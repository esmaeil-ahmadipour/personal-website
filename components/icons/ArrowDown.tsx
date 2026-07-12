import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const ArrowDownIcon = ({
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </svg>
  );
};
