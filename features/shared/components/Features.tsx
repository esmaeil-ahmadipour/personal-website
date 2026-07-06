"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

// ============================================
// BLUE/PURPLE OFFICIAL COLOR PALETTE
// ============================================
const OFFICIAL_COLORS = [
  {
    // 0 - Light Blue
    gradient: "from-blue-400/20 via-blue-300/10 to-transparent",
    border: "border-blue-400/30 hover:border-blue-400/60",
    shadow: "shadow-blue-400/5 hover:shadow-blue-400/15",
    iconBg: "from-blue-400/25 to-blue-300/15",
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-400/15",
    badgeColor: "text-blue-600 dark:text-blue-300",
    badgeBorder: "border-blue-400/25",
    chipBg: "bg-blue-400/10",
    chipBorder: "border-blue-400/20",
    chipColor: "text-blue-600 dark:text-blue-300",
  },
  {
    // 1 - Medium Blue
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    border: "border-blue-500/30 hover:border-blue-500/60",
    shadow: "shadow-blue-500/5 hover:shadow-blue-500/15",
    iconBg: "from-blue-500/25 to-blue-400/15",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-500/15",
    badgeColor: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-500/25",
    chipBg: "bg-blue-500/10",
    chipBorder: "border-blue-500/20",
    chipColor: "text-blue-700 dark:text-blue-300",
  },
  {
    // 2 - Deep Blue
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    border: "border-blue-600/30 hover:border-blue-600/60",
    shadow: "shadow-blue-600/5 hover:shadow-blue-600/15",
    iconBg: "from-blue-600/25 to-blue-500/15",
    iconColor: "text-blue-700",
    badgeBg: "bg-blue-600/15",
    badgeColor: "text-blue-800 dark:text-blue-300",
    badgeBorder: "border-blue-600/25",
    chipBg: "bg-blue-600/10",
    chipBorder: "border-blue-600/20",
    chipColor: "text-blue-800 dark:text-blue-300",
  },
  {
    // 3 - Light Purple
    gradient: "from-purple-400/20 via-purple-300/10 to-transparent",
    border: "border-purple-400/30 hover:border-purple-400/60",
    shadow: "shadow-purple-400/5 hover:shadow-purple-400/15",
    iconBg: "from-purple-400/25 to-purple-300/15",
    iconColor: "text-purple-500",
    badgeBg: "bg-purple-400/15",
    badgeColor: "text-purple-600 dark:text-purple-300",
    badgeBorder: "border-purple-400/25",
    chipBg: "bg-purple-400/10",
    chipBorder: "border-purple-400/20",
    chipColor: "text-purple-600 dark:text-purple-300",
  },
  {
    // 4 - Medium Purple
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    border: "border-purple-500/30 hover:border-purple-500/60",
    shadow: "shadow-purple-500/5 hover:shadow-purple-500/15",
    iconBg: "from-purple-500/25 to-purple-400/15",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-500/15",
    badgeColor: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-500/25",
    chipBg: "bg-purple-500/10",
    chipBorder: "border-purple-500/20",
    chipColor: "text-purple-700 dark:text-purple-300",
  },
  {
    // 5 - Deep Purple
    gradient: "from-purple-600/20 via-purple-500/10 to-transparent",
    border: "border-purple-600/30 hover:border-purple-600/60",
    shadow: "shadow-purple-600/5 hover:shadow-purple-600/15",
    iconBg: "from-purple-600/25 to-purple-500/15",
    iconColor: "text-purple-700",
    badgeBg: "bg-purple-600/15",
    badgeColor: "text-purple-800 dark:text-purple-300",
    badgeBorder: "border-purple-600/25",
    chipBg: "bg-purple-600/10",
    chipBorder: "border-purple-600/20",
    chipColor: "text-purple-800 dark:text-purple-300",
  },
  {
    // 6 - Blue-Purple Mix
    gradient: "from-blue-500/20 via-purple-400/10 to-transparent",
    border: "border-blue-500/30 hover:border-purple-500/60",
    shadow: "shadow-purple-500/5 hover:shadow-purple-500/15",
    iconBg: "from-blue-500/25 to-purple-400/15",
    iconColor: "text-purple-600",
    badgeBg: "bg-purple-500/15",
    badgeColor: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-500/25",
    chipBg: "bg-purple-500/10",
    chipBorder: "border-purple-500/20",
    chipColor: "text-purple-700 dark:text-purple-300",
  },
  {
    // 7 - Purple-Blue Mix
    gradient: "from-purple-500/20 via-blue-400/10 to-transparent",
    border: "border-purple-500/30 hover:border-blue-500/60",
    shadow: "shadow-blue-500/5 hover:shadow-blue-500/15",
    iconBg: "from-purple-500/25 to-blue-400/15",
    iconColor: "text-blue-600",
    badgeBg: "bg-blue-500/15",
    badgeColor: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-500/25",
    chipBg: "bg-blue-500/10",
    chipBorder: "border-blue-500/20",
    chipColor: "text-blue-700 dark:text-blue-300",
  },
];

const featuresData = [
  {
    icon: "fa-layer-group",
    titleKey: "capTitle1",
    descKey: "capDesc1",
    badgeKey: "capBadge1",
    colorIndex: 0, // Light Blue
  },
  {
    icon: "fa-globe",
    titleKey: "capTitle2",
    descKey: "capDesc2",
    badgeKey: "capBadge2",
    colorIndex: 1, // Medium Blue
  },
  {
    icon: "fa-link",
    titleKey: "capTitle3",
    descKey: "capDesc3",
    badgeKey: "capBadge3",
    colorIndex: 3, // Light Purple
  },
  {
    icon: "fa-paint-brush",
    titleKey: "capTitle4",
    descKey: "capDesc4",
    badgeKey: "capBadge4",
    colorIndex: 4, // Medium Purple
  },
  {
    icon: "fa-sitemap",
    titleKey: "capTitle5",
    descKey: "capDesc5",
    badgeKey: "capBadge5",
    colorIndex: 2, // Deep Blue
  },
  {
    icon: "fa-users-cog",
    titleKey: "capTitle6",
    descKey: "capDesc6",
    badgeKey: "capBadge6",
    colorIndex: 5, // Deep Purple
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, index) => {
            const color =
              OFFICIAL_COLORS[feature.colorIndex % OFFICIAL_COLORS.length];
            return (
              <div
                key={index}
                className={`
                  feature-card rounded-2xl p-6 card
                  bg-gradient-to-br ${color.gradient}
                  border ${color.border}
                  shadow-lg ${color.shadow}
                  transition-all duration-300 
                  hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  opacity-0
                `}
              >
                <div
                  className={`
                    w-12 h-12 rounded-xl bg-gradient-to-br ${color.iconBg}
                    flex items-center justify-center ${color.iconColor} mb-4
                  `}
                >
                  <i className={`fas ${feature.icon} text-xl`}></i>
                </div>
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full
                    text-[10px] font-mono font-semibold tracking-wider uppercase
                    ${color.badgeBg} ${color.badgeColor}
                    border ${color.badgeBorder}
                  `}
                >
                  {t(feature.badgeKey)}
                </span>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-3 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
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
