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
// approved post, newsletter issue and project will do. A real release recomputes the plan under its lock and refuses to
// start if it differs from --expect-plan; a production release cannot run without it.
//
// The whole run holds one advisory lock (RELEASE_ORCHESTRATOR_LOCK_KEY), so two releases
// never interleave. The steps run as child processes; seed and import take their own
// (separate) lock. A dry run takes no lock and writes nothing.
//
// The URL is resolved once (DIRECT_DATABASE_URL, else DATABASE_URL) and every step gets it
// in both variables, because `prisma migrate deploy` reads only DATABASE_URL.
//
// Pending migrations are scanned first; in production a destructive one is refused unless
// RELEASE_ALLOW_DESTRUCTIVE names it exactly (comma-separated migration directory names).

import { spawnSync } from "node:child_process";
import { join } from "node:path";
import type { PrismaClient } from "@prisma/client";
import { config as loadDotenv } from "dotenv";
import { runImport, type ImportSummary } from "../prisma/content/import";
import { verifyPins } from "../prisma/content/manifest";
import { validateNewsletter, type NewsletterValidation } from "../prisma/content/newsletter";
import { validateProject, type ProjectValidation } from "../prisma/content/project";
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
import {
  contentStatus,
  describePlan,
  planFingerprint,
  sha256,
  type PlannedItem,
  type ReleasePlan,
} from "../prisma/release/plan";
import { runPendingSeeds } from "../prisma/seed/runner";

/** The manifest-listed content of every kind. */
interface ApprovedContent {
  posts: ParsedPost[];
  issues: NewsletterValidation["issues"];
  projects: ProjectValidation["projects"];
}

/** Offline check, before any lock or database access: invalid or changed content stops the release. */
function approvedContent(log: Logger): ApprovedContent {
  const validation = validateContent();
  const newsletter = validateNewsletter();
  const projects = validateProject();
  const checked = [validation, newsletter, projects];
  if (checked.some((result) => !result.ok)) {
    for (const result of checked) for (const error of result.errors) log.error(error);
    throw new ReleaseError("Content is invalid; nothing was released. Run `pnpm content:validate`.");
  }
  const problems = [
    ...verifyPins(validation.manifestEntries, validation.posts),
    ...verifyPins(newsletter.entries, newsletter.issues, "newsletter"),
    ...verifyPins(projects.entries, projects.projects, "project"),
  ];
  if (problems.length > 0) {
    for (const problem of problems) log.error(problem);
    throw new ReleaseError("The manifest does not match the content; nothing was released.");
  }
  const listedPosts = new Set(validation.manifestSlugs);
  const listedIssues = new Set(newsletter.entries.map((entry) => entry.slug));
  const listedProjects = new Set(projects.entries.map((entry) => entry.slug));
  return {
    posts: validation.posts.filter((post) => listedPosts.has(post.slug)),
    issues: newsletter.issues.filter((issue) => listedIssues.has(issue.slug)),
    projects: projects.projects.filter((project) => listedProjects.has(project.slug)),
  };
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
  approved: ApprovedContent,
  log: Logger,
): Promise<ReleasePlan> {
  const quiet: Logger = { info: () => undefined, warn: (m) => log.warn(m), error: (m) => log.error(m) };
  const needsMigration = pending.length > 0;

  // Do not query application tables against a schema that has pending migrations.
  // The migration SQL hashes are part of the fingerprint; seed and content
  // execution are explicitly deferred until after migrations.
  //
  // When the schema is already current, every planning error must propagate.
  const seeds = needsMigration
    ? null
    : await runPendingSeeds(prisma, { dryRun: true, log: quiet });

  // Same order as the real import (posts, issues, projects). Issues and projects are skipped
  // when nothing is listed for them, like `content:import`. A project may link to a post this
  // release creates; the dry run cannot see that row yet, so it is told which posts will exist.
  const posts = needsMigration ? null : await runImport(prisma, approved.posts, { dryRun: true, log: quiet });
  const issues =
    needsMigration || approved.issues.length === 0
      ? null
      : await runImport(prisma, approved.issues, { dryRun: true, log: quiet, kind: "newsletter" });
  const projects =
    needsMigration || approved.projects.length === 0
      ? null
      : await runImport(prisma, approved.projects, {
          dryRun: true,
          log: quiet,
          kind: "project",
          plannedPosts: new Set(posts?.created ?? []),
        });

  const rows = (
    kind: PlannedItem["kind"],
    items: readonly Pick<ParsedPost, "slug" | "sourceHash">[],
    outcome: ImportSummary | null,
  ): PlannedItem[] =>
    items.map((item) => ({
      kind,
      slug: item.slug,
      sourceHash: item.sourceHash,
      status: outcome === null ? "after-migrations" : contentStatus(item.slug, outcome),
    }));

  return {
    migrations: pending.map((m) => ({ name: m.name, sqlHash: sha256(m.sql) })),
    seeds: seeds === null ? null : seeds.pending,
    content: [
      ...rows("post", approved.posts, posts),
      ...rows("newsletter", approved.issues, issues),
      ...rows("project", approved.projects, projects),
    ],
    blocked: [posts, issues, projects].some((outcome) => outcome?.blocked ?? false),
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

    const approved = approvedContent(log);

    const url = resolveDatabaseUrl(process.env);
    const sha = process.env.VERCEL_GIT_COMMIT_SHA ?? null;

    // Every step must target the database the plan was computed on.
    // A force token must never reach a release run.
    const childEnv: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: url, DIRECT_DATABASE_URL: url };
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
    const plan = await buildPlan(prisma, pending, approved, log);
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
