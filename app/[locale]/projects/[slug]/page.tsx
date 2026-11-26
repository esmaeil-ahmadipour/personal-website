// app/[locale]/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CoverMedia } from "@/components/ui/CoverMedia";
import {
  getNextProject,
  getProjectBySlug,
} from "@/features/projects/services/projects.service";
import { KIND_KEY, projectMeta } from "@/features/projects/utils/labels";
import { localized } from "@/features/projects/utils/localized";
import { formatShortDate } from "@/lib/format-date";

const SITE_URL = "https://tarvix.org";
const LOCALES = ["en", "fa", "ar"] as const;
type Locale = (typeof LOCALES)[number];

type Props = { params: Promise<{ locale: string; slug: string }> };

const toLocale = (raw: string): Locale =>
  (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : "en";

const LABEL =
  "text-[13px] font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]";
const SECTION = "border-b border-[hsl(var(--border-subtle))] py-16";
const ROW =
  "group flex items-baseline gap-6 border-b border-[hsl(var(--border-subtle))] py-5";
const ROW_TITLE =
  "flex-1 text-lg font-semibold text-[hsl(var(--text-primary))] transition-colors group-hover:text-[hsl(var(--accent-blue))] sm:text-[22px]";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const path = (l: string) => `${SITE_URL}/${l}/projects/${slug}`;
  return {
    title: `${project.name} | Tarvix`,
    description: localized(
      locale,
      project.descriptionEn,
      project.descriptionFa,
      project.descriptionAr,
    ),
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(LOCALES.map((l) => [l, path(l)])),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = toLocale(raw);
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [t, next] = await Promise.all([
    getTranslations({ locale }),
    getNextProject(slug),
  ]);
  const description = localized(
    locale,
    project.descriptionEn,
    project.descriptionFa,
    project.descriptionAr,
  );
  // Blank lines in the overview separate paragraphs.
  const overview = localized(
    locale,
    project.overviewEn,
    project.overviewFa,
    project.overviewAr,
  )
    .split(/\n\s*\n/)
    .filter(Boolean);
  const hasLinks = Boolean(project.url || project.sourceUrl);

  return (
    <>
      <Navbar />
      <main className="site-w">
        <header className={`hx-header ${SECTION}`}>
          <HeaderArt variant="project" />
          <Link
            href={`/${locale}/projects`}
            className="rounded-md text-sm text-[hsl(var(--text-muted))] transition-colors hover:text-[hsl(var(--text-primary))]"
          >
            <span aria-hidden className="rtl-flip inline-block">←</span> {t("prAll")}
          </Link>
          <p className="mt-6 text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
            {t(KIND_KEY[project.kind])}
          </p>
          <h1 className="my-4 text-4xl font-extrabold sm:text-[56px] sm:leading-[1.08]">
            {project.name}
          </h1>
          <p className="text-sm text-[hsl(var(--text-muted))]">
            {projectMeta(t, project, { withKind: false })}
          </p>
        </header>

        <div className={SECTION}>
          <CoverMedia
            src={project.coverImageUrl}
            alt={project.name}
            priority
            sizes="(max-width: 1120px) 100vw, 1040px"
            className="h-[240px] w-full rounded-[var(--radius-poster)] border border-[hsl(var(--border-subtle))] sm:h-[420px]"
          />
        </div>

        <div className={`${SECTION} grid gap-8 md:grid-cols-2`}>
          <section>
            <h2 className={LABEL}>{t("prOverview")}</h2>
            <p className="mt-4 text-lg">{description}</p>
            {overview.map((text, i) => (
              <p key={i} className="mt-4">
                {text}
              </p>
            ))}
          </section>

          {(project.stack.length > 0 || hasLinks) && (
            <div className="flex flex-col gap-8">
              {project.stack.length > 0 && (
                <section>
                  <h2 className={LABEL}>{t("prStack")}</h2>
                  <p className="mt-4 text-lg">
                    <bdi dir="ltr">{project.stack.join(" · ")}</bdi>
                  </p>
                </section>
              )}
              {hasLinks && (
                <section>
                  <h2 className={LABEL}>{t("prLinks")}</h2>
                  <div className="mt-4 flex flex-wrap gap-3.5">
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
                </section>
              )}
            </div>
          )}
        </div>

        {project.posts.length > 0 && (
          <section className="pt-16">
            <h2 className={`${LABEL} mb-4`}>{t("prRelated")}</h2>
            <ul>
              {project.posts.map(({ post }) => (
                <li key={post.slug}>
                  <Link href={`/${locale}/blog/${post.slug}`} className={ROW}>
                    <span className={ROW_TITLE}>
                      {localized(locale, post.titleEn, post.titleFa, post.titleAr)}
                    </span>
                    <span className="text-sm text-[hsl(var(--text-muted))]">
                      {[
                        localized(
                          locale,
                          post.category.nameEn,
                          post.category.nameFa,
                          post.category.nameAr,
                        ),
                        formatShortDate(post.publishedAt, locale),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {next && (
          <section className="pt-16">
            <h2 className={`${LABEL} mb-4`}>{t("prNext")}</h2>
            <Link href={`/${locale}/projects/${next.slug}`} className={ROW}>
              <span className={ROW_TITLE}>{next.name}</span>
              <span aria-hidden className="rtl-flip inline-block text-[hsl(var(--text-muted))]">
                →
              </span>
            </Link>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
