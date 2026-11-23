"use client";

import { PageSizeOptions, type PageSize } from "../schemas/blog-list.schema";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface BlogPageSizeSelectorProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}

/** "10 per page" as a native select: keyboard, screen reader and RTL work out of the box. */
export function BlogPageSizeSelector({ value, onChange }: BlogPageSizeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as PageSize)}
        aria-label={t("blPerPage", { n: value })}
        className="cursor-pointer appearance-none rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface)/0.5)] py-[7px] pe-9 ps-4 text-sm text-[hsl(var(--text-secondary))] backdrop-blur-sm transition-colors hover:border-[hsl(var(--accent-blue)/0.5)] hover:text-[hsl(var(--accent-text))]"
      >
        {PageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {t("blPerPage", { n: size })}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute end-3.5 text-xs text-[hsl(var(--text-muted))]"
      >
        ▾
      </span>
    </div>
  );
}
