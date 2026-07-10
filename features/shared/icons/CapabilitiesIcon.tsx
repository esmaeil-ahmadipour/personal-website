// src/shared/icons/CapabilitiesIcon.tsx
"use client";

import { IconProps, BaseIcon } from "./BaseIcon";

export function CapabilitiesIcon({
  className = "w-5 h-5",
  ...props
}: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M10 16v4" />
      <path d="M14 16v4" />
    </BaseIcon>
  );
}
