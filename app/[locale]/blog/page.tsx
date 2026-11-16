// app/[locale]/blog/page.tsx

import { Metadata } from "next";
import { BlogList } from "@/features/blog-list";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("blogTitle")} | Tarvix`,
    description: t("blogSubtitle"),
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = await getTranslations();

  return (
    <>
      <Navbar />
      <main>
        <PageHero title={t("navBlog")} />
        <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-8">
          <BlogList
            locale={locale as "en" | "fa" | "ar"}
            initialPage={1}
            initialLimit={10}
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
