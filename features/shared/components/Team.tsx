"use client";

import Image from "next/image";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string; // ✅ الان اجباری شده
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
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
      social: {
        github: "https://github.com/iManYarahmadi",
        linkedin: "https://linkedin.com/in/iman-yarahmadi",
      },
    },
  ];

  return (
    <section className="py-16 px-4 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge badge-purple text-xs font-mono tracking-wider uppercase mb-3">
            {t("teamTitle") || "Team"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text">
            {t("teamTitle") || "Engineering Leadership"}
          </h2>
          <p className="text-[var(--text-secondary)] mt-3 max-w-2xl mx-auto">
            {t("teamSubtitle") || "The people behind Tarvix engineering"}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[var(--accent-blue)]/20 dark:ring-[var(--accent-blue)]/40 transition-all group-hover:ring-[var(--accent-blue)]/60">
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

                {/* Name + Role */}
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "text-base font-semibold text-[var(--text-primary)]",
                      isFa && "font-vazir",
                    )}
                  >
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-[var(--accent-blue)]">
                    {member.role}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-4 flex-1 mb-4">
                {member.bio}
              </p>

              {/* Social Links */}
              {member.social && (
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)] mt-auto">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
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
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
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
                      className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
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
