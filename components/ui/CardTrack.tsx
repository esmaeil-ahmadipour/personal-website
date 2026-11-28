"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useDragScroll } from "./useDragScroll";

interface CardTrackProps {
  id: string;
  /** Rail inside a bordered band: fixed gutter instead of the page column. */
  inset?: boolean;
  children: React.ReactNode;
}

/** Horizontal scroll-snap rail with mouse drag. Touch and trackpad use native scrolling. */
export function CardTrack({ id, inset = false, children }: CardTrackProps) {
  const ref = useRef<HTMLUListElement>(null);
  useDragScroll(ref);
  return (
    <ul ref={ref} id={id} className={cn("card-track", inset && "card-track-inset")}>
      {children}
    </ul>
  );
}
