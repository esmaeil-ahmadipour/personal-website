"use client";

import { useTranslation } from "@/features/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ArrowDownIcon,
  AlertCircleIcon,
  GitBranchIcon,
  GitCommitIcon,
  GaugeIcon,
  ClockIcon,
  ArrowRightIcon,
  ZapIcon,
} from "@/components/icons/index";
import { OFFICIAL_COLORS } from "@/utils/official-colors";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function WhySection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const problems = [
    { label: "whyProblem0", colorIndex: 0, icon: AlertCircleIcon },
    { label: "whyProblem1", colorIndex: 1, icon: GitBranchIcon },
    { label: "whyProblem2", colorIndex: 2, icon: GitCommitIcon },
    { label: "whyProblem3", colorIndex: 3, icon: GaugeIcon },
    { label: "whyProblem4", colorIndex: 4, icon: ClockIcon },
    { label: "whyProblem5", colorIndex: 5, icon: ZapIcon },
  ];

  // استخراج رنگ از کلاس border برای استفاده در style
  const getColorFromBorder = (borderClass: string) => {
    const colorMap: Record<string, string> = {
      "border-blue-600": "#2563eb",
      "border-purple-600": "#9333ea",
      "border-emerald-600": "#059669",
      "border-indigo-600": "#4f46e5",
      "border-rose-600": "#e11d48",
      "border-blue-700": "#1d4ed8",
      "border-purple-700": "#7e22ce",
      "border-emerald-700": "#047857",
      "border-indigo-700": "#4338ca",
      "border-rose-700": "#be123c",
    };
    return colorMap[borderClass] || "#2563eb";
  };

  // تابع برای تولید رنگ روشن‌تر (برای تم تاریک)
  const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
    const B = Math.min(255, (num & 0x0000ff) + amt);
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  };

  if (!mounted) return null;

  return (
    <section
      id="why"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
          {t("whyNewTitle")}
        </h2>
        <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
          {t("whyNewDesc")}
        </p>

        {/* Problem Flow - چیپ‌ها با آیکون و فلش بین آنها */}
        <div className="flex flex-col items-center gap-2 max-w-md mx-auto px-4">
          {problems.map((item, idx) => {
            const color =
              OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
            const Icon = item.icon;

            const chipColor = getColorFromBorder(color.borderStrong);
            const chipColorLight = isDark
              ? lightenColor(chipColor, 40)
              : chipColor;

            return (
              <div key={idx} className="w-full flex flex-col items-center">
                {/* چیپ */}
                <div
                  className={`
                    group inline-flex items-center justify-center gap-3
                    px-6 py-2.5 rounded-full border-2
                    transition-all duration-300
                    hover:scale-105 hover:shadow-md
                    cursor-default
                    w-full max-w-xs
                  `}
                  style={{
                    backgroundColor: isDark
                      ? `${chipColorLight}15`
                      : `${chipColor}10`,
                    borderColor: isDark ? chipColorLight : chipColor,
                  }}
                >
                  {/* آیکون اصلی - با رنگ خودش */}
                  <Icon
                    className="w-4 h-4 flex-shrink-0 transition-all duration-300"
                    style={{
                      color: isDark ? chipColorLight : chipColor,
                    }}
                  />

                  <span
                    className="text-sm font-medium transition-colors duration-300 text-center"
                    style={{
                      color: isDark ? chipColorLight : chipColor,
                    }}
                  >
                    {t(item.label)}
                  </span>
                </div>

                {/* فلش بین چیپ‌ها */}
                {idx < problems.length - 1 && (
                  <div className="flex justify-center py-1.5">
                    <svg
                      className="w-4 h-4 transition-all duration-300"
                      style={{
                        color: isDark ? chipColorLight : chipColor,
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
