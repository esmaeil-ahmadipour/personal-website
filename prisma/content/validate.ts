// prisma/content/validate.ts
//
// Validates the whole content tree without touching any database. Every post
// directory is checked (drafts included); the manifest only decides which
// posts are released.

import { buildPost } from "./build";
import { DEFAULT_CONTENT_ROOT, loadPostSources, readManifestText } from "./load";
import { parseManifest } from "./parse";
import { ContentError, type ParsedPost, type RawPostSource } from "./types";

export interface ContentValidation {
  ok: boolean;
  errors: string[];
  posts: ParsedPost[];
  manifestSlugs: string[];
}

function issuesOf(error: unknown): string[] {
  if (error instanceof ContentError) return error.issues;
  throw error;
}

export function validateContent(root: string = DEFAULT_CONTENT_ROOT): ContentValidation {
  const errors: string[] = [];

  let manifestSlugs: string[] = [];
  let manifestValid = false;
  try {
    manifestSlugs = parseManifest(readManifestText(root)).posts;
    manifestValid = true;
  } catch (error) {
    errors.push(...issuesOf(error));
  }

  let sources: RawPostSource[] = [];
  try {
    sources = loadPostSources(root);
  } catch (error) {
    errors.push(...issuesOf(error));
  }

  const posts: ParsedPost[] = [];
  for (const source of sources) {
    try {
      posts.push(buildPost(source));
    } catch (error) {
      errors.push(...issuesOf(error).map((issue) => `posts/${source.dirName}: ${issue}`));
    }
  }

  if (manifestValid) {
    const dirNames = new Set(sources.map((source) => source.dirName));
    const seen = new Set<string>();
    for (const slug of manifestSlugs) {
      if (seen.has(slug)) errors.push(`manifest.json: "${slug}" is listed more than once`);
      seen.add(slug);
      if (!dirNames.has(slug)) errors.push(`manifest.json: lists "${slug}" but posts/${slug}/ does not exist`);
    }
  }

  return { ok: errors.length === 0, errors, posts, manifestSlugs };
}
