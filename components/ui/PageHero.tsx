import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

interface PageHeroProps {
  title: string;
  sub?: string;
  className?: string;
  /** Actions shown under the sub line (ButtonLink, Pill). */
  children?: React.ReactNode;
}

/** Two floating background orbs. Put inside a `relative isolate` section. */
export function PageOrbs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="orb animate-float start-[5%] top-4 h-[420px] w-[420px] bg-[hsl(var(--accent-blue)/0.1)]" />
      <div className="orb animate-float-slow end-[5%] top-56 h-[420px] w-[420px] bg-[hsl(var(--accent-purple)/0.1)]" />
    </div>
  );
}

/** Title block of the list pages: orbs, h1, optional sub line and actions. */
export function PageHero({ title, sub, className, children }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-8 md:pt-24",
        className,
      )}
    >
      <PageOrbs />

      <h1 className="animate-fade-up text-4xl sm:text-5xl lg:text-[52px]">{title}</h1>
      {sub && (
        <p
          className="animate-fade-up mt-3 max-w-[620px] text-[19px] text-[hsl(var(--text-secondary))]"
          style={delay(0.05)}
        >
          {sub}
        </p>
      )}
      {children && (
        <div className="animate-fade-up mt-6 flex flex-wrap gap-3.5" style={delay(0.1)}>
          {children}
        </div>
      )}
    </section>
  );
}
