// features/blog-list/components/PostRow.tsx
import Link from "next/link";

/** Fixed column widths so the table header lines up with the rows. */
export const ROW_COLUMNS = {
  number: "w-10 flex-none",
  meta: "sm:w-48 sm:flex-none",
  date: "sm:w-48 sm:flex-none sm:text-end",
} as const;

export const formatPostNumber = (value: number) => String(value).padStart(2, "0");

interface PostRowProps {
  href: string;
  number: number;
  title: string;
  /** "Topic · N min read" */
  meta: string;
  /** Omit to drop the date column. */
  date?: string | null;
}

/** One numbered article line (blog table and "Keep reading"). Stacks on small screens. */
export function PostRow({ href, number, title, meta, date }: PostRowProps) {
  return (
    <Link
      href={href}
      className="group flex items-baseline gap-4 border-b border-[hsl(var(--border-subtle))] py-5 sm:gap-6"
    >
      <span
        className={`${ROW_COLUMNS.number} text-xs font-semibold text-[hsl(var(--text-muted))]`}
      >
        {number > 0 ? formatPostNumber(number) : ""}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
        <span className="flex-1 text-lg font-semibold text-[hsl(var(--text-primary))] transition-colors group-hover:text-[hsl(var(--accent-blue))] sm:text-[22px]">
          {title}
        </span>
        <span className={`text-sm text-[hsl(var(--text-muted))] ${ROW_COLUMNS.meta}`}>
          {meta}
        </span>
        {date !== undefined && (
          <span className={`text-sm text-[hsl(var(--text-muted))] ${ROW_COLUMNS.date}`}>
            {date}
          </span>
        )}
      </span>
    </Link>
  );
}
