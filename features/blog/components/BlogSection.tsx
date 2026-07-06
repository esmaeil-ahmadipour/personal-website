// features/blog/components/BlogSection.tsx

"use client";

import { BlogSectionHeader } from "./BlogSectionHeader";
import { LatestPosts } from "./BlogSectionContent";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function BlogSection() {
  const { locale } = useTranslation();
  const isRTL = locale === "fa";

  return (
    <section
      id="blog"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        <BlogSectionHeader />
        <LatestPosts limit={3} />
      </div>
    </section>
  );
}
