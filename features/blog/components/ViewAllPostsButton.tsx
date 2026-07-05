// features/blog/components/ViewAllPostsButton.tsx

"use client";

import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

export function ViewAllPostsButton() {
  const { t, locale } = useTranslation();
  const isRTL = locale === "fa";

  return (
    <Link
      href={`/${locale}/blog`}
      className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--accent-blue)] hover:text-white border border-[var(--accent-blue)] hover:bg-[var(--accent-blue)] rounded-lg transition-all duration-200 whitespace-nowrap"
    >
      {t("viewAllPosts")}
      {isRTL ? (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}
