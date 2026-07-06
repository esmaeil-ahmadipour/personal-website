// features/get-blog-post/components/BlogPostPage.tsx

import { cn } from "@/lib/utils";
import type { BlogPost } from "../types/get-blog-post.types";
import { BlogImageWithPlaceholder } from "@/components/BlogImageWithPlaceholder";
 
interface BlogPostPageProps {
  post: BlogPost;
  locale: "en" | "fa";
}

function preparePostData(post: BlogPost, locale: "en" | "fa") {
  const isFa = locale === "fa";

  const title = isFa ? post.titleFa : post.titleEn;
  const excerpt = isFa ? post.excerptFa : post.excerptEn;
  const content = isFa ? post.contentFa : post.contentEn;
  const authorName = isFa
    ? `${post.author.firstNameFa} ${post.author.lastNameFa}`
    : `${post.author.firstNameEn} ${post.author.lastNameEn}`;
  const authorBio = isFa ? post.author.bioFa : post.author.bioEn;
  const categoryName = isFa ? post.category.nameFa : post.category.nameEn;
  const tags = post.tags.map((tag) => (isFa ? tag.nameFa : tag.nameEn));

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(isFa ? "fa-IR" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return {
    title,
    excerpt,
    content,
    authorName,
    authorBio,
    categoryName,
    tags,
    publishedDate,
    hasExcerpt: !!(excerpt && excerpt.length > 0),
    hasTags: tags.length > 0,
    hasAuthorBio: !!(authorBio && authorBio.length > 0),
    hasAuthorAvatar: !!(
      post.author.avatarUrl && post.author.avatarUrl.length > 0
    ),
    hasCoverImage: !!(post.coverImageUrl && post.coverImageUrl.length > 0),
    hasReadingTime: !!(post.readingTimeMin && post.readingTimeMin > 0),
    hasPublishedDate: !!(publishedDate && publishedDate.length > 0),
  };
}

export function BlogPostPage({ post, locale }: BlogPostPageProps) {
  const isFa = locale === "fa";
  const data = preparePostData(post, locale);

  const {
    title,
    excerpt,
    content,
    authorName,
    authorBio,
    categoryName,
    tags,
    publishedDate,
    hasExcerpt,
    hasTags,
    hasAuthorBio,
    hasAuthorAvatar,
    hasCoverImage,
    hasReadingTime,
    hasPublishedDate,
  } = data;

  // ============================================
  // JSON-LD (Schema.org)
  // ============================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt || title,
    image:
      post.coverImageUrl || "https://tarvix.org/images/default-blog-cover.webp",
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Tarvix",
      logo: {
        "@type": "ImageObject",
        url: "https://tarvix.org/images/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tarvix.org/${locale}/blog/${post.slug}`,
    },
    keywords: tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        dir={isFa ? "rtl" : "ltr"}
        className={cn(
          "container py-8 md:py-16 max-w-4xl mx-auto space-y-8",
          isFa && "font-vazir",
        )}
      >
        {/* --- هدر مقاله --- */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground">
            {title}
          </h1>

          {/* متا لاین */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-300! text-purple-700! dark:bg-purple-900/30 dark:text-purple-400">
              {categoryName}
            </span>

            {hasPublishedDate && (
              <time
                className="flex items-center"
                dateTime={post.publishedAt?.toISOString()}
              >
                {publishedDate}
              </time>
            )}

            {hasReadingTime && (
              <span className="flex items-center">
                <span className="opacity-40 mx-1">•</span>
                {post.readingTimeMin} min read
              </span>
            )}

            <span className="flex items-center">
              <span className="opacity-40 mx-1">•</span>
              {post.views} views
            </span>
          </div>

          {/* Excerpt */}
          {hasExcerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed font-light mt-4 max-w-3xl">
              {excerpt}
            </p>
          )}

          {/* نویسنده */}
          <div className="flex items-center gap-3 pt-4">
            <BlogImageWithPlaceholder
              src={post.author.avatarUrl}
              alt={authorName}
              className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
              fill={false}
              width={40}
              height={40}
            />
            <span className="font-semibold text-foreground">{authorName}</span>
          </div>
        </header>

        {/* --- تصویر شاخص --- */}
        <figure className="rounded-2xl overflow-hidden aspect-video max-h-[450px] shadow-lg border border-border/20">
          <BlogImageWithPlaceholder
            src={post.coverImageUrl}
            alt={title}
            className="w-full h-full"
            fill={false}
            width={1200}
            height={675}
            priority={true}
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </figure>

        {/* --- بدنه محتوا --- */}
        <main
          className={cn(
            "prose prose-neutral dark:prose-invert max-w-none leading-relaxed",
            "blog-content",
            isFa && "blog-content-fa",
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* --- پاورقی --- */}
        <footer className="pt-12 border-t border-border/60 space-y-8">
          {/* تگ‌ها */}
          {hasTags && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-1">
                Topics:
              </span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-secondary/50 text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* بیوگرافی نویسنده */}
          {hasAuthorBio && (
            <section className="p-6 rounded-xl bg-muted/30 border border-border/60">
              <div className="flex items-start gap-4">
                <BlogImageWithPlaceholder
                  src={post.author.avatarUrl}
                  alt={authorName}
                  className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                  fill={false}
                  width={48}
                  height={48}
                />
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    {authorName}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {authorBio}
                  </p>
                </div>
              </div>
            </section>
          )}
        </footer>
      </article>
    </>
  );
}
