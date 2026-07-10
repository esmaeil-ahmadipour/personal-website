// components/PreferencesDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

interface PreferencesDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function PreferencesDialog({
  open,
  onClose,
}: PreferencesDialogProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const handleLocaleChange = (newLocale: string) => {
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");
    const newPath = `/${newLocale}${pathnameWithoutLocale}`;
    router.push(newPath);
    onClose();
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  if (!mounted) return null;
  if (!open) return null;

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "fa", label: "فارسی", flag: "🇮🇷" },
    { code: "ar", label: "العربية", flag: "🇸🇦" },
  ];

  const themes = [
    { value: "light", label: "☀️ Light" },
    { value: "dark", label: "🌙 Dark" },
    { value: "system", label: "💻 System" },
  ];

  const currentTheme = resolvedTheme || theme || "system";
  const isDark = currentTheme === "dark";

  // رنگ‌های ثابت برای هر تم
  const getColors = () => {
    if (isDark) {
      return {
        bgSurface: "#1a1a1a",
        bgElevated: "#2d2d2d",
        textPrimary: "#f8f9fa",
        textSecondary: "#c8c8c8",
        borderSubtle: "#2d2d2d",
        shadowColor: "rgba(0,0,0,0.5)",
        activeBg: "rgba(59, 130, 246, 0.15)",
        activeBorder: "rgba(59, 130, 246, 0.3)",
        activeText: "#60a5fa",
      };
    }
    return {
      bgSurface: "#ffffff",
      bgElevated: "#f1f3f5",
      textPrimary: "#1a1a1a",
      textSecondary: "#4a4a4a",
      borderSubtle: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.15)",
      activeBg: "rgba(59, 130, 246, 0.1)",
      activeBorder: "rgba(59, 130, 246, 0.3)",
      activeText: "#3b82f6",
    };
  };

  const colors = getColors();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className={`
          fixed inset-0 z-[61] flex items-center justify-center p-4
          animate-in fade-in zoom-in-95 duration-200
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preferences-title"
      >
        <div
          className="relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden"
          style={{
            backgroundColor: colors.bgSurface,
            borderColor: colors.borderSubtle,
            boxShadow: `0 25px 50px -12px ${colors.shadowColor}`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 pt-5 pb-3 border-b"
            style={{
              borderColor: colors.borderSubtle,
            }}
          >
            <h2
              id="preferences-title"
              className="text-lg font-semibold"
              style={{ color: colors.textPrimary }}
            >
              Preferences
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              aria-label="Close preferences"
              style={{
                color: colors.textSecondary,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.bgElevated;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Language */}
            <div>
              <label
                className="text-sm font-medium block mb-3"
                style={{ color: colors.textSecondary }}
              >
                Language / زبان
              </label>
              <div className="grid grid-cols-3 gap-2">
                {languages.map((lang) => {
                  const isActive = locale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleLocaleChange(lang.code)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: isActive
                          ? colors.activeBg
                          : colors.bgElevated,
                        borderColor: isActive
                          ? colors.activeBorder
                          : colors.borderSubtle,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        color: isActive
                          ? colors.activeText
                          : colors.textSecondary,
                      }}
                    >
                      <span className="block text-base mb-0.5">
                        {lang.flag}
                      </span>
                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Separator */}
            <div
              className="border-t"
              style={{ borderColor: colors.borderSubtle }}
            />

            {/* Theme */}
            <div>
              <label
                className="text-sm font-medium block mb-3"
                style={{ color: colors.textSecondary }}
              >
                Appearance
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => {
                  const isActive = currentTheme === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => handleThemeChange(t.value)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        backgroundColor: isActive
                          ? colors.activeBg
                          : colors.bgElevated,
                        borderColor: isActive
                          ? colors.activeBorder
                          : colors.borderSubtle,
                        borderWidth: "1px",
                        borderStyle: "solid",
                        color: isActive
                          ? colors.activeText
                          : colors.textSecondary,
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 py-4 border-t"
            style={{
              borderColor: colors.borderSubtle,
              backgroundColor: isDark
                ? "rgba(255, 255, 255, 0.03)"
                : "rgba(0, 0, 0, 0.02)",
            }}
          >
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl transition-colors text-sm font-medium"
              style={{
                backgroundColor: colors.bgElevated,
                color: colors.textSecondary,
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
