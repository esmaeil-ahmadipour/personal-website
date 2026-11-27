// prisma/content/taxonomy.ts
//
// Categories and tags live in one file, content/taxonomy.yml. This module parses and hashes
// them and handles their entries in content/manifest.json. It never touches a database
// (see taxonomy-import.ts). Every item is hashed on its own, so editing one tag does not
// invalidate the approval of any other item.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { hashValue } from "./build";
import { DEFAULT_CONTENT_ROOT, readManifestText } from "./load";
import { EXTRA_MANIFEST_KEYS, toEntries, type ExtraEntries, type ManifestEntry } from "./manifest";
import { parseManifest } from "./parse";
import { ContentError, FORMAT_VERSION, type FieldValue } from "./types";

export const TAXONOMY_FILE = "taxonomy.yml";
export const TAXONOMY_KINDS = ["category", "tag"] as const;
export type TaxonomyKind = (typeof TAXONOMY_KINDS)[number];
export type TaxonomyEntries = Record<TaxonomyKind, ManifestEntry[]>;

/** Key of each kind in content/manifest.json. */
const MANIFEST_KEY: Record<TaxonomyKind, "categories" | "tags"> = {
  category: "categories",
  tag: "tags",
};

export interface ParsedTaxonomyItem {
  kind: TaxonomyKind;
  slug: string;
  formatVersion: number;
  /** Hash of this item alone (its metadata and the format version). */
  sourceHash: string;
  /** Values for the database columns this pipeline owns. */
  fields: Record<string, FieldValue>;
  /** Hash of each value in `fields`, keyed by column name. */
  fieldHashes: Record<string, string>;
}

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase slug (a-z, 0-9, hyphens)");
const text = z.string().trim().min(1, "must not be empty");

const categoryLocale = z.object({ name: text, description: text.optional() }).strict();
const tagLocale = z.object({ name: text }).strict();

const categorySchema = z
  .object({
    slug,
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
    locales: z
      .object({ en: categoryLocale, fa: categoryLocale, ar: categoryLocale.optional() })
      .strict(),
  })
  .strict();

const tagSchema = z
  .object({
    slug,
    color: z
      .string()
      .trim()
      .regex(/^#[0-9a-fA-F]{6}$/, "must be a hex color like #3b82f6")
      .default("#3b82f6"),
    icon: text.optional(),
    locales: z.object({ en: tagLocale, fa: tagLocale, ar: tagLocale.optional() }).strict(),
  })
  .strict();

const taxonomySchema = z
  .object({
    categories: z.array(categorySchema).default([]),
    tags: z.array(tagSchema).default([]),
  })
  .strict()
  .superRefine((data, ctx) => {
    const lists = [
      ["categories", data.categories.map((item) => item.slug)],
      ["tags", data.tags.map((item) => item.slug)],
    ] as const;
    for (const [key, slugs] of lists) {
      const seen = new Set<string>();
      slugs.forEach((value, index) => {
        if (seen.has(value)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [key, index, "slug"],
            message: "is listed more than once",
          });
        }
        seen.add(value);
      });
    }
  });

export function readTaxonomyText(root: string = DEFAULT_CONTENT_ROOT): string | undefined {
  const file = path.join(root, TAXONOMY_FILE);
  return existsSync(file) ? readFileSync(file, "utf8") : undefined;
}

function finish(
  kind: TaxonomyKind,
  slugValue: string,
  meta: unknown,
  fields: Record<string, FieldValue>,
): ParsedTaxonomyItem {
  return {
    kind,
    slug: slugValue,
    formatVersion: FORMAT_VERSION,
    sourceHash: hashValue({ formatVersion: FORMAT_VERSION, kind, meta }),
    fields,
    fieldHashes: Object.fromEntries(
      Object.entries(fields).map(([name, value]) => [name, hashValue(value)]),
    ),
  };
}

