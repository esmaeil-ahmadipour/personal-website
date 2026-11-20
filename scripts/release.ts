// scripts/release.ts
//
// One database release: migrate, system seed, manifest content import.
//
//   pnpm release            apply everything
//   pnpm release:dry        read-only: migration status, seed and import dry runs
//
// The whole run holds one advisory lock (RELEASE_ORCHESTRATOR_LOCK_KEY), so two releases
// never interleave. The steps run as child processes; seed and import take their own
// (separate) lock. A dry run takes no lock.
//
// Pending migrations are scanned first; in production a destructive one is refused unless
// RELEASE_ALLOW_DESTRUCTIVE names it exactly (comma-separated migration directory names).

import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { config as loadDotenv } from "dotenv";
import { resolveDatabaseUrl, stripPrismaParams } from "../prisma/lib/connection";
import { acquireReleaseLock, type ReleaseLock } from "../prisma/lib/lock";
import { createLogger, errorMessage, type Logger } from "../prisma/lib/log";
import { assessMigrations, parseAllowList } from "../prisma/release/destructive";
import {
  RELEASE_ORCHESTRATOR_LOCK_KEY,
  ReleaseError,
  assertReleaseAllowed,
  buildSteps,
  isProductionEnv,
  parseReleaseArgs,
} from "../prisma/release/guard";
import { listPendingMigrations } from "../prisma/release/pending";

/** Scans pending migrations. Production refuses unnamed destructive ones; elsewhere it only warns. */
async function guardDestructive(connectionString: string, log: Logger): Promise<void> {
  const pending = await listPendingMigrations(connectionString, join(process.cwd(), "prisma", "migrations"));
  const found = assessMigrations(pending, parseAllowList(process.env.RELEASE_ALLOW_DESTRUCTIVE));
  const describe = (items: typeof found) => items.map((m) => `${m.name} (${m.findings.join(", ")})`).join("; ");

  const allowed = found.filter((m) => m.allowed);
  if (allowed.length > 0) log.warn(`Destructive migration(s) allowed by RELEASE_ALLOW_DESTRUCTIVE: ${describe(allowed)}`);

  const blocked = found.filter((m) => !m.allowed);
  if (blocked.length === 0) return;
  if (!isProductionEnv(process.env)) {
    log.warn(`Destructive pending migration(s): ${describe(blocked)}`);
    return;
  }
  throw new ReleaseError(
    `Destructive pending migration(s) blocked: ${describe(blocked)}. ` +
      "To allow one, set RELEASE_ALLOW_DESTRUCTIVE to its exact name (comma-separated for several).",
  );
}

async function main(argv: readonly string[]): Promise<number> {
  const log = createLogger("release");
  let lock: ReleaseLock | undefined;

  try {
    const { dryRun } = parseReleaseArgs(argv);
    loadDotenv({ quiet: true });
    assertReleaseAllowed(process.env);

    const url = resolveDatabaseUrl(process.env);
    const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;

    // A force token must never reach a release run.
    const childEnv: NodeJS.ProcessEnv = { ...process.env };
    delete childEnv.CONTENT_FORCE_TOKEN;

    if (!dryRun) {
      lock = await acquireReleaseLock({
        connectionString: stripPrismaParams(url),
        key: RELEASE_ORCHESTRATOR_LOCK_KEY,
        applicationName: `release:${sha ? sha.slice(0, 7) : "local"}`,
        timeoutMs: Number(process.env.RELEASE_LOCK_TIMEOUT_MS) || undefined,
        log,
      });
    }

    await guardDestructive(stripPrismaParams(url), log);

    const steps = buildSteps(dryRun);
    for (const [index, step] of steps.entries()) {
      await lock?.assertHeld();
      log.info(`[${index + 1}/${steps.length}] ${step.name}`);
      const result = spawnSync(step.command, step.args, { stdio: "inherit", env: childEnv });
      if (result.error) {
        throw new ReleaseError(`${step.name} could not start: ${result.error.message}`);
      }
      if (result.status !== 0) {
        log.error(`${step.name} failed (${result.signal ?? `exit ${result.status}`}); stopping.`);
        return result.status ?? 1;
      }
    }

    log.info(dryRun ? "Dry run complete: nothing was written." : "Release complete.");
    return 0;
  } catch (error) {
    log.error(errorMessage(error));
    return 1;
  } finally {
    await lock?.release().catch(() => undefined);
  }
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
});
