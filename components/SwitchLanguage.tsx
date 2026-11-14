// components/SwitchLanguage.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n/request";

const LABELS: Record<string, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  fa: { short: "فا", name: "فارسی" },
  ar: { short: "ع", name: "العربية" },
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.split("/")[1] || "en";

  const switchTo = (locale: string) => {
    if (locale === current) return;
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/") + window.location.search + window.location.hash);
  };

  return (
    <div
      role="group"
      aria-label="Language"
      dir="ltr"
      className="inline-flex overflow-hidden rounded-lg border border-[hsl(var(--border-strong))]"
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            aria-pressed={active}
            aria-label={LABELS[locale].name}
            lang={locale}
            className={`px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--accent))] ${
              active
                ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-ink))]"
                : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
            }`}
          >
            {LABELS[locale].short}
          </button>
        );
      })}
    </div>
  );
}
