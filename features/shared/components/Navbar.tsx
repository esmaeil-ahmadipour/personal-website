"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import Logo from "@/components/Logo";
import PreferencesDialog from "@/components/PreferencesDialog";
import BrandName from "@/components/BrandName";

interface NavbarProps {
  variant?: "default" | "simple";
  showBack?: boolean;
  backUrl?: string;
}

type NavIconKey =
  | "home"
  | "capabilities"
  | "work"
  | "blog"
  | "team"
  | "contact";

function NavIcon({
  name,
  className = "w-5 h-5",
}: {
  name: NavIconKey;
  className?: string;
}) {
  switch (name) {
    case "home":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3l9 7.5" />
          <path d="M5.25 9.75V20a1 1 0 001 1H9.5v-5.25A.75.75 0 0110.25 15h3.5a.75.75 0 01.75.75V21h3.25a1 1 0 001-1V9.75" />
        </svg>
      );
    case "capabilities":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8" />
          <path d="M10 16v4" />
          <path d="M14 16v4" />
        </svg>
      );
    case "work":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="8" height="7" rx="1.5" />
          <rect x="13" y="4" width="8" height="7" rx="1.5" />
          <rect x="3" y="13" width="8" height="7" rx="1.5" />
          <rect x="13" y="13" width="8" height="7" rx="1.5" />
        </svg>
      );
    case "blog":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 4.75h8.5a2.5 2.5 0 012.5 2.5V19a.75.75 0 01-1.2.6L13.5 18H6A2 2 0 014 16V6.75a2 2 0 012-2z" />
          <path d="M8 9h6" />
          <path d="M8 12h6" />
          <path d="M8 15h4" />
        </svg>
      );
    case "team":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 19v-1a4 4 0 00-8 0v1" />
          <circle cx="12" cy="11" r="3" />
          <path d="M6 19v-.5a3.5 3.5 0 013-3.465" />
          <path d="M18 19v-.5a3.5 3.5 0 00-3-3.465" />
          <circle cx="5.5" cy="11.5" r="2" />
          <circle cx="18.5" cy="11.5" r="2" />
        </svg>
      );
    case "contact":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar({
  variant = "default",
  showBack = false,
  backUrl = "/",
}: NavbarProps) {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // تشخیص سکشن فعال با IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
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
  }, []);

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

  const navLinks: {
    label: string;
    href: string;
    icon: NavIconKey;
    id: string;
  }[] = [
    {
      label: t("home"),
      href: "#home",
      icon: "home",
      id: "home",
    },
    {
      label: t("capabilities"),
      href: "#services",
      icon: "capabilities",
      id: "services",
    },
    {
      label: t("work"),
      href: "#portfolio",
      icon: "work",
      id: "portfolio",
    },
    {
      label: t("blogBadge"),
      href: "#blog",
      icon: "blog",
      id: "blog",
    },
    {
      label: t("team"),
      href: "#team",
      icon: "team",
      id: "team",
    },
    {
      label: t("contact"),
      href: "#contact",
      icon: "contact",
      id: "contact",
    },
  ];

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

              {/* Preferences Button - Simple - فقط آیکون تنظیمات */}
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

  // تابع بررسی فعال بودن لینک
  const isLinkActive = (linkId: string) => {
    return activeSection === linkId;
  };

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
        `}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* سمت چپ: لوگو + دکمه Preferences */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size="md" />
              <BrandName />
            </Link>

            {/* Preferences Button - کنار لوگو */}
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

          {/* سمت راست: فقط دکمه همبرگر */}
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

      {/* Backdrop overlay */}
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

      {/* Mobile / Hamburger menu */}
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
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.id);
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3
                      px-4 py-3
                      rounded-xl
                      transition-all duration-200
                      text-sm font-medium
                      group
                      ${
                        isActive
                          ? "bg-[var(--bg-elevated)]/80 text-[var(--text-primary)] border border-[var(--border-subtle)]/40"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex items-center justify-center
                        w-9 h-9 rounded-lg
                        border transition-colors
                        ${
                          isActive
                            ? "bg-gradient-to-br from-blue-500/15 to-purple-500/15 border-blue-500/30 text-blue-500"
                            : "bg-[var(--bg-elevated)]/65 border-[var(--border-subtle)]/30 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--border-subtle)]/50"
                        }
                      `}
                    >
                      <NavIcon name={link.icon} className="w-4.5 h-4.5" />
                    </span>
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                    )}
                  </a>
                );
              })}
            </div>

            <div className="border-t border-[var(--border-subtle)]/30 my-3" />

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 pt-1">
              <a
                href="#contact"
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

      {/* Preferences Dialog */}
      <PreferencesDialog
        open={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />
    </>
  );
}
