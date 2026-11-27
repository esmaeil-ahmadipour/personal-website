"use client";

import { useEffect } from "react";

/** Pixels the mouse must travel before a press counts as a drag, not a click. */
const THRESHOLD = 5;

/**
 * Mouse drag-to-scroll for a scroll-snap track (see .card-track). Touch keeps
 * the browser's own scrolling. While dragging, `data-dragging` turns snap off;
 * on release it comes back and the track settles on a card. Works in RTL:
 * dragging right always lowers scrollLeft. Renders nothing.
 */
export function DragScroll({ targetId }: { targetId: string }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let down = false;
    let moved = false;
    let pointerId = -1;
    let startX = 0;
    let startLeft = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      pointerId = e.pointerId;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };

    const onMove = (e: PointerEvent) => {
      if (!down || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < THRESHOLD) return;
        moved = true;
        el.setPointerCapture(pointerId);
        el.setAttribute("data-dragging", "");
      }
      el.scrollLeft = startLeft - dx;
    };

    const onEnd = (e: PointerEvent) => {
      if (!down || e.pointerId !== pointerId) return;
      down = false;
      if (moved) {
        if (el.hasPointerCapture(pointerId)) el.releasePointerCapture(pointerId);
        el.removeAttribute("data-dragging");
      }
    };

    // A drag must not open the card under the pointer.
    const onClick = (e: MouseEvent) => {
      if (!moved) return;
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    };

    // Stops the browser's native link/image drag ghost.
    const onDragStart = (e: Event) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointercancel", onEnd);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
      el.removeAttribute("data-dragging");
    };
  }, [targetId]);

  return null;
}
