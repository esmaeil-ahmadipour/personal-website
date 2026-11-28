// features/newsletter/components/IssueSlideCard.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LINKEDIN_NEWSLETTER_URL } from "../config";
import { formatIssueMonth, formatIssueNumber } from "../lib/format";
import type { IssueSummary } from "../services/newsletter.service";

const CARD =
  "block transition-transform duration-500 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const TITLE =
  "mb-1 mt-3.5 line-clamp-2 block text-[15px] font-bold leading-snug text-[hsl(var(--text-primary))]";
const LINKEDIN_BADGE =
  "flex h-[34px] min-w-[34px] items-center justify-center rounded-full bg-[#0A66C2] px-2.5 text-xs font-bold text-white";

/** Narrow issue card for the home newsletter slider (width set by .card-track). */
export async function IssueSlideCard({ issue, locale }: { issue: IssueSummary; locale: string }) {
  const t = await getTranslations({ locale });
  const meta = [
    formatIssueMonth(issue.publishedAt, locale),
    issue.readingTimeMin ? t("hmMin", { n: issue.readingTimeMin }) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link href={`/${locale}/newsletter/${issue.number}`} className={CARD}>
      <div className="cover-slot grid aspect-[176/224] w-full place-items-center rounded-xl border border-[hsl(var(--border-subtle))]">
        <span
          aria-hidden
          dir="ltr"
          className="text-6xl font-extrabold tracking-tight text-[hsl(var(--text-primary))]"
        >
          #{formatIssueNumber(issue.number)}
        </span>
        <span aria-hidden className={`absolute bottom-2 end-2 ${LINKEDIN_BADGE}`}>
          in
        </span>
      </div>
      <span className={TITLE}>{issue.title}</span>
      {issue.authorName && (
        <span className="block text-sm text-[hsl(var(--text-secondary))]">{issue.authorName}</span>
      )}
      <span className="mt-0.5 block text-[13px] text-[hsl(var(--text-muted))]">{meta}</span>
    </Link>
  );
}

/** Last card of the slider: opens the LinkedIn newsletter. */
export async function FollowSlideCard({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  return (
    <a
      href={LINKEDIN_NEWSLETTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={CARD}
    >
      <div className="grid aspect-[176/224] w-full place-items-center rounded-xl bg-[hsl(var(--accent-blue))] text-white">
        <span className="flex flex-col items-center gap-2.5">
          <span aria-hidden className="text-[56px] font-extrabold leading-none">in</span>
          <span className="px-3 text-center font-bold">{t("nlFollowShort")}</span>
        </span>
      </div>
      <span className={TITLE}>{t("nlGetNew")}</span>
      <span className="block text-sm text-[hsl(var(--text-secondary))]">{t("nlPublishedOn")}</span>
      <span className="mt-0.5 block text-[13px] text-[hsl(var(--text-muted))]">
        {t("nlLangsOnSite")}
      </span>
    </a>
  );
}
