// features/get-blog-post/components/AuthorAvatar.tsx

"use client";

import { useState } from "react";

/** Round author photo; shows the initials when there is no photo or it fails to load. */
export function AuthorAvatar({ src, initials }: { src?: string | null; initials: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      aria-hidden
      className="grid h-10 w-10 flex-none place-items-center overflow-hidden rounded-full bg-[hsl(var(--bg-elevated))] text-sm font-semibold text-[hsl(var(--text-primary))]"
    >
      {src && !failed ? (
        // The photo can live on any host, so next/image is not used.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          // Also catches a load that failed before hydration.
          ref={(img) => {
            if (img?.complete && img.naturalWidth === 0) setFailed(true);
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        initials
      )}
    </span>
  );
}
