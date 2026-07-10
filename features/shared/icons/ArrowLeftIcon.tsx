import type { IconProps } from "@/features/shared/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/features/shared/utils/icon-props";

export const ArrowLeftIcon = ({
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
        d="M19 12H5M12 19l-7-7 7-7"
      />
    </svg>
  );
};
