// app/[locale]/blog/[id]/page.tsx

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogPostPage } from "@/features/get-blog-post/components/BlogPostPage";
import { Navbar } from "@/features/shared/components/SimpleNavbar";
import type { BlogPost } from "@/features/get-blog-post/types/get-blog-post.types";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lang?: "en" | "fa" }>;
}

// ============================================
// ۱. تابع کمکی برای تبدیل داده‌ها به فرمت BlogPost
// ============================================
function formatPost(rawPost: any): BlogPost {
  return {
    id: rawPost.id,
    slug: rawPost.slug,
    titleEn: rawPost.titleEn,
    excerptEn: rawPost.excerptEn || null,
    contentEn: rawPost.contentEn,
    seoTitleEn: rawPost.seoTitleEn || null,
    seoDescriptionEn: rawPost.seoDescriptionEn || null,
    titleFa: rawPost.titleFa,
    excerptFa: rawPost.excerptFa || null,
    contentFa: rawPost.contentFa,
    seoTitleFa: rawPost.seoTitleFa || null,
    seoDescriptionFa: rawPost.seoDescriptionFa || null,
    coverImageUrl: rawPost.coverImageUrl || null,
    readingTimeMin: rawPost.readingTimeMin || null,
    status: rawPost.status,
    publishedAt: rawPost.publishedAt,
    author: {
      id: rawPost.author.id,
      slug: rawPost.author.slug,
      firstNameEn: rawPost.author.firstNameEn,
      lastNameEn: rawPost.author.lastNameEn,
      bioEn: rawPost.author.bioEn || null,
      firstNameFa: rawPost.author.firstNameFa,
      lastNameFa: rawPost.author.lastNameFa,
      bioFa: rawPost.author.bioFa || null,
      avatarUrl: rawPost.author.avatarUrl || null,
    },
    category: {
      id: rawPost.category.id,
      slug: rawPost.category.slug,
      nameEn: rawPost.category.nameEn,
      descriptionEn: rawPost.category.descriptionEn || null,
      nameFa: rawPost.category.nameFa,
      descriptionFa: rawPost.category.descriptionFa || null,
    },
    tags: rawPost.tags.map((pt: any) => ({
      id: pt.tag.id,
      slug: pt.tag.slug,
      nameEn: pt.tag.nameEn,
      nameFa: pt.tag.nameFa,
    })),
    views: rawPost.views || 0,
    createdAt: rawPost.createdAt,
    updatedAt: rawPost.updatedAt,
  };
}

// ============================================
// ۲. متادیتا (SEO)
// ============================================
export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const lang = (await searchParams)?.lang || "en";
  const isFa = lang === "fa";

  const post = await prisma.post.findUnique({
    where: { id, status: "published" },
  });

  if (!post) {
    return {
      title: isFa ? "پست یافت نشد" : "Post Not Found",
      description: isFa
        ? "پست مورد نظر وجود ندارد"
        : "The requested post does not exist.",
    };
  }

  const title = isFa
    ? post.seoTitleFa || post.titleFa
    : post.seoTitleEn || post.titleEn;
  const description = isFa
    ? post.seoDescriptionFa || post.excerptFa
    : post.seoDescriptionEn || post.excerptEn;
  const imageUrl = post.coverImageUrl || "/images/default-blog-cover.jpg";
  const url = `https://tarvix.org/${lang}/blog/${post.slug}`;

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
          url: imageUrl,
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
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        en: `/en/blog/${post.slug}`,
        fa: `/fa/blog/${post.slug}`,
      },
    },
  };
}

// ============================================
// ۳. صفحه اصلی (Server Component)
// ============================================
export default async function BlogPostPageWrapper({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const lang = (await searchParams)?.lang || "en";

  const rawPost = await prisma.post.findUnique({
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

  if (!rawPost) {
    notFound();
  }

  const post = formatPost(rawPost);

  return (
    <>
      <Navbar showBack />
      <div className="pt-20">
        <BlogPostPage post={post} locale={lang} />
      </div>
    </>
  );
}

// ============================================
// ۴. Static Paths (برای SSG)
// ============================================
export async function generateStaticParams() {
  // ✅ فقط در محیط production اجرا بشه
  if (process.env.NODE_ENV === "development") {
    return [];
  }

  try {
    const posts = await prisma.post.findMany({
      where: { status: "published" },
      select: { id: true, slug: true },
    });

    return posts.flatMap((post) => [
      { id: post.id, lang: "en" },
      { id: post.id, lang: "fa" },
    ]);
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}
