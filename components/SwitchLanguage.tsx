// components/SwitchLanguage.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { locales } from "@/i18n/request";

const LABELS: Record<string, { short: string; name: string }> = {
  en: { short: "EN", name: "English" },
  fa: { short: "FA", name: "فارسی" },
  ar: { short: "AR", name: "العربية" },
};

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
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
      aria-label={t("langSwitch")}
      dir="ltr"
      className="inline-flex overflow-hidden rounded-full border border-[hsl(var(--border-subtle))] text-[13px]"
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
            className={`btn-press px-3 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[hsl(var(--focus-ring))] ${
              active
                ? "bg-[linear-gradient(90deg,var(--grad-from-hover),var(--grad-to-hover))] text-[hsl(var(--ink-light))]"
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
