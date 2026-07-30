// features/blog-list/schemas/blog-list.schema.ts

import { z } from "zod";

export const BlogListParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  locale: z.enum(["en", "fa", "ar"]).default("en"),
});

export const PageSizeOptions = [10, 15, 20, 25] as const;
export type PageSize = (typeof PageSizeOptions)[number];

export type BlogListParams = z.infer<typeof BlogListParamsSchema>;
