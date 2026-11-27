// prisma/__tests__/newsletter-import-flow.unit.test.ts
//
// Offline tests for importing newsletter issues, using an in-memory stand-in for Prisma whose
// $transaction really rolls back on error (same idea as content-import.unit.test.ts).
// ContentSync rows are keyed by kind and slug, so a post and an issue may both be "5".

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "@prisma/client";
import { hashValue } from "../content/build";
import { ForceTokenError, type ForceRequest } from "../content/force";
import { runImport } from "../content/import";
import type { FieldValue, ParsedPost } from "../content/types";

const log = { info: () => undefined, warn: () => undefined, error: () => undefined };

function issue(edits: { linkedinUrl?: string; status?: string } = {}): ParsedPost {
  const fields: Record<string, FieldValue> = {
    linkedinUrl: edits.linkedinUrl ?? "https://linkedin.com/pulse/a",
    titleEn: "Issue five",
    status: edits.status ?? "published",
    publishedAt: new Date("2025-01-15T00:00:00Z"),
  };
  return {
    slug: "5",
    formatVersion: 1,
    sourceHash: hashValue(fields),
    fields,
    fieldHashes: Object.fromEntries(Object.entries(fields).map(([name, value]) => [name, hashValue(value)])),
    relations: { authorSlug: "esmaeil", categorySlug: "engineering", tagSlugs: ["flutter"] },
    locales: ["en"],
  };
}

type Row = Record<string, unknown>;
type Ref = { id: string; slug: string };

class FakeDb {
  issues: Row[] = [];
  issueTags: { issueId: string; tagId: string }[] = [];
  /** A post with the same slug already has its own ContentSync row. */
  syncs: Row[] = [
    { kind: "post", slug: "5", sourceHash: "p", formatVersion: 1, fieldHashes: {}, consumedForceTokens: [] },
  ];
  authors: Ref[] = [{ id: "a1", slug: "esmaeil" }];
  categories: Ref[] = [{ id: "c1", slug: "engineering" }];
  tags: Ref[] = [{ id: "t1", slug: "flutter" }];
  writes = 0;
  failOnSyncUpdate = false;
  seq = 0;

  delegates() {
    const slugOf = (list: Ref[], id: unknown) => list.find((x) => x.id === id)?.slug;
    const bySlug = (list: Ref[]) => ({
      findMany: async ({ where }: { where: { slug: { in: string[] } } }) =>
        list.filter((x) => where.slug.in.includes(x.slug)),
    });
    return {
      newsletterIssue: {
        findMany: async ({ where }: { where: { number: { in: number[] } } }) =>
          this.issues
            .filter((i) => where.number.in.includes(i.number as number))
            .map((i) => ({
              ...i,
              author: { slug: slugOf(this.authors, i.authorId) },
              category: { slug: slugOf(this.categories, i.categoryId) },
              tags: this.issueTags
                .filter((t) => t.issueId === i.id)
                .map((t) => ({ tag: { slug: slugOf(this.tags, t.tagId) } })),
            })),
        create: async ({ data }: { data: Row }) => {
          const { tags, ...rest } = data as Row & { tags: { create: { tagId: string }[] } };
          const id = `i${++this.seq}`;
          this.issues.push({ ...rest, id });
          for (const t of tags.create) this.issueTags.push({ issueId: id, tagId: t.tagId });
          this.writes++;
          return {};
        },
        update: async ({ where, data }: { where: { id: string }; data: Row }) => {
          Object.assign(this.issues.find((i) => i.id === where.id) as Row, data);
          this.writes++;
          return {};
        },
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
      author: bySlug(this.authors),
      category: bySlug(this.categories),
      tag: bySlug(this.tags),
    };
  }

  client(): PrismaClient {
    const delegates = this.delegates();
    return {
      ...delegates,
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const snapshot = structuredClone({ issues: this.issues, issueTags: this.issueTags, syncs: this.syncs });
        try {
          return await fn(delegates);
        } catch (error) {
          this.issues = snapshot.issues;
          this.issueTags = snapshot.issueTags;
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

const importIssues = (db: FakeDb, issues: ParsedPost[], force?: ForceRequest) =>
  runImport(db.client(), issues, { dryRun: false, log, kind: "newsletter", force });

describe("newsletter import with an in-memory database", () => {
  it("creates the issue with its tag and a newsletter ContentSync row, then changes nothing", async () => {
    const db = new FakeDb();
    const first = await importIssues(db, [issue()]);
    assert.deepEqual(first.created, ["5"]);
    assert.deepEqual(first.applied, ["5"]);
    assert.equal(db.issues.length, 1);
    assert.equal(db.issues[0].number, 5);
    assert.equal(db.issueTags.length, 1);
    assert.equal(db.sync("newsletter", "5").kind, "newsletter");

    const writes = db.writes;
    const second = await importIssues(db, [issue()]);
    assert.deepEqual(second.unchanged, ["5"]);
    assert.equal(db.writes, writes);
  });

  it("updates untouched fields and keeps an administrator's edit", async () => {
    const db = new FakeDb();
    await importIssues(db, [issue()]);
    db.issues[0].titleEn = "Admin title";

    const summary = await importIssues(db, [issue({ linkedinUrl: "https://linkedin.com/pulse/b" })]);
    assert.deepEqual(summary.updated, ["5"]);
    assert.equal(db.issues[0].linkedinUrl, "https://linkedin.com/pulse/b");
    assert.equal(db.issues[0].titleEn, "Admin title");
  });

  it("stops without writing on a blocking status conflict", async () => {
    const db = new FakeDb();
    await importIssues(db, [issue()]);
    db.issues[0].status = "draft";
    const writes = db.writes;

    const summary = await importIssues(db, [issue({ status: "pending" })]);
    assert.equal(summary.blocked, true);
    assert.equal(db.writes, writes);
    assert.equal(db.issues[0].status, "draft");
  });

  it("consumes a newsletter token once and leaves the post's ContentSync row alone", async () => {
    const db = new FakeDb();
    await importIssues(db, [issue()]);
    db.issues[0].status = "draft";
    const force: ForceRequest = { slug: "5", kind: "newsletter", marker: "force:m1" };

    const summary = await importIssues(db, [issue({ status: "pending" })], force);
    assert.deepEqual(summary.forced, ["5"]);
    assert.equal(db.issues[0].status, "pending");
    assert.deepEqual(db.sync("newsletter", "5").consumedForceTokens, ["force:m1"]);
    assert.deepEqual(db.sync("post", "5").consumedForceTokens, []);

    await assert.rejects(importIssues(db, [issue({ status: "pending" })], force), ForceTokenError);
  });

  it("rolls the issue update back when the ContentSync update fails", async () => {
    const db = new FakeDb();
    await importIssues(db, [issue()]);
    db.failOnSyncUpdate = true;

    await assert.rejects(
      importIssues(db, [issue({ linkedinUrl: "https://linkedin.com/pulse/b" })]),
      /injected failure/,
    );
    assert.equal(db.issues[0].linkedinUrl, "https://linkedin.com/pulse/a");
  });
});
