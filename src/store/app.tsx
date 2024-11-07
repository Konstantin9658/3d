import { create } from "zustand";

import { REFERENCE_FOV } from "@/consts";

interface AppStore {
  scrollOffset: number;
  setScrollOffset: (v: number) => void;
  cameraFov: number;
  setCameraFov: (v: number) => void;
  hoveredStates: Record<string, boolean>;
  setHoveredState: (name: string, state: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  scrollOffset: 0,
  setScrollOffset: (v) => set({ scrollOffset: v }),
  cameraFov: REFERENCE_FOV,
  setCameraFov: (v) => set({ cameraFov: v }),
  hoveredStates: {},
  setHoveredState: (name, state) =>
    set((prev) => ({
      hoveredStates: {
        ...prev.hoveredStates,
        [name]: state,
      },
    })),
}));
