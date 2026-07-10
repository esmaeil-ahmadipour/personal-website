"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import LanguageSwitcher from "@/components/SwitchLanguage";
import ThemeSwitcherWrapper from "./ThemeSwitcherWrapper";
import Logo from "@/components/Logo";

interface NavbarProps {
  variant?: "default" | "simple";
  showBack?: boolean;
  backUrl?: string;
}

export default function Navbar({ 
  variant = "default", 
  showBack = false, 
  backUrl = "/" 
}: NavbarProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  const navLinks = [
    { label: t("home"), href: "#home" },
    { label: t("capabilities"), href: "#services" },
    { label: t("work"), href: "#portfolio" },
    { label: t("blogBadge"), href: "#blog" },
    { label: t("team"), href: "#team" },
    { label: t("contact"), href: "#contact" },
  ];

  // حالت ساده (برای صفحات داخلی)
  if (variant === "simple") {
    return (
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
            <LanguageSwitcher />
            <ThemeSwitcherWrapper />
          </div>
        </div>
      </nav>
    );
  }

  // حالت پیش‌فرض (صفحه اصلی با منوی کامل)
  return (
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
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <Logo size="md" />
          <span className="text-lg font-bold tracking-tight gradient-text">
            Tarvix
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
          <ThemeSwitcherWrapper />

          <a
            href="#contact"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all btn-press"
          >
            {t("startProject")}
          </a>
          <a
            href="/dev"
            className="px-4 py-2 rounded-full border border-[var(--border-subtle)]/50 text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all"
          >
            {t("viewEngineeringSystem")}
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitcherWrapper />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
            aria-label="Toggle menu"
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden absolute top-full left-0 right-0
          bg-[var(--bg-surface)]/80 backdrop-blur-xl
          border-b border-[var(--border-subtle)]/50
          shadow-[var(--shadow-card)]
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }
        `}
      >
        <div className="p-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 mt-2 rounded-lg text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold"
          >
            {t("startProject")}
          </a>
          <a
            href="/dev"
            onClick={() => setIsMenuOpen(false)}
            className="block px-4 py-3 rounded-lg text-center border border-[var(--border-subtle)]/50 text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
          >
            {t("viewEngineeringSystem")}
          </a>
        </div>
      </div>
    </nav>
  );
}