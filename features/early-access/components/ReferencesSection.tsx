"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { OFFICIAL_COLORS } from "@/utils/official-colors";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ReferencesSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const references = [
    {
      title: "referencesFlutterStarter",
      desc: "referencesFlutterStarterDesc",
      link: "https://github.com/tarvix", //"https://github.com/tarvix/flutter-starter",
      colorIndex: 0,
    },
    {
      title: "referencesArchitectureGuide",
      desc: "referencesArchitectureGuideDesc",
      link: "https://github.com/tarvix",//"https://github.com/tarvix",
      colorIndex: 1,
    },
    {
      title: "referencesDesignSystem",
      desc: "referencesDesignSystemDesc",
      link: "https://github.com/tarvix",//"/docs/design-system",
      colorIndex: 2,
    },
    {
      title: "referencesCICD",
      desc: "referencesCICDDesc",
      link: "https://github.com/tarvix",//"/docs/ci-cd",
      colorIndex: 3,
    },
    {
      title: "referencesADR",
      desc: "referencesADRDesc",
      link: "https://github.com/tarvix",//"/docs/adr",
      colorIndex: 4,
    },
    {
      title: "referencesBackend",
      desc: "referencesBackendDesc",
      link: "https://github.com/tarvix",//"https://github.com/tarvix/backend-blueprint",
      colorIndex: 5,
    },
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
      id="references"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
          {t("referencesTitle")}
        </h2>
        <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
          {t("referencesDesc")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {references.map((item, idx) => {
            const color =
              OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
            const isExternal = item.link.startsWith("http");

            const chipColor = getColorFromBorder(color.borderStrong);
            const chipColorLight = isDark
              ? lightenColor(chipColor, 40)
              : chipColor;

            return (
              <div
                key={idx}
                className={`
                  rounded-xl p-5
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
                  className={`w-full h-1 rounded-t-xl ${color.borderStrong} mb-3 -mt-5`}
                />

                {/* عنوان به صورت چیپ */}
                <div className="mb-3">
                  <span
                    className={`
                      inline-block text-sm font-bold uppercase tracking-wider
                      px-3 py-1.5 rounded-full border-2
                      transition-all duration-200
                      hover:scale-105
                    `}
                    style={{
                      backgroundColor: isDark ? "transparent" : chipColor,
                      color: isDark ? chipColorLight : "#ffffff",
                      borderColor: isDark ? chipColorLight : chipColor,
                    }}
                  >
                    {t(item.title)}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {t(item.desc)}
                </p>
                <a
                  href={item.link}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`
                    inline-flex items-center gap-1 mt-3 text-sm font-medium
                    ${color.text} hover:${color.text} transition-colors
                  `}
                >
                  {t("viewReference")} →
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-8 italic">
          {t("referencesFooter")}
        </p>
      </div>
    </section>
  );
}
