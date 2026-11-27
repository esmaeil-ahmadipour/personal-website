import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "@prisma/client";
import { hashValue } from "../content/build";
import { ForceTokenError } from "../content/force";
import { ImportError, parseTarget, runImport } from "../content/import";
import type { ParsedPost } from "../content/types";

const log = { info: () => undefined, warn: () => undefined, error: () => undefined };

function item(slug: string): ParsedPost {
  return {
    slug,
    formatVersion: 1,
    sourceHash: "hash",
    fields: { status: "draft" },
    fieldHashes: { status: hashValue("draft") },
    relations: { authorSlug: "esmaeil", categorySlug: "engineering", tagSlugs: [] },
    locales: ["en"],
  };
}

/** Read-only stand-in for the client: enough for a dry run. */
function client(rows: { posts?: unknown[]; issues?: unknown[]; syncs?: unknown[] }): PrismaClient {
  const list = (value: unknown[] | undefined) => ({ findMany: async () => value ?? [] });
  return {
    post: list(rows.posts),
    newsletterIssue: list(rows.issues),
    contentSync: list(rows.syncs),
    author: list([{ id: "a1", slug: "esmaeil" }]),
    category: list([{ id: "c1", slug: "engineering" }]),
    tag: list([]),
  } as unknown as PrismaClient;
}

const relations = { author: { slug: "esmaeil" }, category: { slug: "engineering" }, tags: [] };
const conflictingPost = { id: "p1", slug: "5", status: "published", ...relations };
const staleSync = {
  slug: "5",
  sourceHash: "old",
  formatVersion: 1,
  fieldHashes: { status: hashValue("archived") },
  consumedForceTokens: [],
};

describe("parseTarget", () => {
  it("reads a bare slug as a post and a prefixed one as a newsletter issue", () => {
    assert.deepEqual(parseTarget("my-post"), { kind: "post", slug: "my-post" });
    assert.deepEqual(parseTarget("newsletter:5"), { kind: "newsletter", slug: "5" });
  });

  it("rejects other kinds without echoing more than the kind", () => {
    assert.throws(() => parseTarget("project:x"), ImportError);
  });
});

describe("newsletter import", () => {
  it("plans a new issue as a create on a dry run", async () => {
    const summary = await runImport(client({}), [item("5")], { dryRun: true, log, kind: "newsletter" });
    assert.deepEqual(summary.created, ["5"]);
    assert.equal(summary.blocked, false);
  });

  it("rejects a newsletter token when the issue is not part of the import", async () => {
    await assert.rejects(
      runImport(client({}), [], {
        dryRun: true,
        log,
        kind: "newsletter",
        force: { slug: "5", kind: "newsletter", marker: "force:m" },
      }),
      ForceTokenError,
    );
  });

  it("does not let a newsletter token force a post with the same slug", async () => {
    const posts = [conflictingPost];
    const syncs = [staleSync];
    const ignored = await runImport(client({ posts, syncs }), [item("5")], {
      dryRun: true,
      log,
      force: { slug: "5", kind: "newsletter", marker: "force:m" },
    });
    assert.equal(ignored.blocked, true);
    assert.deepEqual(ignored.forced, []);

    const used = await runImport(client({ posts, syncs }), [item("5")], {
      dryRun: true,
      log,
      force: { slug: "5", marker: "force:m" },
    });
    assert.equal(used.blocked, false);
    assert.deepEqual(used.forced, ["5"]);
  });

  it("does not let a post token force a newsletter issue with the same number", async () => {
    const summary = await runImport(client({ issues: [{ ...conflictingPost, number: 5 }], syncs: [staleSync] }), [item("5")], {
      dryRun: true,
      log,
      kind: "newsletter",
      force: { slug: "5", marker: "force:m" },
    });
    assert.equal(summary.blocked, true);
    assert.deepEqual(summary.forced, []);
  });
});
