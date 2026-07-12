"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================
// Card Context
// ============================================
const CardContext = React.createContext<{
  variant?: "default" | "glass" | "outline";
}>({});

// ============================================
// Card - Root Component
// ============================================
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "outline";
  glow?: boolean;
  glowColor?: "blue" | "purple" | "green" | "emerald" | "none";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      glow = false,
      glowColor = "none",
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: "bg-[var(--bg-surface)] border border-[var(--border-subtle)]",
      glass:
        "bg-[var(--bg-surface)]/50 backdrop-blur-sm border border-[var(--border-subtle)]",
      outline: "bg-transparent border-2 border-[var(--border-subtle)]",
    };

    const glowColors = {
      none: "",
      blue: "shadow-blue-500/10 hover:shadow-blue-500/20",
      purple: "shadow-purple-500/10 hover:shadow-purple-500/20",
      green: "shadow-emerald-500/10 hover:shadow-emerald-500/20",
      emerald: "shadow-emerald-500/10 hover:shadow-emerald-500/20",
    };

    return (
      <CardContext.Provider value={{ variant }}>
        <div
          ref={ref}
          className={cn(
            "rounded-2xl transition-all duration-300",
            variantClasses[variant],
            glow && "shadow-lg",
            glow && glowColors[glowColor],
            "hover:-translate-y-1 hover:shadow-xl",
            className,
          )}
          {...props}
        />
      </CardContext.Provider>
    );
  },
);
Card.displayName = "Card";

// ============================================
// CardHeader
// ============================================
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        withBorder && "border-b border-[var(--border-subtle)]",
        className,
      )}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

// ============================================
// CardTitle
// ============================================
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-none tracking-tight text-[var(--text-primary)]",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

// ============================================
// CardDescription
// ============================================
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--text-secondary)]", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ============================================
// CardContent
// ============================================
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ============================================
// CardFooter
// ============================================
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ============================================
// CardGlow - Special Glow Effect Wrapper
// ============================================
interface CardGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "blue" | "purple" | "emerald" | "none";
  intensity?: "low" | "medium" | "high";
}

const CardGlow = React.forwardRef<HTMLDivElement, CardGlowProps>(
  ({ className, color = "blue", intensity = "medium", ...props }, ref) => {
    const intensityMap = {
      low: "opacity-30",
      medium: "opacity-50",
      high: "opacity-70",
    };

    const colorMap = {
      none: "",
      blue: "from-blue-500 via-blue-400 to-transparent",
      purple: "from-purple-500 via-purple-400 to-transparent",
      emerald: "from-emerald-500 via-emerald-400 to-transparent",
    };

    return (
      <div ref={ref} className={cn("relative group", className)} {...props}>
        {/* Glow Background */}
        <div
          className={cn(
            "absolute -inset-0.5 rounded-3xl blur-2xl transition-opacity duration-500",
            "bg-gradient-to-r",
            colorMap[color],
            intensityMap[intensity],
            "group-hover:opacity-100",
            "pointer-events-none",
          )}
        />
        {/* Content */}
        <div className="relative">{props.children}</div>
      </div>
    );
  },
);
CardGlow.displayName = "CardGlow";

// ============================================
// Exports
// ============================================
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardGlow,
};
