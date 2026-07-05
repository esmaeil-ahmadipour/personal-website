// features/blog/components/BlogSectionTitle.tsx

"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function BlogSectionTitle() {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight gradient-text">
        {t("blogTitle")}
      </h2>
      <p className="text-[var(--text-secondary)] mt-2">{t("blogSubtitle")}</p>
    </div>
  );
}
