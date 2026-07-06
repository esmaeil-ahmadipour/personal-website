// app/[locale]/blog/page.tsx

import { Metadata } from "next";
import { BlogList } from "@/features/blog-list";
import { Navbar } from "@/features/shared/components/SimpleNavbar";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

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
  const isRTL = locale === "fa";

  return (
    <>
      <Navbar showBack />
      <div className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Breadcrumb + Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/${locale}`}
                className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors"
              >
                {t("home")}
              </Link>
              <span className="text-[var(--border-strong)]">
                {isRTL ? "«" : "/"}
              </span>
              <span className="text-[var(--text-primary)] font-medium">
                {t("blogBadge")}
              </span>
            </div>

            {/* Badge - سمت راست */}
            <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-[var(--accent-blue)] bg-[var(--accent-blue-bg)] px-4 py-1.5 rounded-full border border-[var(--border-subtle)] whitespace-nowrap">
              {t("blogBadge")}
            </span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              {t("blogTitle")}
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
              {t("blogSubtitle")}
            </p>
          </div>

          {/* Blog List */}
          <BlogList
            locale={locale as "en" | "fa"}
            initialPage={1}
            initialLimit={10}
          />
        </div>
      </div>
    </>
  );
}
