// features/blog/components/LatestPosts.tsx

"use client";

import { useBlogListQuery } from "@/features/blog-list";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface LatestPostsProps {
  limit?: number;
}

export function LatestPosts({ limit = 3 }: LatestPostsProps) {
  const { t, locale } = useTranslation();

  const { data, isLoading } = useBlogListQuery({
    page: 1,
    limit,
    locale: locale as "en" | "fa",
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse"
          >
            <div className="w-full aspect-[16/9] bg-gray-200 dark:bg-gray-800" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">{t("blogNoPosts")}</p>
      </div>
    );
  }

  const formattedDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString(
      locale === "fa" ? "fa-IR" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.items.map((post) => (
        <Link
          key={post.id}
          href={`/${locale}/blog/${post.id}`}
          className="group block bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg"
        >
          {post.coverImageUrl && (
            <div className="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          )}

          <div className="p-4 md:p-5">
            {post.category && (
              <span className="inline-block text-xs font-mono tracking-[0.15em] uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-800/30 mb-2">
                {post.category.name}
              </span>
            )}

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-500">
              <span>{formattedDate(post.publishedAt)}</span>
              {post.readingTimeMin && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>
                    {post.readingTimeMin} {t("minRead")}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
