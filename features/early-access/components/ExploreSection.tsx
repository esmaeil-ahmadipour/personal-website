"use client";

import { useTranslation } from "@/features/shared";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardGlow,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BookOpenIcon,
  GitBranchIcon,
  WorkflowIcon,
  ShieldCheckIcon,
  FileCodeIcon,
  ArrowRightIcon,
} from "@/components/icons/index";
import { EarlyAccessTrigger } from "./EarlyAccessTrigger";
import { OFFICIAL_COLORS } from "@/utils/official-colors";

export function ExploreSection() {
  const { t } = useTranslation();

  const items = [
    {
      icon: BookOpenIcon,
      title: "exploreStep1",
      desc: "exploreStep1Desc",
      link: "/docs/architecture",
      linkLabel: "exploreStep1Link",
      colorIndex: 0,
    },
    {
      icon: GitBranchIcon,
      title: "exploreStep2",
      desc: "exploreStep2Desc",
      link: "https://github.com/tarvix",
      linkLabel: "exploreStep2Link",
      colorIndex: 1,
      isExternal: true,
    },
    {
      icon: ShieldCheckIcon,
      title: "exploreStep3",
      desc: "exploreStep3Desc",
      link: "requestAccess",
      linkLabel: "exploreStep3Link",
      colorIndex: 2,
      isTrigger: true,
    },
  ];

  return (
    <section
      id="access"
      className="py-16 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 gradient-text">
          {t("exploreTitle")}
        </h2>
        <p className="text-center text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
          {t("exploreDesc")}
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const color =
              OFFICIAL_COLORS[item.colorIndex % OFFICIAL_COLORS.length];
            return (
              <div
                key={idx}
                className={`
                  text-center p-6 rounded-2xl
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
                  className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                />

                {/* Step Number */}
                <div className="text-3xl font-bold font-mono text-[var(--text-muted)] mb-2">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div
                  className={`
                  w-14 h-14 rounded-xl
                  flex items-center justify-center mx-auto mb-4
                  ${color.iconBg} ${color.iconColor}
                  shadow-md
                `}
                >
                  <item.icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="text-[var(--text-primary)] font-semibold">
                  {t(item.title)}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  {t(item.desc)}
                </p>

                {/* Link / Trigger */}
                {item.isTrigger ? (
                  <EarlyAccessTrigger
                    className={`
                      inline-flex items-center gap-1 mt-4 text-sm font-medium
                      ${color.text} hover:${color.text}
                      transition-colors cursor-pointer
                    `}
                  >
                    {t(item.linkLabel)} →
                  </EarlyAccessTrigger>
                ) : (
                  <a
                    href={item.link}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className={`
                      inline-flex items-center gap-1 mt-4 text-sm font-medium
                      ${color.text} hover:${color.text}
                      transition-colors
                    `}
                  >
                    {t(item.linkLabel)} →
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-[var(--text-muted)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 max-w-3xl mx-auto">
          <span className="text-blue-500 mr-2">💡</span>
          {t("accessFooter")}
        </div>
      </div>
    </section>
  );
}