/** Parses taxonomy.yml. A missing file means no items. Throws ContentError when invalid. */
export function buildTaxonomy(yamlText: string | undefined): ParsedTaxonomyItem[] {
  if (yamlText === undefined) return [];
  let data: unknown;
  try {
    data = parseYaml(yamlText.replace(/^\uFEFF/, ""));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new ContentError(`${TAXONOMY_FILE}: not valid YAML: ${reason}`);
  }
  const result = taxonomySchema.safeParse(data ?? {});
  if (!result.success) {
    throw new ContentError(
      result.error.issues.map(
        (issue) => `${TAXONOMY_FILE}: ${issue.path.join(".") || "(root)"}: ${issue.message}`,
      ),
    );
  }

  const items: ParsedTaxonomyItem[] = [];
  for (const category of result.data.categories) {
    const { en, fa, ar } = category.locales;
    items.push(
      finish("category", category.slug, category, {
        order: category.order,
        isActive: category.isActive,
        nameEn: en.name,
        descriptionEn: en.description ?? null,
        nameFa: fa.name,
        descriptionFa: fa.description ?? null,
        nameAr: ar?.name ?? "",
        descriptionAr: ar?.description ?? "",
      }),
    );
  }
  for (const tag of result.data.tags) {
    const { en, fa, ar } = tag.locales;
    items.push(
      finish("tag", tag.slug, tag, {
        color: tag.color,
        icon: tag.icon ?? null,
        nameEn: en.name,
        nameFa: fa.name,
        nameAr: ar?.name ?? "",
      }),
    );
  }
  return items;
}

const short = (hash: string): string => hash.slice(0, 12);

/** "approved", "not in manifest" or "in manifest, NOT approved". */
export function pinStatus(
  entries: readonly ManifestEntry[],
  item: Pick<ParsedTaxonomyItem, "slug" | "sourceHash">,
): string {
  const entry = entries.find((candidate) => candidate.slug === item.slug);
  if (entry === undefined) return "not in manifest";
  return entry.sourceHash === item.sourceHash ? "approved" : "in manifest, NOT approved";
}

export interface TaxonomyValidation {
  ok: boolean;
  errors: string[];
  /** Listed items that are not approved, or changed since they were approved. */
  pinProblems: string[];
  items: ParsedTaxonomyItem[];
  entries: TaxonomyEntries;
}

/** Offline check of taxonomy.yml and the manifest entries that refer to it. */
export function validateTaxonomy(root: string = DEFAULT_CONTENT_ROOT): TaxonomyValidation {
  const errors: string[] = [];
  const pinProblems: string[] = [];
  const entries: TaxonomyEntries = { category: [], tag: [] };

  try {
    const manifest = parseManifest(readManifestText(root));
    entries.category = toEntries(manifest.categories ?? []);
    entries.tag = toEntries(manifest.tags ?? []);
  } catch (error) {
    // validateContent reports an unreadable manifest; nothing is listed from here.
    if (!(error instanceof ContentError)) throw error;
  }

  let items: ParsedTaxonomyItem[] = [];
  let parsed = true;
  try {
    items = buildTaxonomy(readTaxonomyText(root));
  } catch (error) {
    if (!(error instanceof ContentError)) throw error;
    parsed = false;
    errors.push(...error.issues);
  }

  if (parsed) {
    for (const kind of TAXONOMY_KINDS) {
      const key = MANIFEST_KEY[kind];
      const seen = new Set<string>();
      for (const entry of entries[kind]) {
        const label = `${kind} "${entry.slug}"`;
        if (seen.has(entry.slug)) errors.push(`manifest.json: ${key} lists "${entry.slug}" more than once`);
        seen.add(entry.slug);
        const item = items.find((candidate) => candidate.kind === kind && candidate.slug === entry.slug);
        if (item === undefined) {
          errors.push(`manifest.json: ${key} lists "${entry.slug}" but ${TAXONOMY_FILE} has no such ${kind}`);
        } else if (entry.sourceHash === undefined) {
          pinProblems.push(`manifest.json: ${label} is not approved; review it, then run: pnpm content:approve ${kind}:${entry.slug}`);
        } else if (entry.sourceHash !== item.sourceHash) {
          pinProblems.push(
            `manifest.json: ${label} changed since it was approved ` +
              `(approved ${short(entry.sourceHash)}, now ${short(item.sourceHash)}); ` +
              `review it, then run: pnpm content:approve ${kind}:${entry.slug}`,
          );
        }
      }
    }
  }
  return { ok: errors.length === 0, errors, pinProblems, items, entries };
}

