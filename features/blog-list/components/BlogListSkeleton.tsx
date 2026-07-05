// features/blog-list/components/BlogListSkeleton.tsx

"use client";

interface BlogListSkeletonProps {
  count?: number;
}

export function BlogListSkeleton({ count = 10 }: BlogListSkeletonProps) {
  const displayCount = Math.min(count, 9);

  return (
    <div>
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: displayCount }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="w-full aspect-[16/9] bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="p-5 md:p-6 space-y-3">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-2/3" />
              <div className="flex gap-3 pt-2">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
