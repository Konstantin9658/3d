import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import stage_2nd from "@/assets/models/2nd_stage.glb";
import { useAppStore } from "@/store/app";

import { SCROLL_ACTION } from "./consts";
import {
  WwdColliderName,
  WwdHoverAction,
  WwdLoopAnimations,
  WwdUnhoverAction,
} from "./types";

export const SecondStage = () => {
  const { scene, animations } = useGLTF(stage_2nd);
  const { actions, mixer } = useAnimations(animations, scene);

  const hoveredStates = useAppStore((state) => state.hoveredStates);
  const setHoveredStates = useAppStore((state) => state.setHoveredState);

  const lenis = useLenis();
  const camera = useThree((state) => state.camera);
  const scrollOffset = useAppStore((state) => state.scrollOffset);

  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const raycasterFrameId = useRef<number | null>(null);
  const collidersRef = useRef(
    Object.values(WwdColliderName).map((name) => scene.getObjectByName(name))
  );

  useEffect(() => {
    // Скрываем материал всех коллайдеров
    collidersRef.current.forEach((collider) => {
      if (collider && collider instanceof THREE.Mesh) {
        collider.material.visible = false;
      }
    });
  }, [collidersRef]);

  useEffect(() => {
    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];
    const actionLoopAnimations = Object.values(WwdLoopAnimations);

    if (!actionScroll) return;

    actionLoopAnimations.forEach((_, index) => {
      actions[actionLoopAnimations[index]]?.play();
      actions[actionLoopAnimations[index]]?.setDuration(2);
    });

    actionScroll.clampWhenFinished = true;

    if (!lenis?.isSmooth) actionScroll.paused = true;
    else actionScroll.play();
  }, [actions, lenis?.isSmooth]);

  useFrame((_, delta) => {
    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];
    if (actionScroll) {
      const duration = actionScroll.getClip().duration;
      actionScroll.time = scrollOffset * duration;
    }

    mixer.update(delta);
  });

  const handleMouseMove = (event: MouseEvent) => {
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!raycasterFrameId.current) {
      raycasterFrameId.current = requestAnimationFrame(() => {
        raycaster.current.setFromCamera(mouse.current, camera);

        collidersRef.current.forEach((collider, index) => {
          if (!collider) return;

          const colliderName = Object.values(WwdColliderName)[index];
          const actionsHover = actions[Object.values(WwdHoverAction)[index]];
          const actionsUnhover =
            actions[Object.values(WwdUnhoverAction)[index]];

          if (!actionsHover || !actionsUnhover) return;

          const intersects = raycaster.current.intersectObject(collider);
          const isIntersected = intersects.length > 0;
          const isHovered = hoveredStates[colliderName];

          if (isIntersected && !isHovered) {
            actionsHover.setDuration(2);
            actionsUnhover.stop();
            actionsHover.reset().play();
            actionsHover.clampWhenFinished = true;
            actionsHover.loop = THREE.LoopOnce;
            setHoveredStates(colliderName, true);
          } else if (!isIntersected && isHovered) {
            actionsHover.stop();
            actionsUnhover.setDuration(2);
            actionsUnhover.reset().play();
            actionsUnhover.clampWhenFinished = true;
            actionsUnhover.loop = THREE.LoopOnce;
            setHoveredStates(colliderName, false);
          }
        });

        raycasterFrameId.current = null; // Сброс для следующего кадра
      });
    }
  };

  return (
    <primitive
      object={scene}
      position={[0, 0, -25]}
      onPointerMove={handleMouseMove}
    />
  );
};
