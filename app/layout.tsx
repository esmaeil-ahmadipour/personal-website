// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DirectionProvider } from "@/providers/DirectionProvider";
import Script from "next/script";
import { headers } from "next/headers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tarvix | Architecture-First Engineering Studio",
  description:
    "Engineering systems for fintech, Web3, and SaaS products. Clean architecture, scalable foundations.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // تشخیص زبان از هدرها (برای SSR)
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "";
  const isPersian =
    acceptLanguage.includes("fa") || acceptLanguage.includes("ar");

  // اگر از مسیر استفاده می‌کنید (مثلاً /fa/about)
  // می‌تونید از pathname هم استفاده کنید
  // const pathname = headersList.get("x-pathname") || "";

  return (
    <html
      lang={isPersian ? "fa" : "en"}
      dir={isPersian ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('tarvix_theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = saved || (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.add(theme);
                  document.documentElement.style.backgroundColor = theme === 'dark' ? '#0a0a0f' : '#f8fafc';
                } catch (e) {}
              })();
            `,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <div className="fixed inset-0 -z-10 animate-mesh pointer-events-none" />
        <DirectionProvider>{children}</DirectionProvider>
      </body>
    </html>
  );
}
