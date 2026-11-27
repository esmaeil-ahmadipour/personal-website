// features/blog-list/components/BlogListSkeleton.tsx

"use client";

interface BlogListSkeletonProps {
  count?: number;
}

const block = "animate-shimmer rounded-lg";

export function BlogListSkeleton({ count = 10 }: BlogListSkeletonProps) {
  const displayCount = Math.min(count, 9);

  return (
    <div role="status" aria-busy="true">
      <ul>
        {Array.from({ length: displayCount }).map((_, index) => (
          <li
            key={index}
            className="flex items-center gap-4 border-b border-[hsl(var(--border-subtle))] py-5 sm:gap-6"
            aria-hidden
          >
            <div className={`${block} h-4 w-10`} />
            <div className="flex-1">
              <div className={`${block} h-6 w-3/4`} />
            </div>
            <div className={`${block} hidden h-4 w-32 sm:block`} />
            <div className={`${block} h-4 w-20`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
