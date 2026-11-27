// prisma/content/plan.ts
//
// Pure planner: decides, per post, what an import would do. No I/O.
//
// For every file-owned field three values are compared:
//   file   - hash of the value in content/ now
//   last   - hash of the file value last applied (ContentSync.fieldHashes)
//   db     - hash of the value currently in the database
//
//   db == file                -> in-sync    (record the hash only)
//   last == file              -> keep-db    (file unchanged; the database was edited)
//   last known and db == last -> update     (file changed; the database is untouched)
//   otherwise                 -> conflict   (both changed, or history unknown)
//
// A skipped conflict keeps its old `last` hash, so it is reported again by every
// run until it is resolved. Conflicts on BLOCKING_FIELDS stop the whole import.

import { canonicalJson, hashValue } from "./build";
import type { ForceRequest } from "./force";
import type { ParsedPost } from "./types";

/** Conflicts on these fields change what the public sees, so they stop the release. */
export const BLOCKING_FIELDS: ReadonlySet<string> = new Set(["status", "publishedAt"]);

export type FieldAction = "in-sync" | "keep-db" | "update" | "conflict" | "forced";

/** What the planner reads from a parsed item: a post, a newsletter issue or a project. */
export type PlanItem = Pick<ParsedPost, "slug" | "formatVersion" | "sourceHash" | "fields" | "fieldHashes">;

/** What the planner reads from a database row. */
export interface DbItemState {
  id: string;
  values: Record<string, unknown>;
}

export interface DbPostState extends DbItemState {
  authorSlug: string;
  categorySlug: string;
  /** Sorted. */
  tagSlugs: string[];
}

export interface SyncState {
  sourceHash: string;
  formatVersion: number;
  fieldHashes: Record<string, string>;
  consumedForceTokens: string[];
}

interface PlanBase {
  slug: string;
  warnings: string[];
}

export interface CreatePlan<T extends PlanItem = ParsedPost> extends PlanBase {
  kind: "create";
  post: T;
}

/** Skipped on purpose: "unmanaged" has no ContentSync row, "orphan" has no Post row. */
export interface SkipPlan extends PlanBase {
  kind: "unmanaged" | "orphan";
}

export interface UpdatePlan<T extends PlanItem = ParsedPost> extends PlanBase {
  kind: "update";
  post: T;
  actions: Record<string, FieldAction>;
  /** Fields written to the Post (updates plus forced overwrites). */
  writeFields: string[];
  /** Unresolved conflicts (skipped). */
  conflicts: string[];
  /** Unresolved conflicts on BLOCKING_FIELDS. */
  blocking: string[];
  /** Conflicts overwritten because a valid force token applies. */
  forced: string[];
  /** ContentSync.fieldHashes after this import. */
  nextHashes: Record<string, string>;
  /** Whether the ContentSync row itself needs writing. */
  syncChanged: boolean;
  /** Links the file lists and the database lacks (projects only). They are added, never removed. */
  linkAdditions: string[];
}

export type PostPlan<T extends PlanItem = ParsedPost> = CreatePlan<T> | SkipPlan | UpdatePlan<T>;

/** What an item's relations add to its plan: warnings, and links to add to the existing row. */
export interface RelationCheck {
  warnings: string[];
  additions: string[];
}

/** Posts and newsletter issues: author, category and tags are create-only. */
export function taxonomyRelations(post: ParsedPost, db: DbPostState): RelationCheck {
  const slug = post.slug;
  const warnings: string[] = [];
  if (db.authorSlug !== post.relations.authorSlug) {
    warnings.push(`${slug}: author differs from content; relations are create-only, not changed`);
  }
  if (db.categorySlug !== post.relations.categorySlug) {
    warnings.push(`${slug}: category differs from content; relations are create-only, not changed`);
  }
  if (db.tagSlugs.join(",") !== post.relations.tagSlugs.join(",")) {
    warnings.push(`${slug}: tags differ from content; relations are create-only, not changed`);
  }
  return { warnings, additions: [] };
}

export function planPost(
  post: ParsedPost,
  db: DbPostState | null,
  sync: SyncState | null,
  force: ForceRequest | null,
): PostPlan {
  return planItem(post, db, sync, force, (state) => taxonomyRelations(post, state));
}

/** The planner for any kind of item; `relations` supplies what the item's links add to the plan. */
export function planItem<T extends PlanItem, D extends DbItemState>(
  post: T,
  db: D | null,
  sync: SyncState | null,
  force: ForceRequest | null,
  relations: (db: D) => RelationCheck,
): PostPlan<T> {
  const slug = post.slug;
  if (db === null && sync === null) return { kind: "create", slug, post, warnings: [] };
  if (db === null) {
    return {
      kind: "orphan",
      slug,
      warnings: [`${slug}: ContentSync exists but the post is missing from the database; it is NOT recreated`],
    };
  }
  if (sync === null) {
    return {
      kind: "unmanaged",
      slug,
      warnings: [`${slug}: exists in the database but is not managed by content import (no ContentSync); skipped`],
    };
  }

  const actions: Record<string, FieldAction> = {};
  const nextHashes: Record<string, string> = {};
  const unresolved: string[] = [];

  for (const [name, fileHash] of Object.entries(post.fieldHashes)) {
    const raw = db.values[name];
    const dbHash = hashValue(raw === undefined ? null : raw);
    const last = sync.fieldHashes[name];
    if (dbHash === fileHash) {
      actions[name] = "in-sync";
      nextHashes[name] = fileHash;
    } else if (last === fileHash) {
      actions[name] = "keep-db";
      nextHashes[name] = fileHash;
    } else if (last !== undefined && dbHash === last) {
      actions[name] = "update";
      nextHashes[name] = fileHash;
    } else {
      actions[name] = "conflict";
      unresolved.push(name);
      if (last !== undefined) nextHashes[name] = last;
    }
  }

  const forceUsable =
    force !== null && force.slug === slug && !sync.consumedForceTokens.includes(force.marker);
  const forced = forceUsable ? unresolved : [];
  const conflicts = forceUsable ? [] : unresolved;
  for (const name of forced) {
    actions[name] = "forced";
    nextHashes[name] = post.fieldHashes[name];
  }

  const { warnings, additions } = relations(db);

  return {
    kind: "update",
    slug,
    post,
    actions,
    writeFields: Object.keys(actions).filter((n) => actions[n] === "update" || actions[n] === "forced"),
    conflicts,
    blocking: conflicts.filter((n) => BLOCKING_FIELDS.has(n)),
    forced,
    nextHashes,
    syncChanged:
      post.sourceHash !== sync.sourceHash ||
      post.formatVersion !== sync.formatVersion ||
      canonicalJson(nextHashes) !== canonicalJson(sync.fieldHashes),
    linkAdditions: additions,
    warnings,
  };
}

export function hasWork(plan: PostPlan<PlanItem>): boolean {
  if (plan.kind === "create") return true;
  if (plan.kind === "update") return plan.writeFields.length > 0 || plan.syncChanged || plan.linkAdditions.length > 0;
  return false;
}
