import * as THREE from "three";
import { create } from "zustand";

interface AppStore {
  appHeight: number;
  setAppHeight: (v: number) => void;
  scrollOffset: number;
  setScrollOffset: (v: number) => void;
  hoveredStates: Record<string, boolean>;
  setHoveredState: (name: string, state: boolean) => void;
  isVideoTexturesEnabled: boolean;
  setVideoTexturesEnabled: (v: boolean) => void;
  envRotation: THREE.Euler;
  setEnvRotation: (v: THREE.Euler) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  appHeight: 0,
  setAppHeight: (v) => set({ appHeight: v }),
  scrollOffset: 0,
  setScrollOffset: (v) => set({ scrollOffset: v }),
  hoveredStates: {},
  setHoveredState: (name, state) =>
    set((prev) => ({
      hoveredStates: {
        ...prev.hoveredStates,
        [name]: state,
      },
    })),
  isVideoTexturesEnabled: true,
  setVideoTexturesEnabled: (v) => set({ isVideoTexturesEnabled: v }),
  envRotation: new THREE.Euler(0, 0, 0),
  setEnvRotation: (v) => set({ envRotation: v }),
}));
