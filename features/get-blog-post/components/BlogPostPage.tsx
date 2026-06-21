"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import type { BlogPost } from "../types/get-blog-post.types";

interface BlogPostPageProps {
  post: BlogPost;
}

export function BlogPostPage({ post }: BlogPostPageProps) {
  const { lang } = useTranslation();
  const isFa = lang === "fa";

  // محتوای متنی
  const title = isFa ? post.titleFa : post.titleEn;
  const excerpt = isFa ? post.excerptFa : post.excerptEn;
  const content = isFa ? post.contentFa : post.contentEn;
  const authorName = isFa
    ? `${post.author.firstNameFa} ${post.author.lastNameFa}`
    : `${post.author.firstNameEn} ${post.author.lastNameEn}`;
  const authorBio = isFa ? post.author.bioFa : post.author.bioEn;
  const categoryName = isFa ? post.category.nameFa : post.category.nameEn;
  const tags = post.tags.map((tag) => (isFa ? tag.nameFa : tag.nameEn));

  // شرط‌های نمایش
  const hasExcerpt = excerpt && excerpt.length > 0;
  const hasTags = tags.length > 0;
  const hasAuthorBio = authorBio && authorBio.length > 0;
  const hasAuthorAvatar =
    post.author.avatarUrl && post.author.avatarUrl.length > 0;
  const hasCoverImage = post.coverImageUrl && post.coverImageUrl.length > 0;
  const hasReadingTime = post.readingTimeMin && post.readingTimeMin > 0;

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(isFa ? "fa-IR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const hasPublishedDate = publishedDate && publishedDate.length > 0;

  return (
    <article className="container py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        {/* Category - همیشه نمایش داده میشه */}
        <div className="mb-4">
          <span className="badge badge-purple">{categoryName}</span>
        </div>

        {/* Tags - فقط اگر وجود داشته باشد */}
        {hasTags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="badge">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title - همیشه نمایش داده میشه */}
        <h1
          className={cn(
            "text-3xl md:text-5xl font-bold mb-4",
            isFa && "font-vazir",
          )}
        >
          {title}
        </h1>

        {/* Excerpt - فقط اگر وجود داشته باشد */}
        {hasExcerpt && (
          <p className="text-lg md:text-xl text-muted mb-6">{excerpt}</p>
        )}

        {/* Meta - همیشه نمایش داده میشه (با شرط برای آیتم‌ها) */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-8">
          {/* نویسنده - همیشه نمایش داده میشه */}
          <div className="flex items-center gap-2">
            {hasAuthorAvatar && (
              <img
                src={post.author.avatarUrl!}
                alt={authorName}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{authorName}</span>
          </div>

          {/* تاریخ انتشار - فقط اگر وجود داشته باشد */}
          {hasPublishedDate && (
            <>
              <span>•</span>
              <span>{publishedDate}</span>
            </>
          )}

          {/* زمان مطالعه - فقط اگر وجود داشته باشد */}
          {hasReadingTime && (
            <>
              <span>•</span>
              <span>{post.readingTimeMin} min read</span>
            </>
          )}

          {/* بازدید - همیشه نمایش داده میشه */}
          <span>•</span>
          <span>{post.views} views</span>
        </div>

        {/* Cover Image - فقط اگر وجود داشته باشد */}
        {hasCoverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.coverImageUrl!}
              alt={title}
              className="w-full h-auto object-cover max-h-96"
            />
          </div>
        )}

        {/* Content - همیشه نمایش داده میشه */}
        <div
          className={cn("blog-content", isFa && "blog-content-fa")}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Author Bio - فقط اگر وجود داشته باشد */}
        {hasAuthorBio && (
          <div className="mt-12 p-6 rounded-xl bg-surface border border-border-subtle">
            <div className="flex items-start gap-4">
              {hasAuthorAvatar && (
                <img
                  src={post.author.avatarUrl!}
                  alt={authorName}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold">{authorName}</h3>
                <p className="text-muted text-sm">{authorBio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
