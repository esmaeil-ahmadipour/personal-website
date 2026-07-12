import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const BlocksIcon = ({
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
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={strokeWidth} />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        strokeWidth={strokeWidth}
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        strokeWidth={strokeWidth}
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="1"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
