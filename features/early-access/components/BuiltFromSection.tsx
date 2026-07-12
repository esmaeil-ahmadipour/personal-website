"use client";

import { useTranslation } from "@/features/shared";
import { Card, CardContent } from "@/components/ui/Card";
import {
  SmartphoneIcon,
  GlobeIcon,
  ServerIcon,
  BlocksIcon,
  PaletteIcon,
  BracesIcon,
  CheckCircleIcon,
} from "@/components/icons/index";
import { OFFICIAL_COLORS } from "@/utils/official-colors";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function BuiltFromSection() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = [
    { label: "builtFromItem1", colorIndex: 0, icon: SmartphoneIcon },
    { label: "builtFromItem2", colorIndex: 1, icon: GlobeIcon },
    { label: "builtFromItem3", colorIndex: 2, icon: ServerIcon },
    { label: "builtFromItem4", colorIndex: 3, icon: BlocksIcon },
    { label: "builtFromItem5", colorIndex: 4, icon: PaletteIcon },
    { label: "builtFromItem6", colorIndex: 5, icon: BracesIcon },
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
      id="built-from"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
          {t("builtFromTitle")}
        </h2>
        <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-4">
          {t("builtFromDesc")}
        </p>

        <p className="text-center text-sm text-[var(--text-primary)] font-medium mb-10">
          {t("builtFromSub")}
        </p>

        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-6">
          {items.map((item, idx) => {
            const color =
              OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
            const Icon = item.icon;

            const chipColor = getColorFromBorder(color.borderStrong);
            const chipColorLight = isDark
              ? lightenColor(chipColor, 40)
              : chipColor;

            return (
              <div
                key={idx}
                className={`
                  group inline-flex items-center gap-2
                  px-4 py-2.5 rounded-full border-2
                  transition-all duration-300
                  hover:scale-105 hover:shadow-md
                  cursor-default
                `}
                style={{
                  backgroundColor: isDark
                    ? `${chipColorLight}15`
                    : `${chipColor}10`,
                  borderColor: isDark ? chipColorLight : chipColor,
                }}
              >
                {/* آیکون اصلی */}
                <Icon
                  className="w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:hidden"
                  style={{
                    color: isDark ? chipColorLight : chipColor,
                  }}
                />

                {/* آیکون تیک سبز در هاور */}
                <CheckCircleIcon className="w-4 h-4 flex-shrink-0 hidden transition-all duration-300 group-hover:block text-emerald-500" />

                <span
                  className="text-sm font-medium transition-colors duration-300"
                  style={{
                    color: isDark ? chipColorLight : chipColor,
                  }}
                >
                  {t(item.label)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Engineering References */}
        <div className="max-w-3xl mx-auto mt-8 p-6 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] text-center mb-3">
            {t("engineeringReferences")}
          </h3>
          <p className="text-center text-sm text-[var(--text-muted)] italic">
            {t("builtFromFooter")}
          </p>
        </div>
      </div>
    </section>
  );
}
