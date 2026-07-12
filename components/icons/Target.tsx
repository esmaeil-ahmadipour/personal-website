import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const TargetIcon = ({
  size = DIP.SIZE,
  strokeWidth = DIP.STROKE_WIDTH,
  className = "",
  ...props
}: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...props}
    >
      <circle cx="12" cy="12" r="10" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="6" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="2" strokeWidth={strokeWidth} />
    </svg>
  );
};
