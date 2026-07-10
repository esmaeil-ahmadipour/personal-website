// src/shared/icons/WorkIcon.tsx
"use client";

import { IconProps, BaseIcon } from "./BaseIcon";

export function WorkIcon({ className = "w-5 h-5", ...props }: IconProps) {
  return (
    <BaseIcon className={className} {...props}>
      <rect x="3" y="4" width="8" height="7" rx="1.5" />
      <rect x="13" y="4" width="8" height="7" rx="1.5" />
      <rect x="3" y="13" width="8" height="7" rx="1.5" />
      <rect x="13" y="13" width="8" height="7" rx="1.5" />
    </BaseIcon>
  );
}
