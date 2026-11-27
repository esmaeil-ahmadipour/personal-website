// app/[locale]/newsletter/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Notice } from "@/components/ui/Notice";
import { IssueRow } from "@/features/newsletter/components/IssueRow";
import { LINKEDIN_NEWSLETTER_URL } from "@/features/newsletter/config";
import {
  getPublishedIssues,
  groupIssuesByYear,
} from "@/features/newsletter/services/newsletter.service";

const SITE_URL = "https://tarvix.org";
const LOCALES = ["en", "fa", "ar"];
const SECTION = "border-b border-[hsl(var(--border-subtle))] py-10 sm:py-16";
const KICKER =
  "text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const path = (l: string) => `${SITE_URL}/${l}/newsletter`;
  return {
    title: t("nlArchiveTitle"),
    description: t("nlArchiveSub"),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(LOCALES.map((l) => [l, path(l)])),
    },
  };
}

export default async function NewsletterPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const issues = await getPublishedIssues(locale);
  const years = groupIssuesByYear(issues);

  return (
    <>
      <Navbar />
      <main className="site-w">
        <header className={`hx-header ${SECTION}`}>
          <HeaderArt variant="newsletter" number={issues[0]?.number} />
          <p className={KICKER}>{t("navNewsletter")}</p>
          <h1 className="my-4 text-4xl font-extrabold sm:text-[56px] sm:leading-[1.08]">
            {t("nlHeadline")}
          </h1>
          <p className="max-w-[640px] text-lg">{t("nlArchiveSub")}</p>
        </header>

        <section className={SECTION}>
          <div className="rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] p-6 sm:p-10">
            <h2 className={KICKER}>{t("nlGetNew")}</h2>
            <p className="mb-6 mt-3 text-[22px] text-[hsl(var(--text-secondary))]">
              {t("nlPublishedOn")}
            </p>
            <ButtonLink href={LINKEDIN_NEWSLETTER_URL} external>
              {t("nlFollowNewsletter")} <span aria-hidden className="rtl-flip inline-block">→</span>
            </ButtonLink>
          </div>
        </section>

        <section className="py-10 sm:py-16" aria-labelledby="archive-heading">
          <h2 id="archive-heading" className={KICKER}>
            {t("nlArchiveLabel")}
          </h2>
          {years.length === 0 && <Notice className="mt-6">{t("nlEmpty")}</Notice>}
          {years.map(({ year, issues: yearIssues }) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <h3 id={`year-${year}`} className={`${KICKER} mb-1 mt-8`} dir="ltr">
                {year}
              </h3>
              <ul>
                {yearIssues.map((issue, i) => (
                  <IssueRow key={issue.number} issue={issue} locale={locale} index={i} />
                ))}
              </ul>
            </section>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
