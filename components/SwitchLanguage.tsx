// مسیر: features/shared/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/i18n/request";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLocale = pathname.split("/")[1] || "en";
  const otherLocale =
    locales.find((locale) => locale !== currentLocale) || "en";

  const switchLanguage = () => {
    const segments = pathname.split("/");
    segments[1] = otherLocale;
    router.push(segments.join("/"));
  };

  const isDark = mounted && resolvedTheme === "dark";
  const isFa = currentLocale === "fa";

  return (
    <button
      onClick={switchLanguage}
      className={`
        group relative flex items-center gap-2 px-3 py-2 rounded-lg
        transition-all duration-300
        ${
          isDark
            ? "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:border-white/20"
            : "bg-gray-100/50 hover:bg-gray-200/50 text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-300"
        }
        hover:shadow-lg hover:scale-105 active:scale-95
        backdrop-blur-sm
      `}
      aria-label="Switch language"
    >
      {/* دکمه دایره‌ای با پرچم */}
      <div
        className={`
          relative w-7 h-7 rounded-full overflow-hidden flex items-center justify-center
          transition-transform duration-300 group-hover:scale-110
          ${isDark ? "bg-white/10" : "bg-white"}
        `}
      >
        <span className="text-lg leading-none">{isFa ? "🇮🇷" : "🇬🇧"}</span>
      </div>

      {/* نام زبان با انیمیشن */}
      <span
        className={`
          hidden sm:inline font-medium text-sm
          transition-all duration-300
          ${isFa ? "font-vazir" : ""}
        `}
      >
        {isFa ? "فارسی" : "English"}
      </span>

      {/* نشانگر تغییر */}
      <span
        className={`
          absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full
          transition-all duration-500
          ${
            isFa
              ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
              : "bg-blue-500 shadow-lg shadow-blue-500/50"
          }
          group-hover:scale-110
        `}
      />
    </button>
  );
}
