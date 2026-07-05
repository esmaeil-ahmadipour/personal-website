// features/blog-list/hooks/useBlogListQuery.ts

"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlogPosts } from "../api/blog-list.api";
import type { BlogListParams } from "../schemas/blog-list.schema";

export const BLOG_LIST_QUERY_KEY = "blog-list";

export function useBlogListQuery(params: BlogListParams) {
  return useQuery({
    queryKey: [BLOG_LIST_QUERY_KEY, params],
    queryFn: () => fetchBlogPosts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useInvalidateBlogList() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [BLOG_LIST_QUERY_KEY] });
  };
}
