// features/blog-list/components/LatestArticle.tsx
import Link from "next/link";
import { CoverMedia } from "@/components/ui/CoverMedia";

interface LatestArticleProps {
  href: string;
  label: string;
  title: string;
  excerpt?: string | null;
  meta: string;
  cta: string;
  coverImageUrl?: string | null;
}

export function LatestArticle({
  href,
  label,
  title,
  excerpt,
  meta,
  cta,
  coverImageUrl,
}: LatestArticleProps) {
  return (
    <Link
      href={href}
      className="group mb-8 grid overflow-hidden rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] transition-colors hover:border-[hsl(var(--accent-blue))] lg:h-[320px] lg:grid-cols-[minmax(0,1fr)_480px]"
    >
      <span className="order-2 flex flex-col justify-center gap-2 p-6 sm:p-8 lg:order-1">
        <span className="text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
          {label}
        </span>
        <span className="line-clamp-3 text-2xl font-extrabold leading-tight text-[hsl(var(--text-primary))] sm:text-4xl">
          {title}
        </span>
        {excerpt && (
          <span className="line-clamp-2 text-[hsl(var(--text-secondary))]">{excerpt}</span>
        )}
        <span className="text-sm text-[hsl(var(--text-muted))]">{meta}</span>
        <span className="mt-2 font-semibold text-[hsl(var(--accent-text))]">
          {cta} <span aria-hidden className="rtl-flip inline-block">→</span>
        </span>
      </span>
      <CoverMedia
        src={coverImageUrl}
        priority
        sizes="(max-width: 1024px) 100vw, 480px"
        className="order-1 h-[200px] border-b border-[hsl(var(--border-subtle))] lg:order-2 lg:h-full lg:border-b-0 lg:border-s"
      />
    </Link>
  );
}
