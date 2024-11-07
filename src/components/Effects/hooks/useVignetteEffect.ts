import { VignetteEffect } from "postprocessing";
import { useMemo } from "react";

interface VignetteEffectProps {
  vignetteEnabled: boolean;
  offset: number;
  darkness: number;
}

export const useVignetteEffect = ({
  vignetteEnabled,
  offset,
  darkness,
}: VignetteEffectProps): VignetteEffect | null => {
  return useMemo(() => {
    if (!vignetteEnabled) return null;

    return new VignetteEffect({ offset, darkness });
  }, [vignetteEnabled, offset, darkness]);
};
