"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

const featuresData = [
  {
    icon: "fa-layer-group",
    titleKey: "capTitle1",
    descKey: "capDesc1",
    badgeKey: "capBadge1",
  },
  {
    icon: "fa-globe",
    titleKey: "capTitle2",
    descKey: "capDesc2",
    badgeKey: "capBadge2",
  },
  {
    icon: "fa-link",
    titleKey: "capTitle3",
    descKey: "capDesc3",
    badgeKey: "capBadge3",
  },
  {
    icon: "fa-paint-brush",
    titleKey: "capTitle4",
    descKey: "capDesc4",
    badgeKey: "capBadge4",
  },
  {
    icon: "fa-sitemap",
    titleKey: "capTitle5",
    descKey: "capDesc5",
    badgeKey: "capBadge5",
  },
  {
    icon: "fa-users-cog",
    titleKey: "capTitle6",
    descKey: "capDesc6",
    badgeKey: "capBadge6",
  },
];

export default function Features() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".feature-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-up");
              }, index * 80);
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-24 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-blue)] bg-[var(--accent-blue-bg)] px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/10 mb-4">
            {t("capabilities")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">{t("capabilitiesTitle")}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            {t("capabilitiesSub")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="feature-card rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] hover-lift transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 opacity-0"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-[var(--accent-blue)] mb-4">
                <i className={`fas ${feature.icon} text-xl`}></i>
              </div>
              <span className="badge text-xs font-mono tracking-wider uppercase">
                {t(feature.badgeKey)}
              </span>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2 mb-2">
                {t(feature.titleKey)}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
