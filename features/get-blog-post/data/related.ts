// features/get-blog-post/data/related.ts
import "server-only";
import { prisma } from "@/lib/prisma";
import { getPostNumbers } from "@/features/blog/services/post-numbers";

type Locale = "en" | "fa" | "ar";

export interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  number: number;
  readingTimeMin: number | null;
  category: { name: string };
}

const pick = <T,>(locale: Locale, en: T, fa: T, ar: T): T =>
  locale === "ar" ? ar || en : locale === "fa" ? fa || en : en;

const select = {
  id: true,
  slug: true,
  readingTimeMin: true,
  titleEn: true,
  titleFa: true,
  titleAr: true,
  category: { select: { nameEn: true, nameFa: true, nameAr: true } },
} as const;

/** Same-category posts first, topped up with the newest others. Never throws. */
export async function getRelatedPosts(
  postId: string,
  categoryId: string,
  locale: Locale,
  limit = 2,
): Promise<RelatedPost[]> {
  try {
    const base = { status: "published" as const, publishedAt: { not: null } };
    const same = await prisma.post.findMany({
      where: { ...base, categoryId, id: { not: postId } },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select,
    });
    const more =
      same.length < limit
        ? await prisma.post.findMany({
            where: { ...base, id: { notIn: [postId, ...same.map((p) => p.id)] } },
            orderBy: { publishedAt: "desc" },
            take: limit - same.length,
            select,
          })
        : [];

    const numbers = await getPostNumbers();

    return [...same, ...more].map((p) => ({
      id: p.id,
      slug: p.slug,
      title: pick(locale, p.titleEn, p.titleFa, p.titleAr),
      number: numbers.get(p.id) ?? 0,
      readingTimeMin: p.readingTimeMin,
      category: { name: pick(locale, p.category.nameEn, p.category.nameFa, p.category.nameAr) },
    }));
  } catch (error) {
    console.error("[RELATED_POSTS_ERROR]", error);
    return [];
  }
}
