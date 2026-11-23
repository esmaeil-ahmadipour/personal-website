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

export function toEntries(posts: readonly RawEntry[]): ManifestEntry[] {
  return posts.map((post) =>
    typeof post === "string" ? { slug: post } : { slug: post.slug, sourceHash: post.sourceHash },
  );
}

/** Problems that make a release unsafe: unpinned entries and pins the files no longer match. */
export function verifyPins(entries: readonly ManifestEntry[], posts: readonly HashedPost[]): string[] {
  const current = new Map(posts.map((post) => [post.slug, post.sourceHash]));
  const problems: string[] = [];
  for (const entry of entries) {
    const now = current.get(entry.slug);
    if (entry.sourceHash === undefined) {
      problems.push(
        `manifest.json: "${entry.slug}" is not approved; review it, then run: pnpm content:approve ${entry.slug}`,
      );
    } else if (now !== undefined && now !== entry.sourceHash) {
      problems.push(
        `manifest.json: "${entry.slug}" changed since it was approved ` +
          `(approved ${short(entry.sourceHash)}, now ${short(now)}); ` +
          `review it, then run: pnpm content:approve ${entry.slug}`,
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
): ManifestEntry[] {
  const current = new Map(posts.map((post) => [post.slug, post.sourceHash]));
  const next = new Map(entries.map((entry) => [entry.slug, entry] as const));
  const unknown = [...new Set(slugs)].filter((slug) => !current.has(slug));
  if (unknown.length > 0) {
    throw new ContentError(unknown.map((slug) => `No post "${slug}" in content/posts.`));
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
