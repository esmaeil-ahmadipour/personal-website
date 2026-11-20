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

export interface DbPostState {
  id: string;
  values: Record<string, unknown>;
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

export interface CreatePlan extends PlanBase {
  kind: "create";
  post: ParsedPost;
}

/** Skipped on purpose: "unmanaged" has no ContentSync row, "orphan" has no Post row. */
export interface SkipPlan extends PlanBase {
  kind: "unmanaged" | "orphan";
}

export interface UpdatePlan extends PlanBase {
  kind: "update";
  post: ParsedPost;
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
}

export type PostPlan = CreatePlan | SkipPlan | UpdatePlan;

export function planPost(
  post: ParsedPost,
  db: DbPostState | null,
  sync: SyncState | null,
  force: ForceRequest | null,
): PostPlan {
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
    warnings,
  };
}

export function hasWork(plan: PostPlan): boolean {
  if (plan.kind === "create") return true;
  if (plan.kind === "update") return plan.writeFields.length > 0 || plan.syncChanged;
  return false;
}
