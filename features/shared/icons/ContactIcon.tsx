// src/shared/icons/ContactIcon.tsx
"use client";

import { IconProps, BaseIcon } from "./BaseIcon";

export function ContactIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </BaseIcon>
  );
}
