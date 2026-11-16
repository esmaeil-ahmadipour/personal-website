// features/get-blog-post/components/ArticleToc.tsx
import type { TocItem } from "../lib/prepare-content";

export function ArticleToc({ items, title }: { items: TocItem[]; title: string }) {
  if (items.length < 2) return null;
  return (
    <nav
      aria-label={title}
      className="flex flex-col gap-2.5 border-s-2 border-[hsl(var(--border-subtle))] ps-4 text-sm"
    >
      <p className="font-semibold text-[hsl(var(--text-primary))]">{title}</p>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ps-3" : ""}>
            <a
              href={`#${item.id}`}
              className="rounded-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
