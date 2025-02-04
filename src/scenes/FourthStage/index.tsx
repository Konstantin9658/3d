import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_4th from "@/assets/models/4th_stage.glb";
import { useScrollOffset } from "@/hooks/useAppHeight";
import { useInvisibleMaterial } from "@/hooks/useInvisibleMaterial";

export const FourthStage = () => {
  console.log("Render 4th stage");

  const { scene, animations } = useGLTF(stage_4th);
  const { actions, mixer } = useAnimations(animations, scene);

  const camera = useThree((state) => state.camera);

  const colliderRef = useRef(scene.getObjectByName("4th_collider"));

  useInvisibleMaterial(colliderRef);

  const rx = degToRad(-90);

  const prevScrollOffset = useRef(0);
  const sceneBounds = useRef(new THREE.Box3());
  const isSceneActive = useRef<boolean>(false);

  const scrollOffset = useScrollOffset();

  useEffect(() => {
    if (!actions) return;

    const actionScroll = actions["Scene"];

    if (!actionScroll) return;

    actionScroll.play();
  }, [actions]);

  useEffect(() => {
    // Вычисляем границы сцены
    sceneBounds.current.setFromObject(scene);
  }, [scene]);

  useFrame(() => {
    if (!sceneBounds.current) return;

    // Проверяем, находится ли камера внутри границ сцены
    isSceneActive.current = sceneBounds.current.containsPoint(camera.position);
  });

  useFrame((_, delta) => {
    if (!actions || !isSceneActive.current) return;

    console.log("I'm in 4th stage");

    const actionScroll = actions["Scene"];

    if (!actionScroll) return;

    const duration = actionScroll.getClip().duration;

    // console.log(isSceneActive.current);

    if (prevScrollOffset.current !== scrollOffset.current) {
      // Если прокрутка изменилась, продолжаем анимацию
      actionScroll.time = scrollOffset.current * duration;
      prevScrollOffset.current = scrollOffset.current; // Обновляем предыдущий скролл
    } else {
      // Если прокрутка не изменилась, приостанавливаем анимацию
      actionScroll.paused = true;
      actionScroll.clampWhenFinished = true;
    }
    // console.log("useFrame 4th stage");
    mixer.update(delta);
  });

  return (
    <primitive object={scene} position={[0, 14, 35]} rotation={[rx, 0, 0]} />
  );
};

useGLTF.preload(stage_4th);
