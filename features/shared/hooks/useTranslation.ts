// features/shared/hooks/useTranslation.ts
import { useLocale, useTranslations as useNextTranslations } from "next-intl";

type Lang = "en" | "fa"| "ar";

export function useTranslation() {
  const locale = useLocale() as Lang;
  const isRTL = locale === "fa" || locale === "ar";
  const t = useNextTranslations();

  return {
    t,
    locale,
    isRTL,
  };
}
