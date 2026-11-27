// prisma/content/taxonomy-import.ts
//
// Database side of categories and tags (content/taxonomy.yml).
//   runTaxonomyImport  creates and updates rows; same rules as the post import: only fields
//                      that nobody edited in the database change, conflicts are skipped with
//                      a warning, nothing is ever deleted or recreated.
//   runTaxonomyAdopt   hands rows that already exist (for example from seed v1.0.0) to the
//                      importer by recording their current values as the baseline.
// Each item is written in its own Serializable transaction while the release lock is held.

import type { Prisma, PrismaClient } from "@prisma/client";
import type { Logger } from "../lib/log";
import type { LockProof } from "../seed/runner";
import { hashValue } from "./build";
import { planPost, type SyncState } from "./plan";
import type { ParsedTaxonomyItem } from "./taxonomy";
import type { ParsedPost } from "./types";

type Db = Prisma.TransactionClient;
type Row = Record<string, unknown>;

export interface TaxonomyOptions {
  dryRun: boolean;
  log: Logger;
  /** Required for real runs; every transaction re-asserts it. */
  lock?: LockProof;
}

const keyOf = (item: Pick<ParsedTaxonomyItem, "kind" | "slug">): string => `${item.kind}:${item.slug}`;

interface State {
  rows: Map<string, Row>;
  syncs: Map<string, SyncState>;
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

async function loadState(db: Db, items: readonly ParsedTaxonomyItem[]): Promise<State> {
  const slugsOf = (kind: ParsedTaxonomyItem["kind"]): string[] =>
    items.filter((item) => item.kind === kind).map((item) => item.slug);
  const [categories, tags, syncRows] = await Promise.all([
    db.category.findMany({ where: { slug: { in: slugsOf("category") } } }),
    db.tag.findMany({ where: { slug: { in: slugsOf("tag") } } }),
    db.contentSync.findMany({
      where: { kind: { in: ["category", "tag"] }, slug: { in: items.map((item) => item.slug) } },
    }),
  ]);
  const rows = new Map<string, Row>();
  for (const row of categories) rows.set(`category:${row.slug}`, { ...row });
  for (const row of tags) rows.set(`tag:${row.slug}`, { ...row });
  const syncs = new Map<string, SyncState>();
  for (const row of syncRows) {
    syncs.set(`${row.kind}:${row.slug}`, {
      sourceHash: row.sourceHash,
      formatVersion: row.formatVersion,
      fieldHashes: toHashRecord(row.fieldHashes),
      consumedForceTokens: [...row.consumedForceTokens],
    });
  }
  return { rows, syncs };
}

interface ItemPlan {
  item: ParsedTaxonomyItem;
  action: "create" | "update" | "skip";
  /** Columns written to the row. */
  writeFields: string[];
  /** Fields changed in both the file and the database: skipped. */
  conflicts: string[];
  nextHashes: Record<string, string>;
  syncChanged: boolean;
  warnings: string[];
}

const asPost = (item: ParsedTaxonomyItem): ParsedPost => ({
  slug: item.slug,
  formatVersion: item.formatVersion,
  sourceHash: item.sourceHash,
  fields: item.fields,
  fieldHashes: item.fieldHashes,
  relations: { authorSlug: "", categorySlug: "", tagSlugs: [] },
  locales: [],
});

function hasWork(plan: ItemPlan): boolean {
  return plan.action === "create" || plan.writeFields.length > 0 || plan.syncChanged;
}

/** Field classification is the post planner's (see plan.ts); only the skip cases differ. */
export function planItem(item: ParsedTaxonomyItem, row: Row | null, sync: SyncState | null): ItemPlan {
  const label = keyOf(item);
  const base: ItemPlan = {
    item,
    action: "skip",
    writeFields: [],
    conflicts: [],
    nextHashes: {},
    syncChanged: false,
    warnings: [],
  };
  if (row === null && sync === null) return { ...base, action: "create" };
  if (row === null) {
    return {
      ...base,
      warnings: [`${label}: ContentSync exists but the ${item.kind} is missing from the database; it is NOT recreated`],
    };
  }
  if (sync === null) {
    return {
      ...base,
      warnings: [`${label}: exists in the database but is not managed by content import; run \`pnpm content:adopt\` first; skipped`],
    };
  }
  const plan = planPost(asPost(item), { id: String(row.id), values: row, authorSlug: "", categorySlug: "", tagSlugs: [] }, sync, null);
  if (plan.kind !== "update") throw new Error(`${label}: unexpected ${plan.kind} plan`);
  return {
    ...base,
    action: "update",
    writeFields: plan.writeFields,
    conflicts: plan.conflicts,
    nextHashes: plan.nextHashes,
    syncChanged: plan.syncChanged,
  };
}

async function createRow(tx: Db, item: ParsedTaxonomyItem): Promise<void> {
  const data = { ...item.fields, slug: item.slug };
  if (item.kind === "category") {
    await tx.category.create({ data: data as unknown as Prisma.CategoryUncheckedCreateInput });
  } else {
    await tx.tag.create({ data: data as unknown as Prisma.TagUncheckedCreateInput });
  }
}

async function updateRow(tx: Db, item: ParsedTaxonomyItem, names: readonly string[]): Promise<void> {
  const data = Object.fromEntries(names.map((name) => [name, item.fields[name]]));
  if (item.kind === "category") {
    await tx.category.update({
      where: { slug: item.slug },
      data: data as unknown as Prisma.CategoryUncheckedUpdateInput,
    });
  } else {
    await tx.tag.update({
      where: { slug: item.slug },
      data: data as unknown as Prisma.TagUncheckedUpdateInput,
    });
  }
}

const isSerializationFailure = (error: unknown): boolean =>
  typeof error === "object" && error !== null && (error as { code?: unknown }).code === "P2034";

async function inTransaction(
  prisma: PrismaClient,
  label: string,
  lock: LockProof | undefined,
  work: (tx: Db) => Promise<void>,
): Promise<void> {
  await lock?.assertHeld();
  try {
    await prisma.$transaction(
      async (tx) => {
        await lock?.assertHeld();
        await work(tx);
        await lock?.assertHeld(); // still the sole writer right before commit
      },
      { isolationLevel: "Serializable", timeout: 15_000, maxWait: 10_000 },
    );
  } catch (error) {
    if (isSerializationFailure(error)) {
      throw new Error(`${label}: concurrent modification detected; nothing was written for it, run again`);
    }
    throw error;
  }
}

async function applyOne(
  prisma: PrismaClient,
  item: ParsedTaxonomyItem,
  lock: LockProof | undefined,
): Promise<void> {
  const key = keyOf(item);
  await inTransaction(prisma, key, lock, async (tx) => {
    const state = await loadState(tx, [item]);
    const plan = planItem(item, state.rows.get(key) ?? null, state.syncs.get(key) ?? null);
    if (plan.action === "create") {
      await createRow(tx, item);
      await tx.contentSync.create({
        data: {
          kind: item.kind,
          slug: item.slug,
          sourceHash: item.sourceHash,
          formatVersion: item.formatVersion,
          fieldHashes: item.fieldHashes,
        },
      });
    } else if (plan.action === "update") {
      if (plan.writeFields.length > 0) await updateRow(tx, item, plan.writeFields);
      if (plan.syncChanged) {
        await tx.contentSync.update({
          where: { kind_slug: { kind: item.kind, slug: item.slug } },
          data: {
            sourceHash: item.sourceHash,
            formatVersion: item.formatVersion,
            fieldHashes: plan.nextHashes,
          },
        });
      }
    } else {
      throw new Error(`${key}: its state changed during the import; nothing was written for it, run again`);
    }
  });
}

export interface TaxonomySummary {
  dryRun: boolean;
  created: string[];
  updated: string[];
  unchanged: string[];
  skipped: string[];
  conflicts: string[];
  /** Items whose transaction committed. */
  applied: string[];
}

function report(plans: readonly ItemPlan[], log: Logger): void {
  for (const plan of plans) {
    const label = keyOf(plan.item);
    for (const warning of plan.warnings) log.warn(warning);
    if (plan.action === "create") {
      log.info(`${label}: create`);
    } else if (plan.action === "update") {
      if (plan.writeFields.length > 0) log.info(`${label}: update ${plan.writeFields.join(", ")}`);
      else if (plan.syncChanged) log.info(`${label}: record sync state only`);
      if (plan.conflicts.length > 0) {
        log.warn(`${label}: conflict (database and file both changed), skipped: ${plan.conflicts.join(", ")}`);
      }
      if (!hasWork(plan) && plan.conflicts.length === 0) log.info(`${label}: unchanged`);
    }
  }
}

/** Creates and updates categories and tags. Run it before the posts that refer to them. */
export async function runTaxonomyImport(
  prisma: PrismaClient,
  items: readonly ParsedTaxonomyItem[],
  options: TaxonomyOptions,
): Promise<TaxonomySummary> {
  const { dryRun, log, lock } = options;
  const summary: TaxonomySummary = {
    dryRun,
    created: [],
    updated: [],
    unchanged: [],
    skipped: [],
    conflicts: [],
    applied: [],
  };
  if (items.length === 0) return summary;

  const state = await loadState(prisma, items);
  const plans = items.map((item) =>
    planItem(item, state.rows.get(keyOf(item)) ?? null, state.syncs.get(keyOf(item)) ?? null),
  );
  report(plans, log);
  for (const plan of plans) {
    const label = keyOf(plan.item);
    if (plan.action === "create") summary.created.push(label);
    else if (plan.action === "skip") summary.skipped.push(label);
    else if (hasWork(plan)) summary.updated.push(label);
    else summary.unchanged.push(label);
    if (plan.conflicts.length > 0) summary.conflicts.push(label);
  }
  if (dryRun) {
    log.info("Dry run: nothing was written for categories and tags.");
    return summary;
  }

  try {
    for (const plan of plans) {
      if (plan.action === "skip" || !hasWork(plan)) continue;
      await applyOne(prisma, plan.item, lock);
      summary.applied.push(keyOf(plan.item));
    }
  } catch (error) {
    log.error(`Taxonomy import stopped; committed before the failure: ${summary.applied.join(", ") || "none"}.`);
    throw error;
  }
  log.info(
    `Taxonomy done. created=${summary.created.length} updated=${summary.updated.length} ` +
      `unchanged=${summary.unchanged.length} skipped=${summary.skipped.length} conflicts=${summary.conflicts.length}`,
  );
  return summary;
}

export interface AdoptSummary {
  adopted: string[];
  alreadyManaged: string[];
  missing: string[];
}

/** Records the current database values of existing rows as the importer's baseline. */
export async function runTaxonomyAdopt(
  prisma: PrismaClient,
  items: readonly ParsedTaxonomyItem[],
  options: TaxonomyOptions,
): Promise<AdoptSummary> {
  const { dryRun, log, lock } = options;
  const summary: AdoptSummary = { adopted: [], alreadyManaged: [], missing: [] };
  const state = await loadState(prisma, items);
  for (const item of items) {
    const key = keyOf(item);
    if (!state.rows.has(key)) {
      summary.missing.push(key);
      log.info(`${key}: not in the database; the import will create it`);
    } else if (state.syncs.has(key)) {
      summary.alreadyManaged.push(key);
      log.info(`${key}: already managed by content import`);
    } else {
      summary.adopted.push(key);
      log.info(`${key}: ${dryRun ? "would adopt" : "adopt"}`);
    }
  }
  if (dryRun || summary.adopted.length === 0) {
    log.info(dryRun ? "Dry run: nothing was written." : "Nothing to adopt.");
    return summary;
  }

  for (const item of items.filter((candidate) => summary.adopted.includes(keyOf(candidate)))) {
    const key = keyOf(item);
    await inTransaction(prisma, key, lock, async (tx) => {
      const current = await loadState(tx, [item]);
      const row = current.rows.get(key);
      if (row === undefined || current.syncs.has(key)) {
        throw new Error(`${key}: its state changed during adopt; nothing was written for it, run again`);
      }
      const values = Object.fromEntries(
        Object.keys(item.fields).map((name) => [name, row[name] ?? null]),
      );
      await tx.contentSync.create({
        data: {
          kind: item.kind,
          slug: item.slug,
          sourceHash: hashValue({ adoptedFrom: values }),
          formatVersion: item.formatVersion,
          fieldHashes: Object.fromEntries(
            Object.entries(values).map(([name, value]) => [name, hashValue(value)]),
          ),
        },
      });
    });
  }
  log.info(`Adopted ${summary.adopted.length} item(s). Import now treats file changes as updates.`);
  return summary;
}
