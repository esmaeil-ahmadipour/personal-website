// prisma/seed/index.ts
//
// Command wrapper used by prisma/seed.ts: loads the environment, takes the
// release lock on a dedicated connection, runs pending system seed versions,
// and always releases the lock and disconnects.

import { config as loadDotenv } from "dotenv";
import type { PrismaClient } from "@prisma/client";
import { createReleaseClient } from "../lib/client";
import { resolveDatabaseUrl, stripPrismaParams } from "../lib/connection";
import { acquireReleaseLock, type ReleaseLock } from "../lib/lock";
import { createLogger, errorMessage } from "../lib/log";
import { runPendingSeeds } from "./runner";

export { seedVersions } from "./registry";
export {
  runPendingSeeds,
  SeedClaimError,
  SeedVersionError,
  type LockProof,
  type RunOptions,
  type RunSummary,
} from "./runner";

/** Returns the process exit code. Never throws. */
export async function runSeedCommand(
  argv: readonly string[],
  env: Record<string, string | undefined> = process.env,
): Promise<number> {
  const log = createLogger("seed");

  const unknown = argv.filter((arg) => arg !== "--dry-run");
  if (unknown.length > 0) {
    log.error(`Unknown argument(s): ${unknown.join(" ")}. Supported: --dry-run`);
    return 1;
  }
  const dryRun = argv.includes("--dry-run");

  loadDotenv({ quiet: true });

  let prisma: PrismaClient | undefined;
  let lock: ReleaseLock | undefined;
  const cleanup = async (): Promise<void> => {
    await lock?.release().catch(() => undefined);
    await prisma?.$disconnect().catch(() => undefined);
  };
  const onSignal = (signal: NodeJS.Signals): void => {
    log.warn(`Received ${signal}; releasing the lock and exiting.`);
    void cleanup().finally(() => process.exit(signal === "SIGINT" ? 130 : 143));
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);

  try {
    const url = resolveDatabaseUrl(env);
    prisma = createReleaseClient(url);
    const sha = env.VERCEL_GIT_COMMIT_SHA ?? null;

    if (!dryRun) {
      lock = await acquireReleaseLock({
        connectionString: stripPrismaParams(url),
        applicationName: `seed:${sha ? sha.slice(0, 7) : "local"}`,
        timeoutMs: Number(env.RELEASE_LOCK_TIMEOUT_MS) || undefined,
        log,
      });
    }

    const summary = await runPendingSeeds(prisma, {
      lock,
      dryRun,
      log,
      meta: { gitSha: sha, environment: env.VERCEL_ENV ?? env.NODE_ENV ?? "local" },
    });

    log.info(
      `Done. pending=${summary.pending.length} applied=${summary.applied.length} ` +
        `already-applied=${summary.alreadyApplied.length} recovered-stale=${summary.recoveredStale.length}`,
    );
    return 0;
  } catch (error) {
    log.error(errorMessage(error));
    return 1;
  } finally {
    process.off("SIGINT", onSignal);
    process.off("SIGTERM", onSignal);
    await cleanup();
  }
}
