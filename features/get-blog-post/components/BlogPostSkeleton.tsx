// features/get-blog-post/components/BlogPostSkeleton.tsx

"use client";

export function BlogPostSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button skeleton */}
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />

        {/* Cover image skeleton */}
        <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8 animate-pulse" />

        {/* Title skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4 animate-pulse" />

        {/* Meta info skeleton */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Category badge skeleton */}
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 animate-pulse" />

        {/* Content skeleton - paragraphs */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
        </div>

        {/* Tags skeleton */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
