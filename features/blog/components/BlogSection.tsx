// features/blog/components/BlogSection.tsx

"use client";

import { LatestPosts } from "./LatestPosts";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function BlogSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/10 mb-4">
            {t("blogBadge")}
          </span>
          <h2 className="text-3xl font-bold tracking-tight gradient-text">
            {t("blogTitle")}
          </h2>
          <p className="text-[var(--text-secondary)] mt-2">
            {t("blogSubtitle")}
          </p>
        </div>
        <LatestPosts limit={3} />
      </div>
    </section>
  );
}
