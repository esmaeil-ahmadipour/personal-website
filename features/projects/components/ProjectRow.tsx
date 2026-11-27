// features/projects/components/ProjectRow.tsx
import Link from "next/link";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { Reveal } from "@/components/ui/Reveal";
import type { HomeProjectData } from "../services/projects.service";
import { projectRowMeta } from "../utils/labels";
import type { Locale } from "../utils/localized";

/** Compact row of the home projects showcase. */
export function ProjectRow({
  project,
  locale,
  index,
  t,
}: {
  project: HomeProjectData;
  locale: Locale;
  index: number;
  t: (key: string) => string;
}) {
  return (
    <Reveal as="li" delay={Math.min(index, 6) * 0.05}>
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="flex items-center gap-4 rounded-[14px] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] p-4 transition duration-500 hover:border-[hsl(var(--accent-blue))] ltr:hover:translate-x-1.5 rtl:hover:-translate-x-1.5 motion-reduce:transition-none motion-reduce:hover:translate-x-0"
      >
        <CoverMedia
          src={project.coverImageUrl}
          sizes="76px"
          className="h-[76px] w-[76px] flex-none rounded-xl"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[17px] font-bold text-[hsl(var(--text-primary))]">
            {project.name}
          </span>
          <span className="mt-1 block text-[13px] text-[hsl(var(--text-muted))]">
            {projectRowMeta(t, project)}
          </span>
        </span>
        <span aria-hidden className="rtl-flip inline-block text-xl text-[hsl(var(--text-muted))]">
          →
        </span>
      </Link>
    </Reveal>
  );
}
