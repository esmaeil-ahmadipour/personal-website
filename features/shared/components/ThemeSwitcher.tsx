"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-7 w-12 flex-shrink-0 rounded-full border border-[hsl(var(--border-strong))] bg-[hsl(var(--bg-surface))] transition-colors hover:border-[hsl(var(--accent))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))]"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span
        className={`absolute start-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--accent))] text-[10px] text-[hsl(var(--accent-ink))] transition-transform duration-200 ${
          isDark ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
