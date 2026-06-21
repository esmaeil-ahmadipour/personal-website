"use client";

import { useState, useEffect } from "react";
import type { BlogPost } from "../types/get-blog-post.types";

interface UseGetBlogPostState {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

export function useGetBlogPost(id: string | null) {
  const [state, setState] = useState<UseGetBlogPostState>({
    post: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!id) {
      setState({ post: null, isLoading: false, error: null });
      return;
    }

    let isMounted = true;

    const fetchPost = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/blog/${id}`);
        const data = await response.json();

        if (!isMounted) return;

        if (response.ok && data.success) {
          setState({
            post: data.data,
            isLoading: false,
            error: null,
          });
        } else {
          setState({
            post: null,
            isLoading: false,
            error: data.message || "Failed to load post",
          });
        }
      } catch (error) {
        if (!isMounted) return;
        setState({
          post: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load post",
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