/** Items listed in the manifest (the ones a release imports). */
export function selectListedItems(
  items: readonly ParsedTaxonomyItem[],
  entries: TaxonomyEntries,
): ParsedTaxonomyItem[] {
  return items.filter((item) => entries[item.kind].some((entry) => entry.slug === item.slug));
}

export interface TaxonomyTarget {
  kind: TaxonomyKind;
  slug: string;
}

const isKind = (value: string): value is TaxonomyKind =>
  (TAXONOMY_KINDS as readonly string[]).includes(value);

/** Parses the "category:<slug>" and "tag:<slug>" arguments of `content:approve`. */
export function parseTaxonomyTargets(args: readonly string[]): TaxonomyTarget[] {
  return args.map((arg) => {
    const separator = arg.indexOf(":");
    const kind = arg.slice(0, separator);
    const value = arg.slice(separator + 1);
    if (separator === -1 || !isKind(kind) || value === "") {
      throw new ContentError(`Invalid target "${arg}": expected category:<slug> or tag:<slug>.`);
    }
    return { kind, slug: value };
  });
}

export interface TaxonomyApproval {
  entries: TaxonomyEntries;
  /** Log lines, one per approved or unchanged target. */
  lines: string[];
  changed: boolean;
}

/**
 * Adds or re-pins items at the hash of their current content. Targets are the explicit ones,
 * every item (`all`) and every item already in the manifest (`refresh`). Other entries stay.
 */
export function approveTaxonomy(
  entries: TaxonomyEntries,
  items: readonly ParsedTaxonomyItem[],
  options: { refresh: boolean; all: boolean; targets: readonly TaxonomyTarget[] },
): TaxonomyApproval {
  const wanted = new Map<string, TaxonomyTarget>();
  const want = (target: TaxonomyTarget): void => {
    wanted.set(`${target.kind}:${target.slug}`, { kind: target.kind, slug: target.slug });
  };
  if (options.all) items.forEach(want);
  if (options.refresh) {
    for (const kind of TAXONOMY_KINDS) entries[kind].forEach((entry) => want({ kind, slug: entry.slug }));
  }
  options.targets.forEach(want);

  const byKey = new Map<string, ParsedTaxonomyItem>(items.map((item) => [`${item.kind}:${item.slug}`, item] as const));
  const unknown = [...wanted.keys()].filter((key) => !byKey.has(key));
  if (unknown.length > 0) {
    throw new ContentError(unknown.map((key) => `${key} is not in ${TAXONOMY_FILE}.`));
  }

  const next: TaxonomyEntries = { category: [...entries.category], tag: [...entries.tag] };
  const lines: string[] = [];
  let changed = false;
  for (const [key, target] of wanted) {
    const item = byKey.get(key) as ParsedTaxonomyItem;
    const list = next[target.kind];
    const index = list.findIndex((entry) => entry.slug === target.slug);
    const was = index === -1 ? null : list[index].sourceHash;
    if (was === item.sourceHash) {
      lines.push(`${key}: unchanged (${short(item.sourceHash)})`);
      continue;
    }
    changed = true;
    const entry: ManifestEntry = { slug: item.slug, sourceHash: item.sourceHash };
    if (index === -1) list.push(entry);
    else list[index] = entry;
    const from = was === null ? "new" : was === undefined ? "was not approved" : `was ${short(was)}`;
    lines.push(`${key}: approved ${short(item.sourceHash)} (${from})`);
  }
  return { entries: next, lines, changed };
}

/** Stable manifest text: sorted entries; the taxonomy keys appear only when they have entries. */
export function serializeFullManifest(
  posts: readonly ManifestEntry[],
  taxonomy: TaxonomyEntries,
  extra?: ExtraEntries,
): string {
  const raw = (entries: readonly ManifestEntry[]) =>
    [...entries]
      .sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0))
      .map((entry) =>
        entry.sourceHash === undefined ? entry.slug : { slug: entry.slug, sourceHash: entry.sourceHash },
      );
  const manifest: Record<string, unknown> = { posts: raw(posts) };
  if (taxonomy.category.length > 0) manifest.categories = raw(taxonomy.category);
  if (taxonomy.tag.length > 0) manifest.tags = raw(taxonomy.tag);
  for (const key of EXTRA_MANIFEST_KEYS) {
    if (extra !== undefined && extra[key].length > 0) manifest[key] = raw(extra[key]);
  }
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
