// src/components/Breadcrumb.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/shared/icons/HomeIcon";
import { ChevronRightIcon } from "@/shared/icons/ChevronRightIcon";
import { ChevronLeftIcon } from "@/shared/icons/ChevronLeftIcon";

export function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const paths = pathname.split("/").filter(Boolean);
  const isRTL = document.documentElement.dir === "rtl";

  const Separator = isRTL ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
      <Link
        href="/"
        className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1"
      >
        <HomeIcon size={16} />
        <span className="hidden sm:inline"> Home</span>
      </Link>

      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const isLast = index === paths.length - 1;
        const label = path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={href} className="flex items-center gap-1">
            <Separator size={16} className="text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 dark:text-white font-medium">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
