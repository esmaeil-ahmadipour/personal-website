// app/components/Navbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@/features/shared/components/icons/ArrowLeftIcon";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0a0e12]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="بازگشت به خانه"
            >
              <ArrowLeftIcon size={20} />
            </Link>
          )}
          <Link
            href="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          >
            TARVIX
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* ... دکمه‌های دیگر مانند theme toggle, lang toggle ... */}
        </div>
      </div>
    </nav>
  );
}
