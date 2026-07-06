"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

// ============================================
// OFFICIAL COLOR PALETTE - Blue, Purple, Green
// با پشتیبانی از تم دارک و لایت
// ============================================
const OFFICIAL_COLORS = [
  {
    // 0 - Blue
    name: "Blue",
    gradient: "from-blue-500/40 via-blue-400/20 to-transparent",
    border: "border-blue-500 hover:border-blue-700",
    borderStrong: "border-blue-600",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/25",
    text: "text-blue-600 dark:text-blue-300",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    badgeBg: "bg-blue-600",
    badgeColor: "text-white",
    badgeBorder: "border-blue-700",
    techBg: "bg-blue-100 dark:bg-blue-900/30",
    techColor: "text-blue-700 dark:text-white",
    techBorder: "border-blue-300 dark:border-blue-700/30",
  },
  {
    // 1 - Purple
    name: "Purple",
    gradient: "from-purple-500/40 via-purple-400/20 to-transparent",
    border: "border-purple-500 hover:border-purple-700",
    borderStrong: "border-purple-600",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/25",
    text: "text-purple-600 dark:text-purple-300",
    iconBg: "bg-purple-600",
    iconColor: "text-white",
    badgeBg: "bg-purple-600",
    badgeColor: "text-white",
    badgeBorder: "border-purple-700",
    techBg: "bg-purple-100 dark:bg-purple-900/30",
    techColor: "text-purple-700 dark:text-white",
    techBorder: "border-purple-300 dark:border-purple-700/30",
  },
  {
    // 2 - Green
    name: "Green",
    gradient: "from-emerald-500/40 via-emerald-400/20 to-transparent",
    border: "border-emerald-500 hover:border-emerald-700",
    borderStrong: "border-emerald-600",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-300",
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
    badgeBg: "bg-emerald-600",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-700",
    techBg: "bg-emerald-100 dark:bg-emerald-900/30",
    techColor: "text-emerald-700 dark:text-white",
    techBorder: "border-emerald-300 dark:border-emerald-700/30",
  },
  {
    // 3 - Blue (Alternate)
    name: "Blue Alt",
    gradient: "from-blue-600/40 via-blue-500/20 to-transparent",
    border: "border-blue-600 hover:border-blue-800",
    borderStrong: "border-blue-700",
    shadow: "shadow-blue-600/10 hover:shadow-blue-600/25",
    text: "text-blue-700 dark:text-blue-200",
    iconBg: "bg-blue-700",
    iconColor: "text-white",
    badgeBg: "bg-blue-700",
    badgeColor: "text-white",
    badgeBorder: "border-blue-800",
    techBg: "bg-blue-200 dark:bg-blue-800/30",
    techColor: "text-blue-800 dark:text-white",
    techBorder: "border-blue-400 dark:border-blue-700/30",
  },
  {
    // 4 - Purple (Alternate)
    name: "Purple Alt",
    gradient: "from-purple-600/40 via-purple-500/20 to-transparent",
    border: "border-purple-600 hover:border-purple-800",
    borderStrong: "border-purple-700",
    shadow: "shadow-purple-600/10 hover:shadow-purple-600/25",
    text: "text-purple-700 dark:text-purple-200",
    iconBg: "bg-purple-700",
    iconColor: "text-white",
    badgeBg: "bg-purple-700",
    badgeColor: "text-white",
    badgeBorder: "border-purple-800",
    techBg: "bg-purple-200 dark:bg-purple-800/30",
    techColor: "text-purple-800 dark:text-white",
    techBorder: "border-purple-400 dark:border-purple-700/30",
  },
  {
    // 5 - Green (Alternate)
    name: "Green Alt",
    gradient: "from-emerald-600/40 via-emerald-500/20 to-transparent",
    border: "border-emerald-600 hover:border-emerald-800",
    borderStrong: "border-emerald-700",
    shadow: "shadow-emerald-600/10 hover:shadow-emerald-600/25",
    text: "text-emerald-700 dark:text-emerald-200",
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    badgeBg: "bg-emerald-700",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-800",
    techBg: "bg-emerald-200 dark:bg-emerald-800/30",
    techColor: "text-emerald-800 dark:text-white",
    techBorder: "border-emerald-400 dark:border-emerald-700/30",
  },
];

