import { RefObject, useEffect, useMemo, useRef } from "react";
import {
  // Color,
  FrontSide,
  Group,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  TextureLoader,
  VideoTexture,
} from "three";

import { useAppStore } from "@/store/app";

export const useVideoMaterial = (
  videoHref: string,
  imageHref: string,
  ref: RefObject<Group>,
  nodeMaterialName: string,
  additionalInstructions?: (mat: MeshStandardMaterial | ShaderMaterial) => void
) => {
  const mat = useRef<ShaderMaterial | null>(null);
  const isVideoTexturesEnabled = useAppStore(
    (state) => state.isVideoTexturesEnabled
  );

  const videoHandle = useRef<HTMLVideoElement | null>(null);

  // Подготавливаем текстуру в зависимости от флага isVideoTexturesEnabled
  const texture = useMemo(() => {
    if (isVideoTexturesEnabled) {
      if (videoHandle.current) {
        videoHandle.current.pause();
        videoHandle.current.remove();
      }
      const video = document.createElement("video");
      video.src = videoHref;
      video.loop = true;
      video.muted = true;
      video.play();
      videoHandle.current = video;
      return new VideoTexture(video);
    } else {
      return new TextureLoader().load(imageHref);
    }
  }, [imageHref, isVideoTexturesEnabled, videoHref]);

  useEffect(() => {
    if (!ref.current) return;

    // Создаём ShaderMaterial с параметром saturation и эмиссией
    const customMaterial = new ShaderMaterial({
      uniforms: {
        map: { value: texture }, // Основная текстура
        emissiveMap: { value: texture }, // Текстура для эмиссии
        metalness: { value: 0.7 },
        roughness: { value: 0.3 },
        saturation: { value: 1.2 }, // Настройка насыщенности
        emissiveIntensity: { value: 0.4 }, // Интенсивность эмиссии
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map; // Основная текстура
        uniform sampler2D emissiveMap; // Текстура эмиссии
        uniform float saturation;
        uniform float emissiveIntensity;
        varying vec2 vUv;

        void main() {
          // Основной цвет
          vec4 color = texture2D(map, vUv);

          // Эмиссия из текстуры
          vec4 emissiveColor = texture2D(emissiveMap, vUv);

          // Усиливаем эмиссию, чтобы она не была черной
          vec3 enhancedEmissive = max(emissiveColor.rgb, vec3(0.2)); // Минимальное значение эмиссии
          color.rgb += enhancedEmissive * emissiveIntensity;

          // Применение насыщенности
          float gray = dot(color.rgb, vec3(0.3, 0.59, 0.2));
          color.rgb = mix(vec3(gray), color.rgb, saturation);

          gl_FragColor = color;
        }
      `,
    });

    ref.current.traverse((node) => {
      if (node instanceof Mesh) {
        if (node.material.name !== nodeMaterialName) return;

        node.material = customMaterial;
        node.material.side = FrontSide;
        node.material.map = texture;
        node.material.map.flipY = false;
        node.material.map.minFilter = LinearFilter;

        additionalInstructions?.(node.material);

        node.material.needsUpdate = true;
        mat.current = node.material;
      }
    });

    return () => {
      mat.current?.dispose();
    };
  }, [
    ref,
    isVideoTexturesEnabled,
    nodeMaterialName,
    additionalInstructions,
    texture,
  ]);
};
