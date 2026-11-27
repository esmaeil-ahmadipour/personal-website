// features/blog-list/components/BlogPagination.tsx

"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const item =
  "btn-press min-w-9 px-3 py-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--focus-ring))] disabled:cursor-not-allowed disabled:opacity-40";
const idle = "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]";
const active = "bg-[hsl(var(--accent-blue)/0.12)] text-[hsl(var(--accent-text))]";

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BlogPaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label={t("blPagination")}>
      <div
        className="inline-flex items-center overflow-hidden rounded-full border border-[hsl(var(--border-subtle))] text-[13px]"
      >
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${item} ${idle}`}
          aria-label={t("blPrev")}
        >
          <span aria-hidden className="rtl-flip inline-block">
            ‹
          </span>
        </button>

        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                aria-hidden
                className="px-2 text-[hsl(var(--text-muted))]"
              >
                …
              </span>
            );
          }

          const isActive = currentPage === page;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page as number)}
              className={`${item} ${isActive ? active : idle}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${item} ${idle}`}
          aria-label={t("blNext")}
        >
          <span aria-hidden className="rtl-flip inline-block">
            ›
          </span>
        </button>
      </div>
    </nav>
  );
}
