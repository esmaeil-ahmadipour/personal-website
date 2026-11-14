// features/newsletter/components/NewsletterSection.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LINKEDIN_NEWSLETTER_URL, getLatestIssues } from "../data/issues";
import { IssueRow } from "./IssueRow";

export async function NewsletterSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const issues = getLatestIssues(3);
  if (issues.length === 0) return null;

  return (
    <section id="newsletter" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t("nlTitle")}</h2>
          <p className="mt-1 text-[hsl(var(--text-secondary))]">{t("nlSub")}</p>
        </div>
        <a
          href={LINKEDIN_NEWSLETTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center rounded-lg bg-[hsl(var(--accent))] px-5 text-sm font-semibold text-[hsl(var(--accent-ink))] transition-colors hover:bg-[hsl(var(--accent-hover))]"
        >
          {t("nlSubscribe")}
        </a>
      </div>

      <ul className="flex flex-col gap-3">
        {issues.map((issue) => (
          <IssueRow key={issue.number} issue={issue} locale={locale} />
        ))}
      </ul>

      <Link
        href={`/${locale}/newsletter`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(var(--accent))] hover:underline"
      >
        {t("nlArchive")} <span aria-hidden className="rtl-flip inline-block">→</span>
      </Link>
    </section>
  );
}
