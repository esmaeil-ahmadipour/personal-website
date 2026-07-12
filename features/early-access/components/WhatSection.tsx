"use client";

import { useTranslation } from "@/features/shared";
import {
  BookOpenIcon,
  SettingsIcon,
  RocketIcon,
  TargetIcon,
  RepeatIcon,
} from "@/components/icons/index";
import { OFFICIAL_COLORS } from "@/utils/official-colors";

export function WhatSection() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: BookOpenIcon,
      label: "whatStep1",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: SettingsIcon,
      label: "whatStep2",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      icon: RocketIcon,
      label: "whatStep3",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      gradient: "from-orange-500 to-amber-400",
    },
    {
      icon: TargetIcon,
      label: "whatStep4",
      color: "text-green-500",
      bg: "bg-green-500/10",
      gradient: "from-green-500 to-emerald-400",
    },
    {
      icon: RepeatIcon,
      label: "whatStep5",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      gradient: "from-pink-500 to-rose-400",
    },
  ];

  return (
    <section
      id="what"
      className="py-20 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            {t("howWeHelpTitle")}
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-base">
            {t("howWeHelpDesc")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const color = OFFICIAL_COLORS[idx % OFFICIAL_COLORS.length];
            const StepIcon = step.icon;

            return (
              <div
                key={idx}
                className={`
                  group relative rounded-2xl p-6
                  bg-gradient-to-br ${color.gradient}
                  border ${color.border}
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                  ${color.hoverBg}
                  flex flex-col items-center text-center
                  min-h-[200px]
                  ${idx >= 3 ? "sm:col-span-1" : ""}
                  ${idx === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
                `}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                {/* Top accent bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${color.borderStrong}`}
                ></div>

                {/* Icon Container */}
                <div className="relative z-10 flex-shrink-0 mb-4">
                  <div
                    className={`
                      relative w-20 h-20 rounded-full
                      flex items-center justify-center
                      ${color.iconBg} ${color.iconColor}
                      transition-all duration-300
                      group-hover:shadow-lg
                      group-hover:scale-105
                    `}
                  >
                    <div className="w-9 h-9 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <StepIcon className="w-full h-full" />
                    </div>
                  </div>

                  {/* Step number */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-gray-800 text-xs font-bold flex items-center justify-center text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700">
                    {idx + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex-1 flex items-center">
                  <p className="text-sm text-[var(--text-secondary)] font-medium transition-all duration-300 group-hover:text-[var(--text-primary)] group-hover:font-bold leading-relaxed">
                    {t(step.label)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
