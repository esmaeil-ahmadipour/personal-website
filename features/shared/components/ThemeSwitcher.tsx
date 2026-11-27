"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

const ICON =
  "absolute inset-0 h-full w-full transition-[opacity,transform] duration-300 motion-reduce:transition-none";

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
      className="btn-press inline-flex h-8 flex-shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated)/0.55)] w-9 text-[13px] leading-none text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--text-primary))]"
      aria-label={isDark ? t("themeToLight") : t("themeToDark")}
    >
      {/* Icon follows the `dark` class on <html>, so it is right before hydration. */}
      <span aria-hidden className="relative block h-4 w-4">
        <svg
          viewBox="0 0 24 24"
          className={`${ICON} opacity-100 dark:rotate-90 dark:scale-50 dark:opacity-0`}
        >
          <circle cx="12" cy="12" r="4.5" className="fill-[hsl(var(--accent-text))]" />
          <circle cx="10.6" cy="10.6" r="1.4" className="fill-white" />
          <path
            d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            className="stroke-[hsl(var(--accent-text))]"
          />
        </svg>
        <svg
          viewBox="0 0 24 24"
          className={`${ICON} -rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100`}
        >
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" className="fill-white" />
          <path
            d="M17 3.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"
            className="fill-[hsl(var(--accent-blue))]"
          />
        </svg>
      </span>
    </button>
  );
}
