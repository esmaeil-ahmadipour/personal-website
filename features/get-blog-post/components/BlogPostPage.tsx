// features/get-blog-post/components/BlogPostPage.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Poster } from "@/components/ui/Poster";
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

      <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <header className="max-w-3xl">
          <Link
            href={`/${locale}/blog`}
            className="inline-block rounded-full bg-[hsl(var(--accent-soft))] px-3 py-1 text-xs font-semibold text-[hsl(var(--accent))]"
          >
            {category}
          </Link>
          <h1
            className="mt-4 text-3xl font-bold leading-tight sm:text-5xl"
            lang={bodyLocale}
            dir={bodyDir}
          >
            {title}
          </h1>
          <p className="mt-4 text-sm text-[hsl(var(--text-muted))]">
            {meta.join(" · ")}
          </p>

          {!translated && (
            <p
              role="note"
              className="mt-5 rounded-lg border border-[hsl(var(--accent)/0.5)] bg-[hsl(var(--accent-soft))] px-4 py-3 text-sm text-[hsl(var(--text-primary))]"
            >
              {t("apOnlyEn")}
            </p>
          )}
        </header>

        <div className="mt-8 max-w-3xl">
          {post.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.coverImageUrl}
              alt={title}
              className="aspect-video w-full rounded-lg border border-[hsl(var(--border-subtle))] object-cover"
            />
          ) : (
            <Poster index={title.length} className="text-3xl">
              {title}
            </Poster>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 max-w-3xl">
            <details className="card mb-8 p-4 lg:hidden">
              <summary className="cursor-pointer text-sm font-semibold">{t("apToc")}</summary>
              <div className="mt-3">
                <ArticleToc items={toc} title={t("apToc")} />
              </div>
            </details>

            <ArticleBody
              html={html}
              lang={bodyLocale}
              dir={bodyDir}
              copyLabel={t("apCopy")}
              copiedLabel={t("apCopied")}
            />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <ArticleToc items={toc} title={t("apToc")} />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-[hsl(var(--border-subtle))] pt-10">
            <h2 className="mb-6 text-2xl font-bold">{t("apRelated")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <PostCard key={p.id} post={p} locale={locale} index={i + 1} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}