// prisma/__tests__/project-import-flow.unit.test.ts
//
// Offline tests for importing projects, using an in-memory stand-in for Prisma whose
// $transaction really rolls back on error (same idea as newsletter-import-flow.unit.test.ts).
// The author, category and tag tables throw, which proves a project import never reads them.
// A post with the same slug already has its own ContentSync row; the project must leave it alone.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "@prisma/client";
import { hashValue } from "../content/build";
import { ForceTokenError, type ForceRequest } from "../content/force";
import { runImport } from "../content/import";
import type { FieldValue, ParsedProject } from "../content/types";

const log = { info: () => undefined, warn: () => undefined, error: () => undefined };

function project(edits: { name?: string; status?: string; stack?: string[]; posts?: string[] } = {}): ParsedProject {
  const fields: Record<string, FieldValue> = {
    name: edits.name ?? "Demo",
    status: edits.status ?? "published",
    badges: ["personal"],
    stack: edits.stack ?? ["TypeScript"],
  };
  const postSlugs = [...(edits.posts ?? [])].sort();
  return {
    slug: "demo",
    formatVersion: 1,
    // Like the real builder, the source hash covers the linked posts as well as the fields.
    sourceHash: hashValue({ fields, postSlugs }),
    fields,
    fieldHashes: Object.fromEntries(Object.entries(fields).map(([name, value]) => [name, hashValue(value)])),
    relations: { postSlugs },
    locales: ["en"],
  };
}

type Row = Record<string, unknown>;
type Ref = { id: string; slug: string };
type Link = { projectId: string; postId: string };

class FakeDb {
  projects: Row[] = [];
  links: Link[] = [];
  /** A post with the same slug already has its own ContentSync row. */
  syncs: Row[] = [
    { kind: "post", slug: "demo", sourceHash: "p", formatVersion: 1, fieldHashes: {}, consumedForceTokens: [] },
  ];
  posts: Ref[] = [
    { id: "p1", slug: "a-post" },
    { id: "p2", slug: "b-post" },
  ];
  writes = 0;
  failOnSyncUpdate = false;
  failOnLinkAdd = false;
  seq = 0;

  delegates() {
    const slugOf = (id: unknown) => this.posts.find((x) => x.id === id)?.slug;
    const taxonomyTable = {
      findMany: async () => {
        throw new Error("a taxonomy table was read during a project import");
      },
    };
    return {
      project: {
        findMany: async ({ where }: { where: { slug: { in: string[] } } }) =>
          this.projects
            .filter((p) => where.slug.in.includes(p.slug as string))
            .map((p) => ({
              ...p,
              posts: this.links.filter((l) => l.projectId === p.id).map((l) => ({ post: { slug: slugOf(l.postId) } })),
            })),
        create: async ({ data }: { data: Row }) => {
          const { posts, ...rest } = data as Row & { posts: { create: { postId: string }[] } };
          const id = `pr${++this.seq}`;
          this.projects.push({ ...rest, id });
          for (const link of posts.create) this.links.push({ projectId: id, postId: link.postId });
          this.writes++;
          return {};
        },
        update: async ({ where, data }: { where: { id: string }; data: Row }) => {
          Object.assign(this.projects.find((p) => p.id === where.id) as Row, data);
          this.writes++;
          return {};
        },
      },
      projectPost: {
        createMany: async ({ data, skipDuplicates }: { data: Link[]; skipDuplicates?: boolean }) => {
          if (this.failOnLinkAdd) throw new Error("injected link failure");
          let count = 0;
          for (const link of data) {
            const exists = this.links.some((l) => l.projectId === link.projectId && l.postId === link.postId);
            if (exists && skipDuplicates) continue;
            if (exists) throw new Error("duplicate link");
            this.links.push({ projectId: link.projectId, postId: link.postId });
            count++;
          }
          this.writes++;
          return { count };
        },
      },
      post: {
        findMany: async ({ where }: { where: { slug: { in: string[] } } }) =>
          this.posts.filter((x) => where.slug.in.includes(x.slug)),
      },
      contentSync: {
        findMany: async ({ where }: { where: { kind: string; slug: { in: string[] } } }) =>
          this.syncs.filter((s) => s.kind === where.kind && where.slug.in.includes(s.slug as string)),
        create: async ({ data }: { data: Row }) => {
          this.syncs.push({ consumedForceTokens: [], ...data });
          this.writes++;
        },
        update: async ({ where, data }: { where: { kind_slug: { kind: string; slug: string } }; data: Row }) => {
          if (this.failOnSyncUpdate) throw new Error("injected failure");
          Object.assign(this.sync(where.kind_slug.kind, where.kind_slug.slug), data);
          this.writes++;
        },
        updateMany: async ({
          where,
          data,
        }: {
          where: { kind: string; slug: string; NOT: { consumedForceTokens: { has: string } } };
          data: { consumedForceTokens: { push: string } };
        }) => {
          const row = this.syncs.find((s) => s.kind === where.kind && s.slug === where.slug);
          const used = (row?.consumedForceTokens ?? []) as string[];
          if (row === undefined || used.includes(where.NOT.consumedForceTokens.has)) return { count: 0 };
          used.push(data.consumedForceTokens.push);
          this.writes++;
          return { count: 1 };
        },
      },
      author: taxonomyTable,
      category: taxonomyTable,
      tag: taxonomyTable,
    };
  }

