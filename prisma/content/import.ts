// prisma/content/import.ts
//
// Core of `pnpm content:import`. Three stages:
//   1. plan   - read-only, for every selected post (see plan.ts);
//   2. gate   - blocking conflicts, missing references or a bad force token stop
//               the run before anything is written;
//   3. apply  - one Serializable transaction per post, re-planned inside the
//               transaction, with the release lock re-asserted before commit.
//
// Posts are only ever created or updated. Nothing is deleted or recreated.
// A force token is consumed inside the same transaction that applies the forced
// changes, so a failed or rolled-back transaction leaves the token reusable.
// No message here ever contains a token (only slugs and field names).

import type { Prisma, PrismaClient } from "@prisma/client";
import type { Logger } from "../lib/log";
import type { LockProof } from "../seed/runner";
import { ForceTokenError, type ForceRequest } from "./force";
import { planPost, hasWork, type DbPostState, type PostPlan, type SyncState } from "./plan";
import type { FieldValue, ParsedPost } from "./types";

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}

type Db = Prisma.TransactionClient;

export interface ImportOptions {
  dryRun: boolean;
  log: Logger;
  /** Required for real runs; every transaction re-asserts it. */
  lock?: LockProof;
  force?: ForceRequest;
}

export interface ImportSummary {
  dryRun: boolean;
  blocked: boolean;
  created: string[];
  updated: string[];
  unchanged: string[];
  skipped: string[];
  conflicts: string[];
  forced: string[];
  /** Slugs whose transaction committed. */
  applied: string[];
}

// ---------------------------------------------------------------------------
// Command line (pure)
// ---------------------------------------------------------------------------

export type ImportCommand =
  | { command: "token"; slug: string }
  | { command: "import"; dryRun: boolean; all: boolean; force: boolean };

const FLAGS = new Set(["--dry-run", "--all", "--force"]);

export function parseCommand(argv: readonly string[]): ImportCommand {
  if (argv[0] === "token") {
    if (argv.length !== 2) throw new ImportError("Usage: pnpm content:force-token <slug>");
    return { command: "token", slug: argv[1] };
  }
  const unknown = argv.filter((arg) => !FLAGS.has(arg));
  if (unknown.length > 0) {
    // Never echo a value: someone may have pasted a token as an argument.
    const shown = unknown.map((arg) => (/^--[a-z-]+$/.test(arg) ? arg : "[value hidden]"));
    throw new ImportError(`Unknown argument(s): ${shown.join(" ")}. Supported: --dry-run --all --force`);
  }
  return {
    command: "import",
    dryRun: argv.includes("--dry-run"),
    all: argv.includes("--all"),
    force: argv.includes("--force"),
  };
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export function isLocalDatabaseUrl(url: string): boolean {
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** `--all` imports posts that are not in the manifest: development databases only. */
export function assertAllAllowed(env: NodeJS.ProcessEnv, databaseUrl: string): void {
  if (env.VERCEL_ENV === "production") {
    throw new ImportError("--all is refused when VERCEL_ENV is production.");
  }
  if (!isLocalDatabaseUrl(databaseUrl)) {
    throw new ImportError("--all only runs against a local database (localhost, 127.0.0.1 or ::1).");
  }
}

// ---------------------------------------------------------------------------
// Database access
// ---------------------------------------------------------------------------

interface Refs {
  authors: Map<string, string>;
  categories: Map<string, string>;
  tags: Map<string, string>;
}

interface State {
  posts: Map<string, DbPostState>;
  syncs: Map<string, SyncState>;
  refs: Refs;
}

function toHashRecord(value: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === "string") result[key] = entry;
    }
  }
  return result;
}

const toMap = (rows: { id: string; slug: string }[]): Map<string, string> =>
  new Map(rows.map((row) => [row.slug, row.id]));

async function loadState(db: Db, posts: readonly ParsedPost[]): Promise<State> {
  const slugs = posts.map((post) => post.slug);
  const unique = (values: string[]): string[] => [...new Set(values)];

  const [postRows, syncRows, authors, categories, tags] = await Promise.all([
    db.post.findMany({
      where: { slug: { in: slugs } },
      include: {
        author: { select: { slug: true } },
        category: { select: { slug: true } },
        tags: { select: { tag: { select: { slug: true } } } },
      },
    }),
    db.contentSync.findMany({ where: { kind: "post", slug: { in: slugs } } }),
    db.author.findMany({
      where: { slug: { in: unique(posts.map((p) => p.relations.authorSlug)) } },
      select: { id: true, slug: true },
    }),
    db.category.findMany({
      where: { slug: { in: unique(posts.map((p) => p.relations.categorySlug)) } },
      select: { id: true, slug: true },
    }),
    db.tag.findMany({
      where: { slug: { in: unique(posts.flatMap((p) => p.relations.tagSlugs)) } },
      select: { id: true, slug: true },
    }),
  ]);

  return {
    posts: new Map(
      postRows.map((row) => [
        row.slug,
        {
          id: row.id,
          values: { ...row },
          authorSlug: row.author.slug,
          categorySlug: row.category.slug,
          tagSlugs: row.tags.map((entry) => entry.tag.slug).sort(),
        },
      ]),
    ),
    syncs: new Map(
      syncRows.map((row) => [
        row.slug,
        {
          sourceHash: row.sourceHash,
          formatVersion: row.formatVersion,
          fieldHashes: toHashRecord(row.fieldHashes),
          consumedForceTokens: [...row.consumedForceTokens],
        },
      ]),
    ),
    refs: { authors: toMap(authors), categories: toMap(categories), tags: toMap(tags) },
  };
}

