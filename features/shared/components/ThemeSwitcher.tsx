"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

export function ThemeSwitcher() {
  const t = useTranslations();
  const { resolvedTheme, setTheme } = useTheme();
  // false during SSR and hydration, true afterwards (no setState inside an effect)
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="btn-press inline-flex h-8 flex-shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated)/0.55)] px-3.5 text-[13px] leading-none text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--text-primary))]"
      aria-label={isDark ? t("themeToLight") : t("themeToDark")}
    >
      <span aria-hidden>◐</span>
    </button>
  );
}
