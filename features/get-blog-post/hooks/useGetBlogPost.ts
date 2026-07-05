// features/get-blog-post/hooks/useGetBlogPost.ts

"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "../types/get-blog-post.types";

interface UseGetBlogPostState {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
  isInitialLoad: boolean; // اضافه کردن این state
}

export function useGetBlogPost(id: string | null) {
  const [state, setState] = useState<UseGetBlogPostState>({
    post: null,
    isLoading: true,
    error: null,
    isInitialLoad: true, // true در ابتدا
  });

  useEffect(() => {
    if (!id) {
      setState({
        post: null,
        isLoading: false,
        error: null,
        isInitialLoad: false,
      });
      return;
    }

    let isMounted = true;

    const fetchPost = async () => {
      // فقط اگر isInitialLoad نباشه، isLoading رو true کن
      setState((prev) => ({
        ...prev,
        isLoading: prev.isInitialLoad ? true : true,
        error: null,
      }));

      try {
        const response = await fetch(`/api/blog/${id}`);
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.success) {
          setState({
            post: data.data,
            isLoading: false,
            error: null,
            isInitialLoad: false,
          });
        } else {
          setState({
            post: null,
            isLoading: false,
            error: data.message || "Failed to load post",
            isInitialLoad: false,
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setState({
          post: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load post",
          isInitialLoad: false,
        });
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return state;
}
