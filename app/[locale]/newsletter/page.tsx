// app/[locale]/newsletter/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/ButtonLink";
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
      <main>
        <PageHero title={t("nlArchiveTitle")} sub={t("nlArchiveSub")}>
          <ButtonLink href={LINKEDIN_NEWSLETTER_URL} external>
            {t("nlSubscribe")}
          </ButtonLink>
        </PageHero>

        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-8">
          {years.map(({ year, issues }) => (
            <section key={year} aria-labelledby={`year-${year}`}>
              <h2
                id={`year-${year}`}
                className="mb-4 mt-9 text-[26px] text-[hsl(var(--accent-text))]"
              >
                {year}
              </h2>
              <ul className="flex flex-col gap-3.5">
                {issues.map((issue, i) => (
                  <IssueRow key={issue.number} issue={issue} locale={locale} index={i} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
