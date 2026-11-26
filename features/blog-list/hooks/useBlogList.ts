// features/blog-list/hooks/useBlogList.ts

"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useBlogListQuery } from "./useBlogListQuery";
import {
  DEFAULT_PAGE_SIZE,
  parseBlogUrlState,
  type BlogUrlState,
  type SupportedLocale,
} from "../schemas/blog-list.schema";

const DEFAULTS: BlogUrlState = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  q: "",
  category: "",
  sort: "oldest",
};

/** The URL is the single source of truth, so refresh, sharing and Back all work. */
export function useBlogList(locale: SupportedLocale) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = parseBlogUrlState(searchParams);
  const query = useBlogListQuery({ ...state, locale });

  /** Any change other than the page itself goes back to page 1. */
  const update = (changes: Partial<BlogUrlState>) => {
    const next = { ...state, page: 1, ...changes };
    const params = new URLSearchParams();
    for (const key of Object.keys(DEFAULTS) as (keyof BlogUrlState)[]) {
      if (next[key] !== DEFAULTS[key]) params.set(key, String(next[key]));
    }
    const search = params.toString();
    // Next.js keeps useSearchParams in sync with the History API; no server round trip.
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  };

  return { ...query, state, update };
}
