// features/blog-list/components/BlogCard.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/features/blog/types/blog.types";

interface BlogCardProps {
  post: Post;
  locale: "en" | "fa";
}

// ============================================
// OFFICIAL COLOR PALETTE FOR BLOG CARDS
// ============================================
const OFFICIAL_COLORS = [
  {
    // Blue - Trust, Professional
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    borderColor: "border-blue-500/25",
    iconBg: "from-blue-500/25 to-blue-400/15",
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-500/15",
    badgeColor: "text-blue-600 dark:text-blue-400",
    badgeBorder: "border-blue-500/20",
    tagBg: "bg-blue-500/8",
    tagBorder: "border-blue-500/15",
    tagColor: "text-blue-600 dark:text-blue-400",
    hoverShadow: "shadow-blue-500/10",
    hoverBorder: "hover:border-blue-500/40",
  },
  {
    // Purple - Creativity, Premium
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    borderColor: "border-purple-500/25",
    iconBg: "from-purple-500/25 to-purple-400/15",
    iconColor: "text-purple-500",
    badgeBg: "bg-purple-500/15",
    badgeColor: "text-purple-600 dark:text-purple-400",
    badgeBorder: "border-purple-500/20",
    tagBg: "bg-purple-500/8",
    tagBorder: "border-purple-500/15",
    tagColor: "text-purple-600 dark:text-purple-400",
    hoverShadow: "shadow-purple-500/10",
    hoverBorder: "hover:border-purple-500/40",
  },
  {
    // Emerald - Growth, Success
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    borderColor: "border-emerald-500/25",
    iconBg: "from-emerald-500/25 to-emerald-400/15",
    iconColor: "text-emerald-500",
    badgeBg: "bg-emerald-500/15",
    badgeColor: "text-emerald-600 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    tagBg: "bg-emerald-500/8",
    tagBorder: "border-emerald-500/15",
    tagColor: "text-emerald-600 dark:text-emerald-400",
    hoverShadow: "shadow-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/40",
  },
  {
    // Rose - Energy, Passion
    gradient: "from-rose-500/20 via-rose-400/10 to-transparent",
    borderColor: "border-rose-500/25",
    iconBg: "from-rose-500/25 to-rose-400/15",
    iconColor: "text-rose-500",
    badgeBg: "bg-rose-500/15",
    badgeColor: "text-rose-600 dark:text-rose-400",
    badgeBorder: "border-rose-500/20",
    tagBg: "bg-rose-500/8",
    tagBorder: "border-rose-500/15",
    tagColor: "text-rose-600 dark:text-rose-400",
    hoverShadow: "shadow-rose-500/10",
    hoverBorder: "hover:border-rose-500/40",
  },
  {
    // Amber - Warmth, Innovation
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    borderColor: "border-amber-500/25",
    iconBg: "from-amber-500/25 to-amber-400/15",
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-500/15",
    badgeColor: "text-amber-600 dark:text-amber-400",
    badgeBorder: "border-amber-500/20",
    tagBg: "bg-amber-500/8",
    tagBorder: "border-amber-500/15",
    tagColor: "text-amber-600 dark:text-amber-400",
    hoverShadow: "shadow-amber-500/10",
    hoverBorder: "hover:border-amber-500/40",
  },
  {
    // Indigo - Modern, Professional
    gradient: "from-indigo-500/20 via-indigo-400/10 to-transparent",
    borderColor: "border-indigo-500/25",
    iconBg: "from-indigo-500/25 to-indigo-400/15",
    iconColor: "text-indigo-500",
    badgeBg: "bg-indigo-500/15",
    badgeColor: "text-indigo-600 dark:text-indigo-400",
    badgeBorder: "border-indigo-500/20",
    tagBg: "bg-indigo-500/8",
    tagBorder: "border-indigo-500/15",
    tagColor: "text-indigo-600 dark:text-indigo-400",
    hoverShadow: "shadow-indigo-500/10",
    hoverBorder: "hover:border-indigo-500/40",
  },
];

const getCardColors = (id: string) => {
  // Deterministic color selection based on id
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % OFFICIAL_COLORS.length;
  return OFFICIAL_COLORS[index];
};

export function BlogCard({ post, locale }: BlogCardProps) {
  const router = useRouter();
  const isRTL = locale === "fa";
  const colors = getCardColors(post.id);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const readingTime = post.readingTimeMin || 0;

  return (
    <article
      className={`
        group relative rounded-2xl p-6 card
        bg-gradient-to-br ${colors.gradient}
        border ${colors.borderColor}
        ${colors.hoverBorder}
        transition-all duration-300 
        hover:-translate-y-2 hover:shadow-xl ${colors.hoverShadow}
        cursor-pointer overflow-hidden
      `}
      onClick={() => router.push(`/${locale}/blog/${post.id}`)}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Glow Effect on Hover */}
      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 
          transition-opacity duration-500 pointer-events-none
          bg-gradient-to-br ${colors.gradient}
        `}
      />

      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-[var(--bg-secondary)]">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Badge: Category */}
      <div
        className={`flex items-center gap-2 mb-3 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      >
        <span
          className={`
            inline-flex items-center px-3 py-1 rounded-full
            text-[10px] font-mono font-semibold tracking-wider uppercase
            ${colors.badgeBg} ${colors.badgeColor}
            border ${colors.badgeBorder}
            transition-colors duration-200
          `}
        >
          {post.category?.name || "Uncategorized"}
        </span>
        {post.publishedAt && (
          <span className="text-xs text-[var(--text-muted)]">
            {formatDate(post.publishedAt)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className={`
          text-lg font-semibold text-[var(--text-primary)] mb-2 
          line-clamp-2 transition-colors duration-200
          group-hover:text-[var(--accent-blue)]
          ${isRTL ? "text-right" : "text-left"}
        `}
      >
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p
          className={`text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed ${isRTL ? "text-right" : "text-left"}`}
        >
          {post.excerpt}
        </p>
      )}

      {/* Footer: Author + Reading Time */}
      <div
        className={`flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-subtle)]/50 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          {post.author?.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.firstName}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-[var(--border-subtle)]/50"
            />
          ) : (
            <div
              className={`
                w-6 h-6 rounded-full 
                bg-gradient-to-br ${colors.iconBg}
                flex items-center justify-center 
                text-xs font-medium ${colors.iconColor}
              `}
            >
              {post.author?.firstName?.[0] || "A"}
            </div>
          )}
          <span className="text-xs text-[var(--text-secondary)] font-medium">
            {post.author?.firstName} {post.author?.lastName}
          </span>
        </div>

        {/* Reading Time */}
        {readingTime > 0 && (
          <div
            className={`flex items-center gap-1 text-xs text-[var(--text-muted)] ${isRTL ? "flex-row-reverse" : "flex-row"}`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {readingTime} {isRTL ? "دقیقه" : "min read"}
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div
          className={`flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)]/30 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
        >
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className={`
                text-[9px] px-2 py-0.5 rounded-full font-medium
                ${colors.tagBg} ${colors.tagColor}
                border ${colors.tagBorder}
                transition-colors duration-200
              `}
            >
              #{tag.name}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-[9px] text-[var(--text-muted)] font-medium">
              +{post.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
