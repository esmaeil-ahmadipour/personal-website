import { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import ClientHomePage from "./ClientHomePage";

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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ============================================
// METADATA - با ترجمه از فایل‌های JSON
// ============================================
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  // استفاده از getTranslations برای خواندن از فایل‌های JSON
  const t = await getTranslations({ locale, namespace: "homePage" });

  const currentUrl = locale === "en" ? `${SITE_URL}/` : `${SITE_URL}/${locale}`;

  const title = t("title") || "Tarvix | Architecture-First Engineering Studio";
  const description =
    t("description") ||
    "Tarvix helps growing engineering teams build scalable Flutter, Web, and Web3 products through modular architecture, engineering standards, and production-ready delivery.";
  const keywords =
    t("keywords")
      .split(",")
      .map((k: string) => k.trim()) ||
    "Flutter Development,Software Architecture,Engineering Consulting,Web3 Development,Product Engineering,Next.js Development,React Development,Engineering Studio";

  // نام شرکت برای JSON-LD
  const companyName = t("companyName") || "Tarvix";

  return {
    title,
    description,
    keywords,

    authors: [{ name: "Tarvix Team" }],
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
    classification: "Software Development, Engineering Platform",
  };
}

export default function HomePage() {
  return <ClientHomePage />;
}
