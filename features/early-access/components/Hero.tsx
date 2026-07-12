"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { EarlyAccessTrigger } from "@/features/early-access";
import {
  ArrowRightIcon,
  SparklesIcon,
  ShieldIcon,
  ZapIcon,
} from "@/components/icons/index";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section id="dev-dashboard" className="relative pt-32 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-[var(--text-secondary)] tracking-wider">
            {t("engineeringSystem")}
          </span>
        </div>
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
          <span className="gradient-text">{t("devHeroTitle")}</span>
        </h1>

        {/* Subtitle - جدید */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-6 leading-relaxed">
          {t("devHeroSubNew")}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 px-4 py-2 text-sm text-[var(--text-secondary)]">
            <span className="text-emerald-500">✓</span> {t("devHeroBadge")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 px-4 py-2 text-sm text-[var(--text-secondary)]">
            <span className="text-emerald-500">✓</span> {t("devHeroBadge2")}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 px-4 py-2 text-sm text-[var(--text-secondary)]">
            <span className="text-emerald-500">✓</span> {t("devHeroBadge3")}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <EarlyAccessTrigger className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all btn-press">
            {t("exploreSystem")}
          </EarlyAccessTrigger>
          <a
            href="#layers"
            className="px-8 py-4 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] font-medium transition-all btn-press"
          >
            {t("viewLayers")}
          </a>
        </div>
      </div>
    </section>
  );
}
