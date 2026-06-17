// src/features/shared/components/icons/CheckIcon.tsx
import type { IconProps } from "@/features/shared/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/features/shared/utils/icon-props";

export const CheckIcon = ({
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
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};
