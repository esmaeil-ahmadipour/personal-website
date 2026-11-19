// prisma/content/build.ts
//
// Turns one raw post directory into a ParsedPost: validated metadata, sanitized
// HTML, the `Post` column values this pipeline owns, and deterministic hashes.

import { createHash } from "node:crypto";
import { parsePostMeta, type PostMeta } from "./parse";
import { normalizeMarkdown, renderMarkdown } from "./render";
import {
  ContentError,
  FORMAT_VERSION,
  LOCALES,
  POST_FILES,
  type FieldValue,
  type Locale,
  type ParsedPost,
  type RawPostSource,
} from "./types";

function canonical(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(Object.keys(record).sort().map((key) => [key, canonical(record[key])]));
  }
  return value;
}

/** JSON with sorted object keys and ISO dates, so equal data always serializes equally. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonical(value));
}

export function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

export function hashValue(value: unknown): string {
  return sha256Hex(canonicalJson(value));
}

const capitalize = (locale: Locale): string => locale.charAt(0).toUpperCase() + locale.slice(1);

export function buildPost(source: RawPostSource): ParsedPost {
  const issues = source.unexpectedFiles.map(
    (name) => `unexpected file "${name}" (allowed: ${POST_FILES.join(", ")})`,
  );

  if (source.postYml === undefined) throw new ContentError([...issues, "post.yml is missing"]);

  let meta: PostMeta;
  try {
    meta = parsePostMeta(source.postYml);
  } catch (error) {
    if (error instanceof ContentError) throw new ContentError([...issues, ...error.issues]);
    throw error;
  }

  if (meta.slug !== source.dirName) {
    issues.push(`slug "${meta.slug}" does not match its directory "${source.dirName}"`);
  }

  const bodies: Partial<Record<Locale, string>> = {};
  const html: Partial<Record<Locale, string>> = {};
  for (const locale of LOCALES) {
    const declared = meta.locales[locale] !== undefined;
    const raw = source.bodies[locale];
    const file = `${locale}.md`;
    if (!declared && raw === undefined) continue;
    if (!declared) {
      issues.push(`${file} exists but post.yml has no locales.${locale} entry`);
      continue;
    }
    if (raw === undefined) {
      issues.push(`post.yml declares locales.${locale} but ${file} is missing`);
      continue;
    }
    const body = normalizeMarkdown(raw);
    if (body === "") {
      issues.push(`${file} is empty`);
      continue;
    }
    try {
      html[locale] = renderMarkdown(body);
      bodies[locale] = body;
    } catch (error) {
      if (error instanceof ContentError) issues.push(...error.issues.map((issue) => `${file}: ${issue}`));
      else throw error;
    }
  }

  if (issues.length > 0) throw new ContentError(issues);

  // Column values. Arabic is optional, and its text columns are NOT NULL with an
  // empty-string default, so an absent Arabic value is "" there and null elsewhere.
  const fields: Record<string, FieldValue> = {
    isFeatured: meta.isFeatured,
    isTrending: meta.isTrending,
    isPinned: meta.isPinned,
    priority: meta.priority,
    language: meta.language,
    coverImageUrl: meta.coverImageUrl ?? null,
    readingTimeMin: meta.readingTimeMin ?? null,
    status: meta.status,
    publishedAt: meta.publishedAt === undefined ? null : new Date(meta.publishedAt),
  };
  for (const locale of LOCALES) {
    const entry = meta.locales[locale];
    const suffix = capitalize(locale);
    const emptyText = locale === "ar" ? "" : null;
    fields[`title${suffix}`] = entry?.title ?? "";
    fields[`excerpt${suffix}`] = entry?.excerpt ?? emptyText;
    fields[`content${suffix}`] = html[locale] ?? "";
    fields[`seoTitle${suffix}`] = entry?.seoTitle ?? emptyText;
    fields[`seoDescription${suffix}`] = entry?.seoDescription ?? emptyText;
    fields[`keywords${suffix}`] = entry?.keywords ?? null;
    fields[`ogImage${suffix}`] = entry?.ogImage ?? null;
  }

  const fieldHashes = Object.fromEntries(
    Object.entries(fields).map(([name, value]) => [name, hashValue(value)]),
  );
  const tagSlugs = [...meta.tags].sort();

  return {
    slug: meta.slug,
    formatVersion: FORMAT_VERSION,
    sourceHash: hashValue({
      formatVersion: FORMAT_VERSION,
      meta: { ...meta, tags: tagSlugs },
      bodies,
    }),
    fields,
    fieldHashes,
    relations: { authorSlug: meta.author, categorySlug: meta.category, tagSlugs },
    locales: LOCALES.filter((locale) => html[locale] !== undefined),
  };
}
