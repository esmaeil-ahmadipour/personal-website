// features/projects/components/ProjectsGrid.tsx
import { getTranslations } from "next-intl/server";
import type { ProjectCardData } from "../services/projects.service";
import type { Locale } from "../utils/localized";
import { ProjectCard } from "./ProjectCard";

export async function ProjectsGrid({
  projects,
  locale,
}: {
  projects: ProjectCardData[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale });
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.slug} project={project} locale={locale} index={i} t={t} />
      ))}
    </ul>
  );
}
