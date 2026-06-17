"use client";

import { useState } from "react";
import { submitContact } from "../api/contact.api";
import type { ContactData } from "../schemas/contact.schema";

interface UseContactOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useContact(options?: UseContactOptions) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (data: ContactData) => {
    setIsPending(true);
    setError(null);
    setIsSuccess(false);

    try {
      await submitContact(data);
      setIsSuccess(true);
      options?.onSuccess?.();
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error("Something went wrong");
      setError(errorObj);
      options?.onError?.(errorObj);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending, isSuccess, error };
}
