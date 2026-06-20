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
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    titleKey: "projectDaneshjouyarTitle",
    categoryKey: "projectDaneshjouyarCategory",
    roleKey: "projectDaneshjouyarRole",
    descriptionKey: "projectDaneshjouyarDesc",
    technologies: ["Flutter", "Clean Architecture", "BLoC"],
    icon: "fa-graduation-cap",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    titleKey: "projectTONTitle",
    categoryKey: "projectTONCategory",
    roleKey: "projectTONRole",
    descriptionKey: "projectTONDesc",
    technologies: ["Golang", "Smart Contracts", "TON"],
    icon: "fa-coins",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    titleKey: "projectAdminTitle",
    categoryKey: "projectAdminCategory",
    roleKey: "projectAdminRole",
    descriptionKey: "projectAdminDesc",
    technologies: ["Nest.js", "Docker", "RabbitMQ"],
    icon: "fa-server",
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    titleKey: "projectMohsenTitle",
    categoryKey: "projectMohsenCategory",
    roleKey: "projectMohsenRole",
    descriptionKey: "projectMohsenDesc",
    technologies: ["Flutter", "Bluetooth", "Geolocation"],
    icon: "fa-shopping-cart",
    gradient: "from-rose-500/10 to-red-500/10",
  },
  {
    titleKey: "projectPackagesTitle",
    categoryKey: "projectPackagesCategory",
    roleKey: "projectPackagesRole",
    descriptionKey: "projectPackagesDesc",
    technologies: ["Flutter", "Dart", "Pub.dev"],
    icon: "fa-box",
    gradient: "from-indigo-500/10 to-blue-500/10",
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
              className="project-card rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] hover-lift transition-all duration-300 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 opacity-0"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${proj.gradient} flex items-center justify-center text-[var(--accent-blue)] mb-4`}
              >
                <i className={`fas ${proj.icon} text-xl`}></i>
              </div>
              <span className="badge text-xs font-mono tracking-wider uppercase">
                {t(proj.categoryKey)}
              </span>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mt-2">
                {t(proj.titleKey)}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                <span className="text-[var(--text-primary)]">
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
                    className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
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
