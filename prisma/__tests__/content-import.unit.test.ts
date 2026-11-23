// prisma/__tests__/content-import.unit.test.ts
//
// Offline tests for the content import (planner, force tokens, orchestration).
// The orchestration tests use an in-memory stand-in for Prisma whose
// $transaction really rolls back on error. Real PostgreSQL behavior (row locking,
// Serializable) is covered by content-import.test.ts, which needs TEST_DATABASE_URL.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PrismaClient } from "@prisma/client";
import { buildPost } from "../content/build";
import { ForceTokenError, forceMarker, generateForceToken, parseForceToken, redactSecrets } from "../content/force";
import { assertAllAllowed, consumeForceToken, isLocalDatabaseUrl, parseCommand, runImport } from "../content/import";
import { planPost, type DbPostState, type SyncState } from "../content/plan";
import type { ParsedPost } from "../content/types";
import type { Logger } from "../lib/log";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function post(
  slug: string,
  edits: { title?: string; body?: string; status?: string; publishedAt?: string } = {},
): ParsedPost {
  const yml = [
    `slug: ${slug}`,
    "author: esmaeil-ahmadipour",
    "category: engineering",
    "tags: [flutter, architecture]",
    `status: ${edits.status ?? "published"}`,
    `publishedAt: "${edits.publishedAt ?? "2025-01-15"}"`,
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

function collect(): { log: Logger; lines: string[] } {
  const lines: string[] = [];
  return {
    lines,
    log: {
      info: (m) => lines.push(`INFO ${m}`),
      warn: (m) => lines.push(`WARN ${m}`),
      error: (m) => lines.push(`ERROR ${m}`),
    },
  };
}

type Row = Record<string, unknown>;
type SlugIn = { where: { slug: { in: string[] } } };

class FakeDb {
  posts: Row[] = [];
  syncs: Row[] = [];
  postTags: { postId: string; tagId: string }[] = [];
  authors = [{ id: "a1", slug: "esmaeil-ahmadipour" }];
  categories = [{ id: "c1", slug: "engineering" }];
  tags = [
    { id: "t1", slug: "flutter" },
    { id: "t2", slug: "architecture" },
  ];
  writes = 0;
  failOnSyncUpdate = false;
  private seq = 0;

  private delegates() {
    const slugOf = (list: { id: string; slug: string }[], id: unknown) => list.find((x) => x.id === id)?.slug;
    const byIn = (list: { id: string; slug: string }[]) => ({
      findMany: async ({ where }: SlugIn) => list.filter((x) => where.slug.in.includes(x.slug)),
    });
    return {
      post: {
        findMany: async ({ where }: SlugIn) =>
          this.posts
            .filter((p) => where.slug.in.includes(p.slug as string))
            .map((p) => ({
              ...p,
              author: { slug: slugOf(this.authors, p.authorId) },
              category: { slug: slugOf(this.categories, p.categoryId) },
              tags: this.postTags
                .filter((t) => t.postId === p.id)
                .map((t) => ({ tag: { slug: slugOf(this.tags, t.tagId) } })),
            })),
        create: async ({ data }: { data: Row }) => {
          const { tags, ...rest } = data as Row & { tags: { create: { tagId: string }[] } };
          const id = `p${++this.seq}`;
          this.posts.push({ ...rest, id, views: 7 });
          for (const t of tags.create) this.postTags.push({ postId: id, tagId: t.tagId });
          this.writes++;
          return {};
        },
        update: async ({ where, data }: { where: { id: string }; data: Row }) => {
          Object.assign(this.posts.find((p) => p.id === where.id) as Row, data);
          this.writes++;
          return {};
        },
      },
      contentSync: {
        findMany: async ({ where }: SlugIn) => this.syncs.filter((s) => where.slug.in.includes(s.slug as string)),
        create: async ({ data }: { data: Row }) => {
          this.syncs.push({ consumedForceTokens: [], ...data });
          this.writes++;
        },
        update: async ({ where, data }: { where: { kind_slug: { slug: string } }; data: Row }) => {
          if (this.failOnSyncUpdate) throw new Error("injected failure");
          Object.assign(this.syncs.find((s) => s.slug === where.kind_slug.slug) as Row, data);
          this.writes++;
        },
        updateMany: async ({
          where,
          data,
        }: {
          where: { slug: string; NOT: { consumedForceTokens: { has: string } } };
          data: { consumedForceTokens: { push: string } };
        }) => {
          const row = this.syncs.find((s) => s.slug === where.slug);
          const used = (row?.consumedForceTokens ?? []) as string[];
          if (row === undefined || used.includes(where.NOT.consumedForceTokens.has)) return { count: 0 };
          used.push(data.consumedForceTokens.push);
          this.writes++;
          return { count: 1 };
        },
      },
      author: byIn(this.authors),
      category: byIn(this.categories),
      tag: byIn(this.tags),
    };
  }

  client(): PrismaClient {
    const delegates = this.delegates();
    return {
      ...delegates,
      $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
        const snapshot = structuredClone({ posts: this.posts, syncs: this.syncs, postTags: this.postTags });
        try {
          return await fn(delegates);
        } catch (error) {
          this.posts = snapshot.posts;
          this.syncs = snapshot.syncs;
          this.postTags = snapshot.postTags;
          throw error;
        }
      },
    } as unknown as PrismaClient;
  }

  row(slug: string): Row {
    return this.posts.find((p) => p.slug === slug) as Row;
  }
  sync(slug: string): Row {
    return this.syncs.find((s) => s.slug === slug) as Row;
  }
}

const run = (db: FakeDb, posts: ParsedPost[], extra: Partial<Parameters<typeof runImport>[2]> = {}) => {
  const out = collect();
  const promise = runImport(db.client(), posts, { dryRun: false, log: out.log, ...extra });
  return { promise, lines: out.lines };
};

/** A post imported once, then a conflicting status (database "draft", file "pending"). */
async function conflictingStatus(db: FakeDb) {
  await run(db, [post("a")]).promise;
  db.row("a").status = "draft";
  return post("a", { status: "pending" });
}

// ---------------------------------------------------------------------------
// Force tokens
// ---------------------------------------------------------------------------

describe("force tokens", () => {
  it("are random, slug-scoped and parse back to a hashed marker", () => {
    const token = generateForceToken("my-post");
    assert.match(token, /^my-post\.[A-Za-z0-9_-]{43}$/);
    assert.notEqual(generateForceToken("my-post"), token);
    const request = parseForceToken(token);
    assert.equal(request.slug, "my-post");
    assert.match(request.marker, /^force:[0-9a-f]{64}$/);
    assert.equal(request.marker, forceMarker(token));
    assert.ok(!request.marker.includes(token.slice(-43)));
  });

  it("reject malformed tokens without echoing them", () => {
    const secret = "my-post.not-a-valid-token";
    assert.throws(() => parseForceToken(secret), (error: Error) => {
      assert.ok(error instanceof ForceTokenError);
      assert.ok(!error.message.includes(secret));
      return true;
    });
    assert.throws(() => generateForceToken("Bad Slug"), ForceTokenError);
  });

  it("redactSecrets removes every occurrence", () => {
    assert.equal(redactSecrets("a s3cret b s3cret", ["s3cret"]), "a [redacted] b [redacted]");
    assert.equal(redactSecrets("untouched", [""]), "untouched");
  });
});

// ---------------------------------------------------------------------------
// Command line helpers
// ---------------------------------------------------------------------------

describe("command line", () => {
  it("parses flags and the token subcommand", () => {
    assert.deepEqual(parseCommand([]), { command: "import", dryRun: false, all: false, force: false });
    assert.deepEqual(parseCommand(["--dry-run", "--all", "--force"]), { command: "import", dryRun: true, all: true, force: true });
    assert.deepEqual(parseCommand(["token", "my-post"]), { command: "token", slug: "my-post" });
    assert.throws(() => parseCommand(["token"]));
  });

  it("never echoes a stray value that could be a token", () => {
    const secret = "my-post.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    assert.throws(() => parseCommand([secret]), (error: Error) => !error.message.includes(secret));
    assert.throws(() => parseCommand(["--bogus"]), /--bogus/);
  });

  it("limits --all to local, non-production databases", () => {
    assert.ok(isLocalDatabaseUrl("postgresql://u:p@localhost:5435/db"));
    assert.ok(isLocalDatabaseUrl("postgresql://u:p@[::1]:5432/db"));
    assert.ok(!isLocalDatabaseUrl("postgresql://u:p@db.example.com/db"));
    assert.ok(!isLocalDatabaseUrl("not a url"));
    assert.doesNotThrow(() => assertAllAllowed({}, "postgresql://u:p@localhost/db"));
    assert.throws(() => assertAllAllowed({ VERCEL_ENV: "production" }, "postgresql://u:p@localhost/db"), /production/);
    assert.throws(() => assertAllAllowed({}, "postgresql://u:p@db.example.com/db"), /local database/);
  });
});

// ---------------------------------------------------------------------------
// Planner
// ---------------------------------------------------------------------------

describe("planPost", () => {
  const base = post("a");
  const dbOf = (p: ParsedPost, over: Record<string, unknown> = {}): DbPostState => ({
    id: "p1",
    values: { ...p.fields, ...over },
    authorSlug: "esmaeil-ahmadipour",
    categorySlug: "engineering",
    tagSlugs: ["architecture", "flutter"],
  });
  const syncOf = (p: ParsedPost, over: Partial<SyncState> = {}): SyncState => ({
    sourceHash: p.sourceHash,
    formatVersion: p.formatVersion,
    fieldHashes: { ...p.fieldHashes },
    consumedForceTokens: [],
    ...over,
  });

  it("creates new posts and skips unmanaged and orphaned ones", () => {
    assert.equal(planPost(base, null, null, null).kind, "create");
    assert.equal(planPost(base, dbOf(base), null, null).kind, "unmanaged");
    assert.equal(planPost(base, null, syncOf(base), null).kind, "orphan");
  });

  it("classifies each field by comparing file, last import and database", () => {
    const edited = post("a", { title: "New title", body: "## E\n\nNew body" });
    // file changed, database untouched -> update
    const update = planPost(edited, dbOf(base), syncOf(base), null);
    assert.equal(update.kind === "update" && update.actions.titleEn, "update");
    // file unchanged, database edited -> keep-db
    const keep = planPost(base, dbOf(base, { titleEn: "Admin" }), syncOf(base), null);
    assert.equal(keep.kind === "update" && keep.actions.titleEn, "keep-db");
    // both changed -> conflict (not blocking for titles)
    const both = planPost(edited, dbOf(base, { titleEn: "Admin" }), syncOf(base), null);
    assert.ok(both.kind === "update" && both.conflicts.includes("titleEn") && both.blocking.length === 0);
    // unknown history and a different database value -> conflict
    const fresh = syncOf(base, { fieldHashes: {} });
    const unknown = planPost(base, dbOf(base, { titleEn: "Admin" }), fresh, null);
    assert.ok(unknown.kind === "update" && unknown.conflicts.includes("titleEn"));
  });

  it("treats status and publishedAt conflicts as blocking", () => {
    const filePost = post("a", { status: "pending", publishedAt: "2025-05-05" });
    const plan = planPost(filePost, dbOf(base, { status: "draft", publishedAt: new Date("2024-01-01") }), syncOf(base), null);
    assert.ok(plan.kind === "update");
    assert.deepEqual([...plan.blocking].sort(), ["publishedAt", "status"]);
  });

  it("applies a force request only to its own post, once", () => {
    const filePost = post("a", { status: "pending" });
    const conflicting = dbOf(base, { status: "draft" });
    const marker = forceMarker(generateForceToken("a"));
    const forced = planPost(filePost, conflicting, syncOf(base), { slug: "a", marker });
    assert.ok(forced.kind === "update" && forced.forced.includes("status") && forced.blocking.length === 0);
    const otherSlug = planPost(filePost, conflicting, syncOf(base), { slug: "b", marker });
    assert.ok(otherSlug.kind === "update" && otherSlug.blocking.includes("status") && otherSlug.forced.length === 0);
    const used = planPost(filePost, conflicting, syncOf(base, { consumedForceTokens: [marker] }), { slug: "a", marker });
    assert.ok(used.kind === "update" && used.blocking.includes("status") && used.forced.length === 0);
  });

  it("warns when create-only relations differ", () => {
    const plan = planPost(base, { ...dbOf(base), authorSlug: "someone-else", tagSlugs: ["flutter"] }, syncOf(base), null);
    assert.ok(plan.kind === "update" && plan.warnings.length === 2 && !plan.syncChanged);
  });
});

// ---------------------------------------------------------------------------
// Orchestration (in-memory database)
// ---------------------------------------------------------------------------

describe("runImport", () => {
  it("creates posts with tags and ContentSync, then is a no-op", async () => {
    const db = new FakeDb();
    const first = await run(db, [post("a"), post("b")]).promise;
    assert.deepEqual(first.applied, ["a", "b"]);
    assert.equal(db.posts.length, 2);
    assert.equal(db.postTags.length, 4);
    assert.equal(db.syncs.length, 2);
    const writes = db.writes;
    const second = await run(db, [post("a"), post("b")]).promise;
    assert.deepEqual(second.unchanged, ["a", "b"]);
    assert.deepEqual(second.applied, []);
    assert.equal(db.writes, writes);
  });

  it("updates untouched fields, keeps admin edits and never touches views", async () => {
    const db = new FakeDb();
    await run(db, [post("a")]).promise;
    db.row("a").titleEn = "Admin title";
    await run(db, [post("a")]).promise;
    assert.equal(db.row("a").titleEn, "Admin title");

    const summary = await run(db, [post("a", { body: "## E\n\nChanged" })]).promise;
    assert.deepEqual(summary.applied, ["a"]);
    assert.match(String(db.row("a").contentEn), /Changed/);
    assert.equal(db.row("a").titleEn, "Admin title");
    assert.equal(db.row("a").views, 7);
  });

  it("skips a non-blocking conflict with a warning and keeps reporting it", async () => {
    const db = new FakeDb();
    await run(db, [post("a")]).promise;
    db.row("a").titleEn = "Admin title";
    for (let i = 0; i < 2; i++) {
      const { promise, lines } = run(db, [post("a", { title: "File title" })]);
      const summary = await promise;
      assert.deepEqual(summary.conflicts, ["a"]);
      assert.equal(summary.blocked, false);
      assert.ok(lines.some((l) => l.startsWith("WARN") && l.includes("titleEn")));
      assert.equal(db.row("a").titleEn, "Admin title");
    }
  });

  it("stops everything before writing when a blocking conflict exists", async () => {
    const db = new FakeDb();
    await run(db, [post("a"), post("b")]).promise;
    db.row("a").status = "draft";
    const writes = db.writes;
    const { promise, lines } = run(db, [post("a", { status: "pending" }), post("b", { body: "## E\n\nChanged" })]);
    const summary = await promise;
    assert.equal(summary.blocked, true);
    assert.equal(db.writes, writes);
    assert.match(String(db.row("b").contentEn), /Body/);
    assert.ok(lines.some((l) => l.startsWith("ERROR") && l.includes("BLOCKING")));
  });

  it("skips unmanaged posts and orphaned syncs without creating or deleting anything", async () => {
    const db = new FakeDb();
    db.posts.push({ id: "x1", slug: "manual", authorId: "a1", categoryId: "c1" });
    db.syncs.push({ slug: "gone", kind: "post", sourceHash: "h", formatVersion: 1, fieldHashes: {}, consumedForceTokens: [] });
    const summary = await run(db, [post("manual"), post("gone")]).promise;
    assert.deepEqual(summary.skipped, ["manual", "gone"]);
    assert.equal(db.posts.length, 1);
    assert.equal(db.writes, 0);
  });

  it("stops without writing when a referenced author, category or tag is missing", async () => {
    const db = new FakeDb();
    db.authors = [];
    db.tags = [{ id: "t1", slug: "flutter" }];
    const { promise, lines } = run(db, [post("a")]);
    assert.equal((await promise).blocked, true);
    assert.equal(db.writes, 0);
    assert.ok(lines.some((l) => l.includes('author "esmaeil-ahmadipour"')));
    assert.ok(lines.some((l) => l.includes('tag "architecture"')));
  });

  it("writes nothing on a dry run", async () => {
    const db = new FakeDb();
    const summary = await run(db, [post("a")], { dryRun: true }).promise;
    assert.deepEqual(summary.created, ["a"]);
    assert.equal(db.writes, 0);
  });
});

describe("runImport with a force token", () => {
  it("is blocked without a token, then overwrites the conflict once and stores only a hash", async () => {
    const db = new FakeDb();
    const filePost = await conflictingStatus(db);
    assert.equal((await run(db, [filePost]).promise).blocked, true);
    assert.equal(db.row("a").status, "draft");

    const token = generateForceToken("a");
    const force = parseForceToken(token);
    const out = run(db, [filePost], { force });
    const summary = await out.promise;
    assert.deepEqual(summary.applied, ["a"]);
    assert.equal(db.row("a").status, "pending");
    assert.deepEqual(db.sync("a").consumedForceTokens, [force.marker]);
    assert.ok(!JSON.stringify(db.syncs).includes(token.slice(-43)));
    assert.ok(!out.lines.some((l) => l.includes(token) || l.includes(force.marker)));

    const writes = db.writes;
    await assert.rejects(run(db, [filePost], { force }).promise, /already used/);
    assert.equal(db.writes, writes);
  });

  it("rejects a token scoped to another post, or with nothing to force, without writing", async () => {
    const db = new FakeDb();
    const filePost = await conflictingStatus(db);
    const writes = db.writes;
    const wrong = parseForceToken(generateForceToken("other-post"));
    await assert.rejects(run(db, [filePost], { force: wrong }).promise, /not part of this import/);
    const clean = new FakeDb();
    await run(clean, [post("a")]).promise;
    const cleanWrites = clean.writes;
    await assert.rejects(run(clean, [post("a")], { force: parseForceToken(generateForceToken("a")) }).promise, /Nothing to force/);
    assert.equal(db.writes, writes);
    assert.equal(clean.writes, cleanWrites);
  });

  it("rejects force for new, unmanaged or orphaned posts", async () => {
    const db = new FakeDb();
    await assert.rejects(run(db, [post("a")], { force: parseForceToken(generateForceToken("a")) }).promise, /does not apply/);
    assert.equal(db.writes, 0);
  });

  it("leaves the token reusable when the transaction fails after consuming it", async () => {
    const db = new FakeDb();
    const filePost = await conflictingStatus(db);
    const force = parseForceToken(generateForceToken("a"));
    db.failOnSyncUpdate = true;
    await assert.rejects(run(db, [filePost], { force }).promise, /injected failure/);
    assert.equal(db.row("a").status, "draft");
    assert.deepEqual(db.sync("a").consumedForceTokens, []);

    db.failOnSyncUpdate = false;
    const summary = await run(db, [filePost], { force }).promise;
    assert.deepEqual(summary.applied, ["a"]);
    assert.equal(db.row("a").status, "pending");
  });

  it("rolls the consumption back when the lock is lost right before commit", async () => {
    const db = new FakeDb();
    const filePost = await conflictingStatus(db);
    const force = parseForceToken(generateForceToken("a"));
    let calls = 0;
    const lock = {
      assertHeld: async () => {
        if (++calls === 3) throw new Error("lock lost");
      },
    };
    await assert.rejects(run(db, [filePost], { force, lock }).promise, /lock lost/);
    assert.equal(db.row("a").status, "draft");
    assert.deepEqual(db.sync("a").consumedForceTokens, []);
  });

  it("consumeForceToken succeeds once", async () => {
    const db = new FakeDb();
    await run(db, [post("a")]).promise;
    const marker = forceMarker(generateForceToken("a"));
    const tx = db.client() as unknown as Parameters<typeof consumeForceToken>[0];
    assert.equal(await consumeForceToken(tx, "a", marker), true);
    assert.equal(await consumeForceToken(tx, "a", marker), false);
  });
});
