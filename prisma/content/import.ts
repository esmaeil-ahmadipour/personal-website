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
import { ForceTokenError, forceKind, type ForceRequest } from "./force";
import {
  hasWork,
  planItem,
  taxonomyRelations,
  type DbItemState,
  type DbPostState,
  type PlanItem,
  type PostPlan,
  type RelationCheck,
  type SyncState,
} from "./plan";
import type { FieldValue, ParsedPost, ParsedProject } from "./types";

export class ImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportError";
  }
}

type Db = Prisma.TransactionClient;

/** Kinds of content this importer writes; each has its own table and ContentSync kind. */
export type ImportKind = "post" | "newsletter" | "project";

export interface ImportOptions {
  dryRun: boolean;
  log: Logger;
  /** Required for real runs; every transaction re-asserts it. */
  lock?: LockProof;
  force?: ForceRequest;
  /** What the items are. Defaults to "post"; a newsletter issue's slug is its number as text. */
  kind?: ImportKind;
  /** Dry run only, projects only: slugs of posts the same release creates, so a link to one is not reported missing. */
  plannedPosts?: ReadonlySet<string>;
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
export function assertAllAllowed(env: Record<string, string | undefined>, databaseUrl: string): void {
  if (env.VERCEL_ENV === "production") {
    throw new ImportError("--all is refused when VERCEL_ENV is production.");
  }
  if (!isLocalDatabaseUrl(databaseUrl)) {
    throw new ImportError("--all only runs against a local database (localhost, 127.0.0.1 or ::1).");
  }
}

export interface ImportTarget {
  kind: ImportKind;
  slug: string;
}

/** `my-post`, `newsletter:5` or `project:my-project`: the item a force token is for. Never echoes more than a kind word. */
export function parseTarget(arg: string): ImportTarget {
  const match = /^([a-z]+):(.+)$/.exec(arg);
  if (match === null) return { kind: "post", slug: arg };
  if (match[1] === "newsletter" || match[1] === "project") return { kind: match[1], slug: match[2] };
  throw new ImportError(
    `Force tokens are supported for posts, newsletter issues and projects only, not "${match[1]}".`,
  );
}

// ---------------------------------------------------------------------------
// Database access
// ---------------------------------------------------------------------------

interface Refs {
  authors: Map<string, string>;
  categories: Map<string, string>;
  tags: Map<string, string>;
  /** Posts that projects link to; empty for posts and newsletter issues. */
  posts: Map<string, string>;
}

const ref = (kind: ImportKind, slug: string): string => (kind === "post" ? slug : `${kind}:${slug}`);

const LABELS: Record<ImportKind, string> = { post: "post", newsletter: "newsletter issue", project: "project" };

const RELATIONS = {
  author: { select: { slug: true } },
  category: { select: { slug: true } },
  tags: { select: { tag: { select: { slug: true } } } },
} as const;

interface RowWithRelations {
  id: string;
  author: { slug: string };
  category: { slug: string };
  tags: { tag: { slug: string } }[];
}

function toDbState(row: RowWithRelations): DbPostState {
  return {
    id: row.id,
    values: { ...row },
    authorSlug: row.author.slug,
    categorySlug: row.category.slug,
    tagSlugs: row.tags.map((entry) => entry.tag.slug).sort(),
  };
}

/** A project row with the slugs of the posts it links to (sorted). */
interface DbProjectState extends DbItemState {
  postSlugs: string[];
}

const unique = (values: string[]): string[] => [...new Set(values)];

const toMap = (rows: { id: string; slug: string }[]): Map<string, string> =>
  new Map(rows.map((row) => [row.slug, row.id]));

/** The table-specific part of an import. Planning, gating and conflict rules are shared. */
interface ItemOps<T extends PlanItem, D extends DbItemState> {
  kind: ImportKind;
  /** Existing rows keyed by slug. */
  find(db: Db, slugs: string[]): Promise<Map<string, D>>;
  /** Ids of the rows the items refer to: taxonomy for posts and issues, posts for projects. */
  loadRefs(db: Db, items: readonly T[]): Promise<Refs>;
  /** Missing references of a plan: a create needs all of them, an update only the links it adds. */
  referenceErrors(plan: PostPlan<T>, refs: Refs): string[];
  /** Warnings about relations that differ, and links to add to an existing row. */
  relations(item: T, db: D): RelationCheck;
  create(db: Db, item: T, refs: Refs): Promise<void>;
  update(db: Db, id: string, data: Record<string, FieldValue>): Promise<void>;
  /** Adds links an existing row lacks. Only projects have any; nothing is ever removed. */
  addLinks?(db: Db, id: string, slugs: readonly string[], refs: Refs): Promise<void>;
}

// Posts and newsletter issues share author, category and tags.

async function loadTaxonomyRefs(db: Db, posts: readonly ParsedPost[]): Promise<Refs> {
  const [authors, categories, tags] = await Promise.all([
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
  return { authors: toMap(authors), categories: toMap(categories), tags: toMap(tags), posts: new Map() };
}

function taxonomyErrors(kind: ImportKind, plan: PostPlan, refs: Refs): string[] {
  if (plan.kind !== "create") return [];
  const errors: string[] = [];
  const name = ref(kind, plan.slug);
  const { authorSlug, categorySlug, tagSlugs } = plan.post.relations;
  if (!refs.authors.has(authorSlug)) errors.push(`${name}: author "${authorSlug}" not found in the database`);
  if (!refs.categories.has(categorySlug)) errors.push(`${name}: category "${categorySlug}" not found in the database`);
  for (const tag of tagSlugs) {
    if (!refs.tags.has(tag)) errors.push(`${name}: tag "${tag}" not found in the database`);
  }
  return errors;
}

const taxonomyOps = (kind: ImportKind) => ({
  kind,
  loadRefs: loadTaxonomyRefs,
  referenceErrors: (plan: PostPlan, refs: Refs): string[] => taxonomyErrors(kind, plan, refs),
  relations: taxonomyRelations,
});

function taxonomyIds(post: ParsedPost, refs: Refs): { author: string; category: string; tags: string[] } {
  return {
    author: refs.authors.get(post.relations.authorSlug) as string,
    category: refs.categories.get(post.relations.categorySlug) as string,
    tags: post.relations.tagSlugs.map((tag) => refs.tags.get(tag) as string),
  };
}

const POST_OPS: ItemOps<ParsedPost, DbPostState> = {
  ...taxonomyOps("post"),
  async find(db, slugs) {
    const rows = await db.post.findMany({ where: { slug: { in: slugs } }, include: RELATIONS });
    return new Map<string, DbPostState>(rows.map((row) => [row.slug, toDbState(row)] as const));
  },
  async create(db, post, refs) {
    await db.post.create({ data: createData(post, taxonomyIds(post, refs)) });
  },
  async update(db, id, data) {
    await db.post.update({ where: { id }, data: data as unknown as Prisma.PostUncheckedUpdateInput });
  },
};

const ISSUE_OPS: ItemOps<ParsedPost, DbPostState> = {
  ...taxonomyOps("newsletter"),
  async find(db, slugs) {
    const numbers = slugs.map(Number).filter((value) => Number.isInteger(value));
    const rows = await db.newsletterIssue.findMany({ where: { number: { in: numbers } }, include: RELATIONS });
    return new Map<string, DbPostState>(rows.map((row) => [String(row.number), toDbState(row)] as const));
  },
  async create(db, post, refs) {
    const ids = taxonomyIds(post, refs);
    await db.newsletterIssue.create({
      data: {
        ...post.fields,
        number: Number(post.slug),
        authorId: ids.author,
        categoryId: ids.category,
        tags: { create: ids.tags.map((tagId) => ({ tagId })) },
      } as unknown as Prisma.NewsletterIssueUncheckedCreateInput,
    });
  },
  async update(db, id, data) {
    await db.newsletterIssue.update({ where: { id }, data: data as unknown as Prisma.NewsletterIssueUncheckedUpdateInput });
  },
};

// Projects link to posts (ProjectPost). Links are added, never removed; a missing post blocks.

const PROJECT_OPS: ItemOps<ParsedProject, DbProjectState> = {
  kind: "project",
  async find(db, slugs) {
    const rows = await db.project.findMany({
      where: { slug: { in: slugs } },
      include: { posts: { select: { post: { select: { slug: true } } } } },
    });
    return new Map<string, DbProjectState>(
      rows.map(
        (row) =>
          [
            row.slug,
            { id: row.id, values: { ...row }, postSlugs: row.posts.map((entry) => entry.post.slug).sort() },
          ] as const,
      ),
    );
  },
  async loadRefs(db, projects) {
    const slugs = unique(projects.flatMap((project) => project.relations.postSlugs));
    const posts = slugs.length === 0 ? [] : await db.post.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } });
    return { authors: new Map(), categories: new Map(), tags: new Map(), posts: toMap(posts) };
  },
  referenceErrors(plan, refs) {
    const wanted =
      plan.kind === "create" ? plan.post.relations.postSlugs : plan.kind === "update" ? plan.linkAdditions : [];
    const name = ref("project", plan.slug);
    return wanted.filter((slug) => !refs.posts.has(slug)).map((slug) => `${name}: post "${slug}" not found in the database`);
  },
  relations(project, db) {
    const wanted = project.relations.postSlugs;
    const extra = db.postSlugs.filter((slug) => !wanted.includes(slug));
    return {
      warnings:
        extra.length === 0
          ? []
          : [`${project.slug}: the database links post(s) ${extra.join(", ")} that content does not list; links are never removed`],
      additions: wanted.filter((slug) => !db.postSlugs.includes(slug)),
    };
  },
  async create(db, project, refs) {
    await db.project.create({
      data: {
        ...project.fields,
        slug: project.slug,
        posts: { create: project.relations.postSlugs.map((slug) => ({ postId: refs.posts.get(slug) as string })) },
      } as unknown as Prisma.ProjectUncheckedCreateInput,
    });
  },
  async update(db, id, data) {
    await db.project.update({ where: { id }, data: data as unknown as Prisma.ProjectUncheckedUpdateInput });
  },
  async addLinks(db, id, slugs, refs) {
    await db.projectPost.createMany({
      data: slugs.map((slug) => ({ projectId: id, postId: refs.posts.get(slug) as string })),
      skipDuplicates: true,
    });
  },
};

