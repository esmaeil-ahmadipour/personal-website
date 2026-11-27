import { cn } from "@/lib/utils";

interface SectionHeadProps {
  title: string;
  sub?: string;
  className?: string;
  /** Actions (ButtonLink, links) shown at the end of the row. */
  children?: React.ReactNode;
}

/** Section title row: h2, optional muted sub line, optional actions. */
export function SectionHead({ title, sub, className, children }: SectionHeadProps) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-wrap items-end justify-between gap-5",
        className,
      )}
    >
      <div>
        <h2 className="text-2xl sm:text-[32px]">{title}</h2>
        {sub && (
          <p className="mt-1.5 max-w-[620px] text-[hsl(var(--text-muted))]">{sub}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap gap-3.5">{children}</div>}
    </div>
  );
}
