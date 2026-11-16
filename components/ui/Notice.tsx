import { cn } from "@/lib/utils";

/** Inline note, e.g. "This article is only available in English." */
export function Notice({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p role="note" className={cn("notice", className)}>
      {children}
    </p>
  );
}
