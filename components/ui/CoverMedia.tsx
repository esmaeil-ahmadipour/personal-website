"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Shown when a cover is missing or fails to load. */
export const COVER_PLACEHOLDER_SRC = "/images/placeholder-cover.svg";

/** True for `.svg` URLs (query and hash ignored) and `data:image/svg+xml` URIs. */
export function isSvgSource(src: string): boolean {
  if (src.startsWith("data:")) return /^data:image\/svg\+xml/i.test(src);
  return /\.svg$/i.test(src.split(/[?#]/, 1)[0]);
}

/**
 * next/image only accepts local files and the hosts in next.config.ts
 * (images.remotePatterns). Keep this list in sync with that file.
 */
function isAllowedRaster(src: string): boolean {
  if (src.startsWith("/")) return !src.startsWith("//") && !src.includes("?");
  return src.startsWith("https://res.cloudinary.com/");
}

interface CoverMediaProps {
  /** `coverImageUrl` of a post, project or newsletter issue. */
  src?: string | null;
  alt?: string;
  /** Size and radius, e.g. "aspect-[16/9] w-full rounded-[var(--radius-poster)]". */
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Cover slot. A raster image (png, jpg, webp...) fills the slot (object-cover).
 * An SVG file is centered and fitted by height on the slot gradient.
 * A missing or broken source, or a raster on a host that is not allowed,
 * falls back to the placeholder SVG.
 */
export function CoverMedia({
  src,
  alt = "",
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: CoverMediaProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const usable = Boolean(src) && src !== failedSrc && (isSvgSource(src!) || isAllowedRaster(src!));
  const url = src && usable ? src : COVER_PLACEHOLDER_SRC;
  const isPlaceholder = url === COVER_PLACEHOLDER_SRC;

  return (
    <div className={cn("cover-slot", className)}>
      {isSvgSource(url) ? (
        // SVG files are not optimized by next/image, so a plain <img> is used.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={isPlaceholder ? "" : alt}
          className="cover-svg"
          loading={priority ? "eager" : "lazy"}
          onError={() => src && setFailedSrc(src)}
        />
      ) : (
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => src && setFailedSrc(src)}
        />
      )}
    </div>
  );
}
