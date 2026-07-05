// features/blog-list/types/blog-list.types.ts

import type { Post } from "@/features/blog/types/blog.types";

export interface BlogListParams {
  page: number;
  limit: number;
  locale: "en" | "fa";
}

export interface BlogListResponse {
  items: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogListState {
  data: BlogListResponse | null;
  isLoading: boolean;
  error: Error | null;
}
