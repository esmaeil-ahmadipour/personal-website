// features/home/components/PostCard.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Poster } from "@/components/ui/Poster";
import { Reveal } from "@/components/ui/Reveal";
import { accentStyle } from "@/lib/accent";
import { formatShortDate } from "@/lib/format-date";
import type { Post } from "@/features/blog/types/blog.types";

export type PostCardData = Pick<Post, "id" | "slug" | "title" | "readingTimeMin"> & {
  excerpt?: string | null;
  publishedAt?: Date | string | null;
  category: { name: string };
};

interface PostCardProps {
  post: PostCardData;
  locale: string;
  index: number;
  variant?: "card" | "featured";
}

export async function PostCard({ post, locale, index, variant = "card" }: PostCardProps) {
  const t = await getTranslations({ locale });
  const href = `/${locale}/blog/${post.slug}`;
  const meta = [
    post.readingTimeMin ? t("hmMin", { n: post.readingTimeMin }) : null,
    formatShortDate(post.publishedAt, locale),
  ]
    .filter(Boolean)
    .join(" · ");

  if (variant === "featured") {
    return (
      <Reveal as="article">
        <Link
          href={href}
          className="card grid gap-0 p-0 md:grid-cols-[1.1fr_1fr]"
          style={accentStyle(index)}
        >
          <div className="relative min-h-[200px] md:min-h-[260px]">
            <Poster
              aria-hidden
              index={index}
              height="100%"
              className="absolute inset-0 rounded-none text-3xl"
            >
              {post.title}
            </Poster>
          </div>
          <div className="flex flex-col items-start justify-center p-6 sm:p-8">
            <Badge>{t("hmFeatured")}</Badge>
            <h3 className="mb-2 mt-3 text-2xl sm:text-[28px]">{post.title}</h3>
            {post.excerpt && (
              <p className="text-base text-[hsl(var(--text-secondary))]">{post.excerpt}</p>
            )}
            {meta && <p className="mt-3 text-[13px] text-[hsl(var(--text-muted))]">{meta}</p>}
            <span className="btn btn-sm mt-4">{t("hmRead")}</span>
          </div>
        </Link>
      </Reveal>
    );
  }

  return (
    <Reveal as="article" delay={Math.min(index, 6) * 0.05} className="h-full">
      <Link href={href} className="card flex h-full flex-col" style={accentStyle(index)}>
        <Poster aria-hidden index={index}>
          {post.title}
        </Poster>
        <div className="mt-3.5">
          <Badge>{post.category.name}</Badge>
        </div>
        <h3 className="mb-2 mt-3 text-xl">{post.title}</h3>
        <div className="mt-auto flex items-center justify-between border-t border-[hsl(var(--border-subtle)/0.5)] pt-3.5 text-sm text-[hsl(var(--text-secondary))]">
          <span className="text-[13px] text-[hsl(var(--text-muted))]">{meta}</span>
          <span aria-hidden className="rtl-flip inline-block">→</span>
        </div>
      </Link>
    </Reveal>
  );
}
