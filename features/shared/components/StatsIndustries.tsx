// app/features/landing/components/StatsIndustries.tsx

"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";

// ============================================
// OFFICIAL COLOR PALETTE - Blue, Purple, Green
// با پشتیبانی از تم دارک و لایت
// ============================================
const OFFICIAL_COLORS = [
  {
    // 0 - Blue
    name: "Blue",
    gradient: "from-blue-500/30 via-blue-400/15 to-transparent",
    border: "border-blue-300/40 hover:border-blue-400/60",
    borderStrong: "border-blue-400/50",
    shadow: "shadow-blue-500/5 hover:shadow-blue-500/15",
    text: "text-blue-600 dark:text-blue-300", // رنگ اصلی در هر دو تم
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    badgeBg: "bg-blue-600",
    badgeColor: "text-white",
    badgeBorder: "border-blue-700",
  },
  {
    // 1 - Purple
    name: "Purple",
    gradient: "from-purple-500/30 via-purple-400/15 to-transparent",
    border: "border-purple-300/40 hover:border-purple-400/60",
    borderStrong: "border-purple-400/50",
    shadow: "shadow-purple-500/5 hover:shadow-purple-500/15",
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
    gradient: "from-emerald-500/30 via-emerald-400/15 to-transparent",
    border: "border-emerald-300/40 hover:border-emerald-400/60",
    borderStrong: "border-emerald-400/50",
    shadow: "shadow-emerald-500/5 hover:shadow-emerald-500/15",
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
    gradient: "from-blue-600/30 via-blue-500/15 to-transparent",
    border: "border-blue-400/40 hover:border-blue-500/60",
    borderStrong: "border-blue-500/50",
    shadow: "shadow-blue-600/5 hover:shadow-blue-600/15",
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
    gradient: "from-purple-600/30 via-purple-500/15 to-transparent",
    border: "border-purple-400/40 hover:border-purple-500/60",
    borderStrong: "border-purple-500/50",
    shadow: "shadow-purple-600/5 hover:shadow-purple-600/15",
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
    gradient: "from-emerald-600/30 via-emerald-500/15 to-transparent",
    border: "border-emerald-400/40 hover:border-emerald-500/60",
    borderStrong: "border-emerald-500/50",
    shadow: "shadow-emerald-600/5 hover:shadow-emerald-600/15",
    text: "text-emerald-700 dark:text-emerald-200",
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    badgeBg: "bg-emerald-700",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-800",
  },
];

const stats = [
  { key: "projects", value: "20+", labelKey: "statsProjects" },
  { key: "users", value: "50K+", labelKey: "statsUsers" },
  { key: "team", value: "4", labelKey: "statsTeam" },
];

const industries = [
  {
    nameKey: "edTech",
    icon: "📚",
    colorIndex: 0, // Blue
  },
  {
    nameKey: "logistics",
    icon: "🚚",
    colorIndex: 4, // Purple Alt
  },
  {
    nameKey: "retailGrocery",
    icon: "🛒",
    colorIndex: 1, // Purple
  },
  {
    nameKey: "finTechLeanTech",
    icon: "💰",
    colorIndex: 3, // Blue Alt
  },
  {
    nameKey: "web3Blockchain",
    icon: "⛓️",
    colorIndex: 2, // Green
  },
];

export function StatsIndustries() {
  const { t, isRTL } = useTranslation();

  return (
    <section
      className={`py-16 px-4 border-t border-[var(--border-subtle)] border-b border-[var(--border-subtle)] ${isRTL ? "rtl" : ""}`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const color = OFFICIAL_COLORS[index % OFFICIAL_COLORS.length];
            return (
              <div
                key={stat.key}
                className={`
                  rounded-2xl p-6 text-center
                  bg-gradient-to-br ${color.gradient}
                  border-2 ${color.border}
                  shadow-lg ${color.shadow}
                  transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${color.shadow}
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

                {/* متن رنگی - در تم روشن رنگ اصلی، در تم تاریک رنگ روشن */}
                <div
                  className={`text-3xl sm:text-4xl font-black ${color.text} tracking-tight`}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-[var(--text-primary)] mt-1">
                  {t(stat.labelKey)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Industries */}
        <div>
          <p className="text-xl font-bold text-[var(--text-primary)] text-center mb-6">
            {t("industriesTitle")}
          </p>
          <p className="text-lg text-[var(--text-secondary)] text-center mb-6 max-w-2xl mx-auto">
            {t("industriesSub")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry) => {
              const color =
                OFFICIAL_COLORS[industry.colorIndex % OFFICIAL_COLORS.length];
              return (
                <span
                  key={industry.nameKey}
                  className={`
                    inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                    bg-gradient-to-br ${color.gradient}
                    border-2 ${color.border}
                    shadow-sm ${color.shadow}
                    text-sm font-medium text-[var(--text-secondary)]
                    hover:text-[var(--text-primary)] hover:-translate-y-1
                    transition-all duration-300
                  `}
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="text-base">{industry.icon}</span>
                  <span>{t(industry.nameKey)}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
