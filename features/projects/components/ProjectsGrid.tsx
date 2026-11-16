// features/projects/components/ProjectsGrid.tsx
import { PROJECTS } from "../data/projects";
import { ProjectCard } from "./ProjectCard";

type Locale = "en" | "fa" | "ar";

export function ProjectsGrid({ locale }: { locale: Locale }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.slug} project={project} locale={locale} index={i} />
      ))}
    </ul>
  );
}
