// prisma/__tests__/seed.test.ts
//
// Integration tests for the system seed engine against a real PostgreSQL database.
// Requires TEST_DATABASE_URL (see helpers/test-db.ts). Without it every test is
// reported as SKIPPED, not passed.

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { PrismaClient } from "@prisma/client";
import { Client } from "pg";
import {
  acquireReleaseLock,
  LockLostError,
  LockTimeoutError,
  type ReleaseLock,
} from "../lib/lock";
import type { Logger } from "../lib/log";
import { seedVersions } from "../seed/registry";
import {
  runPendingSeeds,
  SeedClaimError,
  SeedVersionError,
  type RunOptions,
  type RunSummary,
} from "../seed/runner";
import type { SeedVersion } from "../seed/types";
import { categories, tags, v1_0_0 } from "../seed/versions/v1.0.0";
import {
  legacyAuthor,
  legacyCategories,
  legacyTags,
} from "./fixtures/legacy-system-data";
import {
  collectingLogger,
  createTestDb,
  silentLogger,
  skipReason,
  type TestDb,
} from "./helpers/test-db";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Picks the keys of `expected` from a stored row so only seeded fields are compared. */
function pick(row: Record<string, unknown>, expected: object): Record<string, unknown> {
  return Object.fromEntries(Object.keys(expected).map((key) => [key, row[key]]));
}

interface TestVersionOptions {
  counter?: { runs: number };
  fail?: boolean;
  delayMs?: number;
}

/** A small version that inserts one tag, optionally slowly or by failing afterwards. */
function tagVersion(
  version: string,
  slug: string,
  options: TestVersionOptions = {},
): SeedVersion {
  return {
    version,
    description: `test version ${version}`,
    async run(tx) {
      if (options.counter) options.counter.runs += 1;
      await tx.tag.createMany({
        data: [{ slug, nameEn: slug, nameFa: slug }],
        skipDuplicates: true,
      });
      if (options.delayMs) await sleep(options.delayMs);
      if (options.fail) throw new Error(`deliberate failure in ${version}`);
    },
  };
}

