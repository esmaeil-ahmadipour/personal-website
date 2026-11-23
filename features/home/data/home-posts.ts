// features/home/data/home-posts.ts
import "server-only";
import { BlogService } from "@/features/blog/services/blog.service";
import type { Post } from "@/features/blog/types/blog.types";

type Locale = "en" | "fa" | "ar";

const blogService = new BlogService();

/** Latest published posts for the home page. Never throws: returns [] on DB errors. */
export async function getHomePosts(locale: Locale, limit = 4): Promise<Post[]> {
  try {
    const { items } = await blogService.getPublishedPosts({ locale, limit, page: 1 });
    return items;
  } catch (error) {
    console.error("[HOME_POSTS_ERROR]", error);
    return [];
  }
}
