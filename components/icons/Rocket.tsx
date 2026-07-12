import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const RocketIcon = ({
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
        d="M15 11.5l-4.5-4.5M15 11.5l4.5-4.5M15 11.5v6M9 7.5L4.5 12M9 7.5v6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
      />
    </svg>
  );
};
