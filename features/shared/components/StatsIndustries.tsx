// app/features/landing/components/StatsIndustries.tsx

"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

const stats = [
  { key: "projects", value: "20+", label: "Projects Delivered" },
  { key: "users", value: "50K+", label: "Users Served" },
  { key: "team", value: "4", label: "Team Members" },
];
const industries = [
  { name: "Ed-Tech", icon: "📚" },
  { name: "Logistics", icon: "🚚" },
  { name: "Retail & Gressory", icon: "🛒" },
  { name: "Fin-Tech/Lean-Tech", icon: "💰" },

  { name: "Web3 & Blockchain", icon: "⛓️" },
];

export function StatsIndustries() {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 border-t border-[var(--border-subtle)] border-b border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[var(--accent-blue)]">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--text-muted)] mt-1">
                {stat.label}
              </div>
            </div>
          ))}
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
            {industries.map((industry) => (
              <span
                key={industry.name}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--text-primary)] hover:-translate-y-0.5 transition-all duration-200 shadow-[var(--shadow-card)]"
              >
                <span className="text-base">{industry.icon}</span>
                <span>{industry.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
