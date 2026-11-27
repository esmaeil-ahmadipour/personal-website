// prisma/content/parse.ts
//
// Parses and validates `post.yml` and `manifest.json`. Unknown keys are errors
// so that typos never silently drop data.

import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { ContentError, LOCALES, POST_STATUSES } from "./types";

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase slug (a-z, 0-9, hyphens)");
const text = z.string().trim().min(1, "must not be empty");

const PUBLISHED_AT = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z)?$/;

const localeMeta = z
  .object({
    title: text,
    excerpt: text.optional(),
    seoTitle: text.optional(),
    seoDescription: text.optional(),
    keywords: text.optional(),
    ogImage: text.optional(),
  })
  .strict();

const postMeta = z
  .object({
    slug,
    author: slug,
    category: slug,
    tags: z.array(slug).max(20),
    language: z.enum(LOCALES).default("en"),
    status: z.enum(POST_STATUSES),
    publishedAt: z
      .string()
      .regex(PUBLISHED_AT, 'must be "YYYY-MM-DD" or an ISO UTC timestamp (quote it)')
      .optional(),
    isFeatured: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    isPinned: z.boolean().default(false),
    priority: z.number().int().default(0),
    readingTimeMin: z.number().int().positive().optional(),
    coverImageUrl: text.optional(),
    locales: z
      .object({ en: localeMeta, fa: localeMeta, ar: localeMeta.optional() })
      .strict(),
  })
  .strict()
  .superRefine((meta, ctx) => {
    if (new Set(meta.tags).size !== meta.tags.length) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["tags"], message: "contains duplicates" });
    }
    if (meta.publishedAt !== undefined && Number.isNaN(Date.parse(meta.publishedAt))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["publishedAt"], message: "is not a valid date" });
    }
    if (meta.status === "published" && meta.publishedAt === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishedAt"],
        message: 'is required when status is "published"',
      });
    }
  });

export type PostMeta = z.infer<typeof postMeta>;

// A bare slug is accepted but "not approved": a release refuses it. The object form carries
// the sourceHash that was reviewed (see `pnpm content:approve`).
const manifestEntry = z.union(
  [
    slug,
    z
      .object({
        slug,
        sourceHash: z.string().regex(/^[0-9a-f]{64}$/, "must be a 64-character lowercase hex sha256"),
      })
      .strict(),
  ],
  { message: 'must be a slug or { "slug": "...", "sourceHash": "..." }' },
);

const manifest = z
  .object({
    posts: z.array(manifestEntry),
    // Optional so a manifest that lists only posts stays valid.
    categories: z.array(manifestEntry).optional(),
    tags: z.array(manifestEntry).optional(),
  })
  .strict();

function describe(source: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const where = issue.path.length > 0 ? issue.path.join(".") : "(root)";
    return `${source}: ${where}: ${issue.message}`;
  });
}

export function parsePostMeta(yamlText: string): PostMeta {
  let data: unknown;
  try {
    data = parseYaml(yamlText.replace(/^\uFEFF/, ""));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new ContentError(`post.yml: not valid YAML: ${reason}`);
  }
  const result = postMeta.safeParse(data);
  if (!result.success) throw new ContentError(describe("post.yml", result.error));
  return result.data;
}

export function parseManifest(jsonText: string): z.infer<typeof manifest> {
  let data: unknown;
  try {
    data = JSON.parse(jsonText.replace(/^\uFEFF/, ""));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new ContentError(`manifest.json: not valid JSON: ${reason}`);
  }
  const result = manifest.safeParse(data);
  if (!result.success) throw new ContentError(describe("manifest.json", result.error));
  return result.data;
}
