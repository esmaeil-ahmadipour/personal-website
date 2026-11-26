// features/blog-list/types/blog-list.types.ts
import type { Post } from "@/features/blog/types/blog.types";

export type NumberedPost = Post & { number: number };

export interface BlogListResponse {
  items: NumberedPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  /** Newest published post, independent of the filters. */
  latest: NumberedPost | null;
  /** Categories that have at least one published post. */
  categories: { slug: string; name: string }[];
}

export interface BlogListState {
  data: BlogListResponse | null;
  isLoading: boolean;
  error: Error | null;
}
