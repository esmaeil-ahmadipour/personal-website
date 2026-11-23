import { cn } from "@/lib/utils";
import { accentStyle, posterInk } from "@/lib/accent";

interface PosterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Picks one of the six accent pairs (index % 6). */
  index?: number;
  ratio?: "16/9" | "4/3" | "1/1";
  /** Fixed height (px number or CSS length). Replaces the aspect ratio. */
  height?: number | string;
}

/** Typographic cover placeholder. Pass the title as children. */
export function Poster({
  index = 0,
  ratio = "16/9",
  height,
  className,
  style,
  children,
  ...props
}: PosterProps) {
  return (
    <div
      className={cn("poster", className)}
      data-ink={posterInk(index)}
      style={{
        ...accentStyle(index),
        ...(height === undefined ? { aspectRatio: ratio } : { height }),
        fontFamily: "var(--font-heading)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
