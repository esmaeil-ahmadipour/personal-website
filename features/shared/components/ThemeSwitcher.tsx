"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  if (!mounted) {
    return (
      <button
        className="relative w-12 h-7 rounded-full bg-white/5 border border-white/10 flex-shrink-0"
        aria-label="Toggle theme"
      >
        <span className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg shadow-blue-500/20 flex items-center justify-center text-[10px]">
          🌙
        </span>
      </button>
    );
  }

  const currentTheme = resolvedTheme || theme || "dark";
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={toggle}
      className="relative w-12 h-7 rounded-full bg-white/5 border border-white/10 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30 flex-shrink-0"
      aria-label="Toggle theme"
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-br 
          from-blue-400 to-purple-400 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          shadow-lg shadow-blue-500/20 flex items-center justify-center text-[10px]
          ${isDark ? "translate-x-5" : "translate-x-0"}
        `}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
