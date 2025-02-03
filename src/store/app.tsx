import * as THREE from "three";
import { create } from "zustand";

export enum CameraInScene {
  FirstStage,
  SecondStage,
  ThirdStage,
  FourthStage,
  FifthStage,
  SixthStage,
  SevenStage,
}

interface AppStore {
  appLoaded: boolean;
  setAppLoaded: (v: boolean) => void;
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
  cameraInScene: CameraInScene;
  setCameraInScene: (v: CameraInScene) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  appLoaded: false,
  setAppLoaded: (v) => set({ appLoaded: v }),
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
  cameraInScene: CameraInScene.FirstStage,
  setCameraInScene: (v) => set({ cameraInScene: v }),
}));
