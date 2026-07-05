// features/blog/components/BlogSection.tsx

"use client";

import { BlogSectionHeader } from "./BlogSectionHeader";
import { LatestPosts } from "./BlogSectionContent";

export function BlogSection() {
  return (
    <section
      id="blog"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <BlogSectionHeader />
        <LatestPosts limit={3} />
      </div>
    </section>
  );
}
