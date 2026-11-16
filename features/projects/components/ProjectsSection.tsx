// features/projects/components/ProjectsSection.tsx
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHead } from "@/components/ui/SectionHead";
import { ProjectsGrid } from "./ProjectsGrid";

type Locale = "en" | "fa" | "ar";

export async function ProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-20 sm:px-8">
      <SectionHead title={t("prTitle")} sub={t("prSub")}>
        <ButtonLink href={`/${locale}/projects`} variant="ghost" size="sm">
          {t("prAll")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </ButtonLink>
      </SectionHead>
      <ProjectsGrid locale={locale} />
    </section>
  );
}
