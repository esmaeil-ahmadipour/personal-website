// prisma/__tests__/project-import.unit.test.ts
//
// Offline tests for importing projects with a read-only stand-in for the client (dry runs).
// The author, category and tag tables throw, which proves a project import never reads them.
// Writes are covered by the in-memory database tests of the next step.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "@prisma/client";
import { hashValue } from "../content/build";
import { ForceTokenError } from "../content/force";
import { ImportError, parseTarget, runImport } from "../content/import";
import { hasWork, planItem, type DbItemState } from "../content/plan";
import type { FieldValue, ParsedPost, ParsedProject } from "../content/types";

function logger() {
  const lines: string[] = [];
  return {
    lines,
    log: {
      info: (message: string) => void lines.push(`INFO ${message}`),
      warn: (message: string) => void lines.push(`WARN ${message}`),
      error: (message: string) => void lines.push(`ERROR ${message}`),
    },
  };
}

function project(edits: { status?: string; posts?: string[] } = {}): ParsedProject {
  const fields: Record<string, FieldValue> = {
    name: "Demo",
    status: edits.status ?? "published",
    badges: ["personal"],
  };
  return {
    slug: "demo",
    formatVersion: 1,
    sourceHash: hashValue(fields),
    fields,
    fieldHashes: Object.fromEntries(Object.entries(fields).map(([name, value]) => [name, hashValue(value)])),
    relations: { postSlugs: edits.posts ?? [] },
    locales: ["en"],
  };
}

const syncOf = (item: ParsedProject, over: Record<string, unknown> = {}) => ({
  slug: item.slug,
  sourceHash: item.sourceHash,
  formatVersion: item.formatVersion,
  fieldHashes: item.fieldHashes,
  consumedForceTokens: [],
  ...over,
});

/** The database row of a project, linked to the given posts. */
const row = (item: ParsedProject, linked: string[] = [], over: Record<string, unknown> = {}) => ({
  id: "pr1",
  slug: item.slug,
  ...item.fields,
  posts: linked.map((slug) => ({ post: { slug } })),
  ...over,
});

const taxonomyTable = {
  findMany: async () => {
    throw new Error("a taxonomy table was read during a project import");
  },
};

/** Read-only stand-in for the client: enough for a dry run. */
function client(rows: { projects?: unknown[]; posts?: unknown[]; syncs?: unknown[] }): PrismaClient {
  const list = (value: unknown[] | undefined) => ({ findMany: async () => value ?? [] });
  return {
    project: list(rows.projects),
    post: list(rows.posts),
    contentSync: list(rows.syncs),
    author: taxonomyTable,
    category: taxonomyTable,
    tag: taxonomyTable,
  } as unknown as PrismaClient;
}

const aPost = { id: "p1", slug: "a-post" };

describe("parseTarget", () => {
  it("reads project:<slug> as a project and still rejects other kinds", () => {
    assert.deepEqual(parseTarget("project:demo"), { kind: "project", slug: "demo" });
    assert.throws(() => parseTarget("category:x"), ImportError);
  });
});

describe("planItem", () => {
  it("counts link additions as work", () => {
    const file = project({ posts: ["a-post"] });
    const db: DbItemState = { id: "pr1", values: { ...file.fields } };
    const sync = syncOf(file);
    const withLink = planItem(file, db, sync, null, () => ({ warnings: [], additions: ["a-post"] }));
    assert.ok(withLink.kind === "update");
    assert.deepEqual(withLink.linkAdditions, ["a-post"]);
    assert.equal(withLink.syncChanged, false);
    assert.equal(hasWork(withLink), true);

    const without = planItem(file, db, sync, null, () => ({ warnings: [], additions: [] }));
    assert.equal(hasWork(without), false);
  });
});

