import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";

import stage_2nd from "@/assets/models/2nd_stage.glb";
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
  const [isDistanceExceeded, setIsDistanceExceeded] = useState(false);

  const { scene, animations } = useGLTF(stage_2nd);
  const { actions } = useAnimations(animations, scene);

  const hoveredStates = useAppStore((state) => state.hoveredStates);
  const setHoveredStates = useAppStore((state) => state.setHoveredState);

  const lenis = useLenis();
  const camera = useThree((state) => state.camera);
  const scrollOffset = useAppStore((state) => state.scrollOffset);

  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const collidersRef = useRef(
    Object.values(WwdColliderName).map((name) => scene.getObjectByName(name))
  );

  useEmissiveNoToneMapped(scene);
  useInvisibleMaterial(collidersRef);

  // const mat = useRef<THREE.MeshStandardMaterial | null>(null);

  // useEffect(() => {
  //   console.log(scene);
  //   scene.traverse((node) => {
  //     if (node instanceof THREE.Mesh) {
  //       if (node.material instanceof THREE.MeshStandardMaterial) {
  //         // if (node.material.name !== nodeMaterialName) return;

  //         node.material.toneMapped = false;
  //         // node.material.side = FrontSide;
  //         // node.material.map = texture;
  //         // node.material.map.flipY = false;
  //         // node.material.map.minFilter = LinearFilter;
  //         // node.material.emissiveMap = texture;
  //         node.material.emissiveIntensity = 0.1;
  //         // node.material.envMapIntensity = 0;
  //         // node.material.envMap = null;

  //         // additionalInstructions?.(node.material);

  //         // node.material.needsUpdate = true;
  //         console.log(node.material);
  //         mat.current = node.material;
  //       }
  //     }

  //     return () => mat.current?.dispose();
  //   });
  // }, [scene]);

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

  useFrame(() => {
    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];

    if (actionScroll) {
      const duration = actionScroll.getClip().duration;
      actionScroll.time = scrollOffset * duration;
    }

    // Проверка расстояния камеры
    const distance = camera.position.distanceTo(scene.position);

    if (distance > MAX_HOVER_DISTANCE && !isDistanceExceeded) {
      setIsDistanceExceeded(true);

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
      setIsDistanceExceeded(false);
    }

    // mixer.update(delta);
  });

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

  return (
    <primitive
      object={scene}
      position={[0, 0, -25]}
      onPointerMove={handleMouseMove}
    />
  );
};
