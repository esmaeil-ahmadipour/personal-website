// features/home/components/PostSlideCard.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { formatShortDate } from "@/lib/format-date";
import type { Post } from "@/features/blog/types/blog.types";

/** Narrow cover card for the home "latest" slider (176px wide, set by .card-track). */
export async function PostSlideCard({ post, locale }: { post: Post; locale: string }) {
  const t = await getTranslations({ locale });
  const author = `${post.author.firstName} ${post.author.lastName}`.trim();
  const meta = [post.category.name, formatShortDate(post.publishedAt, locale)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="block transition-transform duration-500 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative">
        <CoverMedia
          src={post.coverImageUrl}
          sizes="176px"
          className="aspect-[176/236] w-full rounded-xl border border-[hsl(var(--border-subtle))]"
        />
        {post.readingTimeMin ? (
          <span className="absolute bottom-2 end-2 flex h-[34px] min-w-[34px] items-center justify-center rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] px-2.5 text-xs font-bold text-[hsl(var(--text-primary))]">
            {t("hmMinShort", { n: post.readingTimeMin })}
          </span>
        ) : null}
      </div>
      <span className="mb-1 mt-3.5 line-clamp-2 block text-[15px] font-bold leading-snug text-[hsl(var(--text-primary))]">
        {post.title}
      </span>
      {author && <span className="block text-sm text-[hsl(var(--text-secondary))]">{author}</span>}
      {meta && <span className="mt-0.5 block text-[13px] text-[hsl(var(--text-muted))]">{meta}</span>}
    </Link>
  );
}
