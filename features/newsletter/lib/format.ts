// features/newsletter/lib/format.ts

/** "Nov 2026": Gregorian month and year in every locale. */
export function formatIssueMonth(date: Date | string, locale: string): string {
  return new Intl.DateTimeFormat(`${locale}-u-ca-gregory`, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export const formatIssueNumber = (value: number) => String(value).padStart(2, "0");
