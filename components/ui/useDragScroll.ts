// components/ui/useDragScroll.ts
import { useEffect, type RefObject } from "react";

/** Pointer travel (px) before a press counts as a drag, not a click. */
const DRAG_THRESHOLD = 5;
/** How far (ms of release velocity) a fling carries the rail before it settles. */
const FLING_MS = 180;

/**
 * Mouse drag-to-scroll for a scroll-snap rail. Touch and trackpad keep native scrolling.
 * Snap is switched off while dragging; on release the rail glides to the card nearest to
 * where the fling would land, and CSS snap is restored once it stops. Works in LTR and RTL.
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pressed = false;
    let dragging = false;
    let suppressClick = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px per ms, in pointer direction
    let restoreTimer = 0;

    const cancelPending = () => {
      window.clearTimeout(restoreTimer);
      el.removeEventListener("scrollend", restoreSnap);
    };
    const restoreSnap = () => {
      cancelPending();
      el.style.scrollSnapType = "";
    };

    /** Glides to the card nearest to where the release velocity would land. */
    const settle = () => {
      const style = getComputedStyle(el);
      const rtl = style.direction === "rtl";
      const rect = el.getBoundingClientRect();
      const inset = parseFloat(style.paddingInlineStart) || 0;
      const line = rtl ? rect.right - inset : rect.left + inset;
      const range = el.scrollWidth - el.clientWidth;
      const lo = rtl ? -range : 0;
      const hi = rtl ? 0 : range;
      const clamp = (value: number) => Math.min(hi, Math.max(lo, value));
      const landing = clamp(el.scrollLeft - velocity * FLING_MS);

      let best = clamp(el.scrollLeft);
      let bestGap = Infinity;
      for (const child of Array.from(el.children)) {
        const box = child.getBoundingClientRect();
        const target = clamp(el.scrollLeft + (rtl ? box.right : box.left) - line);
        const gap = Math.abs(target - landing);
        if (gap < bestGap) {
          best = target;
          bestGap = gap;
        }
      }

      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: best, behavior: smooth ? "smooth" : "auto" });
      el.addEventListener("scrollend", restoreSnap);
      restoreTimer = window.setTimeout(restoreSnap, smooth ? 800 : 0);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      cancelPending();
      pressed = true;
      dragging = false;
      startX = lastX = e.clientX;
      lastT = e.timeStamp;
      velocity = 0;
    };

    const onUp = (e: PointerEvent) => {
      if (!pressed) return;
      pressed = false;
      if (!dragging) {
        // A press that interrupted a glide: bring the snap back.
        if (el.style.scrollSnapType === "none") restoreSnap();
        return;
      }
      dragging = false;
      el.style.cursor = "";
      if (e.timeStamp - lastT > 80) velocity = 0; // held still before release
      settle();
      // The click that follows a drag's mouseup is swallowed by onClick below.
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    };

    const onMove = (e: PointerEvent) => {
      if (!pressed) return;
      if (e.buttons === 0) return onUp(e); // released outside the window
      if (!dragging) {
        if (Math.abs(e.clientX - startX) < DRAG_THRESHOLD) return;
        dragging = true;
        suppressClick = true;
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
        el.scrollTo({ left: el.scrollLeft }); // stops a glide still running
        startX = lastX = e.clientX;
        startScroll = el.scrollLeft;
        lastT = e.timeStamp;
      }
      const dt = e.timeStamp - lastT;
      if (dt > 0) velocity = 0.6 * ((e.clientX - lastX) / dt) + 0.4 * velocity;
      lastX = e.clientX;
      lastT = e.timeStamp;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };

    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      restoreSnap();
      el.style.cursor = "";
    };
  }, [ref]);
}