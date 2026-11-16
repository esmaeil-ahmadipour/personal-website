// app/[locale]/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageOrbs } from "@/components/ui/PageHero";
import { Poster } from "@/components/ui/Poster";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { accentStyle } from "@/lib/accent";
import { PROJECTS } from "@/features/projects/data/projects";
import { ProjectCard } from "@/features/projects/components/ProjectCard";

const SITE_URL = "https://tarvix.org";
const LOCALES = ["en", "fa", "ar"] as const;
type Locale = (typeof LOCALES)[number];

type Props = { params: Promise<{ locale: string; slug: string }> };

const toLocale = (raw: string): Locale =>
  (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : "en";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => PROJECTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  const path = (l: string) => `${SITE_URL}/${l}/projects/${slug}`;
  return {
    title: `${project.name} | Tarvix`,
    description: project.description[locale],
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(LOCALES.map((l) => [l, path(l)])),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = PROJECTS[index];
  const t = await getTranslations({ locale });
  const placeholder = t("prPlaceholder");
  const sections = [
    { title: t("prOverview"), text: project.overview?.[locale] },
    { title: t("prStack"), text: project.stack?.[locale] },
    { title: t("prStatus"), text: project.status?.[locale] },
  ];
  const others = PROJECTS.map((p, i) => ({ p, i })).filter(({ p }) => p.slug !== slug);

  return (
    <>
      <Navbar />
      <main>
        <section className="relative isolate mx-auto max-w-7xl px-4 pb-4 sm:px-8">
          <PageOrbs />
          <Link
            href={`/${locale}/projects`}
            className="mb-2 mt-9 inline-block rounded-md text-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
          >
            <span aria-hidden className="rtl-flip inline-block">←</span> {t("navProjects")}
          </Link>

          <div className="mt-2 grid items-center gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12">
            <div className="animate-fade-up">
              <Badge accent={index * 2}>{project.category?.[locale] ?? placeholder}</Badge>
              <h1 className="my-4 text-4xl sm:text-5xl lg:text-[52px]">{project.name}</h1>
              <p className="text-[19px] text-[hsl(var(--text-secondary))]">
                {project.description[locale]}
              </p>
              {(project.url || project.sourceUrl) && (
                <div className="mt-5 flex flex-wrap gap-3.5">
                  {project.url && (
                    <ButtonLink href={project.url} external>
                      {t("prVisit")}
                    </ButtonLink>
                  )}
                  {project.sourceUrl && (
                    <ButtonLink href={project.sourceUrl} variant="ghost" external>
                      {t("prSource")}
                    </ButtonLink>
                  )}
                </div>
              )}
            </div>
            <Poster
              aria-hidden
              index={index * 2}
              height={320}
              className="animate-float-slow rounded-[24px] text-[28px]"
            >
              {project.name}
            </Poster>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-8">
          <ul className="grid gap-6 md:grid-cols-3">
            {sections.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.05} className="h-full">
                <div
                  className="card h-full hover:transform-none"
                  style={accentStyle(i)}
                >
                  <h2 className="text-xl">{s.title}</h2>
                  <p className="mt-2 text-[15px] text-[hsl(var(--text-muted))]">
                    {s.text ?? placeholder}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </section>

        {others.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-8">
            <SectionHead title={t("prMore")} />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map(({ p, i }) => (
                <ProjectCard key={p.slug} project={p} locale={locale} index={i} />
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
