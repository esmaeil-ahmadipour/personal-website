// app/api/blog/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

// ============================================
// تابع کمکی برای استخراج زبان از URL
// ============================================
function getLocaleFromUrl(request: NextRequest): "en" | "fa" | "ar" {
  // دریافت مسیر کامل
  const url = request.nextUrl.pathname;
  
  // استخراج زبان از مسیر: /ar/blog/... -> ar
  const segments = url.split('/');
  const locale = segments[1]; // اولین بخش بعد از slash
  
  // اعتبارسنجی زبان
  if (locale === "fa") return "fa";
  if (locale === "ar") return "ar";
  return "en"; // پیش‌فرض
}

// ============================================
// تابع کمکی برای انتخاب فیلد بر اساس زبان
// ============================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Prisma result with relations; typing it is a separate refactor
function getLocalizedPost(post: any, locale: "en" | "fa" | "ar" = "en") {
  const isFa = locale === "fa";
  const isAr = locale === "ar";

  const getField = <T>(en: T, fa: T, ar: T): T => {
    if (isAr) return ar || en;
    if (isFa) return fa || en;
    return en;
  };

  return {
    id: post.id,
    slug: post.slug,
    
    // ===== فیلدهای محلی شده =====
    title: getField(post.titleEn, post.titleFa, post.titleAr),
    excerpt: getField(
      post.excerptEn || "",
      post.excerptFa || "",
      post.excerptAr || ""
    ),
    content: getField(post.contentEn, post.contentFa, post.contentAr),
    seoTitle: getField(
      post.seoTitleEn || "",
      post.seoTitleFa || "",
      post.seoTitleAr || ""
    ),
    seoDescription: getField(
      post.seoDescriptionEn || "",
      post.seoDescriptionFa || "",
      post.seoDescriptionAr || ""
    ),
    
    // ===== فیلدهای خام (برای نمایش در API) =====
    titleEn: post.titleEn,
    excerptEn: post.excerptEn,
    contentEn: post.contentEn,
    seoTitleEn: post.seoTitleEn,
    seoDescriptionEn: post.seoDescriptionEn,
    
    titleFa: post.titleFa,
    excerptFa: post.excerptFa,
    contentFa: post.contentFa,
    seoTitleFa: post.seoTitleFa,
    seoDescriptionFa: post.seoDescriptionFa,
    
    titleAr: post.titleAr,
    excerptAr: post.excerptAr,
    contentAr: post.contentAr,
    seoTitleAr: post.seoTitleAr,
    seoDescriptionAr: post.seoDescriptionAr,
    
    coverImageUrl: post.coverImageUrl,
    readingTimeMin: post.readingTimeMin,
    status: post.status,
    publishedAt: post.publishedAt,
    views: post.views || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    
    // ===== نویسنده =====
    author: {
      id: post.author.id,
      slug: post.author.slug,
      avatarUrl: post.author.avatarUrl,
      
      firstNameEn: post.author.firstNameEn,
      lastNameEn: post.author.lastNameEn,
      bioEn: post.author.bioEn,
      
      firstNameFa: post.author.firstNameFa,
      lastNameFa: post.author.lastNameFa,
      bioFa: post.author.bioFa,
      
      firstNameAr: post.author.firstNameAr,
      lastNameAr: post.author.lastNameAr,
      bioAr: post.author.bioAr,
      
      fullName: getField(
        `${post.author.firstNameEn} ${post.author.lastNameEn}`,
        `${post.author.firstNameFa} ${post.author.lastNameFa}`,
        `${post.author.firstNameAr} ${post.author.lastNameAr}`
      ),
      bio: getField(
        post.author.bioEn || "",
        post.author.bioFa || "",
        post.author.bioAr || ""
      ),
    },
    
    // ===== دسته‌بندی =====
    category: {
      id: post.category.id,
      slug: post.category.slug,
      
      nameEn: post.category.nameEn,
      descriptionEn: post.category.descriptionEn,
      
      nameFa: post.category.nameFa,
      descriptionFa: post.category.descriptionFa,
      
      nameAr: post.category.nameAr,
      descriptionAr: post.category.descriptionAr,
      
      name: getField(
        post.category.nameEn,
        post.category.nameFa,
        post.category.nameAr
      ),
      description: getField(
        post.category.descriptionEn || "",
        post.category.descriptionFa || "",
        post.category.descriptionAr || ""
      ),
    },
    
    // ===== برچسب‌ها =====
    tags: post.tags.map((pt: { tag: { id: string; slug: string; nameEn: string; nameFa: string; nameAr: string } }) => ({
      id: pt.tag.id,
      slug: pt.tag.slug,
      
      nameEn: pt.tag.nameEn,
      nameFa: pt.tag.nameFa,
      nameAr: pt.tag.nameAr,
      
      name: getField(
        pt.tag.nameEn,
        pt.tag.nameFa,
        pt.tag.nameAr
      ),
    })),
  };
}

// ============================================
// GET - دریافت پست با تشخیص خودکار زبان
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // ✅ تشخیص خودکار زبان از URL
    const locale = getLocaleFromUrl(request);
    console.log(`📍 Detected locale: ${locale} from URL: ${request.nextUrl.pathname}`);

    // دریافت پست از دیتابیس
    const post = await prisma.post.findUnique({
      where: {
        id,
        status: "published",
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

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    // افزایش بازدید
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // فرمت کردن پست با زبان تشخیص داده شده
    const formattedPost = getLocalizedPost(post, locale);

    return NextResponse.json({
      success: true,
      data: formattedPost,
      meta: {
        locale: locale,
        detectedFrom: "url",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - به‌روزرسانی پست
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        titleEn: body.titleEn,
        excerptEn: body.excerptEn,
        contentEn: body.contentEn,
        seoTitleEn: body.seoTitleEn,
        seoDescriptionEn: body.seoDescriptionEn,
        
        titleFa: body.titleFa,
        excerptFa: body.excerptFa,
        contentFa: body.contentFa,
        seoTitleFa: body.seoTitleFa,
        seoDescriptionFa: body.seoDescriptionFa,
        
        titleAr: body.titleAr,
        excerptAr: body.excerptAr,
        contentAr: body.contentAr,
        seoTitleAr: body.seoTitleAr,
        seoDescriptionAr: body.seoDescriptionAr,
        
        coverImageUrl: body.coverImageUrl,
        readingTimeMin: body.readingTimeMin,
        status: body.status,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        categoryId: body.categoryId,
        authorId: body.authorId,
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

    // تشخیص خودکار زبان از URL
    const locale = getLocaleFromUrl(request);
    const formattedPost = getLocalizedPost(updatedPost, locale);

    return NextResponse.json({
      success: true,
      data: formattedPost,
      meta: {
        locale: locale,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - حذف پست
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  try {
    const { id } = await params;

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          message: "Post not found",
        },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
