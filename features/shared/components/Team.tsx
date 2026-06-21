"use client";

import { useEffect, useRef } from "react";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

const teamData = [
  {
    name: "Esmaeil Ahmadipour",
    roleKey: "teamEsmaeilRole",
    bioKey: "teamEsmaeilBio",
    skills: ["Flutter", "Next.JS", "React.JS"],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Iman Yarahmadi",
    roleKey: "teamImanRole",
    bioKey: "teamImanBio",
    skills: ["State Management", "Performance", "Custom Packages"],
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "Milad Bachari",
    roleKey: "teamMiladRole",
    bioKey: "teamMiladBio",
    skills: ["Node.js", "Golang", "Web3"],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Sina Soujeh",
    roleKey: "teamSinaRole",
    bioKey: "teamSinaBio",
    skills: ["Figma", "Design Systems", "UI/UX"],
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function Team() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(".team-card");
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add("animate-fade-up");
              }, index * 100);
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
      id="about"
      ref={sectionRef}
      className="py-24 px-4 border-t border-[var(--border-subtle)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/10 mb-4">
            {t("team")}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            <span className="gradient-text">{t("teamTitle")}</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Engineering leadership with deep product experience
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {teamData.map((member, index) => (
            <div
              key={index}
              className="team-card p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover-lift opacity-0 shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--shadow-glow)] text-center"
            >
              <div
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg`}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h3 className="text-[var(--text-primary)] font-semibold text-lg">
                {member.name}
              </h3>
              <p className="text-sm text-[var(--accent-blue)] font-medium mt-1">
                {t(member.roleKey)}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
                {t(member.bioKey)}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {member.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  >
                    {skill}
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
