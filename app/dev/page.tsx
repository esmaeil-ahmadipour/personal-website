"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDirection } from "@/providers/DirectionProvider";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { EarlyAccessModal, EarlyAccessTrigger } from "@/features/early-access";

export default function DevPlatformPage() {
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

  return (
    <>
      {/* Navbar */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                T
              </div>
              <span className="text-lg font-bold gradient-text">Tarvix</span>
            </Link>
            <span className="hidden sm:inline-block text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)] border border-[var(--border-subtle)] px-2 py-0.5 rounded-full">
              Dev
            </span>
          </div>

          <div className="flex items-center gap-4">
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
            <Link
              href="/"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative pt-32 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wider">
              Engineering System
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="gradient-text">{t("heroTitleDev")}</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-6 leading-relaxed">
            {t("heroSubDev")}
          </p>

          <div className="max-w-2xl mx-auto text-sm text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 mb-8">
            <i className="fas fa-check-circle text-[var(--accent-blue)] mr-2"></i>
            {t("heroIntent")}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <EarlyAccessTrigger className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press">
              {t("requestAccess")} →
            </EarlyAccessTrigger>
            <a
              href="#layers"
              className="px-8 py-4 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] font-medium transition-all btn-press"
            >
              Explore System ↓
            </a>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            {t("whyTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
              <span className="badge text-xs font-mono tracking-wider uppercase">
                {t("whyBadge1")}
              </span>
              <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
                {t("whyText1")}
              </p>
            </div>
            <div className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
              <span className="badge text-xs font-mono tracking-wider uppercase">
                {t("whyBadge2")}
              </span>
              <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
                {t("whyText2")}
              </p>
            </div>
          </div>
          <p className="text-center text-[var(--text-muted)] mt-6 text-sm">
            {t("whyFooter")}
          </p>
        </div>
      </section>

      {/* Substance Section */}
      <section
        id="substance"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 gradient-text">
            {t("substanceTitle")}
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12">
            {t("substanceSub")}
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {t("substanceText1")}
              </p>
            </div>
            <div className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)]">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                {t("substanceText2")}
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl p-6 bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/10 text-center">
            <p className="text-[var(--text-primary)] font-medium">
              {t("substancePrinciple")}
            </p>
          </div>
        </div>
      </section>

      {/* Layers Section */}
      <section
        id="layers"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2 gradient-text">
            {t("layersTitle")}
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12">
            {t("layersSub")}
          </p>
          <div className="space-y-4">
            {[
              { title: t("layer1"), content: t("layer1Text") },
              { title: t("layer2"), content: t("layer2Text") },
              { title: t("layer3"), content: t("layer3Text") },
              {
                title: t("layer4"),
                content: t("layer4Text"),
                footer: t("layer4Footer"),
              },
            ].map((layer, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-l-[3px] border-l-[var(--accent-blue)] shadow-[var(--shadow-card)]"
              >
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {layer.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {layer.content}
                </p>
                {layer.footer && (
                  <p className="text-sm text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--border-subtle)]">
                    {layer.footer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="py-16 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            {t("principlesTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                badge: t("principle1Badge"),
                title: t("principle1Title"),
                text: t("principle1Text"),
              },
              {
                badge: t("principle2Badge"),
                title: t("principle2Title"),
                text: t("principle2Text"),
              },
              {
                badge: t("principle3Badge"),
                title: t("principle3Title"),
                text: t("principle3Text"),
              },
            ].map((principle, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] hover-lift transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1"
              >
                <span className="badge text-xs font-mono tracking-wider uppercase">
                  {principle.badge}
                </span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2 mb-2">
                  {principle.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {principle.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Section */}
      <section
        id="access"
        className="py-16 px-4 border-t border-[var(--border-subtle)]"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
            {t("accessTitle")}
          </h2>
          <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
            Explore the engineering system, inspect implementations, or request
            a review.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1">
              <i className="fas fa-book text-3xl text-[var(--accent-blue)] mb-4 block"></i>
              <h3 className="text-[var(--text-primary)] font-semibold">
                {t("accessGuide")}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {t("accessGuideText")}
              </p>
              <a
                href="#"
                className="inline-block mt-4 text-sm text-[var(--accent-blue)] hover:text-[var(--accent-blue-hover)] transition-colors"
              >
                {t("accessGuideLink")} →
              </a>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1">
              <i className="fab fa-github text-3xl text-[var(--accent-purple)] mb-4 block"></i>
              <h3 className="text-[var(--text-primary)] font-semibold">
                {t("accessGithub")}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {t("accessGithubText")}
              </p>
              <a
                href="#"
                className="inline-block mt-4 text-sm text-[var(--accent-purple)] hover:text-[var(--accent-purple-hover)] transition-colors"
              >
                {t("accessGithubLink")} →
              </a>
            </div>
            <div className="text-center p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1">
              <i className="fas fa-microphone-alt text-3xl text-[var(--accent-amber)] mb-4 block"></i>
              <h3 className="text-[var(--text-primary)] font-semibold">
                {t("accessReview")}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {t("accessReviewText")}
              </p>
              <EarlyAccessTrigger className="inline-block mt-4 text-sm text-[var(--accent-amber)] hover:text-[var(--accent-amber-hover)] transition-colors cursor-pointer">
                {t("requestAccess")} →
              </EarlyAccessTrigger>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 max-w-3xl mx-auto">
            <i className="fas fa-quote-left text-[var(--accent-blue)] mr-2"></i>
            {t("accessFooter")}
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="py-16 px-4 border-t border-[var(--border-subtle)]">
        <div className="max-w-3xl mx-auto text-center rounded-2xl p-8 bg-[var(--accent-blue-bg)] border border-[var(--accent-blue)]/10">
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {t("finalTitle")}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            {t("finalText")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-4 bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[var(--text-muted)]">
            © 2025 Tarvix — {t("footer")}
          </p>
          <p className="text-xs text-[var(--text-muted)]/70 mt-2">
            {t("footerTags")}
          </p>
        </div>
      </footer>

      {/* Early Access Modal */}
      <EarlyAccessModal />
    </>
  );
}
