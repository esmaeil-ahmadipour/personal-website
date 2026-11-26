// features/blog-list/components/BlogList.tsx

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useBlogList } from "../hooks/useBlogList";
import { Button } from "@/components/ui/Button";
import { formatShortDate } from "@/lib/format-date";
import { BlogPagination } from "./BlogPagination";
import { BlogPageSizeSelector } from "./BlogPageSizeSelector";
import { BlogListSkeleton } from "./BlogListSkeleton";
import { BlogToolbar } from "./BlogToolbar";
import { LatestArticle } from "./LatestArticle";
import { PostRow, ROW_COLUMNS } from "./PostRow";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import type { NumberedPost } from "../types/blog-list.types";

const HEAD =
  "text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]";

export function BlogList() {
  const { t, locale } = useTranslation();
  const { data, isLoading, error, state, update } = useBlogList(locale);

  // A stable callback keeps the search delay from restarting on every render.
  const updateRef = useRef(update);
  useEffect(() => {
    updateRef.current = update;
  });
  const handleQueryChange = useCallback((q: string) => updateRef.current({ q }), []);

  const meta = (post: NumberedPost) =>
    [post.category.name, post.readingTimeMin ? t("hmMin", { n: post.readingTimeMin }) : null]
      .filter(Boolean)
      .join(" · ");
  const href = (post: NumberedPost) => `/${locale}/blog/${post.slug}`;

  const isDefaultView = state.page === 1 && !state.q && !state.category;
  const isFiltered = Boolean(state.q || state.category);
  const latest = isDefaultView ? data?.latest : null;

  const renderResults = () => {
    if (isLoading) return <BlogListSkeleton count={state.limit} />;

    if (error || !data) {
      return (
        <div className="py-16 text-center">
          <p role="alert" className="font-medium text-[hsl(var(--accent-rose))]">
            {error?.message || t("errorLoadingPost")}
          </p>
          <Button size="sm" className="mt-4" onClick={() => window.location.reload()}>
            {t("tryAgain")}
          </Button>
        </div>
      );
    }

    const { items, pagination } = data;

    if (items.length === 0) {
      // A page past the end (old link) is not the same as "no results".
      const pastEnd = pagination.total > 0;
      return (
        <div className="py-16 text-center">
          <p className="font-medium text-[hsl(var(--text-secondary))]">
            {t(isFiltered || pastEnd ? "blNoResults" : "blogNoPosts")}
          </p>
          {isFiltered || pastEnd ? (
            <Button
              size="sm"
              className="mt-4"
              onClick={() => update(pastEnd ? { page: 1 } : { q: "", category: "" })}
            >
              {t(pastEnd ? "blFirstPage" : "blClear")}
            </Button>
          ) : (
            <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
              {t("blogCheckBackLater")}
            </p>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="flex items-baseline gap-4 border-b border-[hsl(var(--border-subtle))] py-2 sm:gap-6">
          <span className={`${HEAD} ${ROW_COLUMNS.number}`}>#</span>
          <span className={`${HEAD} flex-1`}>{t("blColTitle")}</span>
          <span className={`${HEAD} hidden sm:block ${ROW_COLUMNS.meta}`}>{t("blColTopic")}</span>
          <button
            type="button"
            onClick={() => update({ sort: state.sort === "oldest" ? "newest" : "oldest" })}
            className={`${HEAD} cursor-pointer whitespace-nowrap !text-[hsl(var(--accent-blue))] ${ROW_COLUMNS.date}`}
          >
            {t("blColDate")} <span aria-hidden>{state.sort === "oldest" ? "↑" : "↓"}</span>{" "}
            {t(state.sort === "oldest" ? "blOldestFirst" : "blNewestFirst")}
          </button>
        </div>
        <ul>
          {items.map((post) => (
            <li key={post.id}>
              <PostRow
                href={href(post)}
                number={post.number}
                title={post.title}
                meta={meta(post)}
                date={formatShortDate(post.publishedAt, locale)}
              />
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
          <BlogPageSizeSelector value={state.limit} onChange={(limit) => update({ limit })} />
          <BlogPagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => update({ page })}
          />
        </div>
      </>
    );
  };

  return (
    <div>
      <BlogToolbar
        query={state.q}
        category={state.category}
        categories={data?.categories ?? []}
        onQueryChange={handleQueryChange}
        onCategoryChange={(category) => update({ category })}
      />
      {latest && (
        <LatestArticle
          href={href(latest)}
          label={t("blLatest")}
          title={latest.title}
          excerpt={latest.excerpt}
          meta={[meta(latest), formatShortDate(latest.publishedAt, locale)]
            .filter(Boolean)
            .join(" · ")}
          cta={t("hmRead")}
          coverImageUrl={latest.coverImageUrl}
        />
      )}
      {renderResults()}
    </div>
  );
}
