// features/projects/components/ProjectsSection.tsx
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHead } from "@/components/ui/SectionHead";
import { listHomeProjects, type HomeProjectData } from "../services/projects.service";
import { FeaturedProjectCard } from "./FeaturedProjectCard";
import { ProjectRow } from "./ProjectRow";

type Locale = "en" | "fa" | "ar";

/** A database error hides this section instead of breaking the home page. */
async function loadProjects(): Promise<HomeProjectData[]> {
  try {
    return await listHomeProjects();
  } catch (error) {
    console.error("Failed to load home projects:", error);
    return [];
  }
}

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const projects = await loadProjects();
  if (projects.length === 0) return null;
  const t = await getTranslations({ locale });
  // The featured project is the first one flagged isFeatured, otherwise the first by order.
  const featured = projects.find((p) => p.isFeatured) ?? projects[0];
  const rows = projects.filter((p) => p !== featured).slice(0, 3);
  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-8">
      <SectionHead title={t("prTitle")}>
        <ButtonLink href={`/${locale}/projects`} variant="ghost" size="sm">
          {t("prAll")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </ButtonLink>
      </SectionHead>
      <div className={rows.length > 0 ? "grid items-stretch gap-8 lg:grid-cols-[1.35fr_1fr]" : undefined}>
        <FeaturedProjectCard project={featured} locale={locale} t={t} />
        {rows.length > 0 && (
          <ul className="flex flex-col justify-between gap-4">
            {rows.map((project, i) => (
              <ProjectRow key={project.slug} project={project} locale={locale} index={i} t={t} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
