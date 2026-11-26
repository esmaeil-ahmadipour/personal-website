// features/projects/components/ProjectCard.tsx
import Link from "next/link";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { Reveal } from "@/components/ui/Reveal";
import type { ProjectCardData } from "../services/projects.service";
import { KIND_NOTE_KEY, projectMeta } from "../utils/labels";
import { localized, type Locale } from "../utils/localized";

export function ProjectCard({
  project,
  locale,
  index,
  t,
}: {
  project: ProjectCardData;
  locale: Locale;
  index: number;
  t: (key: string) => string;
}) {
  return (
    <Reveal as="li" delay={Math.min(index, 6) * 0.05}>
      <Link href={`/${locale}/projects/${project.slug}`} className="group block">
        <CoverMedia
          src={project.coverImageUrl}
          sizes="(max-width: 640px) 100vw, 520px"
          className="h-[220px] w-full rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] transition-colors group-hover:border-[hsl(var(--accent-blue))] sm:h-[260px]"
        />
        <p className="mt-4 text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
          {t(KIND_NOTE_KEY[project.kind])}
        </p>
        <h3 className="mt-1 text-[22px] transition-colors group-hover:text-[hsl(var(--accent-text))]">
          {project.name}
        </h3>
        <p className="mt-1 text-sm text-[hsl(var(--text-muted))]">
          {projectMeta(t, project, { withKind: true })}
        </p>
        <p className="mt-1">
          {localized(
            locale,
            project.descriptionEn,
            project.descriptionFa,
            project.descriptionAr,
          )}
        </p>
      </Link>
    </Reveal>
  );
}
