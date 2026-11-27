"use client";

import { useCallback, useEffect, useState } from "react";

interface SliderControlsProps {
  /** id of the scrollable track element (see .card-track). */
  targetId: string;
  prevLabel: string;
  nextLabel: string;
}

const BUTTON =
  "grid h-9 w-9 place-items-center rounded-full border border-[hsl(var(--border-subtle))] text-[hsl(var(--text-secondary))] transition-colors hover:border-[hsl(var(--accent-blue))] hover:text-[hsl(var(--accent-text))] disabled:pointer-events-none disabled:opacity-40";

interface State {
  scrollable: boolean;
  canPrev: boolean;
  canNext: boolean;
}

/**
 * Previous/next buttons for a horizontal scroll-snap track. Renders nothing
 * until the track is measured, and nothing when all cards already fit.
 * Works in LTR and RTL: "next" always moves in the reading direction.
 */
export function SliderControls({ targetId, prevLabel, nextLabel }: SliderControlsProps) {
  const [state, setState] = useState<State>({ scrollable: false, canPrev: false, canNext: false });

  const measure = useCallback((el: HTMLElement) => {
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    const next: State = {
      scrollable: el.scrollWidth > el.clientWidth + 1,
      canPrev: pos > 1,
      canNext: pos + el.clientWidth < el.scrollWidth - 1,
    };
    setState((prev) =>
      prev.scrollable === next.scrollable &&
      prev.canPrev === next.canPrev &&
      prev.canNext === next.canNext
        ? prev
        : next,
    );
  }, []);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const update = () => measure(el);
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    observer?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer?.disconnect();
    };
  }, [targetId, measure]);

  function go(step: 1 | -1) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: step * (rtl ? -1 : 1) * el.clientWidth * 0.8 });
  }

  if (!state.scrollable) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={prevLabel}
        aria-controls={targetId}
        disabled={!state.canPrev}
        onClick={() => go(-1)}
        className={BUTTON}
      >
        <span aria-hidden className="rtl-flip inline-block">‹</span>
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        aria-controls={targetId}
        disabled={!state.canNext}
        onClick={() => go(1)}
        className={BUTTON}
      >
        <span aria-hidden className="rtl-flip inline-block">›</span>
      </button>
    </div>
  );
}
