import { NextRequest, NextResponse } from "next/server";
import { GetPostsSchema } from "@/features/blog/schemas/blog.schema";
import { BlogService } from "@/features/blog/services/blog.service";

const blogService = new BlogService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = GetPostsSchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const result = await blogService.getPublishedPosts(params);

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
