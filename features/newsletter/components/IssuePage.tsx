// features/newsletter/components/IssuePage.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { Notice } from "@/components/ui/Notice";
import { ArticleBody } from "@/features/get-blog-post/components/ArticleBody";
import { ArticleToc } from "@/features/get-blog-post/components/ArticleToc";
import { AuthorAvatar } from "@/features/get-blog-post/components/AuthorAvatar";
import { prepareContent } from "@/features/get-blog-post/lib/prepare-content";
import { LINKEDIN_NEWSLETTER_URL } from "../config";
import { formatIssueMonth } from "../lib/format";
import type { IssueDetail } from "../services/newsletter.service";

type Locale = "en" | "fa" | "ar";

const SITE_URL = "https://tarvix.org";
const SECTION = "border-b border-[hsl(var(--border-subtle))] py-10 sm:py-16";
const KICKER =
  "text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]";

function pick<T>(locale: Locale, en: T, fa: T, ar: T): T {
  return locale === "ar" ? ar || en : locale === "fa" ? fa || en : en;
}

export async function IssuePage({ issue, locale }: { issue: IssueDetail; locale: Locale }) {
  const t = await getTranslations({ locale });

  // Is there a real translation, or are we showing the English fallback?
  const translated =
    locale === "en" ||
    (locale === "fa" ? !!(issue.titleFa && issue.contentFa) : !!(issue.titleAr && issue.contentAr));
  const bodyLocale: Locale = translated ? locale : "en";
  const bodyDir = bodyLocale === "en" ? "ltr" : "rtl";

  const title = pick(bodyLocale, issue.titleEn, issue.titleFa, issue.titleAr);
  const excerpt = pick(bodyLocale, issue.excerptEn, issue.excerptFa, issue.excerptAr);
  const content = pick(bodyLocale, issue.contentEn, issue.contentFa, issue.contentAr);
  const { author } = issue;
  const authorName = pick(
    locale,
    `${author.firstNameEn} ${author.lastNameEn}`,
    `${author.firstNameFa} ${author.lastNameFa}`,
    `${author.firstNameAr} ${author.lastNameAr}`,
  ).trim();
  const initials = [author.firstNameEn, author.lastNameEn]
    .map((name) => name?.trim().charAt(0) ?? "")
    .join("")
    .toUpperCase();

  const { html, toc } = prepareContent(content);
  const hasToc = toc.length >= 2;
  const meta = [
    formatIssueMonth(issue.publishedAt, locale),
    issue.readingTimeMin ? t("hmMin", { n: issue.readingTimeMin }) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const url = `${SITE_URL}/${locale}/newsletter/${issue.number}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt || undefined,
    inLanguage: bodyLocale,
    image: issue.coverImageUrl || undefined,
    datePublished: issue.publishedAt.toISOString(),
    dateModified: issue.updatedAt.toISOString(),
    author: { "@type": "Person", name: authorName },
    mainEntityOfPage: url,
    sameAs: issue.linkedinUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="site-w">
        <article>
          <header className={`hx-header ${SECTION}`}>
            <HeaderArt variant="issue" number={issue.number} />
            <Link
              href={`/${locale}/newsletter`}
              className="rounded-md text-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
            >
              <span aria-hidden className="rtl-flip inline-block">←</span> {t("nlArchiveTitle")}
            </Link>
            <p className={`${KICKER} mt-6 !text-[hsl(var(--accent-blue))]`}>
              {t("nlIssue")} #{issue.number}
            </p>
            <h1
              className="my-4 max-w-[800px] text-4xl font-extrabold sm:text-[56px] sm:leading-[1.08]"
              lang={bodyLocale}
              dir={bodyDir}
            >
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <AuthorAvatar src={author.avatarUrl} initials={initials} />
              <div>
                <p className="text-[hsl(var(--text-primary))]">{authorName}</p>
                <p className="text-sm text-[hsl(var(--text-muted))]">{meta}</p>
              </div>
            </div>
            {!translated && <Notice className="mt-4">{t("apOnlyEn")}</Notice>}
            <p className="mb-3 mt-8 text-sm text-[hsl(var(--text-muted))]">{t("nlOriginally")}</p>
            <ButtonLink href={issue.linkedinUrl} external variant="ghost">
              {t("nlViewOriginal")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </ButtonLink>
          </header>

          <div className={SECTION}>
            <CoverMedia
              src={issue.coverImageUrl}
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

        <section className={SECTION}>
          <div className="rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] p-6 sm:p-10">
            <h2 className="m-0 text-2xl font-bold">{t("nlEnjoyed")}</h2>
            <p className="mb-6 mt-2 text-[hsl(var(--text-secondary))]">{t("nlFollowCta")}</p>
            <ButtonLink href={LINKEDIN_NEWSLETTER_URL} external>
              {t("nlFollowShort")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </ButtonLink>
          </div>
        </section>

        <nav aria-label={t("nlArchiveTitle")} className="flex justify-between gap-4 py-10 sm:py-16">
          {issue.previous !== null ? (
            <Link
              href={`/${locale}/newsletter/${issue.previous}`}
              className="text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--accent-blue))]"
            >
              <span aria-hidden className="rtl-flip inline-block">←</span> {t("nlPrev")}
            </Link>
          ) : (
            <span />
          )}
          {issue.next !== null ? (
            <Link
              href={`/${locale}/newsletter/${issue.next}`}
              className="text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--accent-blue))]"
            >
              {t("nlNext")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </>
  );
}
