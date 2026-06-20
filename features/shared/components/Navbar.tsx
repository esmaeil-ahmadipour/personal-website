"use client";

import { useState, useEffect } from "react";
import { useDirection } from "@/providers/DirectionProvider";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

// ✅ تابع برای دریافت مقدار اولیه از localStorage
const getInitialTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem("tarvix_theme") as "light" | "dark" | null;
  if (saved) return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export default function Navbar() {
  const { isRTL, toggleDirection } = useDirection();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ مقدار اولیه رو از localStorage می‌گیریم
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  // ✅ تم رو روی body اعمال کن
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tarvix_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { label: t("home"), href: "#home" },
    { label: t("capabilities"), href: "#services" },
    { label: t("work"), href: "#portfolio" },
    { label: t("foundation"), href: "#package" },
    { label: t("team"), href: "#about" },
    { label: t("contact"), href: "#contact" },
  ];

  return (
    <nav
      className={`
        glass fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3
        transition-all duration-300
        ${isScrolled ? "border-b border-[var(--border-subtle)] shadow-lg" : "border-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            T
          </div>
          <span className="text-lg font-bold tracking-tight gradient-text">
            Tarvix
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-full">
            v2.0
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
          <button
            onClick={toggleDirection}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 font-medium"
          >
            {isRTL ? "EN" : "FA"}
          </button>
          <button
            onClick={toggleTheme}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200 font-medium"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <a
            href="#contact"
            className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all btn-press"
          >
            {t("startProject")}
          </a>
          <a
            href="/dev"
            className="px-4 py-2 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all"
          >
            {t("viewEngineeringSystem")}
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleDirection}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)] text-sm"
          >
            {isRTL ? "EN" : "FA"}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)]"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
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
          md:hidden absolute top-full left-0 right-0 glass border-b border-[var(--border-subtle)]
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isMenuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"}
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
            className="block px-4 py-3 rounded-lg text-center border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
          >
            {t("viewEngineeringSystem")}
          </a>
        </div>
      </div>
    </nav>
  );
}
