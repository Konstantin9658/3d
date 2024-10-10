// import {
//   Bloom,
//   BrightnessContrast,
//   ChromaticAberration,
//   EffectComposer,
//   HueSaturation,
//   SMAA,
//   Vignette,
// } from "@react-three/postprocessing";
// import { Vector2 } from "three";
// import { degToRad } from "three/src/math/MathUtils.js";
// import {
//   BlendFunction,
//   EdgeDetectionMode,
//   KernelSize,
//   PredicationMode,
//   SMAAPreset,
// } from "postprocessing";
// import { folder, useControls } from "leva";
// import { BLOOM_BLEND_FUNC_OPTIONS } from "./consts";

// export const Effects = () => {
//   const {
//     colorEnabled,
//     colorHue,
//     colorSaturation,
//     colorBrightness,
//     colorContrast,

//     bloomEnabled,
//     mipmapBlur,
//     blendFunction,
//     luminanceThreshold,
//     luminanceSmoothing,
//     intensity,
//     kernelSize,

//     chromaticAberrationEnabled,
//     noiseEnabled,
//     vignetteEnabled,
//   } = useControls({
//     bloom: folder(
//       {
//         bloomEnabled: { label: "enabled", value: true },
//         mipmapBlur: true,
//         blendFunction: {
//           value: BLOOM_BLEND_FUNC_OPTIONS.SCREEN,
//           options: BLOOM_BLEND_FUNC_OPTIONS,
//         },
//         luminanceThreshold: {
//           value: 1,
//           max: 5,
//           min: 0,
//           step: 0.05,
//         },
//         luminanceSmoothing: {
//           value: 0,
//           min: 0,
//           max: 1,
//           step: 0.05,
//         },
//         intensity: {
//           value: 0.65,
//           max: 5,
//           min: 0,
//           step: 0.05,
//         },
//         kernelSize: {
//           value: KernelSize.LARGE,
//           options: {
//             verySmall: KernelSize.VERY_SMALL,
//             small: KernelSize.SMALL,
//             medium: KernelSize.MEDIUM,
//             large: KernelSize.LARGE,
//             veryLarge: KernelSize.VERY_LARGE,
//             huge: KernelSize.HUGE,
//           },
//         },
//       },
//       { collapsed: true }
//     ),
//   });

//   return (
//     <EffectComposer multisampling={0}>
//       <></>
//       {/* {bloomEnabled ? (
//         <Bloom
//           mipmapBlur={mipmapBlur}
//           blendFunction={blendFunction}
//           kernelSize={kernelSize}
//           luminanceThreshold={luminanceThreshold}
//           luminanceSmoothing={luminanceSmoothing}
//           intensity={intensity}
//         />
//       ) : (
//         <></>
//       )}
//       <ChromaticAberration
//         offset={new Vector2(0.0004, 0.0004)}
//         blendFunction={BlendFunction.NORMAL}
//         radialModulation={false}
//         modulationOffset={0.15}
//       />
//       <Vignette offset={0.05} darkness={0.2} />
//       <HueSaturation hue={0} saturation={degToRad(7)} />
//       <BrightnessContrast brightness={0.2} contrast={-0.25} />
//       <SMAA
//         edgeDetectionMode={EdgeDetectionMode.COLOR}
//         predicationMode={PredicationMode.DISABLED}
//         preset={SMAAPreset.MEDIUM}
//       /> */}
//     </EffectComposer>
//   );
// };

import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { folder, useControls } from "leva";
import {
  BloomEffect,
  BrightnessContrastEffect,
  ChromaticAberrationEffect,
  EdgeDetectionMode,
  Effect,
  EffectComposer as RawEffectComposer,
  EffectPass,
  HueSaturationEffect,
  PredicationMode,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
  VignetteEffect,
} from "postprocessing";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Vector2 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { BLEND_FUNC_OPTIONS, KERNEL_SIZE_OPTIONS } from "./consts";

const updateLastComposerEffect = (effectComposer: RawEffectComposer) => {
  for (let i = 0; i < effectComposer.passes.length; i++) {
    const pass = effectComposer.passes[i];

    if (pass.name === "EffectPass") {
      pass.renderToScreen = i === effectComposer.passes.length - 1;
    }
  }
};

