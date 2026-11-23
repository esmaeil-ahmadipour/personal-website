// prisma/seed/runner.ts
//
// Executes pending system seed versions.
//
// Guarantees:
//  - A version runs in ONE interactive transaction together with its SeedHistory
//    "succeeded" update, so data and the success mark commit or roll back together.
//  - A failed version is rolled back and recorded as "failed" (with the error);
//    it is never recorded as succeeded, and later versions do not run.
//  - Only versions that are not "succeeded" run, in registry order.
//  - The caller-supplied release lock serialises runs. As a second line of defence,
//    claiming a version is an atomic insert/update on the unique SeedHistory.version,
//    so even without the lock two runners can never execute the same version.
//  - While holding the lock, any "running" record is by definition stale (a crashed
//    or killed earlier run) and is recovered. Without the lock it is never touched.
//  - A dry run is READ ONLY by construction: its single database read runs in a
//    transaction that PostgreSQL itself enforces as read-only, and the dry-run path
//    contains no write calls.

import type { PrismaClient } from "@prisma/client";
import { createLogger, errorMessage, type Logger } from "../lib/log";
import {
  compareSeedVersions,
  seedVersions,
  validateSeedVersions,
} from "./registry";
import type { SeedVersion } from "./types";

export const DEFAULT_VERSION_TIMEOUT_MS = 60_000;
const TRANSACTION_MAX_WAIT_MS = 10_000;

/** Anything that can prove the release lock is still held (see lib/lock.ts). */
export interface LockProof {
  assertHeld(): Promise<void>;
}

export interface RunMeta {
  gitSha?: string | null;
  environment?: string | null;
}

export interface RunOptions {
  /** Defaults to the production registry; tests inject their own. */
  versions?: readonly SeedVersion[];
  /** Required to recover stale "running" records. */
  lock?: LockProof;
  log?: Logger;
  /** Report what would run without writing anything. */
  dryRun?: boolean;
  meta?: RunMeta;
}

export interface RunSummary {
  /** Versions that were pending when the run started (in order). */
  pending: string[];
  /** Versions executed and committed by this run. */
  applied: string[];
  /** Registry versions that were already succeeded and were skipped. */
  alreadyApplied: string[];
  /** Stale "running" records converted to "failed" by this run. */
  recoveredStale: string[];
}

export class SeedVersionError extends Error {
  readonly version: string;
  readonly original: unknown;

  constructor(version: string, original: unknown) {
    super(`Seed version ${version} failed: ${errorMessage(original)}`);
    this.name = "SeedVersionError";
    this.version = version;
    this.original = original;
  }
}

export class SeedClaimError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SeedClaimError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === "P2002"
  );
}

type Claim = "claimed" | "already-succeeded";

/** Dry-run history read: PostgreSQL rejects any write inside this transaction. */
async function readHistoryReadOnly(
  prisma: PrismaClient,
): Promise<{ version: string; status: string }[]> {
  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRawUnsafe("SET TRANSACTION READ ONLY");
      return tx.seedHistory.findMany({ select: { version: true, status: true } });
    },
    { timeout: 15_000, maxWait: TRANSACTION_MAX_WAIT_MS },
  );
}

async function claimVersion(
  prisma: PrismaClient,
  version: string,
  meta: { gitSha: string | null; environment: string | null },
): Promise<Claim> {
  const startedAt = new Date();
  try {
    await prisma.seedHistory.create({
      data: {
        version,
        status: "running",
        attempts: 1,
        startedAt,
        gitSha: meta.gitSha,
        environment: meta.environment,
      },
    });
    return "claimed";
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
  }

  // A row already exists: take it over only if it is a failed one (a retry).
  const retried = await prisma.seedHistory.updateMany({
    where: { version, status: "failed" },
    data: {
      status: "running",
      attempts: { increment: 1 },
      startedAt,
      finishedAt: null,
      error: null,
      gitSha: meta.gitSha,
      environment: meta.environment,
    },
  });
  if (retried.count === 1) return "claimed";

  const current = await prisma.seedHistory.findUnique({
    where: { version },
    select: { status: true },
  });
  if (current?.status === "succeeded") return "already-succeeded";
  throw new SeedClaimError(
    `Seed version ${version} is currently "${current?.status ?? "unknown"}" and owned by another run; refusing to execute it twice.`,
  );
}

async function recordFailure(
  prisma: PrismaClient,
  version: string,
  error: unknown,
  log: Logger,
): Promise<void> {
  try {
    await prisma.seedHistory.updateMany({
      where: { version, status: "running" },
      data: {
        status: "failed",
        finishedAt: new Date(),
        error: errorMessage(error),
      },
    });
  } catch (recordError) {
    log.error(
      `Could not record the failure of ${version}: ${errorMessage(recordError)}`,
    );
  }
}