describe("project import", () => {
  it("plans a new project as a create on a dry run", async () => {
    const { log } = logger();
    const summary = await runImport(client({ posts: [aPost] }), [project({ posts: ["a-post"] })], {
      dryRun: true,
      log,
      kind: "project",
    });
    assert.deepEqual(summary.created, ["demo"]);
    assert.equal(summary.blocked, false);
  });

  it("blocks a create whose post is not in the database, naming the project", async () => {
    const { log, lines } = logger();
    const summary = await runImport(client({}), [project({ posts: ["missing-post"] })], {
      dryRun: true,
      log,
      kind: "project",
    });
    assert.equal(summary.blocked, true);
    assert.ok(lines.includes('ERROR project:demo: post "missing-post" not found in the database'));
  });

  it("reports an unchanged project", async () => {
    const { log } = logger();
    const file = project({ posts: ["a-post"] });
    const summary = await runImport(
      client({ projects: [row(file, ["a-post"])], syncs: [syncOf(file)], posts: [aPost] }),
      [file],
      { dryRun: true, log, kind: "project" },
    );
    assert.deepEqual(summary.unchanged, ["demo"]);
    assert.deepEqual(summary.updated, []);
  });

  it("plans only the links the database lacks", async () => {
    const { log, lines } = logger();
    const file = project({ posts: ["a-post"] });
    const summary = await runImport(
      client({ projects: [row(file, [])], syncs: [syncOf(file)], posts: [aPost] }),
      [file],
      { dryRun: true, log, kind: "project" },
    );
    assert.deepEqual(summary.updated, ["demo"]);
    assert.equal(summary.blocked, false);
    assert.ok(lines.includes("INFO project:demo: add link(s) to post(s) a-post"));
  });

  it("blocks a link to a post that is not in the database", async () => {
    const { log } = logger();
    const file = project({ posts: ["missing-post"] });
    const summary = await runImport(client({ projects: [row(file, [])], syncs: [syncOf(file)] }), [file], {
      dryRun: true,
      log,
      kind: "project",
    });
    assert.equal(summary.blocked, true);
  });

  it("keeps a link that only the database has and warns about it", async () => {
    const { log, lines } = logger();
    const file = project();
    const summary = await runImport(
      client({ projects: [row(file, ["x-post"])], syncs: [syncOf(file)] }),
      [file],
      { dryRun: true, log, kind: "project" },
    );
    assert.deepEqual(summary.unchanged, ["demo"]);
    assert.ok(lines.some((line) => line.startsWith("WARN project:demo:") && line.includes("never removed")));
  });
});

describe("project force tokens", () => {
  // The database status was edited and the file changed it too: a blocking conflict.
  const conflicting = () => {
    const file = project({ status: "published" });
    return {
      file,
      projects: [row(file, [], { status: "draft" })],
      syncs: [syncOf(file, { fieldHashes: { ...file.fieldHashes, status: hashValue("archived") } })],
    };
  };

  it("lets a project token force the project", async () => {
    const { log } = logger();
    const { file, projects, syncs } = conflicting();
    const summary = await runImport(client({ projects, syncs }), [file], {
      dryRun: true,
      log,
      kind: "project",
      force: { slug: "demo", kind: "project", marker: "force:m" },
    });
    assert.equal(summary.blocked, false);
    assert.deepEqual(summary.forced, ["demo"]);
  });

  it("does not let a post or newsletter token force a project with the same slug", async () => {
    const { file, projects, syncs } = conflicting();
    for (const force of [
      { slug: "demo", marker: "force:m" },
      { slug: "demo", kind: "newsletter" as const, marker: "force:m" },
    ]) {
      const summary = await runImport(client({ projects, syncs }), [file], {
        dryRun: true,
        log: logger().log,
        kind: "project",
        force,
      });
      assert.equal(summary.blocked, true);
      assert.deepEqual(summary.forced, []);
    }
  });

  it("rejects a project token when the project is not part of the import", async () => {
    await assert.rejects(
      runImport(client({}), [], {
        dryRun: true,
        log: logger().log,
        kind: "project",
        force: { slug: "demo", kind: "project", marker: "force:m" },
      }),
      (error) => error instanceof ForceTokenError && /project "demo".*not part of this import/.test(error.message),
    );
  });

  it("does not let a project token force a post or a newsletter issue with the same slug", async () => {
    const item: ParsedPost = {
      slug: "5",
      formatVersion: 1,
      sourceHash: "hash",
      fields: { status: "published" },
      fieldHashes: { status: hashValue("published") },
      relations: { authorSlug: "esmaeil", categorySlug: "engineering", tagSlugs: [] },
      locales: ["en"],
    };
    const relations = { author: { slug: "esmaeil" }, category: { slug: "engineering" }, tags: [] };
    const conflict = { id: "x1", slug: "5", number: 5, status: "draft", ...relations };
    const sync = {
      slug: "5",
      sourceHash: "old",
      formatVersion: 1,
      fieldHashes: { status: hashValue("archived") },
      consumedForceTokens: [],
    };
    const list = (value: unknown[]) => ({ findMany: async () => value });
    const taxonomy = {
      contentSync: list([sync]),
      author: list([{ id: "a1", slug: "esmaeil" }]),
      category: list([{ id: "c1", slug: "engineering" }]),
      tag: list([]),
    };
    const force = { slug: "5", kind: "project" as const, marker: "force:m" };

    const asPost = await runImport({ ...taxonomy, post: list([conflict]) } as unknown as PrismaClient, [item], {
      dryRun: true,
      log: logger().log,
      force,
    });
    assert.equal(asPost.blocked, true);
    assert.deepEqual(asPost.forced, []);

    const asIssue = await runImport(
      { ...taxonomy, newsletterIssue: list([conflict]) } as unknown as PrismaClient,
      [item],
      { dryRun: true, log: logger().log, kind: "newsletter", force },
    );
    assert.equal(asIssue.blocked, true);
    assert.deepEqual(asIssue.forced, []);
  });
});
