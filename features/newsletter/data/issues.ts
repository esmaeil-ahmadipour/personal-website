// features/newsletter/data/issues.ts
// The newsletter is published on LinkedIn; this site only keeps the archive.
// TODO: replace the sample entries below with real issues (newest first not required).

export const LINKEDIN_NEWSLETTER_URL =
  "https://www.linkedin.com/newsletters/"; // TODO: your newsletter URL

export interface NewsletterIssue {
  number: number;
  title: string;
  /** ISO date, e.g. "2026-10-15" */
  date: string;
  /** Link to the issue on LinkedIn */
  url: string;
}

export const ISSUES: NewsletterIssue[] = [
  { number: 3, title: "[Issue title]", date: "2026-10-15", url: LINKEDIN_NEWSLETTER_URL },
  { number: 2, title: "[Issue title]", date: "2026-09-15", url: LINKEDIN_NEWSLETTER_URL },
  { number: 1, title: "[Issue title]", date: "2026-08-15", url: LINKEDIN_NEWSLETTER_URL },
];

const sorted = () =>
  [...ISSUES].sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number);

export function getLatestIssues(count = 3): NewsletterIssue[] {
  return sorted().slice(0, count);
}

/** Newest year first; issues inside each year newest first. */
export function groupIssuesByYear(): { year: string; issues: NewsletterIssue[] }[] {
  const map = new Map<string, NewsletterIssue[]>();
  for (const issue of sorted()) {
    const year = issue.date.slice(0, 4);
    map.set(year, [...(map.get(year) ?? []), issue]);
  }
  return [...map].map(([year, issues]) => ({ year, issues }));
}

export function formatIssueDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(`${locale}-u-ca-gregory`, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
