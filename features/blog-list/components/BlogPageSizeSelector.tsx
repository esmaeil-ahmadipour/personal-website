// features/blog-list/components/BlogPageSizeSelector.tsx

"use client";

import { PageSizeOptions, type PageSize } from "../schemas/blog-list.schema";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface BlogPageSizeSelectorProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}

export function BlogPageSizeSelector({
  value,
  onChange,
}: BlogPageSizeSelectorProps) {
  const { t, locale } = useTranslation();
  const isRTL = locale === "fa";

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="page-size"
        className="text-sm text-[var(--text-secondary)]"
      >
        {isRTL ? "نمایش:" : "Show:"}
      </label>
      <select
        id="page-size"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as PageSize)}
        className="px-3 py-1.5 text-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-[var(--accent-blue)] outline-none transition-all text-[var(--text-primary)]"
      >
        {PageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  );
}
