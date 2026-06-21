
import prisma from "@/lib/prisma";
import type { Post, PostsResponse, GetPostsParams } from "./../types/blog.types";

export class BlogService {
  async getPublishedPosts(params: GetPostsParams): Promise<PostsResponse> {
    const { page = 1, limit = 3 } = params;
    const skip = (page - 1) * limit;

    const where = {
      status: "published" as const,
      publishedAt: {
        not: null,
      },
    };

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: "desc",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          coverImageUrl: true,
          readingTimeMin: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              slug: true,
              avatarUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return {
      items: items.map((post) => ({
        ...post,
        tags: post.tags.map((t) => t.tag),
      })) as Post[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
