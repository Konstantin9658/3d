import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import stage_3rd from "@/assets/models/3rd_stage.glb";
import { useEmissiveNoToneMapped } from "@/hooks/useEmissiveNoToneMapped";
import { useInvisibleMaterial } from "@/hooks/useInvisibleMaterial";
import { useVideoMaterial } from "@/hooks/useVideoMaterial";

import {
  CLOSE_CLIP_1,
  CLOSE_CLIP_2,
  COLLIDER_NAME_1,
  COLLIDER_NAME_2,
  LOOP_ANIMATION,
  OPEN_CLIP_1,
  OPEN_CLIP_2,
} from "./consts";
import imageHref from "./screen.jpg";
import videoHref from "./screen_1024.mp4";

const INITIAL_OPACITY = 0.5;

export const ThirdStage = () => {
  console.log("Render 3rd stage");

  const { scene, animations } = useGLTF(stage_3rd);
  const { actions, mixer } = useAnimations(animations, scene);

  const sceneRef = useRef<THREE.Group | null>(null);

  const nexMeshRef = useRef<THREE.Mesh | null>(null);
  const glowMeshRef = useRef<THREE.Mesh | null>(null);

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const sceneBounds = useRef(new THREE.Box3());

  const isHovered = useRef<boolean>(false);
  const isSceneActive = useRef<boolean>(false);

  const colliderLeftRef = useRef(scene.getObjectByName(COLLIDER_NAME_1));
  const colliderRightRef = useRef(scene.getObjectByName(COLLIDER_NAME_2));

  const camera = useThree((state) => state.camera);

  useVideoMaterial(videoHref, imageHref, sceneRef, "screen");
  useEmissiveNoToneMapped(scene);
  useInvisibleMaterial(colliderLeftRef);
  useInvisibleMaterial(colliderRightRef);

  const scroll = useScroll();
  const lastOffset = useRef(scroll.offset);

  const actionOpen_1 = actions[OPEN_CLIP_1];
  const actionClose_1 = actions[CLOSE_CLIP_1];

  const actionOpen_2 = actions[OPEN_CLIP_2];
  const actionClose_2 = actions[CLOSE_CLIP_2];

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    // Вычисляем границы сцены
    sceneBounds.current.setFromObject(scene);
  }, [scene]);

  useEffect(() => {
    if (!actions) return;
    const loopAnimation = actions[LOOP_ANIMATION];
    loopAnimation?.play();
  }, [actions]);

  useEffect(() => {
    const nexMesh = scene.getObjectByName("nex");

    if (nexMesh instanceof THREE.Mesh) {
      nexMeshRef.current = nexMesh;

      const glowMesh = new THREE.Mesh(nexMesh.geometry, glowMaterial);
      glowMesh.position.copy(nexMesh.position);
      glowMeshRef.current = glowMesh;

      // Проверяем, есть ли родительский объект
      if (nexMesh.parent) {
        nexMesh.parent.add(glowMesh);
      }
    }
  }, [scene, glowMaterial]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!nexMeshRef.current || !glowMeshRef.current) return;

      // Обновляем координаты мыши
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Устанавливаем луч
      raycaster.current.setFromCamera(mouse.current, camera);

      // Проверяем пересечение
      const intersects = raycaster.current.intersectObject(nexMeshRef.current);

      if (intersects.length > 0) {
        isHovered.current = true;
        document.body.style.cursor = "pointer";
      } else {
        isHovered.current = false;
        document.body.style.cursor = "";
      }
    },
    [camera]
  );

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove]);

  useFrame(() => {
    if (!sceneBounds.current) return;

    // Проверяем, находится ли камера внутри границ сцены
    isSceneActive.current = sceneBounds.current.containsPoint(camera.position);
  });

  useFrame((_, delta) => {
    if (!isSceneActive.current) return;

    const deltaOffset = scroll.offset - lastOffset.current;

    lastOffset.current = scroll.offset;

    if (!actionClose_1 || !actionOpen_1 || !actionOpen_2 || !actionClose_2)
      return;

    if (scroll.offset.toFixed(2) >= "0.29" && deltaOffset > 0) {
      actionOpen_1.stop();

      actionClose_1.play();
      actionClose_1.loop = THREE.LoopOnce;
      actionClose_1.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.28" && deltaOffset < 0) {
      actionClose_1.stop();

      actionOpen_1.play();
      actionOpen_1.loop = THREE.LoopOnce;
      actionOpen_1.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) >= "0.45" && deltaOffset > 0) {
      actionClose_2.stop();

      actionOpen_2.play();
      actionOpen_2.loop = THREE.LoopOnce;
      actionOpen_2.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.44" && deltaOffset < 0) {
      actionOpen_2.stop();

      actionClose_2.play();
      actionClose_2.loop = THREE.LoopOnce;
      actionClose_2.clampWhenFinished = true;
    }

    mixer.update(delta);
  });

  useFrame((state) => {
    if (!glowMeshRef.current || !isSceneActive.current) return;

    const material = glowMeshRef.current.material;

    if (Array.isArray(material)) return; // Если массив, игнорируем

    const basicMaterial = material as THREE.MeshBasicMaterial;

    const time = state.clock.elapsedTime;
    const sinOpacity = Math.sin(time * 1.5) * 0.2 + 0.2;

    // Определяем целевую прозрачность и цвет в зависимости от состояния ховера
    if (isHovered.current) {
      basicMaterial.opacity = THREE.MathUtils.lerp(
        basicMaterial.opacity,
        INITIAL_OPACITY,
        0.1
      );
      basicMaterial.color = new THREE.Color(0xffd700);
    } else {
      // Без ховера: мерцание золотым цветом
      basicMaterial.opacity = THREE.MathUtils.lerp(
        basicMaterial.opacity,
        sinOpacity,
        0.1
      );

      const baseColor = new THREE.Color(0xffffcc); // Базовый золотой цвет
      // const pulseColor = baseColor
      //   .clone()
      //   .lerp(
      //     new THREE.Color(0xffffcc),
      //     (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2
      //   );
      basicMaterial.color = baseColor;
    }

    basicMaterial.transparent = true;
    basicMaterial.needsUpdate = true;
  });

  return <primitive object={scene} position={[0, 0, 0]} ref={sceneRef} />;
};

useGLTF.preload(stage_3rd);
