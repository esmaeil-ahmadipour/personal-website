"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Tag = "div" | "section" | "article" | "li" | "ul" | "header";
type Phase = "idle" | "hidden" | "shown";

interface RevealProps {
  as?: Tag;
  /** Stagger in seconds, applied as --d (use 0.05 steps). */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Below-the-fold entrance. Content is visible on the server and without JS.
 * After mount, elements that start below the fold are hidden, then fade up
 * (animate-fade-up) once they enter the viewport. Skipped for reduced motion.
 */
export function Reveal({ as = "div", delay = 0, className, style, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      el.getBoundingClientRect().top < window.innerHeight
    ) {
      return;
    }
    setPhase("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  const merged = (delay ? { ...style, "--d": `${delay}s` } : style) as React.CSSProperties;

  return (
    <Tag
      ref={ref}
      className={cn(phase === "hidden" && "opacity-0", phase === "shown" && "animate-fade-up", className)}
      style={merged}
    >
      {children}
    </Tag>
  );
}
