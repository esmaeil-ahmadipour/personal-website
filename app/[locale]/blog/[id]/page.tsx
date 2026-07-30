// app/[locale]/blog/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostPage } from "@/features/get-blog-post/components/BlogPostPage";
import Navbar from "@/features/shared/components/Navbar";
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
function formatPostForLocale(rawPost: any, locale: "en" | "fa" | "ar"): BlogPost {
  return {
    id: rawPost.id,
    slug: rawPost.slug,
    
    // انگلیسی - همیشه موجود
    titleEn: rawPost.titleEn,
    excerptEn: rawPost.excerptEn || null,
    contentEn: rawPost.contentEn,
    seoTitleEn: rawPost.seoTitleEn || null,
    seoDescriptionEn: rawPost.seoDescriptionEn || null,
    
    // فارسی
    titleFa: rawPost.titleFa,
    excerptFa: rawPost.excerptFa || null,
    contentFa: rawPost.contentFa,
    seoTitleFa: rawPost.seoTitleFa || null,
    seoDescriptionFa: rawPost.seoDescriptionFa || null,
    
    // عربی
    titleAr: rawPost.titleAr || "",
    excerptAr: rawPost.excerptAr || null,
    contentAr: rawPost.contentAr || "",
    seoTitleAr: rawPost.seoTitleAr || null,
    seoDescriptionAr: rawPost.seoDescriptionAr || null,
    
    coverImageUrl: rawPost.coverImageUrl || null,
    readingTimeMin: rawPost.readingTimeMin || null,
    status: rawPost.status,
    publishedAt: rawPost.publishedAt,
    views: rawPost.views || 0,
    
    // ============================================
    // AUTHOR - کامل با تمام فیلدها
    // ============================================
    author: {
      id: rawPost.author.id,
      slug: rawPost.author.slug,
      
      // انگلیسی
      firstNameEn: rawPost.author.firstNameEn,
      lastNameEn: rawPost.author.lastNameEn,
      bioEn: rawPost.author.bioEn || null,
      
      // فارسی
      firstNameFa: rawPost.author.firstNameFa,
      lastNameFa: rawPost.author.lastNameFa,
      bioFa: rawPost.author.bioFa || null,
      
      // عربی
      firstNameAr: rawPost.author.firstNameAr || "",
      lastNameAr: rawPost.author.lastNameAr || "",
      bioAr: rawPost.author.bioAr || null,
      
      // فیلدهای عمومی
      avatarUrl: rawPost.author.avatarUrl || null,
      email: rawPost.author.email || null,
      
      // شبکه‌های اجتماعی
      website: rawPost.author.website || null,
      twitter: rawPost.author.twitter || null,
      github: rawPost.author.github || null,
      linkedin: rawPost.author.linkedin || null,
      
      // فیلدهای زمانی
      createdAt: rawPost.author.createdAt,
      updatedAt: rawPost.author.updatedAt,
    },
    
    // ============================================
    // CATEGORY - کامل با تمام فیلدها
    // ============================================
    category: {
      id: rawPost.category.id,
      slug: rawPost.category.slug,
      
      // انگلیسی
      nameEn: rawPost.category.nameEn,
      descriptionEn: rawPost.category.descriptionEn || null,
      
      // فارسی
      nameFa: rawPost.category.nameFa,
      descriptionFa: rawPost.category.descriptionFa || null,
      
      // عربی
      nameAr: rawPost.category.nameAr || "",
      descriptionAr: rawPost.category.descriptionAr || null,
      
      // فیلدهای اضافی
      order: rawPost.category.order || 0,
      parentId: rawPost.category.parentId || null,
      isActive: rawPost.category.isActive ?? true,
      
      // فیلدهای زمانی
      createdAt: rawPost.category.createdAt,
      updatedAt: rawPost.category.updatedAt,
    },
    
    // ============================================
    // TAGS - کامل با تمام فیلدها
    // ============================================
    tags: rawPost.tags.map((pt: any) => ({
      id: pt.tag.id,
      slug: pt.tag.slug,
      
      // انگلیسی
      nameEn: pt.tag.nameEn,
      
      // فارسی
      nameFa: pt.tag.nameFa,
      
      // عربی
      nameAr: pt.tag.nameAr || "",
      
      // فیلدهای اضافی
      color: pt.tag.color || "#3b82f6",
      icon: pt.tag.icon || null,
      
      // فیلدهای زمانی
      createdAt: pt.tag.createdAt,
      updatedAt: pt.tag.updatedAt,
    })),
    
    createdAt: rawPost.createdAt,
    updatedAt: rawPost.updatedAt,
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

  const post = await prisma.post.findUnique({
    where: { id, status: "published" },
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
    const post = await tx.post.findUnique({
      where: { id, status: "published" },
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
        where: { id },
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

  return (
    <>
      <Navbar showBack backUrl={`/${locale}/blog`} />
      <div className="pt-20">
        <BlogPostPage post={post} locale={locale} />
      </div>
    </>
  );
}

// ============================================
// ۵. Static Paths (برای SSG)
// ============================================
export async function generateStaticParams() {
  if (process.env.NODE_ENV === "development") {
    return [];
  }

  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      select: { id: true, slug: true },
    });

    // مسیرهای هر ۳ زبان
    return posts.flatMap((post) => [
      { id: post.id, locale: "en" },
      { id: post.id, locale: "fa" },
      { id: post.id, locale: "ar" },
    ]);
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// ============================================
// ۶. تنظیمات ریدایرکت برای SSG
// ============================================
export const dynamicParams = true;
