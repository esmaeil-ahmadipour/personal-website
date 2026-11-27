// features/projects/components/FeaturedProjectCard.tsx
import Link from "next/link";
import { CoverMedia } from "@/components/ui/CoverMedia";
import { Reveal } from "@/components/ui/Reveal";
import type { HomeProjectData } from "../services/projects.service";
import { KIND_NOTE_KEY, STAGE_KEY } from "../utils/labels";
import { localized, type Locale } from "../utils/localized";

/** Large card of the home projects showcase. */
export function FeaturedProjectCard({
  project,
  locale,
  t,
}: {
  project: HomeProjectData;
  locale: Locale;
  t: (key: string) => string;
}) {
  const stack = project.stack.slice(0, 3).join(" · ");
  return (
    <Reveal className="h-full">
      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] transition duration-500 hover:-translate-y-1.5 hover:border-[hsl(var(--accent-blue))] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      >
        <div className="relative">
          <CoverMedia
            src={project.coverImageUrl}
            sizes="(max-width: 1024px) 100vw, 640px"
            className="h-[220px] w-full border-b border-[hsl(var(--border-subtle))] sm:h-[260px]"
          />
          <span className="absolute start-4 top-4 rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-surface))] px-3 py-1 text-xs font-semibold text-[hsl(var(--text-secondary))]">
            {t(STAGE_KEY[project.stage])}
          </span>
        </div>
        <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
          <p className="text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
            {t("prFeatured")} · {t(KIND_NOTE_KEY[project.kind])}
          </p>
          <h3 className="mt-1 text-[28px] font-extrabold sm:text-[32px]">{project.name}</h3>
          <p className="mb-4 mt-1.5 line-clamp-2 text-[hsl(var(--text-secondary))]">
            {localized(
              locale,
              project.descriptionEn,
              project.descriptionFa,
              project.descriptionAr,
            )}
          </p>
          <div className="mt-auto flex items-center justify-between gap-4">
            <span className="text-sm text-[hsl(var(--text-muted))]">{stack}</span>
            <span className="font-semibold text-[hsl(var(--accent-text))]">
              {t("prViewProject")}
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
