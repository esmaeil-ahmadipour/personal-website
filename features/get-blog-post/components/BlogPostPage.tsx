// features/get-blog-post/components/BlogPostPage.tsx

import { cn } from "@/lib/utils";
import type { BlogPost } from "../types/get-blog-post.types";
import { BlogImageWithPlaceholder } from "@/components/BlogImageWithPlaceholder";

type Locale = "en" | "ar" | "fa";

interface BlogPostPageProps {
  post: BlogPost;
  locale: Locale;
}

// ============================================
// Helper: Get localized field from any object
// ============================================
function getLocalized<T extends Record<string, any>>(
  item: T,
  locale: Locale,
  enKey: keyof T,
  faKey: keyof T,
  arKey: keyof T
): any {
  if (locale === "fa") return item[faKey] ?? item[enKey];
  if (locale === "ar") return item[arKey] ?? item[enKey];
  return item[enKey];
}

// ============================================
// Helper: Get locale string for date formatting
// ============================================
function getLocaleString(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: "en-US",
    fa: "fa-IR",
    ar: "ar-SA",
  };
  return map[locale];
}

// ============================================
// Helper: Get localized label
// ============================================
function getLabel(locale: Locale, labels: Record<Locale, string>): string {
  return labels[locale];
}

// ============================================
// Prepare post data with all 3 languages
// ============================================
function preparePostData(post: BlogPost, locale: Locale) {
  const isRtl = locale === "fa" || locale === "ar";
  const isFa = locale === "fa";
  const isAr = locale === "ar";
  const isEn = locale === "en";

  // Get localized content
  const title = getLocalized(post, locale, "titleEn", "titleFa", "titleAr");
  const excerpt = getLocalized(post, locale, "excerptEn", "excerptFa", "excerptAr");
  const content = getLocalized(post, locale, "contentEn", "contentFa", "contentAr");

  // Author name
  const authorName = isEn
    ? `${post.author.firstNameEn} ${post.author.lastNameEn}`
    : isFa
    ? `${post.author.firstNameFa} ${post.author.lastNameFa}`
    : `${post.author.firstNameAr} ${post.author.lastNameAr}`;

  // Author bio
  const authorBio = getLocalized(post.author, locale, "bioEn", "bioFa", "bioAr");

  // Category name
  const categoryName = getLocalized(post.category, locale, "nameEn", "nameFa", "nameAr");

  // Tags - handle nested tag object
  const tags = post.tags.map((tag) => {
    // If tag has nested structure with 'tag' property
    const tagData = (tag as any).tag || tag;
    return getLocalized(tagData, locale, "nameEn", "nameFa", "nameAr");
  });

  // Date formatting
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(getLocaleString(locale), {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Localized labels
  const readingTimeLabel = getLabel(locale, {
    en: "min read",
    fa: "دقیقه مطالعه",
    ar: "دقيقة قراءة",
  });

  const viewsLabel = getLabel(locale, {
    en: "views",
    fa: "بازدید",
    ar: "مشاهدة",
  });

  const topicsLabel = getLabel(locale, {
    en: "Topics:",
    fa: "موضوعات:",
    ar: "المواضيع:",
  });

  return {
    title,
    excerpt,
    content,
    authorName,
    authorBio,
    categoryName,
    tags,
    publishedDate,
    readingTimeLabel,
    viewsLabel,
    topicsLabel,
    isRtl,
    isFa,
    isAr,
    isEn,
    hasExcerpt: !!(excerpt && excerpt.length > 0),
    hasTags: tags.length > 0,
    hasAuthorBio: !!(authorBio && authorBio.length > 0),
    hasAuthorAvatar: !!(post.author.avatarUrl && post.author.avatarUrl.length > 0),
    hasCoverImage: !!(post.coverImageUrl && post.coverImageUrl.length > 0),
    hasReadingTime: !!(post.readingTimeMin && post.readingTimeMin > 0),
    hasPublishedDate: !!(publishedDate && publishedDate.length > 0),
  };
}

// ============================================
// Main Component
// ============================================
export function BlogPostPage({ post, locale }: BlogPostPageProps) {
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
    readingTimeLabel,
    viewsLabel,
    topicsLabel,
    isRtl,
    isFa,
    isAr,
    hasExcerpt,
    hasTags,
    hasAuthorBio,
    hasAuthorAvatar,
    hasCoverImage,
    hasReadingTime,
    hasPublishedDate,
  } = data;

  // ============================================
  // JSON-LD (Schema.org) with language support
  // ============================================
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt || title,
    image: post.coverImageUrl || "https://tarvix.org/images/default-blog-cover.webp",
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
    inLanguage: isAr ? "ar" : isFa ? "fa" : "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "container py-8 md:py-16 max-w-4xl mx-auto space-y-8",
          isRtl && "font-vazir",
        )}
      >
        {/* ===== HEADER ===== */}
        <header className="space-y-4">
          <h1
            className={cn(
              "text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-foreground",
              isAr && "font-vazir"
            )}
          >
            {title}
          </h1>

          {/* Meta info */}
          <div
            className={cn(
              "flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground",
              isRtl && "flex-row-reverse"
            )}
          >
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
                {post.readingTimeMin} {readingTimeLabel}
              </span>
            )}

            <span className="flex items-center">
              <span className="opacity-40 mx-1">•</span>
              {post.views} {viewsLabel}
            </span>
          </div>

          {/* Excerpt */}
          {hasExcerpt && (
            <p
              className={cn(
                "text-xl md:text-2xl text-muted-foreground/80 leading-relaxed font-light mt-4 max-w-3xl",
                isRtl && "text-right"
              )}
            >
              {excerpt}
            </p>
          )}

          {/* Author */}
          <div
            className={cn(
              "flex items-center gap-3 pt-4",
              isRtl && "flex-row-reverse"
            )}
          >
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

        {/* ===== COVER IMAGE ===== */}
        {hasCoverImage && (
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
        )}

        {/* ===== CONTENT BODY ===== */}
        <main
          className={cn(
            "prose prose-neutral dark:prose-invert max-w-none leading-relaxed",
            "blog-content",
            isRtl && "blog-content-fa",
            isAr && "font-vazir"
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* ===== FOOTER ===== */}
        <footer className="pt-12 border-t border-border/60 space-y-8">
          {/* Tags */}
          {hasTags && (
            <div
              className={cn(
                "flex flex-wrap items-center gap-2",
                isRtl && "flex-row-reverse"
              )}
            >
              <span className="text-sm font-medium text-muted-foreground mr-1">
                {topicsLabel}
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

          {/* Author Bio */}
          {hasAuthorBio && (
            <section className="p-6 rounded-xl bg-muted/30 border border-border/60">
              <div
                className={cn(
                  "flex items-start gap-4",
                  isRtl && "flex-row-reverse"
                )}
              >
                {hasAuthorAvatar && (
                  <BlogImageWithPlaceholder
                    src={post.author.avatarUrl}
                    alt={authorName}
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    fill={false}
                    width={48}
                    height={48}
                  />
                )}
                <div className={cn("space-y-1", isRtl && "text-right")}>
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