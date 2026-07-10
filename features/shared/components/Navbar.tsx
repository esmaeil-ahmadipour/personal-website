// src/shared/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import Logo from "@/components/Logo";
import BrandName from "@/components/BrandName";
import PreferencesDialog from "@/components/PreferencesDialog";

import {
  HomeIcon,
  CapabilitiesIcon,
  WorkIcon,
  BlogIcon,
  TeamIcon,
  ContactIcon,
} from "../icons";

import { NavLinkItem, NavLinks } from "./NavLinks";

// تعریف تایپ برای آیتم‌های ناوبری
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
}

interface NavbarProps {
  variant?: "default" | "simple";
  showBack?: boolean;
  backUrl?: string;
  navItems?: NavItem[]; // ✅ لیست ورودی از صفحات
  activeSection?: string; // ✅ سکشن فعال از بیرون
  className?: string;
}

// پیش‌فرض برای ناوبری اصلی
export const DEFAULT_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "home",
    href: "#home",
    icon: <HomeIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "services",
    label: "capabilities",
    href: "#services",
    icon: <CapabilitiesIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "portfolio",
    label: "work",
    href: "#portfolio",
    icon: <WorkIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "blog",
    label: "blogBadge",
    href: "#blog",
    icon: <BlogIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "team",
    label: "team",
    href: "#team",
    icon: <TeamIcon className="w-4.5 h-4.5" />,
  },
  {
    id: "contact",
    label: "contact",
    href: "#contact",
    icon: <ContactIcon className="w-4.5 h-4.5" />,
  },
];

// ناوبری Dev
const DEV_NAV_ITEMS: NavItem[] = [
  // {
  //   id: "dev-dashboard",
  //   label: "Dashboard",
  //   href: "/dev",
  //   icon: <HomeIcon className="w-4.5 h-4.5" />,
  // },
  // {
  //   id: "dev-components",
  //   label: "Components",
  //   href: "/dev/components",
  //   icon: <CapabilitiesIcon className="w-4.5 h-4.5" />,
  // },
  // {
  //   id: "dev-docs",
  //   label: "Documentation",
  //   href: "/dev/docs",
  //   icon: <BlogIcon className="w-4.5 h-4.5" />,
  // },
  // {
  //   id: "dev-settings",
  //   label: "Settings",
  //   href: "/dev/settings",
  //   icon: <ContactIcon className="w-4.5 h-4.5" />,
  // },
];

