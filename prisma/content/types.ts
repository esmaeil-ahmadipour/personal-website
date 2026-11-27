// prisma/content/types.ts
//
// Shared types and constants of the Markdown content pipeline.

/**
 * Bump when the importer produces different output for the same source files
 * (rendering rules, hashing, field mapping). It is part of every source hash.
 */
export const FORMAT_VERSION = 1;

export const LOCALES = ["en", "fa", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const POST_STATUSES = ["draft", "pending", "published"] as const;
export type PostStatusValue = (typeof POST_STATUSES)[number];

/** Kinds of content items the pipeline manages; posts are the default. */
export type ContentKind = "post" | "category" | "tag" | "project" | "newsletter";

/** The only files a post directory may contain (dotfiles are ignored). */
export const POST_FILES: readonly string[] = [
  "post.yml",
  ...LOCALES.map((locale) => `${locale}.md`),
];

/** The only files a newsletter issue directory may contain (dotfiles are ignored). */
export const ISSUE_FILES: readonly string[] = [
  "issue.yml",
  ...LOCALES.map((locale) => `${locale}.md`),
];

export interface ContentManifest {
  /** Slugs that are released to production. Posts not listed stay dev-only. */
  posts: string[];
}

/** Raw, unparsed contents of one `content/posts/<slug>/` directory. */
export interface RawPostSource {
  dirName: string;
  postYml: string | undefined;
  bodies: Partial<Record<Locale, string>>;
  unexpectedFiles: string[];
}

/** Raw, unparsed contents of one `content/newsletter/<number>/` directory. */
export interface RawIssueSource {
  dirName: string;
  issueYml: string | undefined;
  bodies: Partial<Record<Locale, string>>;
  unexpectedFiles: string[];
}

export type FieldValue = string | number | boolean | Date | null;

export interface ParsedPost {
  slug: string;
  formatVersion: number;
  /** Hash of every source input (metadata, Markdown bodies, format version). */
  sourceHash: string;
  /** Values for the `Post` columns this pipeline owns (content fields hold sanitized HTML). */
  fields: Record<string, FieldValue>;
  /** Hash of each value in `fields`, keyed by column name. */
  fieldHashes: Record<string, string>;
  /** Slugs to resolve against Author, Category and Tag rows. */
  relations: { authorSlug: string; categorySlug: string; tagSlugs: string[] };
  /** Locales that have a body. */
  locales: Locale[];
}

/** A newsletter issue; `slug` is the issue number as text, so it can key ContentSync. */
export interface ParsedIssue extends ParsedPost {
  number: number;
}

/** Invalid content. `issues` holds one human-readable line per problem. */
export class ContentError extends Error {
  readonly issues: string[];

  constructor(issues: string | string[]) {
    const list = Array.isArray(issues) ? issues : [issues];
    super(list.join("\n"));
    this.name = "ContentError";
    this.issues = list;
  }
}
