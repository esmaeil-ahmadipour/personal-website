// features/blog-list/hooks/useBlogList.ts

"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useBlogListQuery } from "./useBlogListQuery";
import type { PageSize } from "../schemas/blog-list.schema";

interface UseBlogListOptions {
  initialPage?: number;
  initialLimit?: PageSize;
  locale: "en" | "fa";
}

export function useBlogList({
  initialPage = 1,
  initialLimit = 10,
  locale,
}: UseBlogListOptions) {
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState<PageSize>(initialLimit);

  const { data, isLoading, error } = useBlogListQuery({ page, limit, locale });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    params.set("limit", String(limit));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleLimitChange = (newLimit: PageSize) => {
    setLimit(newLimit);
    setPage(1);
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", String(newLimit));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    data,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    handlePageChange,
    handleLimitChange,
  };
}
