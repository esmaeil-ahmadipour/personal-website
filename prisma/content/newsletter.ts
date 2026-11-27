// prisma/content/newsletter.ts
//
// Newsletter issues as files: content/newsletter/<number>/issue.yml plus en.md, fa.md and an
// optional ar.md. This module builds and checks them offline and never touches a database.
// An issue's `slug` is its number as text: it is the manifest entry in the `newsletter` list
// and the ContentSync key of the importer.

import { capitalize, hashValue, renderBodies } from "./build";
import { DEFAULT_CONTENT_ROOT, loadIssueSources, readManifestText } from "./load";
import { toEntries, type ManifestEntry } from "./manifest";
import { parseIssueMeta, parseManifest, type IssueMeta } from "./parse";
import {
  ContentError,
  FORMAT_VERSION,
  ISSUE_FILES,
  LOCALES,
  type FieldValue,
  type ParsedIssue,
  type RawIssueSource,
} from "./types";

export function buildIssue(source: RawIssueSource): ParsedIssue {
  const issues = source.unexpectedFiles.map(
    (name) => `unexpected file "${name}" (allowed: ${ISSUE_FILES.join(", ")})`,
  );

  if (source.issueYml === undefined) throw new ContentError([...issues, "issue.yml is missing"]);

  let meta: IssueMeta;
  try {
    meta = parseIssueMeta(source.issueYml);
  } catch (error) {
    if (error instanceof ContentError) throw new ContentError([...issues, ...error.issues]);
    throw error;
  }

  if (String(meta.number) !== source.dirName) {
    issues.push(`number ${meta.number} does not match its directory "${source.dirName}"`);
  }

  const { bodies, html } = renderBodies(meta.locales, source.bodies, "issue.yml", issues);
  if (issues.length > 0) throw new ContentError(issues);

  // Column values. Arabic is optional and its text columns are NOT NULL with an empty-string
  // default, so an absent Arabic value is "" there and null elsewhere.
  const fields: Record<string, FieldValue> = {
    linkedinUrl: meta.linkedinUrl,
    coverImageUrl: meta.coverImageUrl ?? null,
    readingTimeMin: meta.readingTimeMin ?? null,
    status: meta.status,
    publishedAt: meta.publishedAt === undefined ? null : new Date(meta.publishedAt),
  };
  for (const locale of LOCALES) {
    const entry = meta.locales[locale];
    const suffix = capitalize(locale);
    fields[`title${suffix}`] = entry?.title ?? "";
    fields[`excerpt${suffix}`] = entry?.excerpt ?? (locale === "ar" ? "" : null);
    fields[`content${suffix}`] = html[locale] ?? "";
  }

  const fieldHashes = Object.fromEntries(
    Object.entries(fields).map(([name, value]) => [name, hashValue(value)]),
  );
  const tagSlugs = [...meta.tags].sort();

  return {
    number: meta.number,
    slug: String(meta.number),
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

export interface NewsletterValidation {
  ok: boolean;
  errors: string[];
  issues: ParsedIssue[];
  /** Entries of the `newsletter` list in content/manifest.json. */
  entries: ManifestEntry[];
}

/** Offline check of content/newsletter/ and the manifest entries that refer to it. */
export function validateNewsletter(root: string = DEFAULT_CONTENT_ROOT): NewsletterValidation {
  const errors: string[] = [];

  let entries: ManifestEntry[] = [];
  let manifestValid = false;
  try {
    entries = toEntries(parseManifest(readManifestText(root)).newsletter ?? []);
    manifestValid = true;
  } catch (error) {
    // validateContent reports an unreadable manifest; nothing is listed from here.
    if (!(error instanceof ContentError)) throw error;
  }

  const sources = loadIssueSources(root);
  const issues: ParsedIssue[] = [];
  for (const source of sources) {
    try {
      issues.push(buildIssue(source));
    } catch (error) {
      if (!(error instanceof ContentError)) throw error;
      errors.push(...error.issues.map((issue) => `newsletter/${source.dirName}: ${issue}`));
    }
  }
  issues.sort((a, b) => a.number - b.number);

  if (manifestValid) {
    const dirNames = new Set(sources.map((source) => source.dirName));
    const seen = new Set<string>();
    for (const entry of entries) {
      if (seen.has(entry.slug)) errors.push(`manifest.json: newsletter lists "${entry.slug}" more than once`);
      seen.add(entry.slug);
      if (!dirNames.has(entry.slug)) {
        errors.push(`manifest.json: newsletter lists "${entry.slug}" but newsletter/${entry.slug}/ does not exist`);
      }
    }
  }

  return { ok: errors.length === 0, errors, issues, entries };
}
