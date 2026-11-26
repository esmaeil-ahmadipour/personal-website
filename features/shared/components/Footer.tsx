// features/shared/components/Footer.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { DEFAULT_NAV_ITEMS } from "./Navbar";

export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="site-w mt-24 flex flex-col gap-4 border-t border-[hsl(var(--border-subtle))] py-10 text-sm text-[hsl(var(--text-muted))] md:flex-row md:items-center md:justify-between">
      <p>{t("footerRights")}</p>
      <nav aria-label={t("navFooter")} className="flex flex-wrap gap-x-5 gap-y-2">
        {DEFAULT_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}${item.href}`}
            className="rounded-md transition-colors hover:text-[hsl(var(--text-primary))]"
          >
            {t(item.label)}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
