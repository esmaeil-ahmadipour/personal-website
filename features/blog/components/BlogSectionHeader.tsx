// features/blog/components/BlogSectionHeader.tsx

"use client";

import { BlogBadge } from "./BlogBadge";
import { BlogSectionTitle } from "./BlogSectionTitle";
import { ViewAllPostsButton } from "./ViewAllPostsButton";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function BlogSectionHeader() {
  const { isRTL } = useTranslation();

  return (
    <div className="w-full self-center" dir={isRTL ? "rtl" : "ltr"}>
      {/* Badge - مرکز */}
      <div className="text-center mb-4">
        <BlogBadge />
      </div>

      {/* Title و Button - فلکس */}
      <div
        className={`
    flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 
    pb-3 md:pb-4
    ${isRTL ? "md:flex-row-reverse" : "md:flex-row"}
  `}
      >
        <div className="flex-1">
          <BlogSectionTitle />
        </div>
        <div className="flex-shrink-0">
          <ViewAllPostsButton />
        </div>
      </div>
    </div>
  );
}