export default function Navbar({
  variant = "default",
  showBack = false,
  backUrl = "/",
  navItems = DEFAULT_NAV_ITEMS,
  activeSection: externalActiveSection,
  className = "",
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, locale } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [internalActiveSection, setInternalActiveSection] =
    useState<string>("home");

  // تشخیص صفحه فعلی
  const isHomePage =
    pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
  const isDevPage = pathname?.includes("/dev");

  // انتخاب آیتم‌ها بر اساس صفحه
  const currentNavItems = navItems;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // تشخیص سکشن فعال (فقط در صفحه اصلی)
  useEffect(() => {
    if (!isHomePage || externalActiveSection) return;

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInternalActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -20% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [isHomePage, externalActiveSection]);

  const activeSection = externalActiveSection || internalActiveSection;

  useEffect(() => {
    if (!isMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  // تبدیل NavItem به NavLinkItem با اطلاعات فعال بودن
  const getNavLinkItems = (): NavLinkItem[] => {
    return currentNavItems.map((item) => ({
      ...item,
      isActive: activeSection === item.id || pathname === item.href,
      onClick: () => setIsMenuOpen(false),
    }));
  };

  const handleNavLinkClick = (item: NavLinkItem) => {
    setIsMenuOpen(false);
  };

  if (variant === "simple") {
    return (
      <>
        <nav
          className={`
            fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3
            transition-all duration-300
            ${
              isScrolled
                ? "bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]"
                : "bg-transparent"
            }
            ${className}
          `}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <Logo size="md" />
                <span className="text-lg font-bold gradient-text">Tarvix</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              {showBack && (
                <button
                  onClick={handleBack}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  ← {t("back")}
                </button>
              )}

              <button
                onClick={() => setIsPreferencesOpen(true)}
                className="
                  inline-flex items-center gap-2
                  px-3 py-2 rounded-xl
                  bg-[var(--bg-elevated)]/55
                  backdrop-blur-md
                  border border-[var(--border-subtle)]/35
                  hover:bg-[var(--bg-elevated)]/75
                  transition-colors
                "
                aria-label="Open display preferences"
              >
                <svg
                  className="w-4 h-4 text-[var(--text-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
                <span className="hidden sm:inline text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                  {locale === "en" ? "EN" : locale === "fa" ? "FA" : "AR"}
                </span>
              </button>
            </div>
          </div>
        </nav>

        <PreferencesDialog
          open={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3
          transition-all duration-300
          ${
            isScrolled || isMenuOpen
              ? "bg-[var(--bg-primary)]/75 backdrop-blur-xl border-b border-[var(--border-color)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
              : "bg-transparent"
          }
          ${className}
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size="md" />
              <BrandName />
            </Link>

            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="
                inline-flex items-center gap-1.5
                px-2.5 py-2 rounded-xl
                bg-[var(--bg-elevated)]/55
                backdrop-blur-md
                border border-[var(--border-subtle)]/35
                hover:bg-[var(--bg-elevated)]/75
                transition-colors
              "
              aria-label="Open display preferences"
            >
              <svg
                className="w-4 h-4 text-[var(--text-secondary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
              <span className="hidden md:inline text-[10px] font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                {locale === "en" ? "EN" : locale === "fa" ? "FA" : "AR"}
              </span>
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="p-2.5 rounded-xl bg-[var(--bg-elevated)]/55 backdrop-blur-md border border-[var(--border-subtle)]/35 hover:bg-[var(--bg-elevated)]/75 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="w-6 h-6 text-[var(--text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        onClick={() => setIsMenuOpen(false)}
        className={`
          fixed inset-0 z-40 transition-all duration-300
          ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto bg-black/25 backdrop-blur-sm"
              : "opacity-0 pointer-events-none"
          }
        `}
        aria-hidden="true"
      />

      <div
        id="mobile-menu"
        className={`
          fixed top-[72px] left-4 right-4 sm:left-8 sm:right-8 z-50
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-3 pointer-events-none"
          }
        `}
      >
        <div
          className="
            rounded-2xl
            border border-[var(--border-subtle)]/50
            bg-[var(--bg-surface)]/92
            supports-[backdrop-filter]:bg-[var(--bg-surface)]/80
            backdrop-blur-2xl
            shadow-2xl shadow-black/20
            ring-1 ring-white/5
            overflow-hidden
          "
        >
          <div className="p-3 sm:p-4 max-h-[calc(100vh-96px)] overflow-y-auto">
            {/* ✅ استفاده از NavLinks با لیست ورودی */}
            <NavLinks
              items={getNavLinkItems()}
              onItemClick={handleNavLinkClick}
            />

            <div className="border-t border-[var(--border-subtle)]/30 my-3" />

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 pt-1">
              <a
                href={isHomePage ? "#contact" : "/#contact"}
                onClick={() => setIsMenuOpen(false)}
                className="
                  inline-flex items-center justify-center
                  w-full sm:w-auto
                  sm:min-w-[180px]
                  px-4 py-3
                  rounded-xl
                  text-center
                  bg-gradient-to-r from-blue-500 to-purple-500
                  text-white text-sm font-semibold
                  hover:shadow-lg hover:shadow-blue-500/25
                  transition-all
                "
              >
                {t("startProject")}
              </a>

              <a
                href="/dev"
                onClick={() => setIsMenuOpen(false)}
                className="
                  inline-flex items-center justify-center
                  w-full sm:w-auto
                  sm:min-w-[200px]
                  px-4 py-3
                  rounded-xl
                  text-center
                  border border-[var(--border-subtle)]/50
                  bg-[var(--bg-elevated)]/35
                  text-[var(--text-secondary)]
                  text-sm font-medium
                  hover:text-[var(--text-primary)]
                  hover:border-[var(--text-secondary)]/40
                  hover:bg-[var(--bg-elevated)]/55
                  transition-colors
                "
              >
                {t("viewEngineeringSystem")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <PreferencesDialog
        open={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </>
  );
}
