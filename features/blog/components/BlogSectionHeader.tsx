// features/blog/components/BlogSectionHeader.tsx

"use client";

import { BlogBadge } from "./BlogBadge";
import { BlogSectionTitle } from "./BlogSectionTitle";
import { ViewAllPostsButton } from "./ViewAllPostsButton";

export function BlogSectionHeader() {
  return (
    <div className="text-center mb-12">
      <BlogBadge />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <BlogSectionTitle />
        <ViewAllPostsButton />
      </div>
    </div>
  );
}
