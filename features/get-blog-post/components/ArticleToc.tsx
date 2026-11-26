// features/get-blog-post/components/ArticleToc.tsx

"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../lib/prepare-content";

/** A heading counts as current once it is this close to the top of the viewport. */
const ACTIVE_OFFSET_PX = 140;

/** The id of the section being read: the last heading above the offset. */
function useActiveHeading(items: TocItem[]): string | undefined {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = items[0]?.id;
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) {
          current = item.id;
        }
      }
      setActiveId(atBottom ? items[items.length - 1]?.id : current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  return activeId;
}

export function ArticleToc({ items, title }: { items: TocItem[]; title: string }) {
  const activeId = useActiveHeading(items);
  if (items.length < 2) return null;
  return (
    <nav aria-label={title} className="text-sm">
      <p className="text-[13px] font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
        {title}
      </p>
      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ps-3" : ""}>
            <a
              href={`#${item.id}`}
              aria-current={item.id === activeId ? "location" : undefined}
              className="rounded-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))] aria-[current=location]:text-[hsl(var(--accent-blue))]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
