// app/api/blog/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getBlogList } from "@/features/blog-list/services/blog-list.service";
import { GetPostsSchema } from "@/features/blog/schemas/blog.schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = GetPostsSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      locale: searchParams.get("locale") || "en",
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      sort: searchParams.get("sort") ?? undefined,
    });

    const result = await getBlogList(params);

    return NextResponse.json({
      success: true,
      message: "Blog posts fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("[BLOG_API_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog posts",
      },
      { status: 500 },
    );
  }
}
