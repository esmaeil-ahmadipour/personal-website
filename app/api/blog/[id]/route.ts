import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // ✅ تغییر به Promise
) {
  try {
    const { id } = await params; // ✅ اضافه کردن await

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
        { status: 404 },
      );
    }

    // افزایش بازدید
    await prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // تبدیل به فرمت مورد نظر
    const formattedPost = {
      id: post.id,
      slug: post.slug,
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
      coverImageUrl: post.coverImageUrl,
      readingTimeMin: post.readingTimeMin,
      status: post.status,
      publishedAt: post.publishedAt,
      author: post.author,
      category: post.category,
      tags: post.tags.map((pt) => ({
        id: pt.tag.id,
        slug: pt.tag.slug,
        nameEn: pt.tag.nameEn,
        nameFa: pt.tag.nameFa,
      })),
      views: post.views || 0,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: formattedPost,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
}