interface State<D extends DbItemState> {
  posts: Map<string, D>;
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

async function loadState<T extends PlanItem, D extends DbItemState>(
  db: Db,
  items: readonly T[],
  ops: ItemOps<T, D>,
): Promise<State<D>> {
  const slugs = items.map((item) => item.slug);

  const [found, syncRows, refs] = await Promise.all([
    ops.find(db, slugs),
    db.contentSync.findMany({ where: { kind: ops.kind, slug: { in: slugs } } }),
    ops.loadRefs(db, items),
  ]);

  return {
    posts: found,
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
    refs,
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
  kind: ImportKind = "post",
): Promise<boolean> {
  const result = await db.contentSync.updateMany({
    where: { kind, slug, NOT: { consumedForceTokens: { has: marker } } },
    data: { consumedForceTokens: { push: marker } },
  });
  return result.count === 1;
}

// ---------------------------------------------------------------------------
// Planning and gating
// ---------------------------------------------------------------------------

function planFor<T extends PlanItem, D extends DbItemState>(
  ops: ItemOps<T, D>,
  item: T,
  db: D | null,
  sync: SyncState | null,
  force: ForceRequest | null,
): PostPlan<T> {
  return planItem(item, db, sync, force, (state) => ops.relations(item, state));
}

/** Throws (before any write) unless the token is valid for this import. Messages never contain the token. */
function validateForce(
  plans: readonly PostPlan<PlanItem>[],
  syncs: ReadonlyMap<string, SyncState>,
  force: ForceRequest,
  kind: ImportKind,
): void {
  const label = LABELS[kind];
  const name = ref(kind, force.slug);
  const plan = plans.find((candidate) => candidate.slug === force.slug);
  if (plan === undefined) {
    throw new ForceTokenError(`The force token is scoped to ${label} "${force.slug}", which is not part of this import.`);
  }
  if (plan.kind !== "update") {
    throw new ForceTokenError(`Force does not apply to "${name}": the ${label} is ${plan.kind}, not an existing managed ${label}.`);
  }
  if (syncs.get(force.slug)?.consumedForceTokens.includes(force.marker)) {
    throw new ForceTokenError(`The force token for "${name}" was already used.`);
  }
  if (plan.forced.length === 0) {
    throw new ForceTokenError(`Nothing to force for "${name}": it has no conflicting fields.`);
  }
}

function report(plans: readonly PostPlan<PlanItem>[], refErrors: readonly string[], log: Logger, kind: ImportKind): void {
  for (const plan of plans) {
    const name = ref(kind, plan.slug);
    for (const warning of plan.warnings) log.warn(kind === "post" ? warning : `${kind}:${warning}`);
    if (plan.kind === "create") {
      log.info(`${name}: create`);
    } else if (plan.kind === "update") {
      if (plan.writeFields.length > 0) log.info(`${name}: update ${plan.writeFields.join(", ")}`);
      if (plan.linkAdditions.length > 0) log.info(`${name}: add link(s) to post(s) ${plan.linkAdditions.join(", ")}`);
      if (plan.forced.length > 0) log.warn(`${name}: force token overwrites conflicting field(s): ${plan.forced.join(", ")}`);
      const soft = plan.conflicts.filter((name) => !plan.blocking.includes(name));
      if (soft.length > 0) log.warn(`${name}: conflict (database and file both changed), skipped: ${soft.join(", ")}`);
      if (plan.blocking.length > 0) {
        log.error(`${name}: BLOCKING conflict on ${plan.blocking.join(", ")}; resolve it or use a force token (docs/content-import.md)`);
      }
      if (!hasWork(plan) && plan.conflicts.length === 0) log.info(`${name}: unchanged`);
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

function pickFields(post: PlanItem, names: readonly string[]): Record<string, FieldValue> {
  const data: Record<string, FieldValue> = {};
  for (const name of names) data[name] = post.fields[name];
  return data;
}

function isSerializationFailure(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: unknown }).code === "P2034";
}

async function applyOne<T extends PlanItem, D extends DbItemState>(
  prisma: PrismaClient,
  post: T,
  force: ForceRequest | undefined,
  lock: LockProof | undefined,
  ops: ItemOps<T, D>,
): Promise<void> {
  const name = ref(ops.kind, post.slug);
  await lock?.assertHeld();
  try {
    await prisma.$transaction(
      async (tx) => {
        await lock?.assertHeld();
        const state = await loadState(tx, [post], ops);
        const db = state.posts.get(post.slug) ?? null;
        const plan = planFor(ops, post, db, state.syncs.get(post.slug) ?? null, force ?? null);

        if (plan.kind === "create") {
          const errors = ops.referenceErrors(plan, state.refs);
          if (errors.length > 0) throw new ImportError(errors.join("; "));
          await ops.create(tx, post, state.refs);
          await tx.contentSync.create({
            data: {
              kind: ops.kind,
              slug: post.slug,
              sourceHash: post.sourceHash,
              formatVersion: post.formatVersion,
              fieldHashes: post.fieldHashes,
            },
          });
        } else if (plan.kind === "update" && db !== null) {
          if (plan.blocking.length > 0) {
            throw new ImportError(`${name}: a blocking conflict appeared during the import; nothing was written for it`);
          }
          const errors = ops.referenceErrors(plan, state.refs);
          if (errors.length > 0) throw new ImportError(errors.join("; "));
          if (force !== undefined && force.slug === post.slug) {
            if (plan.forced.length === 0) {
              throw new ForceTokenError(`The force token for "${name}" is no longer applicable; nothing was written for it.`);
            }
            if (!(await consumeForceToken(tx, post.slug, force.marker, ops.kind))) {
              throw new ForceTokenError(`The force token for "${name}" was already used; nothing was written for it.`);
            }
          }
          if (plan.writeFields.length > 0) {
            await ops.update(tx, db.id, pickFields(post, plan.writeFields));
          }
          if (plan.linkAdditions.length > 0) {
            await ops.addLinks?.(tx, db.id, plan.linkAdditions, state.refs);
          }
          if (plan.syncChanged) {
            await tx.contentSync.update({
              where: { kind_slug: { kind: ops.kind, slug: post.slug } },
              data: {
                sourceHash: post.sourceHash,
                formatVersion: post.formatVersion,
                fieldHashes: plan.nextHashes,
              },
            });
          }
        } else {
          throw new ImportError(`${name}: its state changed during the import (${plan.kind}); nothing was written for it, run again`);
        }

        await lock?.assertHeld(); // still the sole writer right before commit
      },
      { isolationLevel: "Serializable", timeout: 15_000, maxWait: 10_000 },
    );
  } catch (error) {
    if (isSerializationFailure(error)) {
      throw new ImportError(`${name}: concurrent modification detected; nothing was written for it, run again`);
    }
    throw error;
  }
}

async function runImportWith<T extends PlanItem, D extends DbItemState>(
  prisma: PrismaClient,
  posts: readonly T[],
  options: ImportOptions,
  ops: ItemOps<T, D>,
): Promise<ImportSummary> {
  const { log, lock, dryRun } = options;
  // A token is scoped to one kind: a post, an issue and a project can all have the slug "5".
  const force =
    options.force !== undefined && forceKind(options.force) === ops.kind ? options.force : undefined;
  const state = await loadState(prisma, posts, ops);
  if (dryRun && ops.kind === "project") {
    for (const slug of options.plannedPosts ?? []) {
      if (!state.refs.posts.has(slug)) state.refs.posts.set(slug, `planned:${slug}`);
    }
  }
  const plans = posts.map((post) =>
    planFor(ops, post, state.posts.get(post.slug) ?? null, state.syncs.get(post.slug) ?? null, force ?? null),
  );
  if (force !== undefined) validateForce(plans, state.syncs, force, ops.kind);

  const refErrors = plans.flatMap((plan) => ops.referenceErrors(plan, state.refs));
  report(plans, refErrors, log, ops.kind);

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
      await applyOne(prisma, plan.post, force, lock, ops);
      summary.applied.push(plan.slug);
    }
  } catch (error) {
    log.error(`Import stopped; committed before the failure: ${summary.applied.join(", ") || "none"}.`);
    throw error;
  }
  log.info(`Done. created=${summary.created.length} updated=${summary.updated.length} unchanged=${summary.unchanged.length} skipped=${summary.skipped.length} conflicts=${summary.conflicts.length}`);
  return summary;
}

export function runImport(
  prisma: PrismaClient,
  items: readonly ParsedPost[] | readonly ParsedProject[],
  options: ImportOptions,
): Promise<ImportSummary> {
  switch (options.kind ?? "post") {
    case "project":
      return runImportWith(prisma, items as readonly ParsedProject[], options, PROJECT_OPS);
    case "newsletter":
      return runImportWith(prisma, items as readonly ParsedPost[], options, ISSUE_OPS);
    default:
      return runImportWith(prisma, items as readonly ParsedPost[], options, POST_OPS);
  }
}
