import { useAnimations, useGLTF } from "@react-three/drei";
import stage_2nd from "@/assets/models/2nd_stage.glb";
import { useFrame, useThree } from "@react-three/fiber";
import { useAppStore } from "@/store/app";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import {
  HOVER_ACTION,
  SCROLL_ACTION,
  UNHOVER_ACTION,
  WWD_COLLIDER_NAME,
  WWD_LOOP_ACTION,
} from "./consts";

export const SecondStage = () => {
  const [hovered, setHovered] = useState<boolean>(false);

  const { scene, cameras, animations } = useGLTF(stage_2nd);
  const { actions, mixer } = useAnimations(animations, scene);

  const lenis = useLenis();
  const camera = useThree((state) => state.camera);
  const scrollOffset = useAppStore((state) => state.scrollOffset);

  const mouse = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());

  const collider = scene.getObjectByName(WWD_COLLIDER_NAME);

  useEffect(() => {
    if (collider && collider instanceof THREE.Mesh) {
      collider.material.visible = false;
    }
  }, [collider]);

  useEffect(() => {
    if (
      cameras.length < 0 ||
      !actions ||
      !actions[SCROLL_ACTION] ||
      !actions[WWD_LOOP_ACTION]
    )
      return;

    const actionScroll = actions[SCROLL_ACTION];
    const actionWwd5loop = actions[WWD_LOOP_ACTION];

    actionScroll.clampWhenFinished = true;

    actionWwd5loop.play();

    if (!lenis?.isSmooth) actionScroll.paused = true;
    else actionScroll.play();
  }, [cameras, actions, lenis?.isSmooth]);

  useFrame((_, delta) => {
    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];

    if (!actionScroll) return;

    const duration = actionScroll.getClip().duration;

    actionScroll.time = scrollOffset * duration;

    raycaster.current.setFromCamera(mouse.current, camera);

    const actionsHover = actions[HOVER_ACTION];
    const actionsUnhover = actions[UNHOVER_ACTION];

    if (collider && actionsHover && actionsUnhover) {
      const intersects = raycaster.current.intersectObject(collider);

      if (intersects.length > 0) {
        if (!hovered) {
          actionsUnhover.stop();
          actionsHover.reset().play(); // Запускаем анимацию при наведении
          actionsHover.clampWhenFinished = true;
          actionsHover.loop = THREE.LoopOnce;
          setHovered(true);
        }
      } else {
        if (hovered) {
          actionsHover.stop();
          actionsUnhover.reset().play(); // Запускаем анимацию при уходе курсора
          actionsUnhover.clampWhenFinished = true;
          actionsUnhover.loop = THREE.LoopOnce;
          setHovered(false);
        }
      }
    }

    mixer.update(delta);
  });

  const handleMouseMove = (event: MouseEvent) => {
    mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  return (
    <primitive
      object={scene}
      position={[0, 0, -25]}
      onPointerMove={handleMouseMove}
    />
  );
};
