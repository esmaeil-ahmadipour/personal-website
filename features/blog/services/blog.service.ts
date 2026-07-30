// features/blog/services/blog.service.ts

import { prisma } from "@/lib/prisma";
import type { Post, PostsResponse, GetPostsParams } from "../types/blog.types";

export class BlogService {
  async getPublishedPosts(params: GetPostsParams): Promise<PostsResponse> {
    const { page = 1, limit = 3, locale = "en" } = params;
    const skip = (page - 1) * limit;
    
    // تشخیص زبان
    const isFa = locale === "fa";
    const isAr = locale === "ar";

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

          // ===== فیلدهای انگلیسی =====
          titleEn: true,
          excerptEn: true,
          contentEn: true,

          // ===== فیلدهای فارسی =====
          titleFa: true,
          excerptFa: true,
          contentFa: true,

          // ===== فیلدهای عربی =====
          titleAr: true,
          excerptAr: true,
          contentAr: true,

          // ===== نویسنده =====
          author: {
            select: {
              id: true,
              slug: true,
              avatarUrl: true,
              
              // انگلیسی
              firstNameEn: true,
              lastNameEn: true,
              bioEn: true,
              
              // فارسی
              firstNameFa: true,
              lastNameFa: true,
              bioFa: true,
              
              // عربی
              firstNameAr: true,
              lastNameAr: true,
              bioAr: true,
            },
          },

          // ===== دسته‌بندی =====
          category: {
            select: {
              id: true,
              slug: true,
              
              // انگلیسی
              nameEn: true,
              descriptionEn: true,
              
              // فارسی
              nameFa: true,
              descriptionFa: true,
              
              // عربی
              nameAr: true,
              descriptionAr: true,
            },
          },

          // ===== برچسب‌ها =====
          tags: {
            select: {
              tag: {
                select: {
                  id: true,
                  slug: true,
                  
                  // انگلیسی
                  nameEn: true,
                  
                  // فارسی
                  nameFa: true,
                  
                  // عربی
                  nameAr: true,
                },
              },
            },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    // تابع کمکی برای انتخاب فیلد بر اساس زبان
    const getLocalizedField = <T>(en: T, fa: T, ar: T): T => {
      if (isAr) return ar || en;
      if (isFa) return fa || en;
      return en;
    };

    // تبدیل به فرمت مناسب بر اساس زبان
    const formattedItems: Post[] = items.map((post) => ({
      id: post.id,
      slug: post.slug,
      
      // عنوان و محتوا بر اساس زبان
      title: getLocalizedField(
        post.titleEn,
        post.titleFa,
        post.titleAr
      ),
      excerpt: getLocalizedField(
        post.excerptEn || "",
        post.excerptFa || "",
        post.excerptAr || ""
      ),
      content: getLocalizedField(
        post.contentEn,
        post.contentFa,
        post.contentAr
      ),
      
      coverImageUrl: post.coverImageUrl,
      readingTimeMin: post.readingTimeMin,
      status: post.status,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      
      // ===== نویسنده =====
      author: {
        id: post.author.id,
        slug: post.author.slug,
        firstName: getLocalizedField(
          post.author.firstNameEn,
          post.author.firstNameFa,
          post.author.firstNameAr
        ),
        lastName: getLocalizedField(
          post.author.lastNameEn,
          post.author.lastNameFa,
          post.author.lastNameAr
        ),
        bio: getLocalizedField(
          post.author.bioEn || "",
          post.author.bioFa || "",
          post.author.bioAr || ""
        ),
        avatarUrl: post.author.avatarUrl,
        email: null,
      },
      
      // ===== دسته‌بندی =====
      category: {
        id: post.category.id,
        slug: post.category.slug,
        name: getLocalizedField(
          post.category.nameEn,
          post.category.nameFa,
          post.category.nameAr
        ),
        description: getLocalizedField(
          post.category.descriptionEn || "",
          post.category.descriptionFa || "",
          post.category.descriptionAr || ""
        ),
      },
      
      // ===== برچسب‌ها =====
      tags: post.tags.map((t) => ({
        id: t.tag.id,
        slug: t.tag.slug,
        name: getLocalizedField(
          t.tag.nameEn,
          t.tag.nameFa,
          t.tag.nameAr
        ),
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

  // ============================================
  // متد برای دریافت یک پست (اختیاری)
  // ============================================
  async getPostBySlug(slug: string, locale: "en" | "fa" | "ar") {
    const isFa = locale === "fa";
    const isAr = locale === "ar";

    const getLocalizedField = <T>(en: T, fa: T, ar: T): T => {
      if (isAr) return ar || en;
      if (isFa) return fa || en;
      return en;
    };

    const post = await prisma.post.findUnique({
      where: { 
        slug,
        status: "published" 
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) return null;

    // تبدیل به فرمت مورد نظر
    return {
      id: post.id,
      slug: post.slug,
      title: getLocalizedField(post.titleEn, post.titleFa, post.titleAr),
      excerpt: getLocalizedField(
        post.excerptEn || "",
        post.excerptFa || "",
        post.excerptAr || ""
      ),
      content: getLocalizedField(post.contentEn, post.contentFa, post.contentAr),
      coverImageUrl: post.coverImageUrl,
      readingTimeMin: post.readingTimeMin,
      status: post.status,
      publishedAt: post.publishedAt,
      views: post.views,
      author: {
        id: post.author.id,
        slug: post.author.slug,
        name: getLocalizedField(
          `${post.author.firstNameEn} ${post.author.lastNameEn}`,
          `${post.author.firstNameFa} ${post.author.lastNameFa}`,
          `${post.author.firstNameAr} ${post.author.lastNameAr}`
        ),
        bio: getLocalizedField(
          post.author.bioEn || "",
          post.author.bioFa || "",
          post.author.bioAr || ""
        ),
        avatarUrl: post.author.avatarUrl,
      },
      category: {
        id: post.category.id,
        slug: post.category.slug,
        name: getLocalizedField(
          post.category.nameEn,
          post.category.nameFa,
          post.category.nameAr
        ),
      },
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        slug: pt.tag.slug,
        name: getLocalizedField(
          pt.tag.nameEn,
          pt.tag.nameFa,
          pt.tag.nameAr
        ),
      })),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
