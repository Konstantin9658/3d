import { create } from "zustand";

interface AppStore {
  scrollOffset: number;
  setScrollOffset: (v: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  scrollOffset: 0,
  setScrollOffset: (v) => set({ scrollOffset: v }),
}));
