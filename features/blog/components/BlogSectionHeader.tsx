// features/blog/components/BlogSectionHeader.tsx

"use client";

import { BlogBadge } from "./BlogBadge";
import { BlogSectionTitle } from "./BlogSectionTitle";
import { ViewAllPostsButton } from "./ViewAllPostsButton";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function BlogSectionHeader() {
  const { isRTL } = useTranslation();

  return (
    <div className="text-center mb-12" dir={isRTL ? "rtl" : "ltr"}>
      <BlogBadge />

      <div
        className={`flex flex-col md:flex-row justify-between items-center gap-4 ${isRTL ? "md:flex-row-reverse" : "md:flex-row"}`}
      >
        <BlogSectionTitle />
        <ViewAllPostsButton />
      </div>
    </div>
  );
}
