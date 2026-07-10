"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface BrandNameProps {
  className?: string;
  showText?: boolean;
}

export default function BrandName({
  className = "",
  showText = true,
}: BrandNameProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!showText) return null;

  // همگام با منطق پیش‌فرض لوگو در حالت SSR (پیش‌فرض روی تم تاریک)
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <span
      className={`
        text-lg font-bold tracking-tight hidden sm:inline
        bg-clip-text text-transparent transition-all duration-300
        ${
          isDark
            ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
            : "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"
        }
        ${className}
      `}
    >
      Tarvix
    </span>
  );
}
