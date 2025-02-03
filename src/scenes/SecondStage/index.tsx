import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import stage_2nd from "@/assets/models/2nd_stage.glb";
import { useScrollOffset } from "@/hooks/useAppHeight";
import { useEmissiveNoToneMapped } from "@/hooks/useEmissiveNoToneMapped";
import { useInvisibleMaterial } from "@/hooks/useInvisibleMaterial";
import { useAppStore } from "@/store/app";
import { playAction } from "@/utils";

import { MAX_HOVER_DISTANCE, SCROLL_ACTION } from "./consts";
import {
  WwdColliderName,
  WwdHoverAction,
  WwdLoopAnimations,
  WwdUnhoverAction,
} from "./types";

export const SecondStage = () => {
  console.log("Render 2nd stage");

  const [isDistanceExceeded, setDistanceExceeded] = useState(false);

  const { scene, animations } = useGLTF(stage_2nd);
  const { actions, mixer } = useAnimations(animations, scene);

  const hoveredStates = useAppStore((state) => state.hoveredStates);
  const setHoveredStates = useAppStore((state) => state.setHoveredState);

  const prevScrollOffset = useRef(0);

  const camera = useThree((state) => state.camera);

  const sceneBounds = useRef(new THREE.Box3());
  const isSceneActive = useRef<boolean>(false);

  // const isDistanceExceeded = useRef<boolean>(false);
  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const collidersRef = useRef(
    Object.values(WwdColliderName).map((name) => scene.getObjectByName(name))
  );

  useEmissiveNoToneMapped(scene);
  useInvisibleMaterial(collidersRef);

  const scrollOffset = useScrollOffset();

  const handleHoverAction = useCallback(
    (
      action: THREE.AnimationAction,
      colliderName: WwdColliderName,
      isHover: boolean
    ) => {
      playAction(action);
      setHoveredStates(colliderName, isHover);
    },
    [setHoveredStates]
  );

  const handleMouseMove = (event: MouseEvent) => {
    if (isDistanceExceeded) return;

    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);

    collidersRef.current.forEach((collider, index) => {
      if (!collider) return;

      const colliderName = Object.values(WwdColliderName)[index];
      const actionsHover = actions[Object.values(WwdHoverAction)[index]];
      const actionsUnhover = actions[Object.values(WwdUnhoverAction)[index]];

      if (!actionsHover || !actionsUnhover) return;

      const intersects = raycaster.current.intersectObject(collider);
      const isIntersected = intersects.length > 0;
      const isHovered = hoveredStates[colliderName];

      if (isIntersected && !isHovered) {
        actionsUnhover.stop();
        handleHoverAction(actionsHover, colliderName, true);
      } else if (!isIntersected && isHovered) {
        actionsHover.stop();
        handleHoverAction(actionsUnhover, colliderName, false);
      }
    });
  };

  useEffect(() => {
    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];
    const actionLoopAnimations = Object.values(WwdLoopAnimations);

    if (!actionScroll) return;

    actionLoopAnimations.forEach((_, index) => {
      actions[actionLoopAnimations[index]]?.play();
      actions[actionLoopAnimations[index]]?.setDuration(2);
    });

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
    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];

    if (!actionScroll) return;

    const duration = actionScroll.getClip().duration;

    if (prevScrollOffset.current !== scrollOffset.current) {
      // Если прокрутка изменилась, продолжаем анимацию
      actionScroll.time = scrollOffset.current * duration;
      prevScrollOffset.current = scrollOffset.current; // Обновляем предыдущий скролл
    } else {
      // Если прокрутка не изменилась, приостанавливаем анимацию
      actionScroll.paused = true;
      actionScroll.clampWhenFinished = true;
    }

    if (!isSceneActive.current) return;

    // Проверка расстояния камеры
    const distance = camera.position.distanceTo(scene.position);

    if (distance > MAX_HOVER_DISTANCE && !isDistanceExceeded) {
      setDistanceExceeded(true);

      collidersRef.current.forEach((collider, index) => {
        if (!collider) return;

        const colliderName = Object.values(WwdColliderName)[index];
        const actionsHover = actions[Object.values(WwdHoverAction)[index]];
        const actionsUnhover = actions[Object.values(WwdUnhoverAction)[index]];

        const isHovered = hoveredStates[colliderName];

        if (isHovered && actionsUnhover && actionsHover) {
          actionsHover.stop();
          handleHoverAction(actionsUnhover, colliderName, false);
        }
      });
    } else if (distance <= MAX_HOVER_DISTANCE && isDistanceExceeded) {
      setDistanceExceeded(false);
    }

    mixer.update(delta);
  });

  return (
    <primitive
      object={scene}
      position={[0, 0, -25]}
      onPointerMove={handleMouseMove}
    />
  );
};

useGLTF.preload(stage_2nd);
