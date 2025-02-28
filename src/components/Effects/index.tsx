import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import {
  Effect,
  EffectComposer as RawEffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import { useEffect, useRef } from "react";

import { CAMERA_NAME } from "@/consts";

import { BLEND_FUNC_OPTIONS, KERNEL_SIZE_OPTIONS } from "./consts";
import { useBloomEffect } from "./hooks/useBloomEffect";
import { useChromaticAberrationEffect } from "./hooks/useChromaticAberrationEffect";
// import { useColorEffects } from "./hooks/useColorEffect";
// import { useVignetteEffect } from "./hooks/useVignetteEffect";

export const Effects = () => {
  const effectComposer = useRef<RawEffectComposer | null>(null);
  const { camera, scene } = useThree((state) => ({
    camera: state.camera,
    scene: state.scene,
  }));

  // const {
  //   colorEnabled,
  //   colorHue,
  //   colorSaturation,
  //   colorBrightness,
  //   colorContrast,
  //   hueBlendFunc,
  //   brightBlendFunc,

  //   bloomEnabled,
  //   mipmapBlur,
  //   blendFunction,
  //   luminanceThreshold,
  //   luminanceSmoothing,
  //   intensity,
  //   kernelSize,

  //   vignetteEnabled,
  //   darkness,
  //   offset,

  //   chromaticAberrationEnabled,
  //   chromaticBlendFunc,
  //   radialModulationEnabled,
  //   modulationOffset,
  //   x: chromaticOffsetX,
  //   y: chromaticOffsetY,

  //   // aaEnabled,
  //   // edgeDetectionMode,
  //   // predicationMode,
  //   // preset,
  // } = useControls(CONFIG, { collapsed: true });

  const bloomEffect = useBloomEffect({
    bloomEnabled: true,
    mipmapBlur: true,
    blendFunction: BLEND_FUNC_OPTIONS.SCREEN,
    luminanceThreshold: 1.8,
    luminanceSmoothing: 0,
    intensity: 1,
    kernelSize: KERNEL_SIZE_OPTIONS.large,
  });
  const chromaticAberrationEffect = useChromaticAberrationEffect({
    chromaticAberrationEnabled: true,
    chromaticBlendFunc: BLEND_FUNC_OPTIONS.NORMAL,
    chromaticOffsetX: 0.0004,
    chromaticOffsetY: 0.0004,
    radialModulationEnabled: false,
    modulationOffset: 0.15,
  });
  // const colorEffects = useColorEffects({
  //   colorEnabled: false,
  //   colorHue,
  //   colorSaturation,
  //   colorBrightness,
  //   colorContrast,
  //   hueBlendFunc,
  //   brightBlendFunc,
  // });
  // const vignetteEffect = useVignetteEffect({
  //   vignetteEnabled,
  //   offset,
  //   darkness,
  // });

  useEffect(() => {
    if (
      !camera ||
      !scene ||
      camera.name !== CAMERA_NAME ||
      !effectComposer.current
    )
      return;

    const composer = effectComposer.current;
    composer.reset();
    composer.addPass(new RenderPass(scene, camera));

    const effects = [
      bloomEffect,
      chromaticAberrationEffect,
      // vignetteEffect,
      // ...(colorEffects || []),
    ].filter(Boolean) as Effect[];

    if (effects.length) {
      composer.addPass(new EffectPass(camera, ...effects));
    }

    return () => composer.reset();
  }, [bloomEffect, chromaticAberrationEffect, camera, scene]);

  return (
    <EffectComposer multisampling={8} ref={effectComposer}>
      <></>
    </EffectComposer>
  );
};

// import {
//   Bloom,
//   ChromaticAberration,
//   EffectComposer,
// } from "@react-three/postprocessing";
// import { BlendFunction, KernelSize } from "postprocessing";
// import { Vector2 } from "three";

// // import { BLEND_FUNC_OPTIONS, KERNEL_SIZE_OPTIONS } from "./consts";
// // import { useBloomEffect } from "./hooks/useBloomEffect";
// // import { useChromaticAberrationEffect } from "./hooks/useChromaticAberrationEffect";
// // import { useColorEffects } from "./hooks/useColorEffect";
// // import { useVignetteEffect } from "./hooks/useVignetteEffect";

// export const Effects = () => {
//   // const effectComposer = useRef<RawEffectComposer | null>(null);
//   // const { camera, scene } = useThree((state) => ({
//   //   camera: state.camera,
//   //   scene: state.scene,
//   // }));

//   // const {
//   //   colorEnabled,
//   //   colorHue,
//   //   colorSaturation,
//   //   colorBrightness,
//   //   colorContrast,
//   //   hueBlendFunc,
//   //   brightBlendFunc,

//   //   bloomEnabled,
//   //   mipmapBlur,
//   //   blendFunction,
//   //   luminanceThreshold,
//   //   luminanceSmoothing,
//   //   intensity,
//   //   kernelSize,

//   //   vignetteEnabled,
//   //   darkness,
//   //   offset,

//   //   chromaticAberrationEnabled,
//   //   chromaticBlendFunc,
//   //   radialModulationEnabled,
//   //   modulationOffset,
//   //   x: chromaticOffsetX,
//   //   y: chromaticOffsetY,

//   //   // aaEnabled,
//   //   // edgeDetectionMode,
//   //   // predicationMode,
//   //   // preset,
//   // } = useControls(CONFIG, { collapsed: true });

//   // const bloomEffect = useBloomEffect({
//   //   bloomEnabled: true,
//   //   mipmapBlur: true,
//   //   blendFunction: BLEND_FUNC_OPTIONS.SCREEN,
//   //   luminanceThreshold: 1.8,
//   //   luminanceSmoothing: 0,
//   //   intensity: 1,
//   //   kernelSize: KERNEL_SIZE_OPTIONS.large,
//   // });
//   // const chromaticAberrationEffect = useChromaticAberrationEffect({
//   //   chromaticAberrationEnabled: true,
//   //   chromaticBlendFunc: BLEND_FUNC_OPTIONS.NORMAL,
//   //   chromaticOffsetX: 0.0004,
//   //   chromaticOffsetY: 0.0004,
//   //   radialModulationEnabled: false,
//   //   modulationOffset: 0.15,
//   // });
//   // const colorEffects = useColorEffects({
//   //   colorEnabled: false,
//   //   colorHue,
//   //   colorSaturation,
//   //   colorBrightness,
//   //   colorContrast,
//   //   hueBlendFunc,
//   //   brightBlendFunc,
//   // });
//   // const vignetteEffect = useVignetteEffect({
//   //   vignetteEnabled,
//   //   offset,
//   //   darkness,
//   // });

//   // useEffect(() => {
//   //   if (
//   //     !camera ||
//   //     !scene ||
//   //     camera.name !== CAMERA_NAME ||
//   //     !effectComposer.current
//   //   )
//   //     return;

//   //   const composer = effectComposer.current;
//   //   composer.reset();
//   //   composer.addPass(new RenderPass(scene, camera));

//   //   const effects = [
//   //     bloomEffect,
//   //     chromaticAberrationEffect,
//   //     // vignetteEffect,
//   //     // ...(colorEffects || []),
//   //   ].filter(Boolean) as Effect[];

//   //   if (effects.length) {
//   //     composer.addPass(new EffectPass(camera, ...effects));
//   //   }

//   //   return () => composer.reset();
//   // }, [bloomEffect, chromaticAberrationEffect, camera, scene]);

//   const vec = new Vector2(0.0004, 0.0004);

//   return (
//     <EffectComposer multisampling={5}>
//       <Bloom
//         mipmapBlur
//         luminanceThreshold={1.8}
//         intensity={1}
//         blendFunction={BlendFunction.SCREEN}
//         kernelSize={KernelSize.LARGE}
//       />
//       <ChromaticAberration
//         offset={vec}
//         blendFunction={BlendFunction.NORMAL}
//         modulationOffset={0.15}
//         radialModulation={false}
//       />
//     </EffectComposer>
//   );
// };
