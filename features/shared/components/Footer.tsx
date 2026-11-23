// features/shared/components/Footer.tsx
"use client";

import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { DEFAULT_NAV_ITEMS } from "./Navbar";

export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="mx-auto mt-24 max-w-7xl border-t border-[hsl(var(--border-subtle))] px-4 py-9 text-sm text-[hsl(var(--text-muted))] sm:px-8">
      <div className="flex flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <Link
            href={`/${locale}`}
            dir="ltr"
            className="inline-block rounded-md bg-[linear-gradient(90deg,var(--grad-from),var(--grad-to))] bg-clip-text text-[22px] font-bold leading-none text-transparent"
          >
            Tarvix
          </Link>
          <p className="mt-2 max-w-[340px]">{t("footerTagline")}</p>
        </div>

        <div className="flex flex-col gap-3 md:items-end md:text-end">
          <nav
            aria-label={t("navFooter")}
            className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end"
          >
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
          <p>{t("footerRights")}</p>
        </div>
      </div>
    </footer>
  );
}
