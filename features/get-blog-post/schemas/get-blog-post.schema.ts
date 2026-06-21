import { z } from "zod";

export const GetBlogPostParamsSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export type GetBlogPostParams = z.infer<typeof GetBlogPostParamsSchema>;
