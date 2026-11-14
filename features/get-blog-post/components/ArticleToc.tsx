// features/get-blog-post/components/ArticleToc.tsx
import type { TocItem } from "../lib/prepare-content";

export function ArticleToc({ items, title }: { items: TocItem[]; title: string }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label={title}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[hsl(var(--text-muted))]">
        {title}
      </p>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ps-4" : ""}>
            <a
              href={`#${item.id}`}
              className="text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--accent))]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
