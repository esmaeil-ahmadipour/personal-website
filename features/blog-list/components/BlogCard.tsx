// features/blog-list/components/BlogCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/features/blog/types/blog.types";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface BlogCardProps {
  post: Post;
  locale: string;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const { t } = useTranslation();

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        locale === "fa" ? "fa-IR" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : t("notPublished");

  return (
    <Link
      href={`/${locale}/blog/${post.id}`}
      className="group block bg-[var(--bg-surface)] rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-blue)] transition-all duration-300 overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-1"
    >
      {/* Cover Image */}
      {post.coverImageUrl && (
        <div className="relative w-full aspect-[16/9] bg-[var(--bg-secondary)] overflow-hidden">
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-5 md:p-6">
        {/* Category Badge */}
        {post.category && (
          <span className="inline-block text-xs font-mono tracking-[0.15em] uppercase text-[var(--accent-blue)] bg-[var(--accent-blue-bg)] px-3 py-1 rounded-full border border-[var(--border-subtle)] mb-3">
            {post.category.name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-[var(--accent-blue)] transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span>{formattedDate}</span>
          {post.readingTimeMin && (
            <>
              <span className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
              <span>
                {post.readingTimeMin} {t("minRead")}
              </span>
            </>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
          {post.author.avatarUrl ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={post.author.avatarUrl}
                alt={post.author.firstName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
              {post.author.firstName?.[0]}
              {post.author.lastName?.[0]}
            </div>
          )}
          <div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {post.author.firstName} {post.author.lastName}
            </span>
            <p className="text-xs text-[var(--text-muted)]">{t("author")}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
