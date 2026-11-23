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
    // Variants. Primary and gradient-* use the gradient pill (.btn);
    // secondary, outline and glass use the ghost pill (.btn-ghost).
    // ============================================
    const pill: Partial<Record<NonNullable<ButtonProps["variant"]>, string>> = {
      primary: "btn",
      "gradient-blue": "btn",
      "gradient-purple": "btn",
      "gradient-emerald": "btn",
      "gradient-pink": "btn",
      secondary: "btn-ghost",
      outline: "btn-ghost",
      glass: "btn-ghost",
    };

    const plainStyles = {
      ghost:
        "bg-transparent text-[hsl(var(--text-secondary))] hover:bg-[hsl(var(--bg-elevated))] hover:text-[hsl(var(--text-primary))]",
      destructive:
        "bg-[hsl(var(--accent-rose))] text-[hsl(var(--ink-light))] hover:opacity-90 dark:text-[hsl(var(--ink-dark))]",
      link: "text-[hsl(var(--accent-text))] underline-offset-4 hover:underline",
    };

    // ============================================
    // Sizes
    // ============================================
    const iconSizes = {
      icon: "h-10 w-10 p-0",
      "icon-sm": "h-8 w-8 p-0",
      "icon-lg": "h-12 w-12 p-0",
    };

    const plainSizes = {
      sm: "h-8 px-4 py-1.5 text-xs rounded-full",
      default: "h-10 px-6 py-2 rounded-full",
      lg: "h-12 px-8 py-3 text-base rounded-full",
      xl: "h-14 px-10 py-4 text-lg rounded-full",
      icon: "h-10 w-10 rounded-full",
      "icon-sm": "h-8 w-8 rounded-full",
      "icon-lg": "h-12 w-12 rounded-full",
    };

    const pillClass = pill[variant];
    const variantClasses = pillClass
      ? cn(
          pillClass,
          size === "sm" && "btn-sm",
          (size === "icon" || size === "icon-sm" || size === "icon-lg") && iconSizes[size],
        )
      : cn(
          "font-semibold transition-colors btn-press",
          plainStyles[variant as keyof typeof plainStyles],
          plainSizes[size],
        );

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
          "group relative inline-flex cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses,
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
