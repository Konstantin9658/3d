import {
  BrightnessContrastEffect,
  Effect,
  HueSaturationEffect,
} from "postprocessing";
import { useMemo } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

interface ColorEffectProps {
  colorEnabled: boolean;
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
        hue: colorHueRads,
        saturation: colorSaturationRads,
      }),
      new BrightnessContrastEffect({
        brightness: colorBrightness,
        contrast: colorContrast,
      }),
    ];
  }, [
    colorEnabled,
    colorHueRads,
    colorSaturationRads,
    colorBrightness,
    colorContrast,
  ]);
};
