// features/blog-list/components/BlogImageWithPlaceholder.tsx

"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface BlogImageWithPlaceholderProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export function BlogImageWithPlaceholder({
  src,
  alt,
  className = "",
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: BlogImageWithPlaceholderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // اگر src null یا undefined باشد، مستقیماً placeholder نمایش داده شود
  if (!src) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-secondary)] ${className}`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[var(--text-muted)]/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[var(--bg-elevated)] ${className}`}
    >
      {/* حالت لودینگ */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-secondary)] animate-pulse">
          <svg
            className="w-8 h-8 text-[var(--text-muted)]/20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* حالت خطا */}
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-secondary)]">
          <svg
            className="w-12 h-12 text-[var(--text-muted)]/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          className={`object-cover transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          sizes={sizes}
          priority={priority}
        />
      )}
    </div>
  );
}
