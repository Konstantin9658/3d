import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import { useMemo } from "react";
import { Vector2 } from "three";

interface ChromaticAberrationEffectProps {
  chromaticAberrationEnabled: boolean;
  chromaticBlendFunc: BlendFunction;
  chromaticOffsetX: number;
  chromaticOffsetY: number;
  radialModulationEnabled: boolean;
  modulationOffset: number;
}

export const useChromaticAberrationEffect = ({
  chromaticAberrationEnabled,
  chromaticBlendFunc,
  chromaticOffsetX,
  chromaticOffsetY,
  radialModulationEnabled,
  modulationOffset,
}: ChromaticAberrationEffectProps): ChromaticAberrationEffect | null => {
  return useMemo(() => {
    if (!chromaticAberrationEnabled) return null;

    return new ChromaticAberrationEffect({
      blendFunction: chromaticBlendFunc,
      offset: new Vector2(chromaticOffsetX, chromaticOffsetY),
      radialModulation: radialModulationEnabled,
      modulationOffset,
    });
  }, [
    chromaticAberrationEnabled,
    chromaticBlendFunc,
    chromaticOffsetX,
    chromaticOffsetY,
    radialModulationEnabled,
    modulationOffset,
  ]);
};