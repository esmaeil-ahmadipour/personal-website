"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// Button Props
// ============================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "glass"
    | "destructive"
    | "gradient-blue"
    | "gradient-purple"
    | "gradient-emerald"
    | "gradient-pink"
    | "link";
  size?: "sm" | "default" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg";
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ============================================
// Button Component
// ============================================
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    // ============================================
    // Variant Styles - مطابق با استایل‌های پروژه
    // ============================================
    // Single accent: every legacy gradient-* variant now maps to the primary look.
    const primary = "bg-[hsl(var(--accent))] text-[hsl(var(--accent-ink))] hover:bg-[hsl(var(--accent-hover))] focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-[hsl(var(--bg-primary))]";
    const variantStyles = {
      primary,
      "gradient-blue": primary,
      "gradient-purple": primary,
      "gradient-emerald": primary,
      "gradient-pink": primary,

      secondary:
        "bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))] border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--accent))]",

      outline:
        "border border-[hsl(var(--border-strong))] bg-transparent text-[hsl(var(--text-primary))] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]",

      ghost:
        "bg-transparent text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-elevated))] hover:text-[hsl(var(--text-primary))]",

      glass:
        "bg-[hsl(var(--bg-surface)/0.6)] backdrop-blur-sm border border-[hsl(var(--border-subtle))] text-[hsl(var(--text-primary))] hover:border-[hsl(var(--accent))]",

      destructive:
        "bg-[hsl(var(--accent-rose))] text-white hover:opacity-90",

      link: "text-[hsl(var(--accent))] underline-offset-4 hover:underline",
    };

    // ============================================
    // Size Styles
    // ============================================
    const sizeStyles = {
      sm: "h-8 px-4 py-1.5 text-xs rounded-lg",
      default: "h-10 px-6 py-2 rounded-lg",
      lg: "h-12 px-8 py-3 text-base rounded-lg",
      xl: "h-14 px-10 py-4 text-lg rounded-lg",
      icon: "h-10 w-10 rounded-lg",
      "icon-sm": "h-8 w-8 rounded-lg",
      "icon-lg": "h-12 w-12 rounded-lg",
    };

    // ============================================
    // Loading Spinner
    // ============================================
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        className={cn(
          // Base styles - مطابق با استایل دکمه‌های پروژه
          "group relative inline-flex items-center justify-center gap-2 font-semibold transition-all btn-press overflow-hidden cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
Button.displayName = "Button";

// ============================================
// ButtonGroup - For grouping buttons
// ============================================
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    { className, orientation = "horizontal", spacing = "md", ...props },
    ref,
  ) => {
    const spacingMap = {
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row flex-wrap" : "flex-col",
          spacingMap[spacing],
          className,
        )}
        {...props}
      />
    );
  },
);
ButtonGroup.displayName = "ButtonGroup";

// ============================================
// Exports
// ============================================
export { Button, ButtonGroup };
