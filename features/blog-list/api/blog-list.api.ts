// features/blog-list/api/blog-list.api.ts

import type { BlogListParams, BlogListResponse } from "../types/blog-list.types";

export async function fetchBlogPosts(params: BlogListParams): Promise<BlogListResponse> {
  const url = new URL("/api/blog", window.location.origin);
  url.searchParams.set("page", String(params.page));
  url.searchParams.set("limit", String(params.limit));
  url.searchParams.set("locale", params.locale);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch blog posts");
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch blog posts");
  }

  return json.data;
}
