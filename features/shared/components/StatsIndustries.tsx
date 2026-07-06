// app/features/landing/components/StatsIndustries.tsx

"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

// ============================================
// BLUE/PURPLE ONLY COLOR PALETTE - OFFICIAL
// ============================================
const OFFICIAL_COLORS = [
  {
    // Light Blue
    gradient: "from-blue-400/20 via-blue-300/10 to-transparent",
    border: "border-blue-400/25 hover:border-blue-400/50",
    text: "text-blue-500",
    shadow: "hover:shadow-blue-400/10",
  },
  {
    // Medium Blue
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    border: "border-blue-500/25 hover:border-blue-500/50",
    text: "text-blue-600",
    shadow: "hover:shadow-blue-500/10",
  },
  {
    // Deep Blue
    gradient: "from-blue-600/20 via-blue-500/10 to-transparent",
    border: "border-blue-600/25 hover:border-blue-600/50",
    text: "text-blue-700",
    shadow: "hover:shadow-blue-600/10",
  },
  {
    // Light Purple
    gradient: "from-purple-400/20 via-purple-300/10 to-transparent",
    border: "border-purple-400/25 hover:border-purple-400/50",
    text: "text-purple-500",
    shadow: "hover:shadow-purple-400/10",
  },
  {
    // Medium Purple
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    border: "border-purple-500/25 hover:border-purple-500/50",
    text: "text-purple-600",
    shadow: "hover:shadow-purple-500/10",
  },
  {
    // Deep Purple
    gradient: "from-purple-600/20 via-purple-500/10 to-transparent",
    border: "border-purple-600/25 hover:border-purple-600/50",
    text: "text-purple-700",
    shadow: "hover:shadow-purple-600/10",
  },
  {
    // Blue-Purple Mix 1
    gradient: "from-blue-500/20 via-purple-400/10 to-transparent",
    border: "border-blue-500/25 hover:border-purple-500/50",
    text: "text-purple-600",
    shadow: "hover:shadow-purple-500/10",
  },
  {
    // Purple-Blue Mix 2
    gradient: "from-purple-500/20 via-blue-400/10 to-transparent",
    border: "border-purple-500/25 hover:border-blue-500/50",
    text: "text-blue-600",
    shadow: "hover:shadow-blue-500/10",
  },
];

const stats = [
  { key: "projects", value: "20+", label: "Projects Delivered" },
  { key: "users", value: "50K+", label: "Users Served" },
  { key: "team", value: "4", label: "Team Members" },
];

const industries = [
  {
    name: "Ed-Tech",
    icon: "📚",
    colorIndex: 0, // Light Blue
  },
  {
    name: "Logistics",
    icon: "🚚",
    colorIndex: 4, // Medium Purple
  },
  {
    name: "Retail & Grocery",
    icon: "🛒",
    colorIndex: 1, // Medium Blue
  },
  {
    name: "Fin-Tech/Lean-Tech",
    icon: "💰",
    colorIndex: 3, // Light Purple
  },
  {
    name: "Web3 & Blockchain",
    icon: "⛓️",
    colorIndex: 7, // Purple-Blue Mix
  },
];

export function StatsIndustries() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 border-t border-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const color = OFFICIAL_COLORS[index % OFFICIAL_COLORS.length];
            return (
              <div
                key={stat.key}
                className={`
                  card text-center p-6
                  bg-gradient-to-br ${color.gradient}
                  border ${color.border}
                  transition-all duration-300 hover:-translate-y-1
                `}
              >
                <div className={`text-3xl sm:text-4xl font-bold ${color.text}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Industries */}
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)] text-center mb-6">
            {t("industriesTitle")}
          </p>
          <p className="text-xs text-[var(--text-muted)] text-center mb-6 max-w-2xl mx-auto">
            {t("industriesSub")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => {
              const color =
                OFFICIAL_COLORS[industry.colorIndex % OFFICIAL_COLORS.length];
              return (
                <span
                  key={industry.name}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                    bg-gradient-to-br ${color.gradient}
                    border ${color.border}
                    text-sm text-[var(--text-secondary)]
                    hover:text-[var(--text-primary)] hover:-translate-y-0.5
                    transition-all duration-200 card
                    ${color.shadow}
                  `}
                >
                  <span className="text-base">{industry.icon}</span>
                  <span>{industry.name}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
