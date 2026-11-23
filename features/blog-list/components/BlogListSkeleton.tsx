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
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: displayCount }).map((_, index) => (
          <li key={index} className="card" aria-hidden>
            <div className={`${block} aspect-[16/9] w-full rounded-[var(--radius-poster)]`} />
            <div className={`${block} mt-3.5 h-6 w-24 rounded-full`} />
            <div className={`${block} mt-3 h-6 w-3/4`} />
            <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--border-subtle)/0.5)] pt-3.5">
              <div className={`${block} h-4 w-32`} />
              <div className={`${block} h-4 w-4`} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
