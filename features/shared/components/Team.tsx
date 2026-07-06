"use client";

import Image from "next/image";
import { useTranslation } from "@/features/shared/hooks/useTranslation";
import { cn } from "@/lib/utils";

// ============================================
// OFFICIAL COLOR PALETTE - Blue, Purple, Green
// با opacity بالاتر برای تم روشن
// ============================================
const OFFICIAL_COLORS = [
  {
    // 0 - Blue
    name: "Blue",
    gradient: "from-blue-500/40 via-blue-400/20 to-transparent",
    border: "border-blue-500 hover:border-blue-700",
    borderStrong: "border-blue-600",
    shadow: "shadow-blue-500/10 hover:shadow-blue-500/25",
    text: "text-text-800",
    iconBg: "bg-blue-600",
    iconColor: "text-white",
    badgeBg: "bg-blue-600",
    badgeColor: "text-white",
    badgeBorder: "border-blue-700",
  },
  {
    // 1 - Purple
    name: "Purple",
    gradient: "from-purple-500/40 via-purple-400/20 to-transparent",
    border: "border-purple-500 hover:border-purple-700",
    borderStrong: "border-purple-600",
    shadow: "shadow-purple-500/10 hover:shadow-purple-500/25",
    text: "text-text-800",
    iconBg: "bg-purple-600",
    iconColor: "text-white",
    badgeBg: "bg-purple-600",
    badgeColor: "text-white",
    badgeBorder: "border-purple-700",
  },
  {
    // 2 - Green
    name: "Green",
    gradient: "from-emerald-500/40 via-emerald-400/20 to-transparent",
    border: "border-emerald-500 hover:border-emerald-700",
    borderStrong: "border-emerald-600",
    shadow: "shadow-emerald-500/10 hover:shadow-emerald-500/25",
    text: "text-text-800",
    iconBg: "bg-emerald-600",
    iconColor: "text-white",
    badgeBg: "bg-emerald-600",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-700",
  },
  {
    // 3 - Blue (Alternate)
    name: "Blue Alt",
    gradient: "from-blue-600/40 via-blue-500/20 to-transparent",
    border: "border-blue-600 hover:border-blue-800",
    borderStrong: "border-blue-700",
    shadow: "shadow-blue-600/10 hover:shadow-blue-600/25",
    text: "text-text-800",
    iconBg: "bg-blue-700",
    iconColor: "text-white",
    badgeBg: "bg-blue-700",
    badgeColor: "text-white",
    badgeBorder: "border-blue-800",
  },
  {
    // 4 - Purple (Alternate)
    name: "Purple Alt",
    gradient: "from-purple-600/40 via-purple-500/20 to-transparent",
    border: "border-purple-600 hover:border-purple-800",
    borderStrong: "border-purple-700",
    shadow: "shadow-purple-600/10 hover:shadow-purple-600/25",
    text: "text-purple-900", // پررنگ‌ترین در تم روشن، روشن‌ترین در تم تاریک
    iconBg: "bg-purple-700",
    iconColor: "text-white",
    badgeBg: "bg-purple-700",
    badgeColor: "text-white",
    badgeBorder: "border-purple-800",
  },
  {
    // 5 - Green (Alternate)
    name: "Green Alt",
    gradient: "from-emerald-600/40 via-emerald-500/20 to-transparent",
    border: "border-emerald-600 hover:border-emerald-800",
    borderStrong: "border-emerald-700",
    shadow: "shadow-emerald-600/10 hover:shadow-emerald-600/25",
    text: "text-emerald-900", // پررنگ‌ترین در تم روشن، روشن‌ترین در تم تاریک
    iconBg: "bg-emerald-700",
    iconColor: "text-white",
    badgeBg: "bg-emerald-700",
    badgeColor: "text-white",
    badgeBorder: "border-emerald-800",
  },
];
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
  colorIndex: number;
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
      colorIndex: 0, // Blue
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
      colorIndex: 1, // Purple
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
      colorIndex: 2, // Green
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
      colorIndex: 3, // Blue Alt
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
          {teamMembers.map((member, index) => {
            const color =
              OFFICIAL_COLORS[member.colorIndex % OFFICIAL_COLORS.length];
            return (
              <div
                key={index}
                className={`
                  group relative rounded-2xl p-6
                  bg-gradient-to-br ${color.gradient}
                  border-2 ${color.border}
                  shadow-lg ${color.shadow}
                  transition-all duration-300 
                  hover:-translate-y-2 hover:shadow-xl ${color.shadow}
                  flex flex-col
                  ${isRTL ? "rtl" : ""}
                `}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Stronger border indicator - decorative top border accent */}
                <div
                  className={`w-full h-1 rounded-t-2xl ${color.borderStrong} mb-4 -mt-6`}
                />

                {/* Avatar with ring */}
                <div
                  className={`flex items-center gap-4 mb-4 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`
                        relative w-14 h-14 rounded-full overflow-hidden 
                        ring-2 ring-${color.text.replace("text-", "")}/30 
                        group-hover:ring-${color.text.replace("text-", "")}/70
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
                    <p className={`text-xs font-medium ${color.text}`}>
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
                          text-[var(--text-muted)] hover:${color.text} 
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
                          text-[var(--text-muted)] hover:${color.text} 
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
                          text-[var(--text-muted)] hover:${color.text} 
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
