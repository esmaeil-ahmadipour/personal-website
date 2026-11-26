// features/blog-list/components/BlogToolbar.tsx

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface BlogToolbarProps {
  query: string;
  category: string;
  categories: { slug: string; name: string }[];
  onQueryChange: (query: string) => void;
  onCategoryChange: (slug: string) => void;
}

const SEARCH_DELAY_MS = 300;

export function BlogToolbar({
  query,
  category,
  categories,
  onQueryChange,
  onCategoryChange,
}: BlogToolbarProps) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(query);
  const [synced, setSynced] = useState(query);

  // The URL changed from outside (Back, a nav link, "clear"): show its value.
  if (query !== synced) {
    setSynced(query);
    if (query !== draft.trim()) setDraft(query);
  }

  useEffect(() => {
    if (draft.trim() === query) return;
    const timer = setTimeout(() => onQueryChange(draft.trim()), SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [draft, query, onQueryChange]);

  const chips = [{ slug: "", name: t("blAllTopics") }, ...categories];

  return (
    <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center">
      <div className="flex flex-1 items-center gap-4">
        <label htmlFor="blog-search" className="text-sm text-[hsl(var(--text-muted))]">
          {t("blSearch")}
        </label>
        <input
          id="blog-search"
          type="search"
          value={draft}
          maxLength={100}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("blSearchPlaceholder")}
          className="h-12 min-w-0 flex-1 rounded-[10px] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] px-4 text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] focus:border-[hsl(var(--accent-text))] focus:outline-none"
        />
      </div>
      {categories.length > 0 && (
        <div role="group" aria-label={t("blTopics")} className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.slug || "all"}
              type="button"
              className="pill cursor-pointer"
              aria-current={chip.slug === category ? "true" : undefined}
              onClick={() => onCategoryChange(chip.slug)}
            >
              {chip.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
