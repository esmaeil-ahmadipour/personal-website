"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

const projectsData = [
  {
    titleKey: "projectPactusTitle",
    categoryKey: "projectPactusCategory",
    roleKey: "projectPactusRole",
    descriptionKey: "projectPactusDesc",
    technologies: ["Flutter", "gRPC", "Blockchain"],
    icon: "fa-link",
    gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
    borderColor: "border-blue-500/25",
    iconBg: "from-blue-500/25 to-blue-400/15",
    iconColor: "text-blue-500",
    badgeBg: "bg-blue-500/15",
    badgeColor: "text-blue-600 dark:text-blue-400",
    badgeBorder: "border-blue-500/20",
    techBg: "bg-blue-500/8",
    techBorder: "border-blue-500/15",
    techColor: "text-blue-600 dark:text-blue-400",
  },
  {
    titleKey: "projectDaneshjouyarTitle",
    categoryKey: "projectDaneshjouyarCategory",
    roleKey: "projectDaneshjouyarRole",
    descriptionKey: "projectDaneshjouyarDesc",
    technologies: ["Flutter", "Clean Architecture", "BLoC"],
    icon: "fa-graduation-cap",
    gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
    borderColor: "border-purple-500/25",
    iconBg: "from-purple-500/25 to-purple-400/15",
    iconColor: "text-purple-500",
    badgeBg: "bg-purple-500/15",
    badgeColor: "text-purple-600 dark:text-purple-400",
    badgeBorder: "border-purple-500/20",
    techBg: "bg-purple-500/8",
    techBorder: "border-purple-500/15",
    techColor: "text-purple-600 dark:text-purple-400",
  },
  {
    titleKey: "projectTONTitle",
    categoryKey: "projectTONCategory",
    roleKey: "projectTONRole",
    descriptionKey: "projectTONDesc",
    technologies: ["Golang", "Smart Contracts", "TON"],
    icon: "fa-coins",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    borderColor: "border-emerald-500/25",
    iconBg: "from-emerald-500/25 to-emerald-400/15",
    iconColor: "text-emerald-500",
    badgeBg: "bg-emerald-500/15",
    badgeColor: "text-emerald-600 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    techBg: "bg-emerald-500/8",
    techBorder: "border-emerald-500/15",
    techColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    titleKey: "projectAdminTitle",
    categoryKey: "projectAdminCategory",
    roleKey: "projectAdminRole",
    descriptionKey: "projectAdminDesc",
    technologies: ["Nest.js", "Docker", "RabbitMQ"],
    icon: "fa-server",
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    borderColor: "border-amber-500/25",
    iconBg: "from-amber-500/25 to-amber-400/15",
    iconColor: "text-amber-500",
    badgeBg: "bg-amber-500/15",
    badgeColor: "text-amber-600 dark:text-amber-400",
    badgeBorder: "border-amber-500/20",
    techBg: "bg-amber-500/8",
    techBorder: "border-amber-500/15",
    techColor: "text-amber-600 dark:text-amber-400",
  },
  {
    titleKey: "projectMohsenTitle",
    categoryKey: "projectMohsenCategory",
    roleKey: "projectMohsenRole",
    descriptionKey: "projectMohsenDesc",
    technologies: ["Flutter", "Bluetooth", "Geolocation"],
    icon: "fa-shopping-cart",
    gradient: "from-rose-500/20 via-rose-400/10 to-transparent",
    borderColor: "border-rose-500/25",
    iconBg: "from-rose-500/25 to-rose-400/15",
    iconColor: "text-rose-500",
    badgeBg: "bg-rose-500/15",
    badgeColor: "text-rose-600 dark:text-rose-400",
    badgeBorder: "border-rose-500/20",
    techBg: "bg-rose-500/8",
    techBorder: "border-rose-500/15",
    techColor: "text-rose-600 dark:text-rose-400",
  },
  {
    titleKey: "projectPackagesTitle",
    categoryKey: "projectPackagesCategory",
    roleKey: "projectPackagesRole",
    descriptionKey: "projectPackagesDesc",
    technologies: ["Flutter", "Dart", "Pub.dev"],
    icon: "fa-box",
    gradient: "from-indigo-500/20 via-indigo-400/10 to-transparent",
    borderColor: "border-indigo-500/25",
    iconBg: "from-indigo-500/25 to-indigo-400/15",
    iconColor: "text-indigo-500",
    badgeBg: "bg-indigo-500/15",
    badgeColor: "text-indigo-600 dark:text-indigo-400",
    badgeBorder: "border-indigo-500/20",
    techBg: "bg-indigo-500/8",
    techBorder: "border-indigo-500/15",
    techColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export default function Portfolio() {
  const { t } = useTranslation();
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
      className="py-24 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-purple)] bg-[var(--accent-purple)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-purple)]/10 mb-4">
            {t("work")}
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="gradient-text">{t("portfolioTitle")}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Real engineering work with real impact
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((proj, idx) => (
            <div
              key={idx}
              className={`
                project-card rounded-2xl p-6 card
                bg-gradient-to-br ${proj.gradient}
                border ${proj.borderColor}
                transition-all duration-300 
                hover:-translate-y-2 hover:shadow-xl
                opacity-0
              `}
            >
              <div
                className={`
                  w-12 h-12 rounded-xl bg-gradient-to-br ${proj.iconBg}
                  flex items-center justify-center ${proj.iconColor} mb-4
                `}
              >
                <i className={`fas ${proj.icon} text-xl`}></i>
              </div>
              <span
                className={`
                  inline-flex items-center px-3 py-1 rounded-full
                  text-[10px] font-mono font-semibold tracking-wider uppercase
                  ${proj.badgeBg} ${proj.badgeColor}
                  border ${proj.badgeBorder}
                `}
              >
                {t(proj.categoryKey)}
              </span>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-3">
                {t(proj.titleKey)}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                <span className="text-[var(--text-primary)] font-medium">
                  {t("tarvixRole")}:
                </span>{" "}
                {t(proj.roleKey)}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                {t(proj.descriptionKey)}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {proj.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className={`
                      text-[10px] px-3 py-1 rounded-full font-medium
                      ${proj.techBg} ${proj.techColor}
                      border ${proj.techBorder}
                    `}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