async function applyVersion(
  prisma: PrismaClient,
  version: SeedVersion,
  options: {
    lock?: LockProof;
    log: Logger;
    meta: { gitSha: string | null; environment: string | null };
  },
): Promise<"applied" | "already-applied"> {
  const { lock, log, meta } = options;

  await lock?.assertHeld();
  if ((await claimVersion(prisma, version.version, meta)) === "already-succeeded") {
    log.info(`${version.version}: already applied by another run, skipping.`);
    return "already-applied";
  }

  log.info(`${version.version}: ${version.description}`);
  const startedAt = Date.now();
  try {
    await prisma.$transaction(
      async (tx) => {
        await version.run(tx, { log, version: version.version });
        // Refuse to commit if the lock was lost while the version ran.
        await lock?.assertHeld();
        const marked = await tx.seedHistory.updateMany({
          where: { version: version.version, status: "running" },
          data: { status: "succeeded", finishedAt: new Date(), error: null },
        });
        if (marked.count !== 1) {
          throw new Error(
            `The running record for ${version.version} disappeared; rolling back.`,
          );
        }
      },
      {
        timeout: version.timeoutMs ?? DEFAULT_VERSION_TIMEOUT_MS,
        maxWait: TRANSACTION_MAX_WAIT_MS,
      },
    );
  } catch (error) {
    await recordFailure(prisma, version.version, error, log);
    throw new SeedVersionError(version.version, error);
  }

  log.info(`${version.version}: committed in ${Date.now() - startedAt} ms.`);
  return "applied";
}

export async function runPendingSeeds(
  prisma: PrismaClient,
  options: RunOptions = {},
): Promise<RunSummary> {
  const versions = options.versions ?? seedVersions;
  validateSeedVersions(versions);

  const log = options.log ?? createLogger("seed");
  const { lock, dryRun = false } = options;
  const meta = {
    gitSha: options.meta?.gitSha ?? null,
    environment: options.meta?.environment ?? null,
  };
  const summary: RunSummary = {
    pending: [],
    applied: [],
    alreadyApplied: [],
    recoveredStale: [],
  };

  await lock?.assertHeld();

  let history: { version: string; status: string }[];
  try {
    history = dryRun
      ? await readHistoryReadOnly(prisma)
      : await prisma.seedHistory.findMany({
          select: { version: true, status: true },
        });
  } catch (error) {
    throw new Error(
      `Cannot read the SeedHistory table. Have the Prisma migrations been applied? (${errorMessage(error)})`,
    );
  }

  const known = new Set(versions.map((entry) => entry.version));
  for (const row of history) {
    if (!known.has(row.version)) {
      log.warn(
        `SeedHistory contains ${row.version}, which is not in this build's registry (applied by a newer release, or removed).`,
      );
    }
  }

  // Stale "running" records: only the lock holder may declare them stale.
  const running = history.filter((row) => row.status === "running");
  if (running.length > 0) {
    const names = running.map((row) => row.version).join(", ");
    if (dryRun) {
      log.warn(`Would recover stale running record(s): ${names}`);
    } else if (!lock) {
      throw new SeedClaimError(
        `SeedHistory has running record(s) (${names}). Another run may be in progress; stale records are only recovered by a run that holds the release lock.`,
      );
    } else {
      for (const row of running) {
        await lock.assertHeld();
        const recovered = await prisma.seedHistory.updateMany({
          where: { version: row.version, status: "running" },
          data: {
            status: "failed",
            finishedAt: new Date(),
            error:
              "Interrupted: a previous run did not finish. Recovered by a later run while holding the release lock.",
          },
        });
        if (recovered.count === 1) {
          summary.recoveredStale.push(row.version);
          log.warn(`${row.version}: recovered a stale running record.`);
        }
      }
    }
  }

  const succeeded = new Set(
    history.filter((row) => row.status === "succeeded").map((row) => row.version),
  );
  summary.alreadyApplied = versions
    .filter((entry) => succeeded.has(entry.version))
    .map((entry) => entry.version);
  const pending = versions.filter((entry) => !succeeded.has(entry.version));
  summary.pending = pending.map((entry) => entry.version);

  for (const entry of pending) {
    const newer = summary.alreadyApplied.find(
      (applied) => compareSeedVersions(applied, entry.version) > 0,
    );
    if (newer) {
      log.warn(
        `${entry.version} is older than the already-applied ${newer}; running it now, in registry order.`,
      );
    }
  }

  if (pending.length === 0) {
    log.info("No pending seed versions.");
    return summary;
  }
  if (dryRun) {
    log.info(`Dry run. Pending seed versions: ${summary.pending.join(", ")}`);
    return summary;
  }

  for (const entry of pending) {
    const outcome = await applyVersion(prisma, entry, { lock, log, meta });
    if (outcome === "applied") summary.applied.push(entry.version);
    else summary.alreadyApplied.push(entry.version);
  }
  return summary;
}
