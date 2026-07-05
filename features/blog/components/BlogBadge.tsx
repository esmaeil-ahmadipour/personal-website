// features/blog/components/BlogBadge.tsx

"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function BlogBadge() {
  const { t } = useTranslation();

  return (
    <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/10 mb-4">
      {t("blogBadge")}
    </span>
  );
}
