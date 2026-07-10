// src/shared/components/NavLinks.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";

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
  activeClassName = "bg-[var(--bg-elevated)]/80 text-[var(--text-primary)] border border-[var(--border-subtle)]/40",
  inactiveClassName = "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50",
  iconContainerClassName = "flex items-center justify-center w-9 h-9 rounded-lg border transition-colors",
  activeIconContainerClassName = "bg-gradient-to-br from-blue-500/15 to-purple-500/15 border-blue-500/30 text-blue-500",
  inactiveIconContainerClassName = "bg-[var(--bg-elevated)]/65 border-[var(--border-subtle)]/30 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] group-hover:border-[var(--border-subtle)]/50",
  showActiveIndicator = true,
  onItemClick,
}: NavLinksProps) {
  const handleClick = (item: NavLinkItem) => {
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
          <Link
            key={item.id}
            href={item.href}
            onClick={() => handleClick(item)}
            className={`
              ${itemClassName}
              ${isActive ? activeClassName : inactiveClassName}
            `}
          >
            <span
              className={`
                ${iconContainerClassName}
                ${isActive ? activeIconContainerClassName : inactiveIconContainerClassName}
              `}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
            {isActive && showActiveIndicator && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
