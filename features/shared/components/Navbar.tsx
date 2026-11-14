// features/shared/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import LanguageSwitcher from "@/components/SwitchLanguage";
import { ThemeSwitcher } from "./ThemeSwitcher";

// Kept for backward compatibility with features/shared/components/index.ts
export interface NavItem {
  id: string;
  label: string; // translation key
  href: string; // path without locale prefix
  icon?: ReactNode;
}

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: "blog", label: "navBlog", href: "/blog" },
  { id: "newsletter", label: "navNewsletter", href: "/newsletter" },
  { id: "projects", label: "navProjects", href: "/projects" },
  { id: "feedback", label: "navFeedback", href: "/#feedback" },
];

interface NavbarProps {
  /** Shows a back link next to the logo. */
  showBack?: boolean;
  backUrl?: string;
  navItems?: NavItem[];
  className?: string;
  // Legacy props, accepted and ignored so existing pages keep compiling.
  variant?: "default" | "simple";
  activeSection?: string;
}

export default function Navbar({
  showBack = false,
  backUrl,
  navItems = DEFAULT_NAV_ITEMS,
  className = "",
}: NavbarProps) {
  const pathname = usePathname();
  const { t, locale, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);

  const withLocale = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const isActive = (href: string) =>
    !href.includes("#") && pathname.startsWith(withLocale(href));

  const linkClass = (active: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      active
        ? "text-[hsl(var(--accent))]"
        : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
    }`;

  return (
    <header
      className={`header-glass sticky top-0 z-50 ${className}`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
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

        {showBack && (
          <Link
            href={backUrl ?? `/${locale}`}
            className="text-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
          >
            <span aria-hidden className={isRTL ? "inline-block rotate-180" : ""}>
              ←
            </span>{" "}
            {t("navBack")}
          </Link>
        )}

        <nav
          aria-label="Main"
          className="ms-auto hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={withLocale(item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={linkClass(isActive(item.href))}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-3">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("navMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-8 w-9 items-center justify-center rounded-lg border border-[hsl(var(--border-strong))] text-[hsl(var(--text-secondary))] md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="border-t border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-primary))] px-4 py-2 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={withLocale(item.href)}
              onClick={() => setOpen(false)}
              className={`block ${linkClass(isActive(item.href))}`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
