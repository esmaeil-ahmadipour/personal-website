// features/newsletter/components/IssueRow.tsx
import { getTranslations } from "next-intl/server";
import { formatIssueDate, type NewsletterIssue } from "../data/issues";

export async function IssueRow({
  issue,
  locale,
}: {
  issue: NewsletterIssue;
  locale: string;
}) {
  const t = await getTranslations({ locale });
  return (
    <li>
      <a
        href={issue.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3"
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--accent))]">
          {t("nlIssue")} {issue.number}
        </span>
        <span className="min-w-0 flex-1 font-semibold">{issue.title}</span>
        <span className="text-sm text-[hsl(var(--text-muted))]">
          {formatIssueDate(issue.date, locale)}
        </span>
        <span className="text-sm font-medium text-[hsl(var(--accent))]">
          {t("nlOpen")}
        </span>
      </a>
    </li>
  );
}
