import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "ghost";
export type ButtonSize = "default" | "sm";

/** Shared by Button (client) and ButtonLink (server). */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
  className?: string,
) {
  return cn(variant === "primary" ? "btn" : "btn-ghost", size === "sm" && "btn-sm", className);
}
