// features/blog-list/components/BlogList.tsx

"use client";

import { useBlogList } from "../hooks/useBlogList";
import { BlogCard } from "./BlogCard";
import { BlogPagination } from "./BlogPagination";
import { BlogPageSizeSelector } from "./BlogPageSizeSelector";
import { BlogListSkeleton } from "./BlogListSkeleton";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import type { PageSize } from "../schemas/blog-list.schema";

interface BlogListProps {
  initialPage?: number;
  initialLimit?: PageSize;
  locale: "en" | "fa";
}

export function BlogList({
  initialPage = 1,
  initialLimit = 10,
  locale,
}: BlogListProps) {
  const { t } = useTranslation();
  const isRTL = locale === "fa";

  const { data, isLoading, error, handlePageChange, handleLimitChange, limit } =
    useBlogList({ initialPage, initialLimit, locale });

  // Loading state
  if (isLoading) {
    return <BlogListSkeleton count={limit} />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 mb-4">
          <svg
            className="w-8 h-8 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium">
          {error.message || t("errorLoadingPost")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2.5 text-sm font-medium text-white bg-[var(--accent-blue)] hover:bg-[var(--accent-blue-hover)] rounded-lg transition-colors"
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] mb-4">
          <svg
            className="w-8 h-8 text-[var(--text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <p className="text-[var(--text-secondary)] font-medium">
          {t("blogNoPosts")}
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {t("blogCheckBackLater")}
        </p>
      </div>
    );
  }

  const { items, pagination } = data;

  return (
    <div>
      {/* Header: Result count + Page Size Selector */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-8 pb-4 border-b border-[var(--border-subtle)]">
        <p className="text-sm text-[var(--text-secondary)]">
          {isRTL ? (
            <>
              نمایش{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {items.length}
              </span>{" "}
              از{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {pagination.total}
              </span>{" "}
              مطلب
            </>
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {items.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {pagination.total}
              </span>{" "}
              posts
            </>
          )}
        </p>
        <BlogPageSizeSelector value={limit} onChange={handleLimitChange} />
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((post) => (
          <BlogCard key={post.id} post={post} locale={locale} />
        ))}
      </div>

      {/* Pagination */}
      <BlogPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        isRTL={isRTL}
      />
    </div>
  );
}
