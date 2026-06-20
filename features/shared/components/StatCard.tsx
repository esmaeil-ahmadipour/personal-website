import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  suffix?: string;
  subtitle?: string;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  className?: string;
  gradient?: string;
  children?: ReactNode;
}

export default function StatCard({
  label,
  value,
  suffix = "",
  subtitle,
  trend,
  trendDirection = "neutral",
  className = "",
  gradient = "from-blue-500/5 via-blue-400/5 to-transparent",
  children,
}: StatCardProps) {
  const trendColor = {
    up: "text-emerald-500 dark:text-emerald-400",
    down: "text-rose-500 dark:text-rose-400",
    neutral: "text-[var(--text-muted)]",
  }[trendDirection];

  const trendIcon = {
    up: "↑",
    down: "↓",
    neutral: "→",
  }[trendDirection];

  return (
    <div
      className={`
        relative rounded-2xl p-5 
        bg-[var(--bg-surface)] 
        border border-[var(--border-subtle)]
        shadow-[var(--shadow-card)]
        transition-all duration-300
        hover:shadow-[var(--shadow-glow)] hover:-translate-y-1
        ${className}
      `}
    >
      <div className="relative z-10">
        <p className="text-xs font-medium tracking-wider uppercase text-[var(--text-muted)]">
          {label}
        </p>
        <div className="flex items-end gap-2 mt-1">
          <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            {value}
            {suffix && (
              <span className="text-[var(--text-muted)] text-xl ml-0.5">
                {suffix}
              </span>
            )}
          </span>
          {trend && (
            <span className={`text-xs font-medium ${trendColor} ml-auto`}>
              {trendIcon} {trend}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}
