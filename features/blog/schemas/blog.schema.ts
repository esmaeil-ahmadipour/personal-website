// features/blog/schemas/blog.schema.ts

import { z } from "zod";

export const GetPostsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(3),
  locale: z.enum(["en","ar", "fa"]).default("en"),
});

export type GetPostsInput = z.infer<typeof GetPostsSchema>;