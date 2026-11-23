// features/blog-list/components/BlogList.tsx

"use client";

import { useBlogList } from "../hooks/useBlogList";
import { Button } from "@/components/ui/Button";
import { BlogCard } from "./BlogCard";
import { BlogPagination } from "./BlogPagination";
import { BlogPageSizeSelector } from "./BlogPageSizeSelector";
import { BlogListSkeleton } from "./BlogListSkeleton";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import type { PageSize } from "../schemas/blog-list.schema";
import { Post } from "@/features/blog/types/blog.types";

// Define the BlogPost type locally or import it
interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  titleEn?: string;
  titleFa?: string;
  titleAr?: string;
  excerptEn?: string;
  excerptFa?: string;
  excerptAr?: string;
  contentEn?: string;
  contentFa?: string;
  contentAr?: string;
  seoTitleEn?: string;
  seoTitleFa?: string;
  seoTitleAr?: string;
  seoDescriptionEn?: string;
  seoDescriptionFa?: string;
  seoDescriptionAr?: string;
  publishedAt: string;
  updatedAt: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
  isFeatured?: boolean;
  isTrending?: boolean;
  isPinned?: boolean;
  priority?: number;
  views?: number;
  readingTime?: number;
  image?: string | null;
  coverImage?: string | null;
}

interface BlogListProps {
  initialPage?: number;
  initialLimit?: PageSize;
  locale: "en" | "fa" | "ar";
}

export function BlogList({
  initialPage = 1,
  initialLimit = 10,
 }: BlogListProps) {
  const { t, locale } = useTranslation();
 
  const { data, isLoading, error, handlePageChange, handleLimitChange, limit } =
    useBlogList({ initialPage, initialLimit, locale });

  // Loading state
  if (isLoading) {
    return <BlogListSkeleton count={limit} />;
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 text-center">
        <p role="alert" className="font-medium text-[hsl(var(--accent-rose))]">
          {error.message || t("errorLoadingPost")}
        </p>
        <Button size="sm" className="mt-4" onClick={() => window.location.reload()}>
          {t("tryAgain")}
        </Button>
      </div>
    );
  }

  // Empty state
  if (!data || data.items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium text-[hsl(var(--text-secondary))]">{t("blogNoPosts")}</p>
        <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">{t("blogCheckBackLater")}</p>
      </div>
    );
  }

  const { items, pagination } = data;

  return (
    <div>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((post: Post, i: number) => (
          <BlogCard post={post} key={post.id} locale={locale} index={i} />
        ))}
      </ul>

      <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
        <BlogPageSizeSelector value={limit} onChange={handleLimitChange} />
        <BlogPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