/**
 * Atomically marks a force token as used. The conditional UPDATE locks the row, so
 * of any number of concurrent callers exactly one gets `true`. Call it inside the
 * transaction that applies the forced changes: if that transaction rolls back, so
 * does the consumption.
 */
export async function consumeForceToken(
  db: Pick<Db, "contentSync">,
  slug: string,
  marker: string,
): Promise<boolean> {
  const result = await db.contentSync.updateMany({
    where: { kind: "post", slug, NOT: { consumedForceTokens: { has: marker } } },
    data: { consumedForceTokens: { push: marker } },
  });
  return result.count === 1;
}

// ---------------------------------------------------------------------------
// Planning and gating
// ---------------------------------------------------------------------------

function referenceErrors(plans: readonly PostPlan[], refs: Refs): string[] {
  const errors: string[] = [];
  for (const plan of plans) {
    if (plan.kind !== "create") continue;
    const { authorSlug, categorySlug, tagSlugs } = plan.post.relations;
    if (!refs.authors.has(authorSlug)) errors.push(`${plan.slug}: author "${authorSlug}" not found in the database`);
    if (!refs.categories.has(categorySlug)) errors.push(`${plan.slug}: category "${categorySlug}" not found in the database`);
    for (const tag of tagSlugs) {
      if (!refs.tags.has(tag)) errors.push(`${plan.slug}: tag "${tag}" not found in the database`);
    }
  }
  return errors;
}

/** Throws (before any write) unless the token is valid for this import. Messages never contain the token. */
function validateForce(plans: readonly PostPlan[], state: State, force: ForceRequest): void {
  const plan = plans.find((candidate) => candidate.slug === force.slug);
  if (plan === undefined) {
    throw new ForceTokenError(`The force token is scoped to post "${force.slug}", which is not part of this import.`);
  }
  if (plan.kind !== "update") {
    throw new ForceTokenError(`Force does not apply to "${force.slug}": the post is ${plan.kind}, not an existing managed post.`);
  }
  if (state.syncs.get(force.slug)?.consumedForceTokens.includes(force.marker)) {
    throw new ForceTokenError(`The force token for "${force.slug}" was already used.`);
  }
  if (plan.forced.length === 0) {
    throw new ForceTokenError(`Nothing to force for "${force.slug}": it has no conflicting fields.`);
  }
}

function report(plans: readonly PostPlan[], refErrors: readonly string[], log: Logger): void {
  for (const plan of plans) {
    for (const warning of plan.warnings) log.warn(warning);
    if (plan.kind === "create") {
      log.info(`${plan.slug}: create`);
    } else if (plan.kind === "update") {
      if (plan.writeFields.length > 0) log.info(`${plan.slug}: update ${plan.writeFields.join(", ")}`);
      if (plan.forced.length > 0) log.warn(`${plan.slug}: force token overwrites conflicting field(s): ${plan.forced.join(", ")}`);
      const soft = plan.conflicts.filter((name) => !plan.blocking.includes(name));
      if (soft.length > 0) log.warn(`${plan.slug}: conflict (database and file both changed), skipped: ${soft.join(", ")}`);
      if (plan.blocking.length > 0) {
        log.error(`${plan.slug}: BLOCKING conflict on ${plan.blocking.join(", ")}; resolve it or use a force token (docs/content-import.md)`);
      }
      if (!hasWork(plan) && plan.conflicts.length === 0) log.info(`${plan.slug}: unchanged`);
    }
  }
  for (const error of refErrors) log.error(error);
}

// ---------------------------------------------------------------------------
// Apply
// ---------------------------------------------------------------------------

/** Column names and types come from the content builder (covered by its tests). */
function createData(post: ParsedPost, ids: { author: string; category: string; tags: string[] }): Prisma.PostUncheckedCreateInput {
  return {
    ...post.fields,
    slug: post.slug,
    authorId: ids.author,
    categoryId: ids.category,
    tags: { create: ids.tags.map((tagId) => ({ tagId })) },
  } as unknown as Prisma.PostUncheckedCreateInput;
}

function pickFields(post: ParsedPost, names: readonly string[]): Prisma.PostUncheckedUpdateInput {
  const data: Record<string, FieldValue> = {};
  for (const name of names) data[name] = post.fields[name];
  return data as unknown as Prisma.PostUncheckedUpdateInput;
}

function isSerializationFailure(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: unknown }).code === "P2034";
}

