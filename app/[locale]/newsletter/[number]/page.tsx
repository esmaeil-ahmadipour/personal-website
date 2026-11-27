// app/[locale]/newsletter/[number]/page.tsx
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { IssuePage } from "@/features/newsletter/components/IssuePage";
import { getIssueByNumber } from "@/features/newsletter/services/newsletter.service";

type Locale = "en" | "fa" | "ar";
type Props = { params: Promise<{ locale: Locale; number: string }> };

const SITE_URL = "https://tarvix.org";
const LOCALES: Locale[] = ["en", "fa", "ar"];
/** Postgres Int upper bound; anything larger can never match a stored number. */
const MAX_NUMBER = 2_147_483_647;

/** Parses the URL segment; null for anything that is not a positive whole number. */
function parseNumber(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 && n <= MAX_NUMBER ? n : null;
}

// Shared by generateMetadata and the page so one request runs one query.
const loadIssue = cache(async (value: string) => {
  const n = parseNumber(value);
  return n === null ? null : getIssueByNumber(n);
});

const pick = (locale: Locale, en: string, fa: string, ar: string) =>
  locale === "ar" ? ar || en : locale === "fa" ? fa || en : en;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, number } = await params;
  const issue = await loadIssue(number);
  if (!issue) return {};

  const translated =
    locale === "en" ||
    (locale === "fa" ? !!(issue.titleFa && issue.contentFa) : !!(issue.titleAr && issue.contentAr));
  const l = translated ? locale : "en";
  const title = pick(l, issue.titleEn, issue.titleFa, issue.titleAr);
  const description = pick(l, issue.excerptEn, issue.excerptFa, issue.excerptAr) || undefined;
  const path = (code: string) => `${SITE_URL}/${code}/newsletter/${issue.number}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: path(locale),
      siteName: "Tarvix",
      type: "article",
      publishedTime: issue.publishedAt.toISOString(),
      ...(issue.coverImageUrl ? { images: [{ url: issue.coverImageUrl }] } : {}),
    },
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(LOCALES.map((code) => [code, path(code)])),
    },
  };
}

export default async function NewsletterIssuePage({ params }: Props) {
  const { locale, number } = await params;
  const issue = await loadIssue(number);
  if (!issue) notFound();

  return (
    <>
      <Navbar />
      <main>
        <IssuePage issue={issue} locale={locale} />
      </main>
      <Footer />
    </>
  );
}
