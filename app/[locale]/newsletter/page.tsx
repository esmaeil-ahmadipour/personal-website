// app/[locale]/newsletter/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { IssueRow } from "@/features/newsletter/components/IssueRow";
import {
  LINKEDIN_NEWSLETTER_URL,
  groupIssuesByYear,
} from "@/features/newsletter/data/issues";

const SITE_URL = "https://tarvix.org";
const LOCALES = ["en", "fa", "ar"];

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
  const years = groupIssuesByYear();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-bold">{t("nlArchiveTitle")}</h1>
        <p className="mt-3 text-[hsl(var(--text-secondary))]">{t("nlArchiveSub")}</p>
        <a
          href={LINKEDIN_NEWSLETTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[hsl(var(--accent))] px-5 text-sm font-semibold text-[hsl(var(--accent-ink))] transition-colors hover:bg-[hsl(var(--accent-hover))]"
        >
          {t("nlSubscribe")}
        </a>

        {years.map(({ year, issues }) => (
          <section key={year} className="mt-10">
            <h2 className="mb-3 text-xl font-bold text-[hsl(var(--text-muted))]">
              {year}
            </h2>
            <ul className="flex flex-col gap-3">
              {issues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} locale={locale} />
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
