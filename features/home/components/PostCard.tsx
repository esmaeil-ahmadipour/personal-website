// features/home/components/PostCard.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Poster } from "@/components/ui/Poster";
import type { Post } from "@/features/blog/types/blog.types";

export type PostCardData = Pick<Post, "id" | "slug" | "title" | "readingTimeMin"> & {
  excerpt?: string | null;
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
    post.category.name,
    post.readingTimeMin ? t("hmMin", { n: post.readingTimeMin }) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  if (variant === "featured") {
    return (
      <article className="grid items-center gap-6 md:grid-cols-2">
        <Link href={href} tabIndex={-1} aria-hidden>
          <Poster index={index} className="text-2xl">
            {post.title}
          </Poster>
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
            {t("hmFeatured")}
          </p>
          <h3 className="mt-2 text-2xl font-bold leading-snug">
            <Link href={href} className="hover:text-[hsl(var(--accent))]">
              {post.title}
            </Link>
          </h3>
          {post.excerpt && (
            <p className="mt-3 text-[hsl(var(--text-secondary))]">{post.excerpt}</p>
          )}
          <p className="mt-3 text-sm text-[hsl(var(--text-muted))]">{meta}</p>
          <Link
            href={href}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--accent))] hover:underline"
          >
            {t("hmRead")} <span aria-hidden className="rtl-flip inline-block">→</span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="card flex flex-col gap-3 p-3">
      <Link href={href} tabIndex={-1} aria-hidden>
        <Poster index={index}>{post.title}</Poster>
      </Link>
      <p className="px-1 text-xs text-[hsl(var(--text-muted))]">{meta}</p>
      <h3 className="px-1 text-lg font-bold leading-snug">
        <Link href={href} className="hover:text-[hsl(var(--accent))]">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && (
        <p className="line-clamp-2 px-1 pb-1 text-sm text-[hsl(var(--text-secondary))]">
          {post.excerpt}
        </p>
      )}
    </article>
  );
}
