// app/[locale]/blog/page.tsx

import { Metadata } from "next";
import { Suspense } from "react";
import { BlogList, BlogListSkeleton } from "@/features/blog-list";
import Navbar from "@/features/shared/components/Navbar";
import Footer from "@/features/shared/components/Footer";
import { HeaderArt } from "@/components/ui/HeaderArt";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("blogTitle")} | Tarvix`,
    description: t("blogSubtitle"),
  };
}

export default async function BlogPage() {
  const t = await getTranslations();

  return (
    <>
      <Navbar />
      <main className="site-w">
        <header className="hx-header border-b border-[hsl(var(--border-subtle))] py-16">
          <HeaderArt variant="blog" />
          <p className="text-xs font-semibold text-[hsl(var(--text-muted))] ltr:uppercase ltr:tracking-[0.14em]">
            {t("navBlog")}
          </p>
          <h1 className="my-4 text-4xl font-extrabold sm:text-[56px] sm:leading-[1.08]">
            {t("blHeadline")}
          </h1>
          <p className="max-w-[640px] text-lg">{t("blogSubtitle")}</p>
        </header>
        {/* BlogList reads the URL (useSearchParams), which needs a Suspense boundary. */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
