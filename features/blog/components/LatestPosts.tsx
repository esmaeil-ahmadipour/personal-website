// features/blog/components/LatestPosts.tsx

"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { BlogApi } from "../api/blog.api";
import type { Post } from "../types/blog.types";

interface LatestPostsProps {
  limit?: number;
}

export function LatestPosts({ limit = 3 }: LatestPostsProps) {
  const { lang } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await BlogApi.getPosts({
          page: 1,
          limit,
          locale: lang as "en" | "fa",
        });
        setPosts(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, lang]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] animate-pulse"
          >
            <div className="h-4 bg-[var(--bg-elevated)] rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-[var(--bg-elevated)] rounded w-full mb-2"></div>
            <div className="h-3 bg-[var(--bg-elevated)] rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        <p>Failed to load blog posts</p>
        <p className="text-sm text-[var(--text-muted)]">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        <p>No blog posts yet</p>
        <p className="text-sm text-[var(--text-muted)]">Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <a
          key={post.id}
          href={`/blog/${post.slug}`}
          className="group rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover-lift shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]">
              {post.category.name}
            </span>
            {post.readingTimeMin && (
              <span className="text-xs text-[var(--text-muted)]">
                {post.readingTimeMin} min read
              </span>
            )}
          </div>

          <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2 group-hover:text-[var(--accent-blue)] transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.firstName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                {post.author.firstName?.[0] || "?"}
                {post.author.lastName?.[0] || ""}
              </div>
            )}
            <span>
              {post.author.firstName} {post.author.lastName}
            </span>
            {post.publishedAt && (
              <span>
                {new Date(post.publishedAt).toLocaleDateString(
                  lang === "fa" ? "fa-IR" : "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
