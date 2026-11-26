import type { CSSProperties } from "react";

type AccentStyle = CSSProperties & { "--c": string; "--c2": string };

/**
 * Deprecated. The new design has a single accent (Signal Blue), so every index
 * maps to the same pair. Kept so existing callers compile; removed together with
 * the last legacy page.
 */
export function accentStyle(index: number): AccentStyle {
  void index;
  return { "--c": "var(--accent-blue)", "--c2": "var(--accent-blue)" };
}

/** Deprecated: the poster ink is always the theme text color now. */
export function posterInk(index: number): "light" | "dark" {
  void index;
  return "dark";
}
