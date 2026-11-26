// features/projects/utils/localized.ts
export type Locale = "en" | "fa" | "ar";

/** Text for the locale; an empty or missing Fa/Ar text falls back to English. */
export function localized(
  locale: Locale,
  en: string | null,
  fa: string | null,
  ar: string | null,
): string {
  const value = locale === "fa" ? fa : locale === "ar" ? ar : en;
  return value?.trim() || en?.trim() || "";
}
