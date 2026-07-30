// features/blog-list/schemas/blog-list.schema.ts

import { z } from "zod";

// Add these exports for the BlogPageSizeSelector component
export const PageSizeOptions = [5, 10, 20, 50] as const;
export type PageSize = (typeof PageSizeOptions)[number];

// Define the schema
export const BlogListParamsSchema = z.object({
  locale: z.enum(["en", "fa", "ar"]),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  category: z.string().optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
});

// Export the type directly from the schema
export type BlogListParams = z.infer<typeof BlogListParamsSchema>;

// Also export a type for the locale to use elsewhere
export type SupportedLocale = "en" | "fa" | "ar";