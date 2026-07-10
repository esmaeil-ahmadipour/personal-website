// src/shared/icons/TeamIcon.tsx
"use client";

import { IconProps, BaseIcon } from "./BaseIcon";

export function TeamIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M16 19v-1a4 4 0 00-8 0v1" />
      <circle cx="12" cy="11" r="3" />
      <path d="M6 19v-.5a3.5 3.5 0 013-3.465" />
      <path d="M18 19v-.5a3.5 3.5 0 00-3-3.465" />
      <circle cx="5.5" cy="11.5" r="2" />
      <circle cx="18.5" cy="11.5" r="2" />
    </BaseIcon>
  );
}
