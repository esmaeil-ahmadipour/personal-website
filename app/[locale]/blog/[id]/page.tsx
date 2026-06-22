"use client";

import { useParams, useRouter } from "next/navigation";
import { BlogPostPage } from "@/features/get-blog-post/components/BlogPostPage";
import { useGetBlogPost } from "@/features/get-blog-post/hooks/useGetBlogPost";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { Navbar } from "@/features/shared/components/SimpleNavbar";

export default function BlogPostRoute() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { post, isLoading, error } = useGetBlogPost(id);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <>
        <Navbar showBack />
        <div className="pt-20">
          <div className="container py-16">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar showBack />
        <div className="pt-20">
          <div className="container py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="card p-12">
                <h2 className="text-2xl font-bold mb-4">
                  {t("postNotFound") || "Post Not Found"}
                </h2>
                <p className="text-muted mb-6">
                  {error || t("postNotFoundDesc") || "Post not found"}
                </p>
                <a
                  href="/"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  ← {t("backToHome") || "Back to Home"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar showBack />
      <div className="pt-20">
        <BlogPostPage post={post} />
      </div>
    </>
  );
}