export const Effects = () => {
  const effectComposer = useRef<RawEffectComposer>(null);

  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    if (!effectComposer.current || !effectComposer.current.passes) return;
    updateLastComposerEffect(effectComposer.current);
  });

  const {
    colorEnabled,
    colorHue,
    colorSaturation,
    colorBrightness,
    colorContrast,

    bloomEnabled,
    mipmapBlur,
    blendFunction,
    luminanceThreshold,
    luminanceSmoothing,
    intensity,
    kernelSize,

    vignetteEnabled,
    darkness,
    offset,

    chromaticAberrationEnabled,
    chromaticBlendFunc,
    radialModulationEnabled,
    modulationOffset,
    x: chromaticOffsetX,
    y: chromaticOffsetY,

    aaEnabled,
    edgeDetectionMode,
    predicationMode,
    preset,
  } = useControls(
    {
      Bloom: folder(
        {
          bloomEnabled: { label: "enabled", value: true },
          mipmapBlur: true,
          blendFunction: {
            value: BLEND_FUNC_OPTIONS.SCREEN,
            options: BLEND_FUNC_OPTIONS,
          },
          luminanceThreshold: {
            value: 1,
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
            value: 0.65,
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
          chromaticAberrationEnabled: { label: "enabled", value: false },
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
      "Anti-aliasing": folder(
        {
          aaEnabled: { label: "enabled", value: true },
          edgeDetectionMode: {
            value: EdgeDetectionMode.COLOR,
            options: {
              COLOR: EdgeDetectionMode.COLOR,
              DEPTH: EdgeDetectionMode.DEPTH,
              LUMA: EdgeDetectionMode.LUMA,
            },
          },
          predicationMode: {
            value: PredicationMode.DISABLED,
            options: {
              DISABLED: PredicationMode.DISABLED,
              CUSTOM: PredicationMode.CUSTOM,
              DEPTH: PredicationMode.DEPTH,
            },
          },
          preset: {
            value: SMAAPreset.HIGH,
            options: {
              LOW: SMAAPreset.LOW,
              MEDIUM: SMAAPreset.MEDIUM,
              HIGH: SMAAPreset.HIGH,
              ULTRA: SMAAPreset.ULTRA,
            },
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
          colorEnabled: { label: "enabled", value: true },
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
            value: 0.2,
            step: 0.05,
            min: -1,
            max: 1,
          },
          colorContrast: {
            label: "contrast",
            value: -0.25,
            step: 0.05,
            min: -1,
            max: 1,
          },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const colorHueRads = useMemo(() => degToRad(colorHue), [colorHue]);
  const colorSaturationRads = useMemo(
    () => degToRad(colorSaturation),
    [colorSaturation]
  );

  useEffect(() => {
    const composer = effectComposer.current;

    if (!camera || !scene || camera.name !== "Camera" || !composer) return;

    composer.reset();
    composer.addPass(new RenderPass(scene, camera));

    const effects: Effect[] = [];

    if (bloomEnabled) {
      effects.push(
        new BloomEffect({
          mipmapBlur,
          blendFunction,
          kernelSize,
          luminanceThreshold,
          luminanceSmoothing,
          intensity,
        })
      );
    }

    if (chromaticAberrationEnabled) {
      effects.push(
        new ChromaticAberrationEffect({
          blendFunction: chromaticBlendFunc,
          offset: new Vector2(chromaticOffsetX, chromaticOffsetY),
          radialModulation: radialModulationEnabled,
          modulationOffset,
        })
      );
    }

    if (vignetteEnabled) {
      effects.push(
        new VignetteEffect({
          offset,
          darkness,
        })
      );
    }

    if (colorEnabled) {
      effects.push(
        new HueSaturationEffect({
          hue: colorHueRads,
          saturation: colorSaturationRads,
        })
      );
      effects.push(
        new BrightnessContrastEffect({
          brightness: colorBrightness,
          contrast: colorContrast,
        })
      );
    }

    if (aaEnabled) {
      const smaaPass = new EffectPass(
        camera,
        new SMAAEffect({
          edgeDetectionMode,
          predicationMode,
          preset,
        })
      );
      composer.addPass(smaaPass);
    }

    if (effects.length) composer.addPass(new EffectPass(camera, ...effects));

    updateLastComposerEffect(effectComposer.current);

    return () => composer.reset();
  }, [
    aaEnabled,
    blendFunction,
    bloomEnabled,
    camera,
    chromaticAberrationEnabled,
    chromaticBlendFunc,
    chromaticOffsetX,
    chromaticOffsetY,
    colorBrightness,
    colorContrast,
    colorEnabled,
    colorHue,
    colorHueRads,
    colorSaturation,
    colorSaturationRads,
    darkness,
    edgeDetectionMode,
    intensity,
    kernelSize,
    luminanceSmoothing,
    luminanceThreshold,
    mipmapBlur,
    modulationOffset,
    offset,
    predicationMode,
    preset,
    radialModulationEnabled,
    scene,
    vignetteEnabled,
  ]);

  return (
    <EffectComposer multisampling={0} ref={effectComposer}>
      {/* Обман для свойства children */}
      <></>
    </EffectComposer>
  );
};
