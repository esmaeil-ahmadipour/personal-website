import { cn } from "@/lib/utils";

interface PosterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Picks one of three theme-aware palettes (index % 3). */
  index?: number;
  ratio?: "16/9" | "4/3" | "1/1";
}

/** Typographic cover placeholder. Pass the title as children. */
export function Poster({
  index = 0,
  ratio = "16/9",
  className,
  style,
  children,
  ...props
}: PosterProps) {
  return (
    <div
      className={cn(
        `poster-${index % 3}`,
        "flex w-full items-end rounded-lg p-4 text-xl font-bold leading-tight",
        className,
      )}
      style={{
        aspectRatio: ratio,
        fontFamily: "var(--font-heading)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
