// features/newsletter/components/IssueRow.tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { formatIssueMonth, formatIssueNumber } from "../lib/format";
import type { IssueSummary } from "../services/newsletter.service";

/** One archive line: number, title, summary, date and a "Read" pill. Links to the issue page. */
export async function IssueRow({
  issue,
  locale,
  index = 0,
}: {
  issue: IssueSummary;
  locale: string;
  /** Position in the list; staggers the reveal animation. */
  index?: number;
}) {
  const t = await getTranslations({ locale });
  const meta = [
    formatIssueMonth(issue.publishedAt, locale),
    issue.readingTimeMin ? t("hmMin", { n: issue.readingTimeMin }) : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Reveal as="li" delay={Math.min(index, 6) * 0.05}>
      <Link
        href={`/${locale}/newsletter/${issue.number}`}
        className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-b border-[hsl(var(--border-subtle))] py-5 sm:grid-cols-[64px_1fr_auto_auto] sm:items-center sm:gap-x-6"
      >
        <span
          aria-hidden
          dir="ltr"
          className="text-start font-extrabold text-[hsl(var(--accent-blue))]"
        >
          #{formatIssueNumber(issue.number)}
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="sr-only">
            {t("nlIssue")} {issue.number}
          </span>
          <span className="text-lg font-semibold text-[hsl(var(--text-primary))] transition-colors group-hover:text-[hsl(var(--accent-blue))] sm:text-[22px]">
            {issue.title}
          </span>
          {issue.summary && (
            <span className="text-[hsl(var(--text-secondary))]">{issue.summary}</span>
          )}
        </span>
        <span className="col-start-2 text-sm text-[hsl(var(--text-muted))] sm:col-start-auto">
          {meta}
        </span>
        <Pill className="col-start-2 justify-self-start sm:col-start-auto sm:justify-self-auto">
          {t("nlRead")} <span aria-hidden className="rtl-flip inline-block">→</span>
        </Pill>
      </Link>
    </Reveal>
  );
}
