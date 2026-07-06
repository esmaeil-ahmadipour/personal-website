"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

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

const featuresData = [
  {
    icon: "fa-layer-group",
    titleKey: "capTitle1",
    descKey: "capDesc1",
    badgeKey: "capBadge1",
    colorIndex: 0, // Blue
  },
  {
    icon: "fa-globe",
    titleKey: "capTitle2",
    descKey: "capDesc2",
    badgeKey: "capBadge2",
    colorIndex: 1, // Purple
  },
  {
    icon: "fa-link",
    titleKey: "capTitle3",
    descKey: "capDesc3",
    badgeKey: "capBadge3",
    colorIndex: 2, // Green
  },
  {
    icon: "fa-paint-brush",
    titleKey: "capTitle4",
    descKey: "capDesc4",
    badgeKey: "capBadge4",
    colorIndex: 3, // Blue Alt
  },
  {
    icon: "fa-sitemap",
    titleKey: "capTitle5",
    descKey: "capDesc5",
    badgeKey: "capBadge5",
    colorIndex: 4, // Purple Alt
  },
  {
    icon: "fa-users-cog",
    titleKey: "capTitle6",
    descKey: "capDesc6",
    badgeKey: "capBadge6",
    colorIndex: 5, // Green Alt
  },
];

export default function Features() {
  const { t, isRTL } = useTranslation();
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
      className={`py-24 px-4 border-t border-[var(--border-subtle)] ${isRTL ? "rtl" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}>
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => {
            const color =
              OFFICIAL_COLORS[feature.colorIndex % OFFICIAL_COLORS.length];
            return (
              <div
                key={index}
                className={`
                  feature-card rounded-2xl p-6
                  bg-gradient-to-br ${color.gradient}
                  border-2 ${color.border}
                  shadow-lg ${color.shadow}
                  transition-all duration-300 
                  hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  opacity-0
                  ${isRTL ? "rtl" : ""}
                `}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Stronger border indicator - decorative top border accent */}
                <div
                  className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                />

                {/* Icon with solid background and white icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl
                    flex items-center justify-center
                    ${color.iconBg} ${color.iconColor}
                    mb-4 shadow-md
                    ${isRTL ? "ml-auto mr-0" : ""}
                  `}
                >
                  <i className={`fas ${feature.icon} text-xl`}></i>
                </div>

                {/* Badge with white text - بدون شفافیت */}
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full
                    text-[10px] font-mono font-semibold tracking-wider uppercase
                    ${color.badgeBg} ${color.badgeColor}
                    border ${color.badgeBorder}
                    ${isRTL ? "flex-row-reverse" : ""}
                  `}
                >
                  {t(feature.badgeKey)}
                </span>

                <h3
                  className={`text-lg font-semibold text-[var(--text-primary)] mt-3 mb-2 ${isRTL ? "text-right" : ""}`}
                >
                  {t(feature.titleKey)}
                </h3>
                <p
                  className={`text-sm text-[var(--text-secondary)] leading-relaxed ${isRTL ? "text-right" : ""}`}
                >
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
