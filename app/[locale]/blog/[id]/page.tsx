// app/[locale]/blog/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostPage } from "@/features/get-blog-post/components/BlogPostPage";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { getRelatedPosts } from "@/features/get-blog-post/data/related";
import type { BlogPost } from "@/features/get-blog-post/types/get-blog-post.types";

interface PageProps {
  params: Promise<{ id: string; locale: "en" | "fa" | "ar" }>;
  searchParams?: Promise<{ lang?: "en" | "fa" | "ar" }>;
}

// ============================================
// ۱. تابع کمکی برای انتخاب فیلد بر اساس زبان
// ============================================
function getLocalizedField<T>(en: T, fa: T, ar: T, locale: "en" | "fa" | "ar"): T {
  if (locale === "ar") return ar || en;
  if (locale === "fa") return fa || en;
  return en;
}

// ============================================
// ۲. تابع تبدیل داده‌ها با پشتیبانی از ۳ زبان
// ============================================
// app/[locale]/blog/[id]/page.tsx

// ============================================
function formatPostForLocale(rawPost: any, locale: "en" | "fa" | "ar"): BlogPost {
  return {
    id: rawPost.id,
    slug: rawPost.slug,
    authorId: rawPost.authorId,
    categoryId: rawPost.categoryId,
    // Keep all original localized fields
    titleEn: rawPost.titleEn,
    excerptEn: rawPost.excerptEn,
    contentEn: rawPost.contentEn,
    seoTitleEn: rawPost.seoTitleEn,
    seoDescriptionEn: rawPost.seoDescriptionEn,
    titleFa: rawPost.titleFa,
    excerptFa: rawPost.excerptFa,
    contentFa: rawPost.contentFa,
    seoTitleFa: rawPost.seoTitleFa,
    seoDescriptionFa: rawPost.seoDescriptionFa,
    titleAr: rawPost.titleAr,
    excerptAr: rawPost.excerptAr,
    contentAr: rawPost.contentAr,
    seoTitleAr: rawPost.seoTitleAr,
    seoDescriptionAr: rawPost.seoDescriptionAr,
    // Metadata
    publishedAt: rawPost.publishedAt,
    updatedAt: rawPost.updatedAt,
    author: rawPost.author,
    tags: rawPost.tags || [],
    status: rawPost.status || 'published',
    // All required fields from BlogPost type
    isFeatured: rawPost.isFeatured ?? false,
    language: rawPost.language || null,
    isTrending: rawPost.isTrending ?? false,
    isPinned: rawPost.isPinned ?? false,
    keywordsAr: rawPost.keywordsAr || null,
    keywordsEn: rawPost.keywordsEn || null,
    keywordsFa: rawPost.keywordsFa || null,
    ogImageAr: rawPost.ogImageAr || null,
    ogImageEn: rawPost.ogImageEn || null,
    ogImageFa: rawPost.ogImageFa || null,
    priority: rawPost.priority ?? 0,
    likes: rawPost.likes ?? 0,
    coverImageUrl: rawPost.coverImageUrl || null,
    readingTimeMin: rawPost.readingTimeMin || null,
    views: rawPost.views ?? 0,
    category: rawPost.category,
    comments: rawPost.comments || [],
    createdAt: rawPost.createdAt,
  };
}
// ============================================
// ۳. متادیتا (SEO) با پشتیبانی از ۳ زبان
// ============================================
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  const isFa = locale === "fa";
  const isAr = locale === "ar";

  // Accept both the post id (old links) and the slug (new links).
  const post = await prisma.post.findFirst({
    where: { OR: [{ id }, { slug: id }], status: "published" },
  });

  if (!post) {
    const titles = {
      en: "Post Not Found",
      fa: "پست یافت نشد",
      ar: "لم يتم العثور على المنشور"
    };
    const descriptions = {
      en: "The requested post does not exist.",
      fa: "پست مورد نظر وجود ندارد",
      ar: "المنشور المطلوب غير موجود."
    };
    return {
      title: isAr ? titles.ar : isFa ? titles.fa : titles.en,
      description: isAr ? descriptions.ar : isFa ? descriptions.fa : descriptions.en,
    };
  }

  // انتخاب عنوان و توضیحات بر اساس زبان
  const title = isAr
    ? post.seoTitleAr || post.titleAr || post.titleEn
    : isFa
      ? post.seoTitleFa || post.titleFa
      : post.seoTitleEn || post.titleEn;

  const description = isAr
    ? post.seoDescriptionAr || post.excerptAr || post.excerptEn
    : isFa
      ? post.seoDescriptionFa || post.excerptFa
      : post.seoDescriptionEn || post.excerptEn;

  // انتخاب تصویر OG بر اساس زبان
  const ogImage = isAr
    ? post.ogImageAr || post.coverImageUrl || "/images/default-blog-cover.webp"
    : isFa
      ? post.ogImageFa || post.coverImageUrl || "/images/default-blog-cover.webp"
      : post.ogImageEn || post.coverImageUrl || "/images/default-blog-cover.webp";

  const url = `https://tarvix.org/${locale}/blog/${post.slug}`;

  return {
    title,
    description: description || undefined,
    openGraph: {
      title,
      description: description || undefined,
      url,
      siteName: "Tarvix",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `/en/blog/${post.slug}`,
        fa: `/fa/blog/${post.slug}`,
        ar: `/ar/blog/${post.slug}`,
      },
    },
  };
}

// ============================================
// ۴. صفحه اصلی (Server Component)
// ============================================
export default async function BlogPostPageWrapper({ params }: PageProps) {
  const { id, locale } = await params;

  // دریافت پست با افزایش بازدید در یک تراکنش
  const rawPost = await prisma.$transaction(async (tx) => {
    const post = await tx.post.findFirst({
      where: { OR: [{ id }, { slug: id }], status: "published" },
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

    if (post) {
      await tx.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }

    return post;
  });

  if (!rawPost) {
    notFound();
  }

  // فرمت کردن پست با زبان فعلی
  const post = formatPostForLocale(rawPost, locale);

  const related = await getRelatedPosts(post.id, post.categoryId, locale);

  return (
    <>
      <Navbar showBack backUrl={`/${locale}/blog`} />
      <main>
        <BlogPostPage post={post} locale={locale} related={related} />
      </main>
      <Footer />
    </>
  );
}
