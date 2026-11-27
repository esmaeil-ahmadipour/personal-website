// app/[locale]/projects/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ProjectKind } from "@prisma/client";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { ProjectsGrid } from "@/features/projects/components/ProjectsGrid";
import { listPublishedProjects } from "@/features/projects/services/projects.service";
import { KIND_KEY } from "@/features/projects/utils/labels";

const SITE_URL = "https://tarvix.org";
const LOCALES = ["en", "fa", "ar"] as const;

type Props = { params: Promise<{ locale: string }> };
type PageProps = Props & { searchParams: Promise<{ kind?: string | string[] }> };

const KINDS = Object.keys(KIND_KEY) as ProjectKind[];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const path = (l: string) => `${SITE_URL}/${l}/projects`;
  return {
    title: t("prTitle"),
    description: t("prSub"),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(LOCALES.map((l) => [l, path(l)])),
    },
  };
}

export default async function ProjectsPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params;
  const locale = (LOCALES as readonly string[]).includes(raw)
    ? (raw as (typeof LOCALES)[number])
    : "en";
  // An unknown ?kind= value shows all projects.
  const { kind: rawKind } = await searchParams;
  const kind = KINDS.find((k) => k === rawKind);
  const [t, projects] = await Promise.all([
    getTranslations({ locale }),
    listPublishedProjects(kind),
  ]);
  const basePath = `/${locale}/projects`;
  const filters = [
    { value: undefined, label: t("prFilterAll"), href: basePath },
    ...KINDS.map((k) => ({ value: k, label: t(KIND_KEY[k]), href: `${basePath}?kind=${k}` })),
  ];

  return (
    <>
      <Navbar />
      <main className="site-w">
        <header className="hx-header border-b border-[hsl(var(--border-subtle))] py-16">
          <HeaderArt variant="projects" />
          <p className="text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
            {t("prTitle")}
          </p>
          <h1 className="my-4 text-4xl font-extrabold sm:text-[56px] sm:leading-[1.08]">
            {t("prHeadline")}
          </h1>
          <p className="max-w-[640px] text-lg">{t("prSub")}</p>
        </header>

        <nav aria-label={t("prFilterLabel")} className="flex flex-wrap gap-2 py-8">
          {filters.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              scroll={false}
              className="pill"
              aria-current={f.value === kind ? "page" : undefined}
            >
              {f.label}
            </Link>
          ))}
        </nav>

        {projects.length > 0 ? (
          <ProjectsGrid projects={projects} locale={locale} />
        ) : (
          <p className="text-[hsl(var(--text-muted))]">{t("prEmpty")}</p>
        )}
      </main>
      <Footer />
    </>
  );
}
