// features/shared/components/Footer.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { DEFAULT_NAV_ITEMS } from "./Navbar";

export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="mt-16 border-t border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 font-bold text-[hsl(var(--text-primary))]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-md bg-[hsl(var(--accent))] text-sm text-[hsl(var(--accent-ink))]"
            >
              T
            </span>
            Tarvix
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--text-muted))]">
            {t("footerTagline")}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {DEFAULT_NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.href}`}
              className="text-sm text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--accent))]"
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-[hsl(var(--border-subtle))]">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-[hsl(var(--text-muted))] sm:px-6">
          {t("footerRights")}
        </p>
      </div>
    </footer>
  );
}
