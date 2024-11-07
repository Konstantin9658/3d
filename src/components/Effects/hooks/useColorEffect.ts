import {
  BlendFunction,
  BrightnessContrastEffect,
  Effect,
  HueSaturationEffect,
} from "postprocessing";
import { useMemo } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

interface ColorEffectProps {
  colorEnabled: boolean;
  brightBlendFunc: BlendFunction;
  hueBlendFunc: BlendFunction;
  colorHue: number;
  colorSaturation: number;
  colorBrightness: number;
  colorContrast: number;
}

export const useColorEffects = ({
  colorEnabled,
  colorHue,
  colorSaturation,
  colorBrightness,
  colorContrast,
  brightBlendFunc,
  hueBlendFunc,
}: ColorEffectProps): Effect[] | null => {
  const colorHueRads = useMemo(() => degToRad(colorHue), [colorHue]);
  const colorSaturationRads = useMemo(
    () => degToRad(colorSaturation),
    [colorSaturation]
  );

  return useMemo(() => {
    if (!colorEnabled) return null;

    return [
      new HueSaturationEffect({
        blendFunction: hueBlendFunc,
        hue: colorHueRads,
        saturation: colorSaturationRads,
      }),
      new BrightnessContrastEffect({
        blendFunction: brightBlendFunc,
        brightness: colorBrightness,
        contrast: colorContrast,
      }),
    ];
  }, [
    colorEnabled,
    hueBlendFunc,
    colorHueRads,
    colorSaturationRads,
    brightBlendFunc,
    colorBrightness,
    colorContrast,
  ]);
};
