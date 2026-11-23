// features/blog-list/components/BlogCard.tsx

"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Poster } from "@/components/ui/Poster";
import { Reveal } from "@/components/ui/Reveal";
import { BlogImageWithPlaceholder } from "@/components/BlogImageWithPlaceholder";
import { accentStyle } from "@/lib/accent";
import { formatShortDate } from "@/lib/format-date";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import type { Post } from "@/features/blog/types/blog.types";

interface BlogCardProps {
  post: Post;
  locale: "en" | "ar" | "fa";
  /** Position in the list; rotates the accent color and the entrance delay. */
  index: number;
}

/** Article card: cover (or typographic poster), category, title, meta. Same look as the Home card. */
export function BlogCard({ post, locale, index }: BlogCardProps) {
  const { t } = useTranslation();
  const meta = [
    post.readingTimeMin ? t("hmMin", { n: post.readingTimeMin }) : null,
    formatShortDate(post.publishedAt, locale),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Reveal as="li" delay={Math.min(index, 6) * 0.05} className="h-full">
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="card flex h-full flex-col"
        style={accentStyle(index)}
      >
        {post.coverImageUrl ? (
          <BlogImageWithPlaceholder
            src={post.coverImageUrl}
            alt=""
            className="aspect-[16/9] w-full rounded-[var(--radius-poster)]"
          />
        ) : (
          <Poster aria-hidden index={index}>
            {post.title}
          </Poster>
        )}
        {post.category?.name && (
          <div className="mt-3.5">
            <Badge>{post.category.name}</Badge>
          </div>
        )}
        <h3 className="mb-2 mt-3 text-xl">{post.title}</h3>
        <div className="mt-auto flex items-center justify-between border-t border-[hsl(var(--border-subtle)/0.5)] pt-3.5 text-sm text-[hsl(var(--text-secondary))]">
          <span className="text-[13px] text-[hsl(var(--text-muted))]">{meta}</span>
          <span aria-hidden className="rtl-flip inline-block">
            →
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
