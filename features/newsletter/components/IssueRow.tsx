// features/newsletter/components/IssueRow.tsx
import { getTranslations } from "next-intl/server";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";
import { accentStyle } from "@/lib/accent";
import { formatIssueDate, type NewsletterIssue } from "../data/issues";

export async function IssueRow({
  issue,
  locale,
  index = 0,
}: {
  issue: NewsletterIssue;
  locale: string;
  /** Position in the list; rotates the accent color. */
  index?: number;
}) {
  const t = await getTranslations({ locale });
  return (
    <Reveal as="li" delay={Math.min(index, 6) * 0.05}>
      <a
        href={issue.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3 px-6 py-[18px] sm:grid-cols-[64px_1fr_auto]"
        style={accentStyle(index * 2 + 1)}
      >
        <span
          aria-hidden
          dir="ltr"
          className="font-mono text-[22px] font-bold text-[color-mix(in_srgb,hsl(var(--c))_var(--badge-mix),hsl(var(--text-primary)))]"
        >
          #{issue.number}
        </span>
        <span className="sr-only">
          {t("nlIssue")} {issue.number}
        </span>
        <div>
          <h3 className="mb-0.5 mt-0 text-lg">{issue.title}</h3>
          <span className="text-[13px] text-[hsl(var(--text-muted))]">
            {formatIssueDate(issue.date, locale)}
          </span>
        </div>
        <Pill className="col-span-2 justify-self-start sm:col-span-1 sm:justify-self-auto">
          {t("nlOpen")}
        </Pill>
      </a>
    </Reveal>
  );
}
