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
      className={`group relative inline-flex items-center gap-2 pl-5 pr-2 py-2 text-sm font-semibold
    text-blue-600 dark:text-blue-300
    bg-white dark:bg-gray-900/80
    border-2 border-blue-400 dark:border-blue-600
    hover:bg-blue-600 hover:border-blue-600 hover:text-white
    dark:hover:bg-blue-500 dark:hover:border-blue-400 dark:hover:text-white
    rounded-full transition-all duration-300 ease-out
    hover:shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-blue-500/40
    hover:scale-[1.02] active:scale-[0.97]
    whitespace-nowrap`}
    >
      <span className="relative z-10">{t("viewAllPosts")}</span>

      {/* switch-style icon capsule */}
      <span
        className="flex items-center justify-center w-8 h-8 rounded-full
          bg-blue-600 text-white shadow-md
          dark:bg-blue-400 dark:text-gray-900
          transition-all duration-300 ease-out
          group-hover:bg-white group-hover:text-blue-600
          dark:group-hover:bg-white dark:group-hover:text-blue-600
          group-hover:scale-110 group-hover:shadow-lg
          group-hover:shadow-blue-500/30"
      >
        <svg
          width={15}
          height={15}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-all duration-300 ease-out ${
            isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
          } group-hover:scale-110`}
        >
          <path
            d={isRTL ? "M19 12H5M12 19l-7-7 7-7" : "M5 12h14M12 5l7 7-7 7"}
          />
        </svg>
      </span>

      {/* Subtle glow effect on hover */}
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 
        group-hover:from-blue-400/20 group-hover:via-blue-400/10 group-hover:to-blue-400/20 
        dark:group-hover:from-blue-400/30 dark:group-hover:via-blue-400/20 dark:group-hover:to-blue-400/30
        transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
      />
    </Link>
  );
}
