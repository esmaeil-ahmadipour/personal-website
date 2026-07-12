import type { IconProps } from "@/utils/icon-props";
import { DEFAULT_ICON_PROPS as DIP } from "@/utils/icon-props";

export const HandshakeIcon = ({
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
        d="M15.75 7.5L18.75 10.5M18.75 10.5L15.75 13.5M18.75 10.5H8.25M8.25 10.5C7.5 10.5 6.75 10.5 6.75 12M8.25 10.5V13.5M8.25 13.5L11.25 16.5M8.25 13.5C6.75 13.5 5.25 13.5 5.25 15V18M11.25 16.5L14.25 13.5M11.25 16.5V19.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M12.75 4.5L14.25 6M12.75 4.5L11.25 6M12.75 4.5V8.25"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M18.75 19.5V16.5C18.75 15 17.25 15 16.5 15M5.25 19.5H18.75"
      />
      <circle cx="19.5" cy="10.5" r="1.5" strokeWidth={strokeWidth} />
      <circle cx="4.5" cy="19.5" r="1.5" strokeWidth={strokeWidth} />
    </svg>
  );
};
