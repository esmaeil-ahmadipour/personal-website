import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const BracesIcon = ({
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
        d="M8 4H6a2 2 0 00-2 2v3a2 2 0 01-2 2m0 0a2 2 0 012 2v3a2 2 0 002 2h2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M16 4h2a2 2 0 012 2v3a2 2 0 002 2m0 0a2 2 0 01-2 2v3a2 2 0 01-2 2h-2"
      />
    </svg>
  );
};
