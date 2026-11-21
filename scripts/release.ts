// scripts/release.ts
//
// One database release: migrate, system seed, manifest content import.
//
//   pnpm release:dry                        read-only: prints the plan and its PLAN_FINGERPRINT
//   pnpm release --expect-plan=<fingerprint>  apply exactly that reviewed plan
//
// Before anything else (and before taking a lock) the approved content is verified offline:
// every manifest entry must be pinned and still match its files. The plan covers the
// pending migrations (with a hash of their SQL), the pending seed versions and what each
// approved post will do. A real release recomputes the plan under its lock and refuses to
// start if it differs from --expect-plan; a production release cannot run without it.
//
// The whole run holds one advisory lock (RELEASE_ORCHESTRATOR_LOCK_KEY), so two releases
// never interleave. The steps run as child processes; seed and import take their own
// (separate) lock. A dry run takes no lock and writes nothing.
//
// Pending migrations are scanned first; in production a destructive one is refused unless
// RELEASE_ALLOW_DESTRUCTIVE names it exactly (comma-separated migration directory names).

import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { PrismaClient } from "@prisma/client";
import { config as loadDotenv } from "dotenv";
import { runImport } from "../prisma/content/import";
import { verifyPins } from "../prisma/content/manifest";
import type { ParsedPost } from "../prisma/content/types";
import { validateContent } from "../prisma/content/validate";
import { createReleaseClient } from "../prisma/lib/client";
import { resolveDatabaseUrl, stripPrismaParams } from "../prisma/lib/connection";
import { acquireReleaseLock, type ReleaseLock } from "../prisma/lib/lock";
import { createLogger, errorMessage, type Logger } from "../prisma/lib/log";
import { assessMigrations, parseAllowList, type PendingMigration } from "../prisma/release/destructive";
import {
  RELEASE_ORCHESTRATOR_LOCK_KEY,
  ReleaseError,
  assertPlanExpected,
  assertReleaseAllowed,
  buildSteps,
  isProductionEnv,
  parseReleaseArgs,
} from "../prisma/release/guard";
import { listPendingMigrations } from "../prisma/release/pending";
import { contentStatus, describePlan, planFingerprint, sha256, type ReleasePlan } from "../prisma/release/plan";
import { runPendingSeeds } from "../prisma/seed/runner";

/** Offline check, before any lock or database access: invalid or changed content stops the release. */
function approvedPosts(log: Logger): ParsedPost[] {
  const validation = validateContent();
  if (!validation.ok) {
    for (const error of validation.errors) log.error(error);
    throw new ReleaseError("Content is invalid; nothing was released. Run `pnpm content:validate`.");
  }
  const problems = verifyPins(validation.manifestEntries, validation.posts);
  if (problems.length > 0) {
    for (const problem of problems) log.error(problem);
    throw new ReleaseError("The manifest does not match the content; nothing was released.");
  }
  const listed = new Set(validation.manifestSlugs);
  return validation.posts.filter((post) => listed.has(post.slug));
}

/** Scans pending migrations. Production refuses unnamed destructive ones; elsewhere it only warns. */
function guardDestructive(pending: readonly PendingMigration[], log: Logger): void {
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

/**
 * Read-only plan. The seed and import dry runs need tables that pending migrations may not
 * have created yet; in that case (and only then) they are reported as "after migrations".
 */
async function buildPlan(
  prisma: PrismaClient,
  pending: readonly PendingMigration[],
  selected: readonly ParsedPost[],
  log: Logger,
): Promise<ReleasePlan> {
  const quiet: Logger = { info: () => undefined, warn: (m) => log.warn(m), error: (m) => log.error(m) };
  const needsMigration = pending.length > 0;
  const readable = async <T>(read: () => Promise<T>): Promise<T | null> => {
    try {
      return await read();
    } catch (error) {
      if (needsMigration) return null;
      throw error;
    }
  };

  const seeds = await readable(() => runPendingSeeds(prisma, { dryRun: true, log: quiet }));
  const imported = await readable(() => runImport(prisma, selected, { dryRun: true, log: quiet }));

  return {
    migrations: pending.map((m) => ({ name: m.name, sqlHash: sha256(m.sql) })),
    seeds: seeds === null ? null : seeds.pending,
    content: selected.map((post) => ({
      slug: post.slug,
      sourceHash: post.sourceHash,
      status: imported === null ? "after-migrations" : contentStatus(post.slug, imported),
    })),
    blocked: imported?.blocked ?? false,
  };
}

async function main(argv: readonly string[]): Promise<number> {
  const log = createLogger("release");
  let lock: ReleaseLock | undefined;
  let prisma: PrismaClient | undefined;

  try {
    const options = parseReleaseArgs(argv);
    const { dryRun } = options;
    loadDotenv({ quiet: true });
    assertReleaseAllowed(process.env);
    assertPlanExpected(process.env, options);

    const selected = approvedPosts(log);

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

    const pending = await listPendingMigrations(stripPrismaParams(url), join(process.cwd(), "prisma", "migrations"));
    guardDestructive(pending, log);

    prisma = createReleaseClient(url);
    const plan = await buildPlan(prisma, pending, selected, log);
    const fingerprint = planFingerprint(plan);
    for (const line of describePlan(plan)) log.info(line);
    console.log(`PLAN_FINGERPRINT=${fingerprint}`);

    if (plan.blocked) {
      throw new ReleaseError(
        "The import plan has blocking conflicts; nothing was released. Run `pnpm content:import --dry-run` for details.",
      );
    }
    if (options.expectPlan !== undefined && options.expectPlan !== fingerprint) {
      throw new ReleaseError(
        `The plan differs from the reviewed one (expected ${options.expectPlan.slice(0, 12)}, now ${fingerprint.slice(0, 12)}); ` +
          "nothing was released. Review the plan above, then run `pnpm release:dry` again.",
      );
    }
    if (dryRun) {
      log.info("Dry run complete: nothing was written.");
      return 0;
    }

    const steps = buildSteps(false);
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

    log.info("Release complete.");
    return 0;
  } catch (error) {
    log.error(errorMessage(error));
    return 1;
  } finally {
    await prisma?.$disconnect().catch(() => undefined);
    await lock?.release().catch(() => undefined);
  }
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
});
