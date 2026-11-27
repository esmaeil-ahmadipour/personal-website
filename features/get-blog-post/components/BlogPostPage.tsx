// features/get-blog-post/components/BlogPostPage.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { Notice } from "@/components/ui/Notice";
import { PostRow } from "@/features/blog-list/components/PostRow";
import type { BlogPost } from "../types/get-blog-post.types";
import type { RelatedPost } from "../data/related";
import { prepareContent } from "../lib/prepare-content";
import { ArticleBody } from "./ArticleBody";
import { ArticleToc } from "./ArticleToc";
import { AuthorAvatar } from "./AuthorAvatar";

type Locale = "en" | "fa" | "ar";

interface BlogPostPageProps {
  post: BlogPost;
  locale: Locale;
  related?: RelatedPost[];
}

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", fa: "fa-IR", ar: "ar-SA" };
const SITE_URL = "https://tarvix.org";
const SECTION = "border-b border-[hsl(var(--border-subtle))] py-10 sm:py-16";
const KICKER =
  "text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]";

function pick<T>(locale: Locale, en: T, fa: T, ar: T): T {
  return locale === "ar" ? ar || en : locale === "fa" ? fa || en : en;
}

export async function BlogPostPage({ post, locale, related = [] }: BlogPostPageProps) {
  const t = await getTranslations({ locale });

  // Is there a real translation, or are we showing the English fallback?
  const translated =
    locale === "en" ||
    (locale === "fa" ? !!(post.titleFa && post.contentFa) : !!(post.titleAr && post.contentAr));
  const bodyLocale: Locale = translated ? locale : "en";
  const bodyDir = bodyLocale === "en" ? "ltr" : "rtl";

  const title = pick(bodyLocale, post.titleEn, post.titleFa, post.titleAr);
  const excerpt = pick(bodyLocale, post.excerptEn, post.excerptFa, post.excerptAr);
  const content = pick(bodyLocale, post.contentEn, post.contentFa, post.contentAr);
  const category = pick(locale, post.category.nameEn, post.category.nameFa, post.category.nameAr);
  const authorName = pick(
    locale,
    `${post.author.firstNameEn} ${post.author.lastNameEn}`,
    `${post.author.firstNameFa} ${post.author.lastNameFa}`,
    `${post.author.firstNameAr} ${post.author.lastNameAr}`,
  );

  const { html, toc } = prepareContent(content ?? "");
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(DATE_LOCALE[locale], {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const url = `${SITE_URL}/${locale}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt || undefined,
    inLanguage: bodyLocale,
    image: post.coverImageUrl || `${SITE_URL}/images/default-blog-cover.webp`,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: { "@type": "Person", name: authorName },
    mainEntityOfPage: url,
  };

  const hasToc = toc.length >= 2;

  const readingTime = post.readingTimeMin ? t("hmMin", { n: post.readingTimeMin }) : null;
  const initials = [post.author.firstNameEn, post.author.lastNameEn]
    .map((name) => name?.trim().charAt(0) ?? "")
    .join("")
    .toUpperCase();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="site-w">
        <article>
          <header className={`hx-header ${SECTION}`}>
            <HeaderArt variant="article" />
            <Link
              href={`/${locale}/blog`}
              className="rounded-md text-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
            >
              <span aria-hidden className="rtl-flip inline-block">←</span> {t("navBlog")}
            </Link>
            <p className={`${KICKER} mt-6`}>
              {[category, readingTime].filter(Boolean).join(" · ")}
            </p>
            <h1
              className="my-4 max-w-[800px] text-4xl font-extrabold sm:text-[56px] sm:leading-[1.08]"
              lang={bodyLocale}
              dir={bodyDir}
            >
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <AuthorAvatar src={post.author.avatarUrl} initials={initials} />
              <div>
                <p className="text-[hsl(var(--text-primary))]">{authorName.trim()}</p>
                {date && <p className="text-sm text-[hsl(var(--text-muted))]">{date}</p>}
              </div>
            </div>
            {!translated && <Notice className="mt-4">{t("apOnlyEn")}</Notice>}
          </header>

          <div className={SECTION}>
            <CoverMedia
              src={post.coverImageUrl}
              alt={title}
              priority
              sizes="(max-width: 1120px) 100vw, 1040px"
              className="h-[240px] w-full rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] sm:h-[420px]"
            />
          </div>

          <div
            className={`${SECTION} grid grid-cols-1 gap-8 ${hasToc ? "lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-16" : ""}`}
          >
            {hasToc && (
              <details className="rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] p-4 lg:hidden">
                <summary className="cursor-pointer text-sm font-semibold">{t("apToc")}</summary>
                <div className="mt-3">
                  <ArticleToc items={toc} title={t("apToc")} />
                </div>
              </details>
            )}

            <div className="w-full min-w-0 max-w-[680px]">
              <ArticleBody
                html={html}
                lang={bodyLocale}
                dir={bodyDir}
                copyLabel={t("apCopy")}
                copiedLabel={t("apCopied")}
              />
            </div>

            {hasToc && (
              <aside className="hidden self-start lg:sticky lg:top-6 lg:block">
                <ArticleToc items={toc} title={t("apToc")} />
              </aside>
            )}
          </div>
        </article>

        {related.length > 0 && (
          <section className="pt-10 sm:pt-16">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className={`${KICKER} !text-[13px]`}>{t("apKeepReading")}</h2>
              <Link href={`/${locale}/blog`} className="text-[hsl(var(--accent-blue))]">
                {t("apAllWriting")} <span aria-hidden className="rtl-flip inline-block">→</span>
              </Link>
            </div>
            <ul>
              {related.map((p) => (
                <li key={p.id}>
                  <PostRow
                    href={`/${locale}/blog/${p.slug}`}
                    number={p.number}
                    title={p.title}
                    meta={[
                      p.category.name,
                      p.readingTimeMin ? t("hmMin", { n: p.readingTimeMin }) : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}