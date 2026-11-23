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
    `rounded-md px-1 py-1 text-[15px] transition-colors ${
      active
        ? "font-medium text-[hsl(var(--text-primary))]"
        : "text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
    }`;

  return (
    <header
      className={`header-glass sticky top-3 z-50 mx-3 mt-3 sm:mx-8 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={`/${locale}`}
            dir="ltr"
            className="rounded-md bg-[linear-gradient(90deg,var(--grad-from),var(--grad-to))] bg-clip-text text-[22px] font-bold leading-none text-transparent"
          >
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
        </div>

        <nav
          aria-label={t("navMain")}
          className="hidden items-center gap-7 md:flex"
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

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("navMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="btn-press inline-flex h-8 w-9 items-center justify-center rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated)/0.55)] text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--text-primary))] md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label={t("navMenu")}
          className="flex flex-col gap-1 border-t border-[hsl(var(--border-subtle))] px-5 py-3 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={withLocale(item.href)}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block py-1.5 ${linkClass(isActive(item.href))}`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
