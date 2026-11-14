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
      className="btn-press inline-flex h-8 flex-shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-elevated)/0.55)] px-3.5 text-[13px] leading-none text-[hsl(var(--text-secondary))] transition-colors hover:text-[hsl(var(--text-primary))]"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span aria-hidden>◐</span>
    </button>
  );
}
