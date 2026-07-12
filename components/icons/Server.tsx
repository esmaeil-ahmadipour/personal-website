import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const ServerIcon = ({
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
      <rect
        x="3"
        y="4"
        width="18"
        height="4"
        rx="2"
        strokeWidth={strokeWidth}
      />
      <rect
        x="3"
        y="12"
        width="18"
        height="4"
        rx="2"
        strokeWidth={strokeWidth}
      />
      <rect
        x="3"
        y="20"
        width="18"
        height="4"
        rx="2"
        strokeWidth={strokeWidth}
      />
      <circle cx="6" cy="6" r="0.5" fill="currentColor" />
      <circle cx="6" cy="14" r="0.5" fill="currentColor" />
      <circle cx="6" cy="22" r="0.5" fill="currentColor" />
    </svg>
  );
};
