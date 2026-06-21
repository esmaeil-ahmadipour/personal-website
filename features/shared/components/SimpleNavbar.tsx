"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDirection } from "@/providers/DirectionProvider";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { useState, useEffect } from "react";

interface NavbarProps {
  showBack?: boolean;
  backUrl?: string;
}

export function Navbar({ showBack = false, backUrl = "/" }: NavbarProps) {
  const router = useRouter();
  const { isRTL, toggleDirection } = useDirection();
  const { t } = useTranslation();
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("tarvix_theme") as
      | "light"
      | "dark"
      | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme(saved || (prefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("tarvix_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-card)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              T
            </div>
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
            onClick={toggleDirection}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {isRTL ? "EN" : "FA"}
          </button>
          <button
            onClick={toggleTheme}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
