"use client";

import { useState, useRef, useEffect } from "react";
import { PageSizeOptions, type PageSize } from "../schemas/blog-list.schema";
import { useTranslation } from "@/features/shared/hooks/useTranslation";

interface BlogPageSizeSelectorProps {
  value: PageSize;
  onChange: (value: PageSize) => void;
}

export function BlogPageSizeSelector({
  value,
  onChange,
}: BlogPageSizeSelectorProps) {
  const { t, locale } = useTranslation();
  const isRTL = locale === "fa";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // بستن منو وقتی کلیک بیرون از آن انجام می‌شود
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}
      ref={dropdownRef}
    >
      <label className="text-sm font-medium text-[var(--text-secondary)] dark:text-[var(--text-secondary)]">
        {isRTL ? "نمایش:" : "Show:"}
      </label>

      {/* کانتینر اصلی دراپ‌داون */}
      <div className="relative">
        {/* دکمه‌ای که جایگزین سلکت می‌شود */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            px-3 py-1.5 pr-8 text-sm rounded-lg
            bg-white dark:bg-[var(--bg-elevated)]
            border border-gray-300 dark:border-[var(--border-strong)]
            text-gray-700 dark:text-gray-200
            hover:border-[var(--accent-blue)]/50
            focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-[var(--accent-blue)]
            outline-none transition-all
            cursor-pointer min-w-[70px]
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          {value}
        </button>

        {/* آیکون فلش پایین */}
        <div
          className={`
          absolute inset-y-0 flex items-center pointer-events-none
          ${isRTL ? "left-2" : "right-2"}
        `}
        >
          <svg
            className={`w-4 h-4 text-gray-400 dark:text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* لیست بازشونده (گزینه‌ها) */}
        {isOpen && (
          <div
            className={`
              absolute top-full mt-2 w-full min-w-[70px] rounded-lg shadow-lg z-50
              bg-white dark:bg-[#1f2937]
              border border-gray-200 dark:border-[var(--border-strong)]
              overflow-hidden py-1
              ${isRTL ? "left-0 text-right" : "left-0 text-left"}
            `}
          >
            {PageSizeOptions.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onChange(size);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-3 py-1.5 text-sm text-left transition-colors
                  ${
                    value === size
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
