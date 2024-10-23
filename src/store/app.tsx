import { create } from "zustand";

interface AppStore {
  scrollOffset: number;
  setScrollOffset: (v: number) => void;
  cameraFov: number;
  setCameraFov: (v: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  scrollOffset: 0,
  setScrollOffset: (v) => set({ scrollOffset: v }),
  cameraFov: 21.5,
  setCameraFov: (v) => set({ cameraFov: v }),
}));
