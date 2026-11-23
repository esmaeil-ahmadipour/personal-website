// prisma/release/plan.ts
//
// Pure description of what a release will do, and a fingerprint of it. `pnpm release:dry`
// prints the fingerprint; a real release passes it back with --expect-plan and refuses to
// start if the plan it computes now is any different.

import { createHash } from "node:crypto";

export interface PlannedMigration {
  name: string;
  sqlHash: string;
}

export interface PlannedPost {
  slug: string;
  sourceHash: string;
  status: string;
}

export interface ReleasePlan {
  migrations: PlannedMigration[];
  /** Pending seed versions, or null when they cannot be read until the migrations are applied. */
  seeds: string[] | null;
  content: PlannedPost[];
  blocked: boolean;
}

export interface ImportOutcome {
  created: readonly string[];
  updated: readonly string[];
  unchanged: readonly string[];
  skipped: readonly string[];
  conflicts: readonly string[];
}

const PLAN_VERSION = 1;
const short = (hash: string): string => hash.slice(0, 12);

export function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** What a post will do in this release, from the import's own dry-run result. */
export function contentStatus(slug: string, outcome: ImportOutcome): string {
  const tags = [
    outcome.created.includes(slug) && "create",
    outcome.updated.includes(slug) && "update",
    outcome.unchanged.includes(slug) && "unchanged",
    outcome.skipped.includes(slug) && "skip",
    outcome.conflicts.includes(slug) && "conflict",
  ].filter((tag): tag is string => typeof tag === "string");
  return tags.length > 0 ? tags.join("+") : "none";
}

function byKey<T>(items: readonly T[], key: (item: T) => string): T[] {
  return [...items].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0));
}

/** sha256 of the plan with a fixed key order, so equal plans always hash equally. */
export function planFingerprint(plan: ReleasePlan): string {
  const normalized = {
    version: PLAN_VERSION,
    migrations: byKey(plan.migrations, (m) => m.name).map((m) => ({ name: m.name, sqlHash: m.sqlHash })),
    seeds: plan.seeds,
    content: byKey(plan.content, (p) => p.slug).map((p) => ({
      slug: p.slug,
      sourceHash: p.sourceHash,
      status: p.status,
    })),
    blocked: plan.blocked,
  };
  return sha256(JSON.stringify(normalized));
}

export function describePlan(plan: ReleasePlan): string[] {
  const lines: string[] = [];
  lines.push(`Plan: ${plan.migrations.length} pending migration(s)`);
  for (const m of plan.migrations) lines.push(`  migration ${m.name} (sql ${short(m.sqlHash)})`);
  lines.push(
    plan.seeds === null
      ? "Plan: seeds cannot be read until the migrations are applied"
      : `Plan: ${plan.seeds.length} pending seed version(s)${plan.seeds.length > 0 ? `: ${plan.seeds.join(", ")}` : ""}`,
  );
  lines.push(`Plan: ${plan.content.length} approved post(s)`);
  for (const p of plan.content) lines.push(`  post ${p.slug}: ${p.status} (hash ${short(p.sourceHash)})`);
  if (plan.blocked) lines.push("Plan: BLOCKED by conflicts that need review");
  return lines;
}
