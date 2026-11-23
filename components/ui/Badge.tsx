import { cn } from "@/lib/utils";
import { accentStyle } from "@/lib/accent";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Picks one of the six accent pairs. Omit to inherit the card color. */
  accent?: number;
}

export function Badge({ accent, className, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn("badge", className)}
      style={accent === undefined ? style : { ...accentStyle(accent), ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
