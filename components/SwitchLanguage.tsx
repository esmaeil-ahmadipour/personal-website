// مسیر: src/components/LanguageSwitcher.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
 import { locales } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split("/")[1] || "en";
  const otherLocale =
    locales.find((locale) => locale !== currentLocale) || "en";

  const switchLanguage = () => {
    const segments = pathname.split("/");
    segments[1] = otherLocale;
    router.push(segments.join("/"));
  };

  return (
    <button
      onClick={switchLanguage}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
        color: "white",
        fontWeight: "500",
        fontSize: "14px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #6d28d9, #1d4ed8)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(124, 58, 237, 0.4)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg, #7c3aed, #2563eb)";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(124, 58, 237, 0.3)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label="Switch language"
    >
       <span>{otherLocale === "fa" ? "فارسی" : "English"}</span>
    </button>
  );
}