  client(): PrismaClient {
    const delegates = this.delegates();
    return {
      ...delegates,
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const snapshot = structuredClone({ projects: this.projects, links: this.links, syncs: this.syncs });
        try {
          return await fn(delegates);
        } catch (error) {
          this.projects = snapshot.projects;
          this.links = snapshot.links;
          this.syncs = snapshot.syncs;
          throw error;
        }
      },
    } as unknown as PrismaClient;
  }

  sync(kind: string, slug: string): Row {
    return this.syncs.find((s) => s.kind === kind && s.slug === slug) as Row;
  }
}

const importProjects = (db: FakeDb, items: ParsedProject[], force?: ForceRequest) =>
  runImport(db.client(), items, { dryRun: false, log, kind: "project", force });

describe("project import with an in-memory database", () => {
  it("creates the project with its links and a project ContentSync row, then changes nothing", async () => {
    const db = new FakeDb();
    const first = await importProjects(db, [project({ posts: ["a-post", "b-post"] })]);
    assert.deepEqual(first.created, ["demo"]);
    assert.deepEqual(first.applied, ["demo"]);
    assert.equal(db.projects.length, 1);
    assert.deepEqual(db.links.map((link) => link.postId).sort(), ["p1", "p2"]);
    assert.equal(db.sync("project", "demo").kind, "project");
    assert.equal(db.sync("post", "demo").sourceHash, "p");

    const writes = db.writes;
    const second = await importProjects(db, [project({ posts: ["a-post", "b-post"] })]);
    assert.deepEqual(second.unchanged, ["demo"]);
    assert.equal(db.writes, writes);
  });

  it("updates untouched fields and keeps an administrator's edit", async () => {
    const db = new FakeDb();
    await importProjects(db, [project()]);
    db.projects[0].name = "Admin name";

    const summary = await importProjects(db, [project({ stack: ["TypeScript", "Prisma"] })]);
    assert.deepEqual(summary.updated, ["demo"]);
    assert.deepEqual(db.projects[0].stack, ["TypeScript", "Prisma"]);
    assert.equal(db.projects[0].name, "Admin name");
  });

  it("adds only the links the database lacks", async () => {
    const db = new FakeDb();
    await importProjects(db, [project({ posts: ["a-post"] })]);

    const summary = await importProjects(db, [project({ posts: ["a-post", "b-post"] })]);
    assert.deepEqual(summary.updated, ["demo"]);
    assert.deepEqual(db.links.map((link) => link.postId).sort(), ["p1", "p2"]);

    const writes = db.writes;
    const again = await importProjects(db, [project({ posts: ["a-post", "b-post"] })]);
    assert.deepEqual(again.unchanged, ["demo"]);
    assert.equal(db.writes, writes);
  });

  it("never removes a link the file no longer lists", async () => {
    const db = new FakeDb();
    await importProjects(db, [project({ posts: ["a-post", "b-post"] })]);

    await importProjects(db, [project({ posts: ["a-post"] })]);
    assert.deepEqual(db.links.map((link) => link.postId).sort(), ["p1", "p2"]);
  });

  it("writes nothing when a post a new project links to is missing", async () => {
    const db = new FakeDb();
    const summary = await importProjects(db, [project({ posts: ["missing-post"] })]);
    assert.equal(summary.blocked, true);
    assert.equal(db.writes, 0);
    assert.equal(db.projects.length, 0);
    assert.equal(db.syncs.length, 1);
  });

  it("writes nothing when a link to add points at a missing post", async () => {
    const db = new FakeDb();
    await importProjects(db, [project({ posts: ["a-post"] })]);
    const writes = db.writes;

    const summary = await importProjects(db, [project({ posts: ["a-post", "missing-post"] })]);
    assert.equal(summary.blocked, true);
    assert.equal(db.writes, writes);
    assert.equal(db.links.length, 1);
  });

  it("skips a project that exists without a ContentSync row", async () => {
    const db = new FakeDb();
    db.projects.push({ id: "x1", slug: "demo", name: "Old", status: "draft", badges: [], stack: [] });

    const summary = await importProjects(db, [project({ posts: ["a-post"] })]);
    assert.deepEqual(summary.skipped, ["demo"]);
    assert.equal(summary.blocked, false);
    assert.equal(db.writes, 0);
    assert.equal(db.projects[0].name, "Old");
    assert.equal(db.links.length, 0);
  });

  it("stops without writing on a blocking status conflict", async () => {
    const db = new FakeDb();
    await importProjects(db, [project()]);
    db.projects[0].status = "draft";
    const writes = db.writes;

    const summary = await importProjects(db, [project({ status: "pending" })]);
    assert.equal(summary.blocked, true);
    assert.equal(db.writes, writes);
    assert.equal(db.projects[0].status, "draft");
  });

  it("consumes a project token once and leaves the post's ContentSync row alone", async () => {
    const db = new FakeDb();
    await importProjects(db, [project()]);
    db.projects[0].status = "draft";
    const force: ForceRequest = { slug: "demo", kind: "project", marker: "force:m1" };

    const summary = await importProjects(db, [project({ status: "pending" })], force);
    assert.deepEqual(summary.forced, ["demo"]);
    assert.equal(db.projects[0].status, "pending");
    assert.deepEqual(db.sync("project", "demo").consumedForceTokens, ["force:m1"]);
    assert.deepEqual(db.sync("post", "demo").consumedForceTokens, []);

    await assert.rejects(importProjects(db, [project({ status: "pending" })], force), ForceTokenError);
  });

  it("rolls the project update and the new links back when the ContentSync update fails", async () => {
    const db = new FakeDb();
    await importProjects(db, [project({ posts: ["a-post"] })]);
    db.failOnSyncUpdate = true;

    await assert.rejects(
      importProjects(db, [project({ stack: ["TypeScript", "Prisma"], posts: ["a-post", "b-post"] })]),
      /injected failure/,
    );
    assert.deepEqual(db.projects[0].stack, ["TypeScript"]);
    assert.equal(db.links.length, 1);
  });

  it("rolls the project update back when adding a link fails", async () => {
    const db = new FakeDb();
    await importProjects(db, [project({ posts: ["a-post"] })]);
    db.failOnLinkAdd = true;

    await assert.rejects(
      importProjects(db, [project({ stack: ["TypeScript", "Prisma"], posts: ["a-post", "b-post"] })]),
      /injected link failure/,
    );
    assert.deepEqual(db.projects[0].stack, ["TypeScript"]);
    assert.equal(db.links.length, 1);
  });
});