async function applyOne(
  prisma: PrismaClient,
  post: ParsedPost,
  force: ForceRequest | undefined,
  lock: LockProof | undefined,
): Promise<void> {
  await lock?.assertHeld();
  try {
    await prisma.$transaction(
      async (tx) => {
        await lock?.assertHeld();
        const state = await loadState(tx, [post]);
        const db = state.posts.get(post.slug) ?? null;
        const plan = planPost(post, db, state.syncs.get(post.slug) ?? null, force ?? null);

        if (plan.kind === "create") {
          const errors = referenceErrors([plan], state.refs);
          if (errors.length > 0) throw new ImportError(errors.join("; "));
          await tx.post.create({
            data: createData(post, {
              author: state.refs.authors.get(post.relations.authorSlug) as string,
              category: state.refs.categories.get(post.relations.categorySlug) as string,
              tags: post.relations.tagSlugs.map((tag) => state.refs.tags.get(tag) as string),
            }),
          });
          await tx.contentSync.create({
            data: {
              kind: "post",
              slug: post.slug,
              sourceHash: post.sourceHash,
              formatVersion: post.formatVersion,
              fieldHashes: post.fieldHashes,
            },
          });
        } else if (plan.kind === "update" && db !== null) {
          if (plan.blocking.length > 0) {
            throw new ImportError(`${post.slug}: a blocking conflict appeared during the import; nothing was written for it`);
          }
          if (force !== undefined && force.slug === post.slug) {
            if (plan.forced.length === 0) {
              throw new ForceTokenError(`The force token for "${post.slug}" is no longer applicable; nothing was written for it.`);
            }
            if (!(await consumeForceToken(tx, post.slug, force.marker))) {
              throw new ForceTokenError(`The force token for "${post.slug}" was already used; nothing was written for it.`);
            }
          }
          if (plan.writeFields.length > 0) {
            await tx.post.update({ where: { id: db.id }, data: pickFields(post, plan.writeFields) });
          }
          if (plan.syncChanged) {
            await tx.contentSync.update({
              where: { kind_slug: { kind: "post", slug: post.slug } },
              data: {
                sourceHash: post.sourceHash,
                formatVersion: post.formatVersion,
                fieldHashes: plan.nextHashes,
              },
            });
          }
        } else {
          throw new ImportError(`${post.slug}: its state changed during the import (${plan.kind}); nothing was written for it, run again`);
        }

        await lock?.assertHeld(); // still the sole writer right before commit
      },
      { isolationLevel: "Serializable", timeout: 15_000, maxWait: 10_000 },
    );
  } catch (error) {
    if (isSerializationFailure(error)) {
      throw new ImportError(`${post.slug}: concurrent modification detected; nothing was written for it, run again`);
    }
    throw error;
  }
}

export async function runImport(
  prisma: PrismaClient,
  posts: readonly ParsedPost[],
  options: ImportOptions,
): Promise<ImportSummary> {
  const { log, force, lock, dryRun } = options;
  const state = await loadState(prisma, posts);
  const plans = posts.map((post) =>
    planPost(post, state.posts.get(post.slug) ?? null, state.syncs.get(post.slug) ?? null, force ?? null),
  );
  if (force !== undefined) validateForce(plans, state, force);

  const refErrors = referenceErrors(plans, state.refs);
  report(plans, refErrors, log);

  const summary: ImportSummary = {
    dryRun,
    blocked: refErrors.length > 0 || plans.some((p) => p.kind === "update" && p.blocking.length > 0),
    created: plans.filter((p) => p.kind === "create").map((p) => p.slug),
    updated: plans.filter((p) => p.kind === "update" && hasWork(p)).map((p) => p.slug),
    unchanged: plans.filter((p) => p.kind === "update" && !hasWork(p)).map((p) => p.slug),
    skipped: plans.filter((p) => p.kind === "unmanaged" || p.kind === "orphan").map((p) => p.slug),
    conflicts: plans.filter((p) => p.kind === "update" && p.conflicts.length > 0).map((p) => p.slug),
    forced: plans.filter((p) => p.kind === "update" && p.forced.length > 0).map((p) => p.slug),
    applied: [],
  };

  if (summary.blocked) {
    log.error("Import stopped before writing anything (blocking conflict or missing reference).");
    return summary;
  }
  if (dryRun) {
    log.info("Dry run: nothing was written.");
    return summary;
  }

  try {
    for (const plan of plans) {
      if (plan.kind !== "create" && plan.kind !== "update") continue; // unmanaged / orphan: skipped on purpose
      if (!hasWork(plan)) continue;
      await applyOne(prisma, plan.post, force, lock);
      summary.applied.push(plan.slug);
    }
  } catch (error) {
    log.error(`Import stopped; committed before the failure: ${summary.applied.join(", ") || "none"}.`);
    throw error;
  }
  log.info(`Done. created=${summary.created.length} updated=${summary.updated.length} unchanged=${summary.unchanged.length} skipped=${summary.skipped.length} conflicts=${summary.conflicts.length}`);
  return summary;
}
