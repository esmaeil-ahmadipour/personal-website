// features/blog-list/schemas/blog-list.schema.ts

import { z } from "zod";

// Add these exports for the BlogPageSizeSelector component
export const PageSizeOptions = [5, 10, 20, 50] as const;
export type PageSize = (typeof PageSizeOptions)[number];

export const DEFAULT_PAGE_SIZE: PageSize = 10;

/** The blog page state as kept in the URL. An invalid value falls back to its default. */
const BlogUrlStateSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce
    .number()
    .refine((n) => (PageSizeOptions as readonly number[]).includes(n))
    .catch(DEFAULT_PAGE_SIZE),
  q: z.string().trim().max(100).catch(""),
  category: z.string().max(100).catch(""),
  sort: z.enum(["oldest", "newest"]).catch("oldest"),
});

export type BlogUrlState = Omit<z.infer<typeof BlogUrlStateSchema>, "limit"> & {
  limit: PageSize;
};

export function parseBlogUrlState(params: { get(name: string): string | null }): BlogUrlState {
  return BlogUrlStateSchema.parse({
    page: params.get("page") ?? 1,
    limit: params.get("limit") ?? DEFAULT_PAGE_SIZE,
    q: params.get("q") ?? "",
    category: params.get("category") ?? "",
    sort: params.get("sort") ?? "oldest",
  }) as BlogUrlState;
}

export type BlogListParams = BlogUrlState & { locale: SupportedLocale };

// Also export a type for the locale to use elsewhere
export type SupportedLocale = "en" | "fa" | "ar";