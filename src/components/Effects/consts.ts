import { folder } from "leva";
import { BlendFunction, KernelSize } from "postprocessing";

export const BLEND_FUNC_OPTIONS = {
  ADD: BlendFunction.ADD,
  ALPHA: BlendFunction.ALPHA,
  AVERAGE: BlendFunction.AVERAGE,
  COLOR: BlendFunction.COLOR,
  COLOR_BURN: BlendFunction.COLOR_BURN,
  COLOR_DODGE: BlendFunction.COLOR_DODGE,
  DARKEN: BlendFunction.DARKEN,
  DIFFERENCE: BlendFunction.DIFFERENCE,
  DIVIDE: BlendFunction.DIVIDE,
  DST: BlendFunction.DST,
  EXCLUSION: BlendFunction.EXCLUSION,
  HARD_LIGHT: BlendFunction.HARD_LIGHT,
  HARD_MIX: BlendFunction.HARD_MIX,
  HUE: BlendFunction.HUE,
  INVERT: BlendFunction.INVERT,
  INVERT_RGB: BlendFunction.INVERT_RGB,
  LIGHTEN: BlendFunction.LIGHTEN,
  LINEAR_BURN: BlendFunction.LINEAR_BURN,
  LINEAR_DODGE: BlendFunction.LINEAR_DODGE,
  LINEAR_LIGHT: BlendFunction.LINEAR_LIGHT,
  LUMINOSITY: BlendFunction.LUMINOSITY,
  MULTIPLY: BlendFunction.MULTIPLY,
  NEGATION: BlendFunction.NEGATION,
  NORMAL: BlendFunction.NORMAL,
  OVERLAY: BlendFunction.OVERLAY,
  PIN_LIGHT: BlendFunction.PIN_LIGHT,
  REFLECT: BlendFunction.REFLECT,
  SATURATION: BlendFunction.SATURATION,
  SCREEN: BlendFunction.SCREEN,
  SET: BlendFunction.SET,
  SKIP: BlendFunction.SKIP,
  SOFT_LIGHT: BlendFunction.SOFT_LIGHT,
  SRC: BlendFunction.SRC,
  SUBTRACT: BlendFunction.SUBTRACT,
  VIVID_LIGHT: BlendFunction.VIVID_LIGHT,
};

export const KERNEL_SIZE_OPTIONS = {
  verySmall: KernelSize.VERY_SMALL,
  small: KernelSize.SMALL,
  medium: KernelSize.MEDIUM,
  large: KernelSize.LARGE,
  veryLarge: KernelSize.VERY_LARGE,
  huge: KernelSize.HUGE,
};

export const CONFIG = {
  Bloom: folder(
    {
      bloomEnabled: { label: "enabled", value: true },
      mipmapBlur: true,
      blendFunction: {
        value: BLEND_FUNC_OPTIONS.SCREEN,
        options: BLEND_FUNC_OPTIONS,
      },
      luminanceThreshold: {
        value: 1.8,
        max: 5,
        min: 0,
        step: 0.05,
      },
      luminanceSmoothing: {
        value: 0,
        min: 0,
        max: 1,
        step: 0.05,
      },
      intensity: {
        value: 1,
        max: 5,
        min: 0,
        step: 0.05,
      },
      kernelSize: {
        value: KERNEL_SIZE_OPTIONS.large,
        options: KERNEL_SIZE_OPTIONS,
      },
    },
    { collapsed: true }
  ),
  "Chromatic Aberration": folder(
    {
      chromaticAberrationEnabled: { label: "enabled", value: true },
      radialModulationEnabled: { value: false },
      chromaticBlendFunc: {
        value: BLEND_FUNC_OPTIONS.NORMAL,
        options: BLEND_FUNC_OPTIONS,
      },
      chromaticOffset: folder({
        x: {
          value: 0.0004,
          max: 0.01,
          min: 0,
          step: 0.0001,
        },
        y: {
          value: 0.0004,
          max: 0.01,
          min: 0,
          step: 0.0001,
        },
      }),
      modulationOffset: {
        value: 0.15,
        max: 5,
        min: 0,
        step: 0.05,
      },
    },
    { collapsed: true }
  ),
  Vignette: folder(
    {
      vignetteEnabled: { label: "enabled", value: false },
      offset: {
        value: 0.05,
        max: 5,
        min: 0,
        step: 0.05,
      },
      darkness: {
        value: 0.2,
        max: 1,
        min: 0,
        step: 0.1,
      },
    },
    { collapsed: true }
  ),
  Color: folder(
    {
      colorEnabled: { label: "enabled", value: false },
      hueBlendFunc: {
        value: BLEND_FUNC_OPTIONS.NORMAL,
        options: BLEND_FUNC_OPTIONS,
      },
      brightBlendFunc: {
        value: BLEND_FUNC_OPTIONS.NORMAL,
        options: BLEND_FUNC_OPTIONS,
      },
      colorHue: { label: "hue", value: 0, step: 1, min: -180, max: 180 },
      colorSaturation: {
        label: "saturation",
        value: 7,
        step: 1,
        min: -180,
        max: 180,
      },
      colorBrightness: {
        label: "brightness",
        value: 0.25,
        step: 0.05,
        min: -1,
        max: 1,
      },
      colorContrast: {
        label: "contrast",
        value: 0.1,
        step: 0.05,
        min: -1,
        max: 1,
      },
    },
    { collapsed: true }
  ),
  // Color: folder(
  //   {
  //     colorEnabled: { label: "enabled", value: true },

  //     colorHue: { label: "hue", value: 0, step: 0.05, min: -10, max: 10 },
  //     colorSaturation: {
  //       label: "saturation",
  //       value: 7,
  //       step: 0.05,
  //       min: -100,
  //       max: 100,
  //     },
  //     colorBrightness: {
  //       label: "brightness",
  //       value: 0.2,
  //       step: 0.05,
  //       min: -10,
  //       max: 10,
  //     },
  //     colorContrast: {
  //       label: "contrast",
  //       value: -0.25,
  //       step: 0.05,
  //       min: -10,
  //       max: 10,
  //     },
  //   },
  //   { collapsed: true }
  // ),
};
