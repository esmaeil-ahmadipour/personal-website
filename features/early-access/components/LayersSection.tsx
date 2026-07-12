"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { LayersIcon } from "@/components/icons/Layers";
import { OFFICIAL_COLORS } from "@/utils/official-colors";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

// ============================================
// Official Colors - مطابق با پروژه
// ============================================

export function LayersSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const layers = [
    {
      title: "layer1New",
      outcome: "layer1Outcome",
      items: ["Modular Architecture", "Clear Ownership", "Explicit Boundaries"],
      colorIndex: 0,
    },
    {
      title: "layer2New",
      outcome: "layer2Outcome",
      items: ["ADRs", "Engineering Standards", "Review Checklists"],
      colorIndex: 1,
    },
    {
      title: "layer3New",
      outcome: "layer3Outcome",
      items: ["CI/CD Pipelines", "Static Analysis", "Quality Gates"],
      colorIndex: 2,
    },
    {
      title: "layer4New",
      outcome: "layer4Outcome",
      items: ["Flutter Starter", "Backend Blueprint", "Design System"],
      colorIndex: 0,
    },
    {
      title: "layer5New",
      outcome: "layer5Outcome",
      items: [
        "Architecture Reviews",
        "Technical Health Checks",
        "Delivery Metrics",
      ],
      colorIndex: 1,
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
      id="layers"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <LayersIcon className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wider">
              {t("layers")}
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4 gradient-text">
            {t("layersTitle")}
          </h2>
          <p className="text-[var(--text-secondary)]">{t("layersSub")}</p>
        </div>

        <div className="space-y-4">
          {layers.map((layer, idx) => {
            const color =
              OFFICIAL_COLORS[layer.colorIndex % OFFICIAL_COLORS.length];

            const chipColor = getColorFromBorder(color.borderStrong);
            // برای تم تاریک، رنگ را روشن‌تر می‌کنیم
            const chipColorLight = isDark
              ? lightenColor(chipColor, 40)
              : chipColor;

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

                {/* عنوان به صورت چیپ با رنگ‌های معکوس */}
                <div className="mb-4">
                  <span
                    className={`
                      inline-block text-sm font-bold uppercase tracking-wider
                      px-4 py-2 rounded-full border-2
                      transition-all duration-200
                      hover:scale-105
                    `}
                    style={{
                      backgroundColor: isDark
                        ? "transparent" // شفاف در تم تاریک
                        : chipColor, // رنگ اصلی در تم روشن
                      color: isDark
                        ? chipColorLight // رنگ روشن در تم تاریک
                        : "#ffffff", // سفید در تم روشن
                      borderColor: isDark
                        ? chipColorLight // border روشن در تم تاریک
                        : chipColor, // border رنگی در تم روشن
                    }}
                  >
                    {t(layer.title)}
                  </span>
                </div>

                {/* Outcome با آیکون و خط کناری */}
                <div className="mb-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-1 h-full min-h-[24px] rounded-full ${color.borderStrong} flex-shrink-0 mt-1`}
                    />
                    <p className="text-lg font-semibold text-[#000000] dark:text-[#ffffff]">
                      ✓ {t(layer.outcome)}
                    </p>
                  </div>
                </div>

                {/* آیتم‌ها با نقطه به جای چیپ */}
                <ul className="space-y-2">
                  {layer.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                        style={{
                          backgroundColor: isDark ? chipColorLight : chipColor,
                        }}
                      />
                      <span className="text-sm text-[#000000] dark:text-[#ffffff] font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
