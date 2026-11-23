// features/projects/components/ProjectCard.tsx
import Link from "next/link";
import { Poster } from "@/components/ui/Poster";
import { Reveal } from "@/components/ui/Reveal";
import { accentStyle } from "@/lib/accent";
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
  // Every second pair, so neighbouring cards differ (blue, cyan, emerald).
  const accent = index * 2;

  return (
    <Reveal as="li" delay={Math.min(index, 6) * 0.05}>
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="card flex h-full flex-col"
        style={accentStyle(accent)}
      >
        <Poster aria-hidden index={accent} height={130}>
          {project.name}
        </Poster>
        <h3 className="mb-2 mt-3 text-xl">{project.name}</h3>
        <p className="text-[15px] text-[hsl(var(--text-muted))]">
          {project.description[locale]}
        </p>
      </Link>
    </Reveal>
  );
}
