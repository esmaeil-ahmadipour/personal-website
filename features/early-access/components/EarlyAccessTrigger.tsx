"use client";

import { ReactNode } from "react";
import { useEarlyAccessStore } from "../store/early-access.store";

interface EarlyAccessTriggerProps {
  children: ReactNode;
  className?: string;
}

export function EarlyAccessTrigger({
  children,
  className = "",
}: EarlyAccessTriggerProps) {
  const { openModal } = useEarlyAccessStore();

  return (
    <button type="button" className={className} onClick={openModal}>
      {children}
    </button>
  );
}
