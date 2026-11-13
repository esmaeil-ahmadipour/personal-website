// مسیر: app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Vazirmatn } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/request";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

// ============================================
// 🔤 فونت‌ها
// ============================================
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grotesk",
  weight: ["500", "700"],
});

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-vazir",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Tarvix | Architecture-First Engineering Studio",
  description:
    "Engineering systems for fintech, Web3, and SaaS products. Clean architecture, scalable foundations.",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // ✅ اعتبارسنجی locale
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  // ✅ تشخیص RTL بودن
  const isRTL = locale === "fa" || locale === "ar";

  // ✅ دریافت ترجمه‌ها
  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${inter.variable} ${grotesk.variable} ${vazir.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body
        className="antialiased"
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
