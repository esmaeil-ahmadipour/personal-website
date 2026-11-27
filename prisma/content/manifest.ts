// prisma/content/manifest.ts
//
// Pure helpers for content/manifest.json. An entry is "pinned" when it carries the
// sourceHash that was reviewed and approved; a release imports only pinned entries whose
// files still hash to that value.

import { ContentError, type ParsedPost } from "./types";

export interface ManifestEntry {
  slug: string;
  sourceHash?: string;
}

type RawEntry = string | { slug: string; sourceHash: string };
type HashedPost = Pick<ParsedPost, "slug" | "sourceHash">;

const short = (hash: string): string => hash.slice(0, 12);

/** What a manifest entry stands for. Only posts are approved by their bare slug. */
export type PinKind = "post" | "newsletter" | "project";

const KIND_TEXT: Record<PinKind, { noun: string; dir: string }> = {
  post: { noun: "post", dir: "content/posts" },
  newsletter: { noun: "newsletter issue", dir: "content/newsletter" },
  project: { noun: "project", dir: "content/projects" },
};

/** The argument `pnpm content:approve` takes for an entry. */
export const approveTarget = (kind: PinKind, slug: string): string => (kind === "post" ? slug : `${kind}:${slug}`);

const label = (kind: PinKind, slug: string): string => (kind === "post" ? `"${slug}"` : `${kind} "${slug}"`);

export function toEntries(posts: readonly RawEntry[]): ManifestEntry[] {
  return posts.map((post) =>
    typeof post === "string" ? { slug: post } : { slug: post.slug, sourceHash: post.sourceHash },
  );
}

/** Manifest keys of newsletter issues and projects; they are listed and pinned like posts. */
export const EXTRA_MANIFEST_KEYS = ["newsletter", "projects"] as const;
export type ExtraManifestKey = (typeof EXTRA_MANIFEST_KEYS)[number];
export type ExtraEntries = Record<ExtraManifestKey, ManifestEntry[]>;

export function extraEntriesOf(manifest: Partial<Record<ExtraManifestKey, readonly RawEntry[]>>): ExtraEntries {
  return { newsletter: toEntries(manifest.newsletter ?? []), projects: toEntries(manifest.projects ?? []) };
}

/** Problems that make a release unsafe: unpinned entries and pins the files no longer match. */
export function verifyPins(
  entries: readonly ManifestEntry[],
  posts: readonly HashedPost[],
  kind: PinKind = "post",
): string[] {
  const current = new Map(posts.map((post) => [post.slug, post.sourceHash]));
  const problems: string[] = [];
  for (const entry of entries) {
    const now = current.get(entry.slug);
    if (entry.sourceHash === undefined) {
      problems.push(
        `manifest.json: ${label(kind, entry.slug)} is not approved; ` +
          `review it, then run: pnpm content:approve ${approveTarget(kind, entry.slug)}`,
      );
    } else if (now !== undefined && now !== entry.sourceHash) {
      problems.push(
        `manifest.json: ${label(kind, entry.slug)} changed since it was approved ` +
          `(approved ${short(entry.sourceHash)}, now ${short(now)}); ` +
          `review it, then run: pnpm content:approve ${approveTarget(kind, entry.slug)}`,
      );
    }
  }
  return problems;
}

/** Adds or re-pins `slugs` at the current hash of their files; other entries are untouched. */
export function approveEntries(
  entries: readonly ManifestEntry[],
  posts: readonly HashedPost[],
  slugs: readonly string[],
  kind: PinKind = "post",
): ManifestEntry[] {
  const current = new Map(posts.map((post) => [post.slug, post.sourceHash]));
  const next = new Map(entries.map((entry) => [entry.slug, entry] as const));
  const unknown = [...new Set(slugs)].filter((slug) => !current.has(slug));
  if (unknown.length > 0) {
    const { noun, dir } = KIND_TEXT[kind];
    throw new ContentError(unknown.map((slug) => `No ${noun} "${slug}" in ${dir}.`));
  }
  for (const slug of new Set(slugs)) {
    next.set(slug, { slug, sourceHash: current.get(slug) });
  }
  return [...next.values()];
}

/** Stable output: entries sorted by slug, unpinned ones kept as plain strings, trailing newline. */
export function serializeManifest(entries: readonly ManifestEntry[]): string {
  const posts = [...entries]
    .sort((a, b) => (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0))
    .map((entry) => (entry.sourceHash === undefined ? entry.slug : { slug: entry.slug, sourceHash: entry.sourceHash }));
  return `${JSON.stringify({ posts }, null, 2)}\n`;
}
