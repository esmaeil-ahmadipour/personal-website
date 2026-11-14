// features/projects/components/ProjectCard.tsx
import { Poster } from "@/components/ui/Poster";
import type { Project } from "../data/projects";

type Locale = "en" | "fa" | "ar";

export function ProjectCard({
  project,
  locale,
  index,
}: {
  project: Project;
  locale: Locale;
  index: number;
}) {
  const body = (
    <>
      <Poster index={index} ratio="4/3" className="text-xl">
        {project.name}
      </Poster>
      <h3 className="mt-3 px-1 text-lg font-bold">
        {project.name}
        {project.url && (
          <span aria-hidden className="ms-1 text-[hsl(var(--accent))]">↗</span>
        )}
      </h3>
      <p className="px-1 pb-1 text-sm text-[hsl(var(--text-secondary))]">
        {project.description[locale]}
      </p>
    </>
  );

  return (
    <li className="card flex flex-col p-3">
      {project.url ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </li>
  );
}
