// prisma/__tests__/content-import.test.ts
//
// Integration tests for the content import against real PostgreSQL. They run in a
// throwaway schema created by helpers/test-db.ts and are SKIPPED (never passed)
// unless TEST_DATABASE_URL is set.

import assert from "node:assert/strict";
import { after, afterEach, before, describe, it } from "node:test";
import { buildPost } from "../content/build";
import { forceMarker, generateForceToken, parseForceToken } from "../content/force";
import { consumeForceToken, runImport } from "../content/import";
import type { ParsedPost } from "../content/types";
import { acquireReleaseLock } from "../lib/lock";
import { author, categories, tags } from "../seed/versions/v1.0.0";
import { createTestDb, silentLogger, skipReason, type TestDb } from "./helpers/test-db";

function post(
  slug: string,
  edits: { title?: string; body?: string; status?: string } = {},
): ParsedPost {
  const yml = [
    `slug: ${slug}`,
    "author: esmaeil-ahmadipour",
    "category: engineering",
    "tags: [flutter, architecture]",
    `status: ${edits.status ?? "published"}`,
    'publishedAt: "2025-01-15"',
    "locales:",
    "  en:",
    `    title: "${edits.title ?? "Title"}"`,
    "  fa:",
    '    title: "Fa"',
  ].join("\n");
  return buildPost({
    dirName: slug,
    postYml: yml,
    bodies: { en: edits.body ?? "## E\n\nBody", fa: "## F\n\nBody" },
    unexpectedFiles: [],
  });
}

