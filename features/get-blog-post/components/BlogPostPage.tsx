// features/get-blog-post/components/BlogPostPage.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { Notice } from "@/components/ui/Notice";
import { Poster } from "@/components/ui/Poster";
import { SectionHead } from "@/components/ui/SectionHead";
import { PostCard } from "@/features/home/components/PostCard";
import type { BlogPost } from "../types/get-blog-post.types";
import type { RelatedPost } from "../data/related";
import { prepareContent } from "../lib/prepare-content";
import { ArticleBody } from "./ArticleBody";
import { ArticleToc } from "./ArticleToc";

type Locale = "en" | "fa" | "ar";

interface BlogPostPageProps {
  post: BlogPost;
  locale: Locale;
  related?: RelatedPost[];
}

const DATE_LOCALE: Record<Locale, string> = { en: "en-US", fa: "fa-IR", ar: "ar-SA" };
const SITE_URL = "https://tarvix.org";

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

  const meta = [
    date,
    post.readingTimeMin ? t("hmMin", { n: post.readingTimeMin }) : null,
    authorName.trim(),
  ].filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Link
          href={`/${locale}/blog`}
          className="mb-2 mt-9 inline-block rounded-md text-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
        >
          <span aria-hidden className="rtl-flip inline-block">←</span> {t("navBack")}
        </Link>
      </div>

      <article className="mx-auto max-w-[1000px] px-4 sm:px-8">
        <header>
          <Link href={`/${locale}/blog`} className="inline-block rounded-full">
            <Badge accent={0}>{category}</Badge>
          </Link>
          <h1
            className="animate-fade-up my-[18px] text-3xl sm:text-5xl lg:text-[52px]"
            lang={bodyLocale}
            dir={bodyDir}
          >
            {title}
          </h1>
          <p className="text-sm text-[hsl(var(--text-muted))]">{meta.join(" · ")}</p>

          {!translated && <Notice className="my-3.5">{t("apOnlyEn")}</Notice>}
        </header>

        <div className="mt-4">
          {post.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImageUrl}
              alt={title}
              className="aspect-video w-full rounded-[20px] border border-[hsl(var(--border-subtle))] object-cover"
            />
          ) : (
            <Poster
              aria-hidden
              index={title.length}
              height={280}
              className="rounded-[20px] text-3xl sm:text-4xl"
            >
              {title}
            </Poster>
          )}
        </div>

        <div
          className={`mt-10 grid gap-14 ${hasToc ? "lg:grid-cols-[220px_minmax(0,1fr)]" : ""}`}
        >
          {hasToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ArticleToc items={toc} title={t("apToc")} />
              </div>
            </aside>
          )}

          <div className={`min-w-0 ${hasToc ? "" : "mx-auto w-full max-w-[724px]"}`}>
            {hasToc && (
            <details className="card mb-8 p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">{t("apToc")}</summary>
              <div className="mt-3">
                <ArticleToc items={toc} title={t("apToc")} />
              </div>
            </details>
            )}

            <ArticleBody
              html={html}
              lang={bodyLocale}
              dir={bodyDir}
              copyLabel={t("apCopy")}
              copiedLabel={t("apCopied")}
            />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
          <SectionHead title={t("apRelated")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <PostCard key={p.id} post={p} locale={locale} index={i + 1} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}