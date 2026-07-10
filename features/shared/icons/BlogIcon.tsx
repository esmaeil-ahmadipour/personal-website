// src/shared/icons/BlogIcon.tsx
"use client";

import { IconProps, BaseIcon } from "./BaseIcon";

export function BlogIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <path d="M6 4.75h8.5a2.5 2.5 0 012.5 2.5V19a.75.75 0 01-1.2.6L13.5 18H6A2 2 0 014 16V6.75a2 2 0 012-2z" />
      <path d="M8 9h6" />
      <path d="M8 12h6" />
      <path d="M8 15h4" />
    </BaseIcon>
  );
}