describe("content import (PostgreSQL)", { skip: skipReason }, () => {
  let db: TestDb;

  before(async () => {
    db = await createTestDb();
    await db.prisma.author.createMany({ data: [author] });
    await db.prisma.category.createMany({ data: categories });
    await db.prisma.tag.createMany({ data: tags });
  });

  afterEach(async () => {
    await db.prisma.postTag.deleteMany();
    await db.prisma.post.deleteMany();
    await db.prisma.contentSync.deleteMany();
  });

  after(async () => {
    await db.drop();
  });

  const run = (posts: ParsedPost[], extra: Partial<Parameters<typeof runImport>[2]> = {}) =>
    runImport(db.prisma, posts, { dryRun: false, log: silentLogger, ...extra });

  const status = async (slug: string) =>
    (await db.prisma.post.findUniqueOrThrow({ where: { slug } })).status;
  const consumed = async (slug: string) =>
    (await db.prisma.contentSync.findUniqueOrThrow({ where: { kind_slug: { kind: "post", slug } } })).consumedForceTokens;

  /** Imports "a", then makes its status conflict (database "draft", file "pending"). */
  async function conflictingStatus(): Promise<ParsedPost> {
    await run([post("a")]);
    await db.prisma.post.update({ where: { slug: "a" }, data: { status: "draft" } });
    return post("a", { status: "pending" });
  }

  it("creates posts, tags and ContentSync, then changes nothing on a second run", async () => {
    const first = await run([post("a"), post("b")]);
    assert.deepEqual(first.applied, ["a", "b"]);
    assert.equal(await db.prisma.postTag.count(), 4);
    assert.equal(await db.prisma.contentSync.count(), 2);

    const before = await db.prisma.post.findUniqueOrThrow({ where: { slug: "a" } });
    const second = await run([post("a"), post("b")]);
    assert.deepEqual(second.applied, []);
    assert.deepEqual(second.unchanged, ["a", "b"]);
    const after = await db.prisma.post.findUniqueOrThrow({ where: { slug: "a" } });
    assert.equal(after.updatedAt.getTime(), before.updatedAt.getTime());
  });

  it("updates untouched fields, keeps admin edits and preserves views", async () => {
    await run([post("a")]);
    await db.prisma.post.update({ where: { slug: "a" }, data: { titleEn: "Admin title", views: 42 } });
    await run([post("a", { body: "## E\n\nChanged" })]);
    const row = await db.prisma.post.findUniqueOrThrow({ where: { slug: "a" } });
    assert.equal(row.titleEn, "Admin title");
    assert.match(row.contentEn, /Changed/);
    assert.equal(row.views, 42);
  });

  it("skips non-blocking conflicts, and stops everything on a blocking one", async () => {
    await run([post("a"), post("b")]);
    await db.prisma.post.update({ where: { slug: "a" }, data: { titleEn: "Admin title" } });
    const soft = await run([post("a", { title: "File title" })]);
    assert.deepEqual(soft.conflicts, ["a"]);
    assert.equal(soft.blocked, false);

    await db.prisma.post.update({ where: { slug: "a" }, data: { status: "draft" } });
    const blocked = await run([post("a", { status: "pending" }), post("b", { body: "## E\n\nChanged" })]);
    assert.equal(blocked.blocked, true);
    assert.match((await db.prisma.post.findUniqueOrThrow({ where: { slug: "b" } })).contentEn, /Body/);
  });

  it("skips unmanaged posts and orphaned syncs, never creating or deleting", async () => {
    await run([post("a")]);
    await db.prisma.contentSync.delete({ where: { kind_slug: { kind: "post", slug: "a" } } }); // now unmanaged
    await db.prisma.contentSync.create({
      data: { kind: "post", slug: "gone", sourceHash: "h", formatVersion: 1, fieldHashes: {} },
    }); // orphan
    const summary = await run([post("a"), post("gone")]);
    assert.deepEqual(summary.skipped, ["a", "gone"]);
    assert.equal(await db.prisma.post.count(), 1);
    assert.equal(await db.prisma.contentSync.count(), 1);
  });

  it("consumes a force token once, stores only its hash, and never leaks it", async () => {
    const filePost = await conflictingStatus();
    assert.equal((await run([filePost])).blocked, true);

    const token = generateForceToken("a");
    const force = parseForceToken(token);
    const summary = await run([filePost], { force });
    assert.deepEqual(summary.applied, ["a"]);
    assert.equal(await status("a"), "pending");
    assert.deepEqual(await consumed("a"), [force.marker]);
    assert.ok(!JSON.stringify(await db.prisma.contentSync.findMany()).includes(token.slice(-43)));

    await assert.rejects(run([filePost], { force }), /already used/);
  });

  it("rejects wrongly scoped or unusable tokens without writing", async () => {
    const filePost = await conflictingStatus();
    await assert.rejects(run([filePost], { force: parseForceToken(generateForceToken("other-post")) }), /not part of this import/);
    assert.equal(await status("a"), "draft");
    assert.deepEqual(await consumed("a"), []);
  });

  it("lets exactly one of many concurrent consumers use a token", async () => {
    await run([post("a")]);
    const marker = forceMarker(generateForceToken("a"));
    const results = await Promise.all(Array.from({ length: 8 }, () => consumeForceToken(db.prisma, "a", marker)));
    assert.equal(results.filter(Boolean).length, 1);
    assert.deepEqual(await consumed("a"), [marker]);
  });

  it("rolls the token consumption back when the lock is lost right before commit", async () => {
    const filePost = await conflictingStatus();
    const force = parseForceToken(generateForceToken("a"));
    let calls = 0;
    const lock = {
      assertHeld: async () => {
        if (++calls === 3) throw new Error("lock lost");
      },
    };
    await assert.rejects(run([filePost], { force, lock }), /lock lost/);
    assert.equal(await status("a"), "draft");
    assert.deepEqual(await consumed("a"), []);

    const retry = await run([filePost], { force });
    assert.deepEqual(retry.applied, ["a"]);
    assert.equal(await status("a"), "pending");
  });

  it("works under a real release lock and releases it afterwards", async () => {
    const lock = await acquireReleaseLock({ connectionString: db.pgUrl, key: db.lockKey, timeoutMs: 5_000, log: silentLogger });
    try {
      const summary = await run([post("a")], { lock });
      assert.deepEqual(summary.applied, ["a"]);
    } finally {
      await lock.release();
    }
    const again = await acquireReleaseLock({ connectionString: db.pgUrl, key: db.lockKey, timeoutMs: 1_000, log: silentLogger });
    await again.release();
  });
});