const projectsData = [
  {
    titleKey: "projectPactusTitle",
    categoryKey: "projectPactusCategory",
    roleKey: "projectPactusRole",
    descriptionKey: "projectPactusDesc",
    technologies: ["Flutter", "gRPC", "Blockchain"],
    icon: "fa-link",
    colorIndex: 0,
  },
  {
    titleKey: "projectDaneshjouyarTitle",
    categoryKey: "projectDaneshjouyarCategory",
    roleKey: "projectDaneshjouyarRole",
    descriptionKey: "projectDaneshjouyarDesc",
    technologies: ["Flutter", "Clean Architecture", "BLoC"],
    icon: "fa-graduation-cap",
    colorIndex: 1,
  },
  {
    titleKey: "projectTONTitle",
    categoryKey: "projectTONCategory",
    roleKey: "projectTONRole",
    descriptionKey: "projectTONDesc",
    technologies: ["Golang", "Smart Contracts", "TON"],
    icon: "fa-coins",
    colorIndex: 2,
  },
  {
    titleKey: "projectAdminTitle",
    categoryKey: "projectAdminCategory",
    roleKey: "projectAdminRole",
    descriptionKey: "projectAdminDesc",
    technologies: ["Nest.js", "Docker", "RabbitMQ"],
    icon: "fa-server",
    colorIndex: 3,
  },
  {
    titleKey: "projectMohsenTitle",
    categoryKey: "projectMohsenCategory",
    roleKey: "projectMohsenRole",
    descriptionKey: "projectMohsenDesc",
    technologies: ["Flutter", "Bluetooth", "Geolocation"],
    icon: "fa-shopping-cart",
    colorIndex: 4,
  },
  {
    titleKey: "projectPackagesTitle",
    categoryKey: "projectPackagesCategory",
    roleKey: "projectPackagesRole",
    descriptionKey: "projectPackagesDesc",
    technologies: ["Flutter", "Dart", "Pub.dev"],
    icon: "fa-box",
    colorIndex: 5,
  },
];

export default function Portfolio() {
  const { t, isRTL } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".project-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-up");
              }, index * 80);
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className={`py-24 px-4 border-t border-[var(--border-subtle)] ${isRTL ? "rtl" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 ${isRTL ? "rtl" : ""}`}>
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-purple)]/10 mb-4">
            {t("work")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">{t("portfolioTitle")}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            {t("principle4Title")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((proj, idx) => {
            const color =
              OFFICIAL_COLORS[proj.colorIndex % OFFICIAL_COLORS.length];
            return (
              <div
                key={idx}
                className={`
                  project-card rounded-2xl p-6
                  bg-gradient-to-br ${color.gradient}
                  border-2 ${color.border}
                  shadow-lg ${color.shadow}
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-xl
                  opacity-0
                  ${isRTL ? "rtl" : ""}
                `}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Decorative top border accent */}
                <div
                  className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                />

                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl
                    flex items-center justify-center
                    ${color.iconBg} ${color.iconColor}
                    mb-4 shadow-md
                    ${isRTL ? "ml-auto mr-0" : ""}
                  `}
                >
                  <i className={`fas ${proj.icon} text-xl`}></i>
                </div>

                {/* Badge */}
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full
                    text-[10px] font-mono font-semibold tracking-wider uppercase
                    ${color.badgeBg} ${color.badgeColor}
                    border ${color.badgeBorder}
                    ${isRTL ? "flex-row-reverse" : ""}
                  `}
                >
                  {t(proj.categoryKey)}
                </span>

                <h3
                  className={`text-lg font-semibold text-[var(--text-primary)] mt-3 ${isRTL ? "text-right" : ""}`}
                >
                  {t(proj.titleKey)}
                </h3>
                <p
                  className={`text-sm text-[var(--text-secondary)] mt-1 ${isRTL ? "text-right" : ""}`}
                >
                  <span className="text-[var(--text-primary)] font-medium">
                    {t("tarvixRole")}:
                  </span>{" "}
                  {t(proj.roleKey)}
                </p>
                <p
                  className={`text-sm text-[var(--text-muted)] mt-2 leading-relaxed ${isRTL ? "text-right" : ""}`}
                >
                  {t(proj.descriptionKey)}
                </p>

                {/* Technologies */}
                <div
                  className={`flex flex-wrap gap-2 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {proj.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className={`
                        inline-flex items-center px-3 py-1 rounded-full
                        text-[11px] font-semibold
                        ${color.techBg}
                        ${color.techColor}
                        border ${color.techBorder}
                        transition-all duration-200
                        hover:scale-105
                      `}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
