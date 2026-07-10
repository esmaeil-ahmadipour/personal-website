// src/shared/components/NavLinks.tsx
"use client";

import { ReactNode } from "react";

export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavLinksProps {
  items: NavLinkItem[];
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  iconContainerClassName?: string;
  activeIconContainerClassName?: string;
  inactiveIconContainerClassName?: string;
  showActiveIndicator?: boolean;
  onItemClick?: (item: NavLinkItem) => void;
}

export function NavLinks({
  items,
  className = "space-y-1",
  itemClassName = "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium group",
  activeClassName = "font-bold border-2 border-[var(--text-primary)]/10 bg-[var(--text-primary)]/5", // ✅ بک‌گراند خیلی ملایم
  inactiveClassName = "border border-transparent hover:border-[var(--border-subtle)]/20 hover:bg-[var(--text-primary)]/3", // ✅ بک‌گراند خیلی ملایم در hover
  iconContainerClassName = "flex items-center justify-center w-9 h-9 rounded-lg border transition-colors",
  activeIconContainerClassName = "border-[var(--text-primary)]/10 bg-[var(--text-primary)]/5", // ✅ بک‌گراند خیلی ملایم
  inactiveIconContainerClassName = "border-[var(--border-subtle)]/20 group-hover:border-[var(--border-subtle)]/30 group-hover:bg-[var(--text-primary)]/3",
  showActiveIndicator = true,
  onItemClick,
}: NavLinksProps) {
  const handleClick = (item: NavLinkItem, e: React.MouseEvent) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemClick) {
      onItemClick(item);
    }
  };

  return (
    <div className={className}>
      {items.map((item) => {
        const isActive = item.isActive || false;
        return (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => handleClick(item, e)}
            className={`
              ${itemClassName}
              ${isActive ? activeClassName : inactiveClassName}
              text-[var(--text-primary)]
            `}
          >
            <span
              className={`
                ${iconContainerClassName}
                ${isActive ? activeIconContainerClassName : inactiveIconContainerClassName}
                text-[var(--text-primary)]
              `}
            >
              {item.icon}
            </span>
            <span className={isActive ? "font-bold" : "font-medium"}>
              {item.label}
            </span>

            {/* ✅ نشانگر مشکی برای تم روشن، سفید برای تم تیره */}
            {isActive && showActiveIndicator && (
              <span className="ml-auto w-2.5 h-2.5 rounded-full bg-[var(--text-primary)]/40" />
            )}
          </a>
        );
      })}
    </div>
  );
}
