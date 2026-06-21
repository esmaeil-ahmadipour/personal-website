import type { PostsResponse } from "../types/blog.types";

export class BlogApi {
  private static baseUrl = "/api/blog";

  static async getPosts(params?: {
    page?: number;
    limit?: number;
  }): Promise<PostsResponse> {
    const url = new URL(this.baseUrl, window.location.origin);
    if (params?.page) url.searchParams.set("page", String(params.page));
    if (params?.limit) url.searchParams.set("limit", String(params.limit));

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
