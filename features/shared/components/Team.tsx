"use client";

import Image from "next/image";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  gradient: string;
  borderColor: string;
  borderHoverColor: string;
  iconColor: string;
  ringColor: string;
}

export function Team() {
  const { t, locale, isRTL } = useTranslation();
  const isFa = locale === "fa";

  const teamMembers: TeamMember[] = [
    {
      name: "Esmaeil",
      role: t("teamEsmaeilRole"),
      bio: t("teamEsmaeilBio"),
      image: "/images/authors/avatar-esmaeil.png",
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
      borderColor: "border-blue-500",
      borderHoverColor: "hover:border-blue-600",
      iconColor: "text-blue-500",
      ringColor: "ring-blue-500/30 group-hover:ring-blue-500/70",
      social: {
        github: "https://github.com/esmaeil-ahmadipour",
        linkedin: "https://linkedin.com/in/esmaeil-ahmadipour",
      },
    },
    {
      name: "Milad",
      role: t("teamMiladRole"),
      bio: t("teamMiladBio"),
      image: "/images/authors/avatar-milad.png",
      gradient: "from-purple-500/20 via-purple-400/10 to-transparent",
      borderColor: "border-purple-500",
      borderHoverColor: "hover:border-purple-600",
      iconColor: "text-purple-500",
      ringColor: "ring-purple-500/30 group-hover:ring-purple-500/70",
      social: {
        github: "https://github.com/sg-milad",
        linkedin: "https://linkedin.com/in/sg-milad",
      },
    },
    {
      name: "Sina",
      role: t("teamSinaRole"),
      bio: t("teamSinaBio"),
      image: "/images/authors/avatar-sina.png",
      gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
      borderColor: "border-emerald-500",
      borderHoverColor: "hover:border-emerald-600",
      iconColor: "text-emerald-500",
      ringColor: "ring-emerald-500/30 group-hover:ring-emerald-500/70",
      social: {
        github: "",
        linkedin: "https://linkedin.com/in/sina-soujeh-b91844250",
      },
    },
    {
      name: "Iman",
      role: t("teamImanRole"),
      bio: t("teamImanBio"),
      image: "/images/authors/avatar-iman.png",
      gradient: "from-rose-500/20 via-rose-400/10 to-transparent",
      borderColor: "border-rose-500",
      borderHoverColor: "hover:border-rose-600",
      iconColor: "text-rose-500",
      ringColor: "ring-rose-500/30 group-hover:ring-rose-500/70",
      social: {
        github: "https://github.com/iManYarahmadi",
        linkedin: "https://linkedin.com/in/iman-yarahmadi",
      },
    },
  ];

  return (
    <section
      id="team"
      className="py-16 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge badge-purple text-xs font-mono tracking-wider uppercase mb-3 inline-block">
            {t("teamTitle") || "Team"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            {t("teamTitle") || "Engineering Leadership"}
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-2xl mx-auto">
            {t("teamSubtitle") || "The people behind Tarvix engineering"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              border-amber-500
              border-2
              className={`
                group relative rounded-2xl p-6 card
                bg-gradient-to-br ${member.gradient}
                border-2 ${member.borderColor} ${member.borderHoverColor}
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
                flex flex-col
              `}
            >
              <div
                className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`
                      relative w-14 h-14 rounded-full overflow-hidden 
                      ring-2 ${member.ringColor}
                      transition-all duration-300
                    `}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                      priority={index < 2}
                    />
                  </div>
                </div>

                <div
                  className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}
                >
                  <h3
                    className={cn(
                      "text-base font-semibold text-[var(--text-primary)]",
                      isFa && "font-vazir",
                    )}
                  >
                    {member.name}
                  </h3>
                  <p className={`text-xs font-medium ${member.iconColor}`}>
                    {member.role}
                  </p>
                </div>
              </div>

              <p
                className={`text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4 flex-1 mb-4 ${isRTL ? "text-right" : "text-left"}`}
              >
                {member.bio}
              </p>

              {member.social && (
                <div
                  className={`flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)] mt-auto ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                >
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        text-[var(--text-muted)] hover:${member.iconColor} 
                        transition-all duration-200 hover:scale-110
                      `}
                      aria-label="GitHub"
                    >
                      <i className="fab fa-github text-base"></i>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        text-[var(--text-muted)] hover:${member.iconColor} 
                        transition-all duration-200 hover:scale-110
                      `}
                      aria-label="LinkedIn"
                    >
                      <i className="fab fa-linkedin text-base"></i>
                    </a>
                  )}
                  {member.social.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`
                        text-[var(--text-muted)] hover:${member.iconColor} 
                        transition-all duration-200 hover:scale-110
                      `}
                      aria-label="Twitter"
                    >
                      <i className="fab fa-twitter text-base"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
