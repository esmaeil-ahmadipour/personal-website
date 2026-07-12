import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const WorkflowIcon = ({
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
      <rect x="2" y="2" width="6" height="6" rx="1" strokeWidth={strokeWidth} />
      <rect
        x="16"
        y="2"
        width="6"
        height="6"
        rx="1"
        strokeWidth={strokeWidth}
      />
      <rect
        x="9"
        y="16"
        width="6"
        height="6"
        rx="1"
        strokeWidth={strokeWidth}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M8 5h8M5 8v5a3 3 0 003 3h1M19 8v5a3 3 0 01-3 3h-1"
      />
    </svg>
  );
};
