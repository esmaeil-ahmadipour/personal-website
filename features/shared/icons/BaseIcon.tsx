// src/shared/icons/BaseIcon.tsx
"use client";

import { SVGProps, ReactNode } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export function BaseIcon({
  className = "w-5 h-5",
  size,
  strokeWidth = 1.9,
  children,
  ...props
}: IconProps) {
  const sizeClass = size ? `w-${size} h-${size}` : className;

  return (
    <svg
      className={sizeClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}
