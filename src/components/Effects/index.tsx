import { useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useControls } from "leva";
import {
  Effect,
  EffectComposer as RawEffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import { useEffect, useRef } from "react";

import { CAMERA_NAME } from "@/consts";

import { CONFIG } from "./consts";
import { useBloomEffect } from "./hooks/useBloomEffect";
import { useChromaticAberrationEffect } from "./hooks/useChromaticAberrationEffect";
import { useColorEffects } from "./hooks/useColorEffect";
import { useVignetteEffect } from "./hooks/useVignetteEffect";

export const Effects = () => {
  const effectComposer = useRef<RawEffectComposer | null>(null);
  const { camera, scene } = useThree((state) => ({
    camera: state.camera,
    scene: state.scene,
  }));

  const {
    colorEnabled,
    colorHue,
    colorSaturation,
    colorBrightness,
    colorContrast,
    hueBlendFunc,
    brightBlendFunc,

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

    // aaEnabled,
    // edgeDetectionMode,
    // predicationMode,
    // preset,
  } = useControls(CONFIG, { collapsed: true });

  const bloomEffect = useBloomEffect({
    bloomEnabled,
    mipmapBlur,
    blendFunction,
    luminanceThreshold,
    luminanceSmoothing,
    intensity,
    kernelSize,
  });
  const chromaticAberrationEffect = useChromaticAberrationEffect({
    chromaticAberrationEnabled,
    chromaticBlendFunc,
    chromaticOffsetX,
    chromaticOffsetY,
    radialModulationEnabled,
    modulationOffset,
  });
  const colorEffects = useColorEffects({
    colorEnabled,
    colorHue,
    colorSaturation,
    colorBrightness,
    colorContrast,
    hueBlendFunc,
    brightBlendFunc,
  });
  const vignetteEffect = useVignetteEffect({
    vignetteEnabled,
    offset,
    darkness,
  });

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
      vignetteEffect,
      ...(colorEffects || []),
    ].filter(Boolean) as Effect[];

    if (effects.length) {
      composer.addPass(new EffectPass(camera, ...effects));
    }

    return () => composer.reset();
  }, [
    bloomEffect,
    chromaticAberrationEffect,
    vignetteEffect,
    colorEffects,
    camera,
    scene,
  ]);

  return (
    <EffectComposer multisampling={3} ref={effectComposer}>
      <></>
    </EffectComposer>
  );
};
