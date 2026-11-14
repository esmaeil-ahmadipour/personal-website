// features/projects/components/ProjectsSection.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProjectsGrid } from "./ProjectsGrid";

type Locale = "en" | "fa" | "ar";

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("prTitle")}</h2>
          <p className="mt-1 text-[hsl(var(--text-secondary))]">{t("prSub")}</p>
        </div>
        <Link
          href={`/${locale}/projects`}
          className="text-sm font-semibold text-[hsl(var(--accent))] hover:underline"
        >
          {t("prAll")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </Link>
      </div>
      <ProjectsGrid locale={locale} />
    </section>
  );
}