describe("system seed engine (PostgreSQL)", { skip: skipReason }, () => {
  let db: TestDb;

  beforeEach(async () => {
    db = await createTestDb();
  });
  afterEach(async () => {
    await db.drop();
  });

  function lockOptions(timeoutMs = 15_000) {
    return {
      connectionString: db.pgUrl,
      key: db.lockKey,
      timeoutMs,
      pollMs: 50,
      heartbeatMs: 5_000,
      log: silentLogger,
    };
  }

  async function withLock<T>(fn: (lock: ReleaseLock) => Promise<T>): Promise<T> {
    const lock = await acquireReleaseLock(lockOptions());
    try {
      return await fn(lock);
    } finally {
      await lock.release();
    }
  }

  /** Runs pending versions while holding the release lock, like the real CLI does. */
  function run(options: Omit<RunOptions, "lock"> = {}): Promise<RunSummary> {
    return withLock((lock) =>
      runPendingSeeds(db.prisma, { log: silentLogger, ...options, lock }),
    );
  }

  async function historyRow(version: string) {
    return db.prisma.seedHistory.findUniqueOrThrow({ where: { version } });
  }

  describe("successful execution", () => {
    it("applies v1.0.0 to an empty database and records it", async () => {
      const summary = await run({ versions: seedVersions });

      assert.deepEqual(summary.applied, ["v1.0.0"]);
      assert.equal(await db.prisma.author.count(), 1);
      assert.equal(await db.prisma.category.count(), categories.length);
      assert.equal(await db.prisma.tag.count(), tags.length);

      const row = await historyRow("v1.0.0");
      assert.equal(row.status, "succeeded");
      assert.equal(row.attempts, 1);
      assert.notEqual(row.finishedAt, null);
      assert.equal(row.error, null);
    });

    it("stores exactly the original seed values", async () => {
      await run({ versions: seedVersions });

      const storedAuthor = await db.prisma.author.findUniqueOrThrow({
        where: { slug: legacyAuthor.slug },
      });
      assert.deepEqual(pick(storedAuthor, legacyAuthor), legacyAuthor);
      for (const expected of legacyCategories) {
        const stored = await db.prisma.category.findUniqueOrThrow({
          where: { slug: expected.slug },
        });
        assert.deepEqual(pick(stored, expected), expected);
      }
      for (const expected of legacyTags) {
        const stored = await db.prisma.tag.findUniqueOrThrow({
          where: { slug: expected.slug },
        });
        assert.deepEqual(pick(stored, expected), expected);
      }
    });

    it("dry run is read-only: it reports pending versions and works on a read-only session", async () => {
      // One pooled connection whose session is read-only: any write attempt fails.
      const readOnlyUrl = new URL(db.prismaUrl);
      readOnlyUrl.searchParams.set("connection_limit", "1");
      const readOnly = new PrismaClient({ datasourceUrl: readOnlyUrl.toString() });
      try {
        await readOnly.$executeRawUnsafe("SET default_transaction_read_only = on");
        // Sanity check: the harness really is read-only, so a pass below is not vacuous.
        await assert.rejects(
          readOnly.seedHistory.create({ data: { version: "v0.0.1" } }),
          /read-only/i,
        );

        const summary = await runPendingSeeds(readOnly, {
          versions: seedVersions,
          dryRun: true,
          log: silentLogger,
        });

        assert.deepEqual(summary.pending, ["v1.0.0"]);
        assert.deepEqual(summary.applied, []);
      } finally {
        await readOnly.$disconnect();
      }
      assert.equal(await db.prisma.seedHistory.count(), 0);
      assert.equal(await db.prisma.author.count(), 0);
      assert.equal(await db.prisma.category.count(), 0);
      assert.equal(await db.prisma.tag.count(), 0);
    });
  });

  describe("repeated execution", () => {
    it("does not re-run or duplicate anything on a second run", async () => {
      const counter = { runs: 0 };
      const counted: SeedVersion = {
        ...v1_0_0,
        async run(tx, ctx) {
          counter.runs += 1;
          await v1_0_0.run(tx, ctx);
        },
      };

      await run({ versions: [counted] });
      const first = await historyRow("v1.0.0");
      const second = await run({ versions: [counted] });

      assert.equal(counter.runs, 1);
      assert.deepEqual(second.applied, []);
      assert.deepEqual(second.alreadyApplied, ["v1.0.0"]);
      assert.equal(await db.prisma.category.count(), categories.length);
      assert.equal(await db.prisma.tag.count(), tags.length);
      const after = await historyRow("v1.0.0");
      assert.equal(after.attempts, 1);
      assert.equal(after.finishedAt?.getTime(), first.finishedAt?.getTime());
    });

    it("is idempotent even if its history row is lost (insert-only data)", async () => {
      await run({ versions: seedVersions });
      await db.prisma.seedHistory.deleteMany();

      const summary = await run({ versions: seedVersions });

      assert.deepEqual(summary.applied, ["v1.0.0"]);
      assert.equal(await db.prisma.author.count(), 1);
      assert.equal(await db.prisma.category.count(), categories.length);
      assert.equal(await db.prisma.tag.count(), tags.length);
      assert.equal((await historyRow("v1.0.0")).attempts, 1);
    });
  });

  describe("non-destructive behavior", () => {
    it("never overwrites existing records, and inserts only the missing ones", async () => {
      await db.prisma.category.create({
        data: { ...legacyCategories[0], nameEn: "Edited by admin", isActive: false, order: 99 },
      });
      await db.prisma.tag.create({
        data: { ...legacyTags[0], nameEn: "Edited tag", color: "#000000" },
      });
      await db.prisma.author.create({
        data: { ...legacyAuthor, bioEn: "Edited bio" },
      });
      const { log, lines } = collectingLogger();

      await run({ versions: seedVersions, log });

      const category = await db.prisma.category.findUniqueOrThrow({
        where: { slug: legacyCategories[0].slug },
      });
      assert.equal(category.nameEn, "Edited by admin");
      assert.equal(category.isActive, false);
      assert.equal(category.order, 99);
      const tag = await db.prisma.tag.findUniqueOrThrow({
        where: { slug: legacyTags[0].slug },
      });
      assert.equal(tag.nameEn, "Edited tag");
      assert.equal(tag.color, "#000000");
      const storedAuthor = await db.prisma.author.findUniqueOrThrow({
        where: { slug: legacyAuthor.slug },
      });
      assert.equal(storedAuthor.bioEn, "Edited bio");

      assert.equal(await db.prisma.category.count(), categories.length);
      assert.equal(await db.prisma.tag.count(), tags.length);
      assert.ok(
        lines.some((line) =>
          line.includes(`Category: ${categories.length - 1} inserted, 1 already present`),
        ),
      );
    });

    it("an intentional compare-and-set update changes only the intended field and skips admin-edited rows", async () => {
      await run({ versions: seedVersions });
      const [untouched, edited] = legacyCategories;
      await db.prisma.category.update({
        where: { slug: edited.slug },
        data: { nameEn: "Admin chose this name" },
      });

      const intentional: SeedVersion = {
        version: "v1.1.0",
        description: "intentional rename (compare-and-set)",
        async run(tx) {
          await tx.category.updateMany({
            where: { slug: untouched.slug, nameEn: untouched.nameEn },
            data: { nameEn: "Renamed on purpose" },
          });
          await tx.category.updateMany({
            where: { slug: edited.slug, nameEn: edited.nameEn },
            data: { nameEn: "Renamed on purpose" },
          });
        },
      };
      await run({ versions: [v1_0_0, intentional] });

      const renamed = await db.prisma.category.findUniqueOrThrow({ where: { slug: untouched.slug } });
      assert.equal(renamed.nameEn, "Renamed on purpose");
      assert.equal(renamed.nameFa, untouched.nameFa);
      assert.equal(renamed.order, untouched.order);
      assert.equal(renamed.isActive, untouched.isActive);
      const preserved = await db.prisma.category.findUniqueOrThrow({ where: { slug: edited.slug } });
      assert.equal(preserved.nameEn, "Admin chose this name");
    });
  });

  describe("failed transactions", () => {
    it("rolls back every data change of a failed version and records the failure", async () => {
      const failing = tagVersion("v1.0.0", "rollback-probe", { fail: true });

      await assert.rejects(
        run({ versions: [failing] }),
        (error: unknown) =>
          error instanceof SeedVersionError &&
          error.version === "v1.0.0" &&
          /deliberate failure/.test(error.message),
      );

      assert.equal(await db.prisma.tag.count({ where: { slug: "rollback-probe" } }), 0);
      const row = await historyRow("v1.0.0");
      assert.equal(row.status, "failed");
      assert.equal(row.attempts, 1);
      assert.match(row.error ?? "", /deliberate failure/);
      assert.notEqual(row.finishedAt, null);
    });

    it("stops at the first failing version and never runs later ones", async () => {
      const later = { runs: 0 };
      const versions = [
        tagVersion("v1.0.0", "first-ok"),
        tagVersion("v1.1.0", "second-fails", { fail: true }),
        tagVersion("v1.2.0", "third-never", { counter: later }),
      ];

      await assert.rejects(run({ versions }), SeedVersionError);

      assert.equal((await historyRow("v1.0.0")).status, "succeeded");
      assert.equal((await historyRow("v1.1.0")).status, "failed");
      assert.equal(await db.prisma.seedHistory.count({ where: { version: "v1.2.0" } }), 0);
      assert.equal(later.runs, 0);
      assert.equal(await db.prisma.tag.count({ where: { slug: "first-ok" } }), 1);
      assert.equal(await db.prisma.tag.count({ where: { slug: "second-fails" } }), 0);
    });
  });

  describe("retry behavior", () => {
    it("retries a failed version, increments attempts and clears the error", async () => {
      await assert.rejects(
        run({ versions: [tagVersion("v1.0.0", "retry-probe", { fail: true })] }),
        SeedVersionError,
      );

      const summary = await run({ versions: [tagVersion("v1.0.0", "retry-probe")] });

      assert.deepEqual(summary.applied, ["v1.0.0"]);
      const row = await historyRow("v1.0.0");
      assert.equal(row.status, "succeeded");
      assert.equal(row.attempts, 2);
      assert.equal(row.error, null);
      assert.equal(await db.prisma.tag.count({ where: { slug: "retry-probe" } }), 1);
    });

    it("recovers a stale running record only while holding the lock", async () => {
      await db.prisma.seedHistory.create({
        data: { version: "v1.0.0", status: "running", attempts: 1, startedAt: new Date(Date.now() - 3_600_000) },
      });
      const versions = [tagVersion("v1.0.0", "stale-probe")];

      // Without the lock a running record must be treated as someone else's work.
      await assert.rejects(
        runPendingSeeds(db.prisma, { versions, log: silentLogger }),
        SeedClaimError,
      );
      assert.equal((await historyRow("v1.0.0")).status, "running");

      const summary = await run({ versions });

      assert.deepEqual(summary.recoveredStale, ["v1.0.0"]);
      assert.deepEqual(summary.applied, ["v1.0.0"]);
      const row = await historyRow("v1.0.0");
      assert.equal(row.status, "succeeded");
      assert.equal(row.attempts, 2);
    });
  });

  describe("concurrent execution", () => {
    it("the release lock makes two simultaneous runs execute a version exactly once", async () => {
      const counter = { runs: 0 };
      const versions = [tagVersion("v1.0.0", "concurrent-probe", { counter, delayMs: 400 })];

      const [a, b] = await Promise.all([run({ versions }), run({ versions })]);

      assert.equal(counter.runs, 1);
      assert.equal(a.applied.length + b.applied.length, 1);
      assert.equal(a.alreadyApplied.length + b.alreadyApplied.length, 1);
      assert.equal(await db.prisma.seedHistory.count(), 1);
      assert.equal((await historyRow("v1.0.0")).attempts, 1);
      assert.equal(await db.prisma.tag.count({ where: { slug: "concurrent-probe" } }), 1);
    });

    it("the atomic claim still prevents duplicate execution without the lock", async () => {
      const counter = { runs: 0 };
      const versions = [tagVersion("v1.0.0", "claim-probe", { counter, delayMs: 400 })];

      const results = await Promise.allSettled([
        runPendingSeeds(db.prisma, { versions, log: silentLogger }),
        runPendingSeeds(db.prisma, { versions, log: silentLogger }),
      ]);

      assert.equal(counter.runs, 1);
      const winners = results.filter(
        (result) => result.status === "fulfilled" && result.value.applied.length === 1,
      );
      assert.equal(winners.length, 1);
      for (const result of results) {
        if (result.status === "rejected") assert.ok(result.reason instanceof SeedClaimError);
      }
      assert.equal((await historyRow("v1.0.0")).status, "succeeded");
      assert.equal(await db.prisma.tag.count({ where: { slug: "claim-probe" } }), 1);
    });

    it("a second lock acquirer times out while the lock is held, and succeeds after release", async () => {
      const first = await acquireReleaseLock(lockOptions());
      await assert.rejects(
        acquireReleaseLock({ ...lockOptions(300) }),
        LockTimeoutError,
      );
      await first.release();

      const third = await acquireReleaseLock(lockOptions(2_000));
      await third.release();
    });

    it("release is idempotent", async () => {
      const lock = await acquireReleaseLock(lockOptions());
      await lock.release();
      await lock.release();
    });

    it("detects a lost lock and lets another process take over", async () => {
      const lock = await acquireReleaseLock(lockOptions());
      const killer = new Client({ connectionString: db.pgUrl });
      await killer.connect();
      try {
        await killer.query("SELECT pg_terminate_backend($1)", [lock.pid]);
      } finally {
        await killer.end();
      }

      await assert.rejects(lock.assertHeld(), LockLostError);
      await lock.release();

      const next = await acquireReleaseLock(lockOptions(5_000));
      await next.release();
    });
  });

  describe("history diagnostics", () => {
    it("fails with a clear message when migrations have not been applied", async () => {
      const bare = await createTestDb({ migrate: false });
      try {
        await assert.rejects(
          runPendingSeeds(bare.prisma, { versions: seedVersions, log: silentLogger }),
          /migrations/i,
        );
      } finally {
        await bare.drop();
      }
    });

    it("warns about history entries that are not in the registry", async () => {
      await db.prisma.seedHistory.create({
        data: { version: "v9.9.9", status: "succeeded", attempts: 1, finishedAt: new Date() },
      });
      const { log, lines } = collectingLogger();

      await run({ versions: [tagVersion("v1.0.0", "diag-probe")], log });

      assert.ok(lines.some((line) => line.startsWith("WARN") && line.includes("v9.9.9")));
    });

    it("warns when a pending version is older than an applied one", async () => {
      await db.prisma.seedHistory.create({
        data: { version: "v1.1.0", status: "succeeded", attempts: 1, finishedAt: new Date() },
      });
      const { log, lines } = collectingLogger();

      await run({
        versions: [tagVersion("v1.0.0", "older-probe"), tagVersion("v1.1.0", "newer-probe")],
        log,
      });

      assert.ok(lines.some((line) => line.includes("v1.0.0 is older than the already-applied v1.1.0")));
      assert.equal((await historyRow("v1.0.0")).status, "succeeded");
    });
  });
});

// Keeps the Logger type import used when this file is edited to add log assertions.
export type { Logger };
