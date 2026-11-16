// app/[locale]/projects/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectsGrid } from "@/features/projects/components/ProjectsGrid";

const SITE_URL = "https://tarvix.org";
const LOCALES = ["en", "fa", "ar"] as const;

type Props = { params: Promise<{ locale: string }> };

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

export default async function ProjectsPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale = (LOCALES as readonly string[]).includes(raw)
    ? (raw as (typeof LOCALES)[number])
    : "en";
  const t = await getTranslations({ locale });

  return (
    <>
      <Navbar />
      <main>
        <PageHero title={t("prTitle")} sub={t("prSub")} />
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
          <ProjectsGrid locale={locale} />
        </div>
      </main>
      <Footer />
    </>
  );
}
