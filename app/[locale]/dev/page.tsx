// app/[locale]/dev/page.tsx
import { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import DevPlatformPage from "./ClientDev";

// ============================================
// CONSTANTS
// ============================================
const SITE_URL = "https://tarvix.com";
const LOCALE_MAP = {
  en: "en_US",
  fa: "fa_IR",
  ar: "ar_SA",
};

// ============================================
// VIEWPORT
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
// METADATA - صفحه Dev
// ============================================
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "devPage" });

  const currentUrl =
    locale === "en"
      ? `${SITE_URL}/dev`
      : `${SITE_URL}/${locale}/dev`;

  const title = t("title");
  const description = t("description");
  const keywords = t("keywords").split(",").map((k: string) => k.trim());
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
        en: `${SITE_URL}/dev`,
        fa: `${SITE_URL}/fa/dev`,
        ar: `${SITE_URL}/ar/dev`,
        "x-default": `${SITE_URL}/dev`,
      },
    },

    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: companyName,
      images: [
        {
          url: `/og/dev-${locale}.jpg`,
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
      images: [`/og/dev-${locale}.jpg`],
    },

    category: "Technology",
    classification: "Software Development, Engineering Platform",
  };
}

// ============================================
// PAGE COMPONENT
// ============================================
export default function DevPage() {
  return <DevPlatformPage/>;
}