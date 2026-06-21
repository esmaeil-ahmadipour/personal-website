// features/blog/api/blog.api.ts

import type { PostsResponse, GetPostsParams } from "../types/blog.types";

export class BlogApi {
  private static baseUrl = "/api/blog";

  static async getPosts(params?: GetPostsParams): Promise<PostsResponse> {
    const url = new URL(this.baseUrl, window.location.origin);

    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));
    if (params?.locale) url.searchParams.set("locale", params.locale);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Failed to fetch blog posts");
    }

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.message || "Failed to fetch blog posts");
    }

    return json.data;
  }
}
