// features/blog/components/LatestPosts.tsx

"use client";

import { useBlogListQuery } from "@/features/blog-list";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface LatestPostsProps {
  limit?: number;
}

// ============================================
// OFFICIAL COLOR PALETTE FOR LATEST POSTS CARDS
// ============================================
const OFFICIAL_COLORS = [
  {
    // Blue - Trust, Professional
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    border: "border-blue-500/40 hover:border-blue-500/70", // Increased opacity for light theme
    shadow: "shadow-blue-500/5 hover:shadow-blue-500/15",
    badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    title: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
    tagBg: "bg-blue-500/8",
    tagColor: "text-blue-600 dark:text-blue-400",
    tagBorder: "border-blue-500/20",
    iconBg: "from-blue-500/25 to-blue-400/15",
    iconColor: "text-blue-500",
  },
  {
    // Purple - Creativity, Premium
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    border: "border-purple-500/40 hover:border-purple-500/70",
    shadow: "shadow-purple-500/5 hover:shadow-purple-500/15",
    badge:
      "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    title: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
    tagBg: "bg-purple-500/8",
    tagColor: "text-purple-600 dark:text-purple-400",
    tagBorder: "border-purple-500/20",
    iconBg: "from-purple-500/25 to-purple-400/15",
    iconColor: "text-purple-500",
  },
  {
    // Emerald - Growth, Success
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    border: "border-emerald-500/40 hover:border-emerald-500/70",
    shadow: "shadow-emerald-500/5 hover:shadow-emerald-500/15",
    badge:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    title: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    tagBg: "bg-emerald-500/8",
    tagColor: "text-emerald-600 dark:text-emerald-400",
    tagBorder: "border-emerald-500/20",
    iconBg: "from-emerald-500/25 to-emerald-400/15",
    iconColor: "text-emerald-500",
  },
  {
    // Rose - Energy, Passion
    gradient: "from-rose-500/20 via-rose-400/10 to-transparent",
    border: "border-rose-500/40 hover:border-rose-500/70",
    shadow: "shadow-rose-500/5 hover:shadow-rose-500/15",
    badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    title: "group-hover:text-rose-600 dark:group-hover:text-rose-400",
    tagBg: "bg-rose-500/8",
    tagColor: "text-rose-600 dark:text-rose-400",
    tagBorder: "border-rose-500/20",
    iconBg: "from-rose-500/25 to-rose-400/15",
    iconColor: "text-rose-500",
  },
  {
    // Amber - Warmth, Innovation
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    border: "border-amber-500/40 hover:border-amber-500/70",
    shadow: "shadow-amber-500/5 hover:shadow-amber-500/15",
    badge:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    title: "group-hover:text-amber-600 dark:group-hover:text-amber-400",
    tagBg: "bg-amber-500/8",
    tagColor: "text-amber-600 dark:text-amber-400",
    tagBorder: "border-amber-500/20",
    iconBg: "from-amber-500/25 to-amber-400/15",
    iconColor: "text-amber-500",
  },
  {
    // Indigo - Modern, Professional
    gradient: "from-indigo-500/20 via-indigo-400/10 to-transparent",
    border: "border-indigo-500/40 hover:border-indigo-500/70",
    shadow: "shadow-indigo-500/5 hover:shadow-indigo-500/15",
    badge:
      "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    title: "group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
    tagBg: "bg-indigo-500/8",
    tagColor: "text-indigo-600 dark:text-indigo-400",
    tagBorder: "border-indigo-500/20",
    iconBg: "from-indigo-500/25 to-indigo-400/15",
    iconColor: "text-indigo-500",
  },
];

export function LatestPosts({ limit = 3 }: LatestPostsProps) {
  const { t, locale, isRTL } = useTranslation();

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
            className="rounded-2xl overflow-hidden card animate-pulse border border-[var(--border-subtle)]"
          >
            <div className="w-full aspect-[16/9] bg-[var(--bg-elevated)]" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-20 bg-[var(--bg-elevated)] rounded" />
              <div className="h-6 bg-[var(--bg-elevated)] rounded" />
              <div className="h-4 bg-[var(--bg-elevated)] rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--text-secondary)]">{t("blogNoPosts")}</p>
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
      {data.items.map((post, index) => {
        const color = OFFICIAL_COLORS[index % OFFICIAL_COLORS.length];
        return (
          <Link
            key={post.id}
            href={`/${locale}/blog/${post.id}`}
            className={`
              group block rounded-2xl overflow-hidden
              bg-gradient-to-br ${color.gradient}
              border-2 ${color.border}
              shadow-lg ${color.shadow}
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-xl ${color.shadow}
              bg-[var(--bg-secondary)]/80 backdrop-blur-sm
            `}
            dir={isRTL ? "rtl" : "ltr"}
          >
            {post.coverImageUrl && (
              <div className="relative w-full aspect-[16/9] bg-[var(--bg-elevated)] overflow-hidden">
                <Image
                  src={post.coverImageUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500
                    bg-gradient-to-t from-black/30 via-transparent to-transparent
                  `}
                />
              </div>
            )}

            <div className="p-4 md:p-5">
              {post.category && (
                <span
                  className={`
                    inline-block text-[10px] font-mono font-semibold tracking-[0.15em] uppercase
                    px-2.5 py-0.5 rounded-full border mb-1.5
                    ${color.badge}
                  `}
                >
                  {post.category.name}
                </span>
              )}

              <h3
                className={`
                  text-lg font-bold text-[var(--text-primary)] mb-1 line-clamp-2
                  transition-colors duration-300 ${color.title}
                `}
              >
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-2 mt-3 text-xs text-[var(--text-muted)]">
                <span>{formattedDate(post.publishedAt)}</span>
                {post.readingTimeMin && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-subtle)] shrink-0" />
                    <span>
                      {post.readingTimeMin} {t("minRead")}
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
