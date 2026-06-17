"use client";

import { useState } from "react";
import { EarlyAccessData } from "../schemas/early-access.schema";

export function useEarlyAccessMutation() {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (data: EarlyAccessData): Promise<void> => {
    setIsPending(true);
    try {
      // شبیه‌سازی درخواست به سرور
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Early Access Request:", data);
      // در صورت نیاز به API واقعی:
      // const response = await fetch('/api/early-access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Failed to submit');
    } catch (error) {
      throw new Error("خطا در ارسال درخواست");
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
