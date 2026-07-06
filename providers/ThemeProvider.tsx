// providers/ThemeProvider.tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode, useEffect, useState } from "react";
import Script from "next/script"; // اضافه کردن ایمپورت اسکریپت

export function ThemeProvider({ children }: { children: ReactNode }) {
  // این خط باعث می‌شود اسکریپت در سمت سرور رندر نشود تا خطا نخورید
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      {/* تزریق اسکریپت به صورت دستی برای جلوگیری از خطای Encountered a script tag */}
      <Script
        id="next-themes-script"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              const storedTheme = localStorage.getItem('theme');
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              const theme = storedTheme === 'system' || !storedTheme ? systemTheme : storedTheme;
              document.documentElement.classList.add(theme);
            } catch (e) {}
          `,
        }}
      />

      {/* خود کامپوننت نکست تم */}
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        {/* جلوگیری از رندر شدن محتوا قبل از لود شدن تم (جلوگیری از فلش سفید) */}
        {mounted && children}
      </NextThemesProvider>
    </>
  );
}
