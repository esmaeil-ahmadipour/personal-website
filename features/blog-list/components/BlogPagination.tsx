// features/blog-list/components/BlogPagination.tsx

"use client";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isRTL?: boolean;
}

export function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
  isRTL = false,
}: BlogPaginationProps) {
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
    <nav
      className="flex justify-center items-center gap-2 mt-10"
      aria-label="Pagination"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-3.5 py-2 text-sm font-medium rounded-xl
          bg-[var(--bg-surface)] text-[var(--text-secondary)]
          border border-[var(--border-subtle)]
          hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200
        `}
        aria-label="Previous page"
      >
        {isRTL ? "→" : "←"}
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-sm text-[var(--text-muted)]"
            >
              …
            </span>
          );
        }

        const isActive = currentPage === page;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`
              px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200
              ${
                isActive
                  ? `
                    bg-gradient-to-r from-blue-500 to-purple-500
                    text-white shadow-lg shadow-blue-500/25
                    hover:shadow-blue-500/40 hover:-translate-y-0.5
                    border border-blue-500/20
                  `
                  : `
                    bg-[var(--bg-surface)] text-[var(--text-secondary)]
                    border border-[var(--border-subtle)]
                    hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]
                    hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]
                  `
              }
            `}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-3.5 py-2 text-sm font-medium rounded-xl
          bg-[var(--bg-surface)] text-[var(--text-secondary)]
          border border-[var(--border-subtle)]
          hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]
          disabled:opacity-30 disabled:cursor-not-allowed
          transition-all duration-200
        `}
        aria-label="Next page"
      >
        {isRTL ? "←" : "→"}
      </button>
    </nav>
  );
}
