// features/blog/services/blog.service.ts

import { prisma } from "@/lib/prisma";
import type { Post, PostsResponse, GetPostsParams } from "../types/blog.types";

export class BlogService {
  async getPublishedPosts(params: GetPostsParams): Promise<PostsResponse> {
    const { page = 1, limit = 3, locale = "en" } = params;
    const skip = (page - 1) * limit;
    const isEn = locale === "en";

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
          slug: true,
          coverImageUrl: true,
          readingTimeMin: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,

          // انتخاب فیلدهای مناسب بر اساس زبان
          titleEn: true,
          titleFa: true,
          excerptEn: true,
          excerptFa: true,
          contentEn: true,
          contentFa: true,

          author: {
            select: {
              id: true,
              slug: true,
              avatarUrl: true,
              firstNameEn: true,
              firstNameFa: true,
              lastNameEn: true,
              lastNameFa: true,
              bioEn: true,
              bioFa: true,
            },
          },

          category: {
            select: {
              id: true,
              slug: true,
              nameEn: true,
              nameFa: true,
              descriptionEn: true,
              descriptionFa: true,
            },
          },

          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  slug: true,
                  nameEn: true,
                  nameFa: true,
                },
              },
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // تبدیل به فرمت مناسب بر اساس زبان
    const formattedItems: Post[] = items.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: isEn ? post.titleEn : post.titleFa,
      excerpt: isEn ? post.excerptEn : post.excerptFa,
      content: isEn ? post.contentEn : post.contentFa,
      coverImageUrl: post.coverImageUrl,
      readingTimeMin: post.readingTimeMin,
      status: post.status,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        slug: post.author.slug,
        firstName: isEn ? post.author.firstNameEn : post.author.firstNameFa,
        lastName: isEn ? post.author.lastNameEn : post.author.lastNameFa,
        bio: isEn ? post.author.bioEn : post.author.bioFa,
        avatarUrl: post.author.avatarUrl,
        email: null,
      },
      category: {
        id: post.category.id,
        slug: post.category.slug,
        name: isEn ? post.category.nameEn : post.category.nameFa,
        description: isEn
          ? post.category.descriptionEn
          : post.category.descriptionFa,
      },
      tags: post.tags.map((t) => ({
        id: t.tag.id,
        slug: t.tag.slug,
        name: isEn ? t.tag.nameEn : t.tag.nameFa,
      })),
    }));

    return {
      items: formattedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
