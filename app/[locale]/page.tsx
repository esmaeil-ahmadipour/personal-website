import { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { HomeHero } from "@/features/home/components/HomeHero";
import { HomePosts } from "@/features/home/components/HomePosts";
import { ProjectsSection } from "@/features/projects/components/ProjectsSection";
import { FeedbackSection } from "@/features/contact/components/FeedbackSection";
import { NewsletterSection } from "@/features/newsletter/components/NewsletterSection";

// ============================================
// CONSTANTS
// ============================================
const SITE_URL = "https://tarvix.org";
const LOCALE_MAP = {
  en: "en_US",
  fa: "fa_IR",
  ar: "ar_SA",
};

// ============================================
// VIEWPORT - جدا از metadata (Next.js 15+)
// ============================================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#101218" },
  ],
};

// ============================================
// METADATA - با ترجمه از فایل‌های JSON
// ============================================
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // استفاده از getTranslations برای خواندن از فایل‌های JSON
  const t = await getTranslations({ locale, namespace: "homePage" });

  const currentUrl = locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

  const title = t("title") || "Tarvix | Engineering notes by Esmaeil Ahmadipour";
  const description =
    t("description") ||
    "A personal technical publication: articles, a LinkedIn newsletter and free lessons for software engineers.";
  const keywords =
    t("keywords")
      .split(",")
      .map((k: string) => k.trim()) ||
    "Software Engineering,Mobile Development,Cross-Platform,Fintech,Digital Assets,Technical Education,Newsletter";

  // نام شرکت برای JSON-LD
  const companyName = t("companyName") || "Tarvix";

  return {
    title,
    description,
    keywords,

    authors: [{ name: "Esmaeil Ahmadipour" }],
    creator: "Tarvix",
    publisher: "Tarvix",

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    metadataBase: new URL(SITE_URL),

    alternates: {
      canonical: currentUrl,
      languages: {
        en: `${SITE_URL}/`,
        fa: `${SITE_URL}/fa`,
        ar: `${SITE_URL}/ar`,
        "x-default": `${SITE_URL}/`,
      },
    },

    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: companyName,
      images: [
        {
          url: `/og/home-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/home-${locale}.jpg`],
    },

    // سایر
    category: "Technology",
    classification: "Software Engineering, Technical Publication",
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = (["en", "fa", "ar"].includes(raw) ? raw : "en") as
    | "en"
    | "fa"
    | "ar";
  const t = await getTranslations({ locale });
  const url = locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tarvix",
    url,
    description: t("hmSub"),
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <HomeHero locale={locale} />
        <HomePosts locale={locale} />
        <NewsletterSection locale={locale} />
        <ProjectsSection locale={locale} />
        <FeedbackSection locale={locale} />
      </main>
      <Footer />
    </>
  );
}
