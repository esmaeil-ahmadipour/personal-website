"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-[var(--radius-input)] border border-[hsl(var(--border-subtle))] bg-[hsl(var(--bg-secondary))] px-3.5 py-3 text-base text-[hsl(var(--text-primary))] placeholder:text-[hsl(var(--text-muted))] transition-[border-color,box-shadow] focus:border-[hsl(var(--accent-text))] focus:outline-none focus:ring-[3px] focus:ring-[hsl(var(--accent-blue)/0.18)] aria-[invalid=true]:border-[hsl(var(--accent-rose))]";

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + error message. Wrap Input/Textarea/Select with it. */
export function Field({ label, htmlFor, error, className, children }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm text-[hsl(var(--text-secondary))]"
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-[hsl(var(--accent-rose))]">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(control, className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 5, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cn(control, "resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(control, className)} {...props} />
));
Select.displayName = "Select";
