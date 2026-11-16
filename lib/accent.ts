import type { CSSProperties } from "react";

/** The six accent pairs from the design system, rotated by index. */
const PAIRS = [
  ["blue", "purple"],
  ["purple", "pink"],
  ["cyan", "blue"],
  ["pink", "amber"],
  ["emerald", "cyan"],
  ["amber", "pink"],
] as const;

type AccentStyle = CSSProperties & { "--c": string; "--c2": string };

/** Sets --c and --c2 for .card, .badge and .poster from design tokens. */
export function accentStyle(index: number): AccentStyle {
  const [a, b] = PAIRS[Math.abs(index) % PAIRS.length];
  return { "--c": `var(--accent-${a})`, "--c2": `var(--accent-${b})` };
}

/** Pairs where white poster ink is allowed (dark theme only). */
export function posterInk(index: number): "light" | "dark" {
  return Math.abs(index) % PAIRS.length < 2 ? "light" : "dark";
}
