"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { EarlyAccessModal, EarlyAccessTrigger } from "@/features/early-access";
import LanguageSwitcher from "@/components/SwitchLanguage";
import ThemeSwitcherWrapper from "@/features/shared/components/ThemeSwitcherWrapper";

// ============================================
// OFFICIAL COLOR PALETTE - Blue, Purple, Green
// با opacity بالاتر برای تم روشن
// ============================================
const OFFICIAL_COLORS = [
  {
    // 0 - Blue
    name: "Blue",
    gradient: "from-blue-500/40 via-blue-400/20 to-transparent",
    border: "border-blue-500 hover:border-blue-700",
    borderStrong: "border-blue-600",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/25",
    text: "text-blue-600 dark:text-blue-300",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    badgeBg: "bg-blue-600",
    badgeColor: "text-white",
    badgeBorder: "border-blue-700",
  },
  {
    // 1 - Purple
    name: "Purple",
    gradient: "from-purple-500/40 via-purple-400/20 to-transparent",
    border: "border-purple-500 hover:border-purple-700",
    borderStrong: "border-purple-600",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/25",
    text: "text-purple-600 dark:text-purple-300",
    iconBg: "bg-purple-600",
    iconColor: "text-white",
    badgeBg: "bg-purple-600",
    badgeColor: "text-white",
    badgeBorder: "border-purple-700",
  },
  {
    // 2 - Green
    name: "Green",
    gradient: "from-emerald-500/40 via-emerald-400/20 to-transparent",
    border: "border-emerald-500 hover:border-emerald-700",
    borderStrong: "border-emerald-600",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-300",
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
    badgeBg: "bg-emerald-600",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-700",
  },
  {
    // 3 - Blue (Alternate)
    name: "Blue Alt",
    gradient: "from-blue-600/40 via-blue-500/20 to-transparent",
    border: "border-blue-600 hover:border-blue-800",
    borderStrong: "border-blue-700",
    shadow: "shadow-blue-600/10 hover:shadow-blue-600/25",
    text: "text-blue-700 dark:text-blue-200",
    iconBg: "bg-blue-700",
    iconColor: "text-white",
    badgeBg: "bg-blue-700",
    badgeColor: "text-white",
    badgeBorder: "border-blue-800",
  },
  {
    // 4 - Purple (Alternate)
    name: "Purple Alt",
    gradient: "from-purple-600/40 via-purple-500/20 to-transparent",
    border: "border-purple-600 hover:border-purple-800",
    borderStrong: "border-purple-700",
    shadow: "shadow-purple-600/10 hover:shadow-purple-600/25",
    text: "text-purple-700 dark:text-purple-200",
    iconBg: "bg-purple-700",
    iconColor: "text-white",
    badgeBg: "bg-purple-700",
    badgeColor: "text-white",
    badgeBorder: "border-purple-800",
  },
  {
    // 5 - Green (Alternate)
    name: "Green Alt",
    gradient: "from-emerald-600/40 via-emerald-500/20 to-transparent",
    border: "border-emerald-600 hover:border-emerald-800",
    borderStrong: "border-emerald-700",
    shadow: "shadow-emerald-600/10 hover:shadow-emerald-600/25",
    text: "text-emerald-700 dark:text-emerald-200",
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    badgeBg: "bg-emerald-700",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-800",
  },
];

export default function DevPlatformPage() {
  const { t, locale, isRTL } = useTranslation();

  return (
    <>
      {/* Navbar */}
      <nav className="header-glass fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3">
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
            <LanguageSwitcher />
            <ThemeSwitcherWrapper />
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
            {[
              { badge: t("whyBadge1"), text: t("whyText1"), colorIndex: 0 },
              { badge: t("whyBadge2"), text: t("whyText2"), colorIndex: 1 },
            ].map((item, idx) => {
              const color =
                OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      text-[10px] font-mono font-semibold tracking-wider uppercase
                      ${color.badgeBg} ${color.badgeColor}
                      border ${color.badgeBorder}
                    `}
                  >
                    {item.badge}
                  </span>
                  <p className="text-[var(--text-secondary)] mt-3 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
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
            {[
              { text: t("substanceText1"), colorIndex: 2 },
              { text: t("substanceText2"), colorIndex: 3 },
            ].map((item, idx) => {
              const color =
                OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
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
              { title: t("layer1"), content: t("layer1Text"), colorIndex: 0 },
              { title: t("layer2"), content: t("layer2Text"), colorIndex: 1 },
              { title: t("layer3"), content: t("layer3Text"), colorIndex: 2 },
              {
                title: t("layer4"),
                content: t("layer4Text"),
                footer: t("layer4Footer"),
                colorIndex: 3,
              },
            ].map((layer, idx) => {
              const color =
                OFFICIAL_COLORS[layer.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
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
              );
            })}
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
                colorIndex: 0,
              },
              {
                badge: t("principle2Badge"),
                title: t("principle2Title"),
                text: t("principle2Text"),
                colorIndex: 1,
              },
              {
                badge: t("principle3Badge"),
                title: t("principle3Title"),
                text: t("principle3Text"),
                colorIndex: 2,
              },
            ].map((principle, idx) => {
              const color =
                OFFICIAL_COLORS[principle.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    rounded-2xl p-6
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      text-[10px] font-mono font-semibold tracking-wider uppercase
                      ${color.badgeBg} ${color.badgeColor}
                      border ${color.badgeBorder}
                    `}
                  >
                    {principle.badge}
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {principle.text}
                  </p>
                </div>
              );
            })}
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
            {[
              {
                icon: "fa-book",
                title: t("accessGuide"),
                text: t("accessGuideText"),
                link: t("accessGuideLink"),
                colorIndex: 0,
              },
              {
                icon: "fa-github",
                title: t("accessGithub"),
                text: t("accessGithubText"),
                link: t("accessGithubLink"),
                colorIndex: 1,
              },
              {
                icon: "fa-microphone-alt",
                title: t("accessReview"),
                text: t("accessReviewText"),
                link: t("requestAccess"),
                colorIndex: 2,
                isTrigger: true,
              },
            ].map((item, idx) => {
              const color =
                OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
              return (
                <div
                  key={idx}
                  className={`
                    text-center p-6 rounded-2xl
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-lg ${color.shadow}
                    transition-all duration-300
                    hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                  />
                  <div
                    className={`
                      w-14 h-14 rounded-xl
                      flex items-center justify-center mx-auto
                      ${color.iconBg} ${color.iconColor}
                      mb-4 shadow-md
                    `}
                  >
                    <i className={`fas ${item.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-[var(--text-primary)] font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-2">
                    {item.text}
                  </p>
                  {item.isTrigger ? (
                    <EarlyAccessTrigger
                      className={`
                        inline-block mt-4 text-sm font-medium
                        ${color.text} hover:${color.text}
                        transition-colors cursor-pointer
                      `}
                    >
                      {item.link} →
                    </EarlyAccessTrigger>
                  ) : (
                    <a
                      href="#"
                      className={`
                        inline-block mt-4 text-sm font-medium
                        ${color.text} hover:${color.text}
                        transition-colors
                      `}
                    >
                      {item.link} →
                    </a>
                  )}
                </div>
              );
            })}
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
