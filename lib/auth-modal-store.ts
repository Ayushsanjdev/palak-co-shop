import { create } from "zustand";

// Global switch for the login modal -- any component can call
// useAuthModalStore.getState().open() to trigger it, no prop drilling.
interface AuthModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAuthModalStore = create<AuthModalState>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
