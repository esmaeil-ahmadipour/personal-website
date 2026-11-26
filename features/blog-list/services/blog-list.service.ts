// features/blog-list/services/blog-list.service.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import { BlogService } from "@/features/blog/services/blog.service";
import { getPostNumbers } from "@/features/blog/services/post-numbers";
import type { Post } from "@/features/blog/types/blog.types";
import type { GetPostsInput } from "@/features/blog/schemas/blog.schema";
import type { BlogListResponse, NumberedPost } from "../types/blog-list.types";

const blogService = new BlogService();

/** Everything the blog page shows: the filtered page, the latest post and the categories. */
export async function getBlogList(params: GetPostsInput): Promise<BlogListResponse> {
  const { locale } = params;
  const [list, latest, numbers, categories] = await Promise.all([
    blogService.getPublishedPosts(params),
    blogService.getPublishedPosts({ locale, page: 1, limit: 1, sort: "newest" }),
    getPostNumbers(),
    prisma.category.findMany({
      where: { posts: { some: { status: "published", publishedAt: { not: null } } } },
      orderBy: [{ order: "asc" }, { slug: "asc" }],
      select: { slug: true, nameEn: true, nameFa: true, nameAr: true },
    }),
  ]);
  const numbered = (post: Post): NumberedPost => ({ ...post, number: numbers.get(post.id) ?? 0 });

  return {
    items: list.items.map(numbered),
    pagination: list.pagination,
    latest: latest.items[0] ? numbered(latest.items[0]) : null,
    categories: categories.map((c) => ({
      slug: c.slug,
      name: (locale === "fa" ? c.nameFa : locale === "ar" ? c.nameAr : c.nameEn) || c.nameEn,
    })),
  };
}
