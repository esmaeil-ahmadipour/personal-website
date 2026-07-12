"use client";

import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { OFFICIAL_COLORS } from "@/utils/official-colors";

export function HowWePartnerSection() {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: "howWePartnerStep1",
      items: [
        "howWePartnerStep1Item1",
        "howWePartnerStep1Item2",
        "howWePartnerStep1Item3",
        "howWePartnerStep1Item4",
      ],
      colorIndex: 0,
    },
    {
      number: "02",
      title: "howWePartnerStep2",
      items: [
        "howWePartnerStep2Item1",
        "howWePartnerStep2Item2",
        "howWePartnerStep2Item3",
      ],
      colorIndex: 1,
    },
    {
      number: "03",
      title: "howWePartnerStep3",
      items: [
        "howWePartnerStep3Item1",
        "howWePartnerStep3Item2",
        "howWePartnerStep3Item3",
        "howWePartnerStep3Item4",
      ],
      colorIndex: 2,
    },
    {
      number: "04",
      title: "howWePartnerStep4",
      items: [
        "howWePartnerStep4Item1",
        "howWePartnerStep4Item2",
        "howWePartnerStep4Item3",
      ],
      colorIndex: 3,
    },
  ];

  return (
    <section
      id="how-we-partner"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold gradient-text mb-3">
            {t("howWePartnerTitle")}
          </h2>
          <p className="text-[var(--text-secondary)]">
            {t("howWePartnerDesc")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {steps.map((step, idx) => {
            const color =
              OFFICIAL_COLORS[step.colorIndex % OFFICIAL_COLORS.length];
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className="flex items-start gap-6 mb-6 last:mb-0">
                {/* Step Number */}
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      text-sm font-bold font-mono
                      ${color.iconBg} ${color.iconColor}
                      shadow-md flex-shrink-0
                    `}
                  >
                    {step.number}
                  </div>
                  {!isLast && (
                    <div className="w-0.5 h-12 bg-[var(--border-subtle)] mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {t(step.title)}
                  </h3>
                  <ul className="mt-2 space-y-1">
                    {step.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <span className={`${color.text} mt-0.5`}>•</span>
                        <span>{t(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-[var(--text-muted)] italic max-w-2xl mx-auto">
            {t("howWePartnerFooter")}
          </p>
        </div>
      </div>
    </section>
  );
}
