import { BlendFunction, BloomEffect, KernelSize } from "postprocessing";
import { useMemo } from "react";

interface BloomEffectProps {
  bloomEnabled: boolean;
  mipmapBlur: boolean;
  blendFunction: BlendFunction;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  intensity: number;
  kernelSize: KernelSize;
}

export const useBloomEffect = ({
  bloomEnabled,
  mipmapBlur,
  blendFunction,
  luminanceThreshold,
  luminanceSmoothing,
  intensity,
  kernelSize,
}: BloomEffectProps): BloomEffect | null => {
  return useMemo(() => {
    if (!bloomEnabled) return null;

    return new BloomEffect({
      mipmapBlur,
      blendFunction,
      kernelSize,
      luminanceThreshold,
      luminanceSmoothing,
      intensity,
    });
  }, [
    bloomEnabled,
    mipmapBlur,
    blendFunction,
    kernelSize,
    luminanceThreshold,
    luminanceSmoothing,
    intensity,
  ]);
};
