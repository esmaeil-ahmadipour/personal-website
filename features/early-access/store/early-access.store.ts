import { create } from "zustand";

interface EarlyAccessState {
  isOpen: boolean;
  isSubmitted: boolean;
  openModal: () => void;
  closeModal: () => void;
  setSubmitted: (value: boolean) => void;
  reset: () => void;
}

export const useEarlyAccessStore = create<EarlyAccessState>((set) => ({
  isOpen: false,
  isSubmitted: false,
  openModal: () => set({ isOpen: true, isSubmitted: false }),
  closeModal: () => set({ isOpen: false }),
  setSubmitted: (value) => set({ isSubmitted: value }),
  reset: () => set({ isOpen: false, isSubmitted: false }),
}));
