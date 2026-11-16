// lib/format-date.ts

/** Short Gregorian date for cards, e.g. "Oct 15, 2026". Shared by server and client cards. */
export function formatShortDate(
  value: Date | string | null | undefined,
  locale: string,
): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat(`${locale}-u-ca-gregory`, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
