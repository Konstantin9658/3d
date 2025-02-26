import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_5th from "@/assets/models/5th_stage.glb";

export const FifthStage = () => {
  console.log("Render 5th stage");

  const { scene, animations } = useGLTF(stage_5th);
  const { actions, mixer } = useAnimations(animations, scene);

  const scroll = useScroll();
  const lastOffset = useRef(scroll.offset);

  const rx = degToRad(-180);

  const open = actions["st5-open"];
  const close = actions["st5-close"];

  useFrame((_, delta) => {
    if (!open || !close) return;

    const deltaOffset = scroll.offset - lastOffset.current;

    lastOffset.current = scroll.offset;

    if (scroll.offset.toFixed(2) >= "0.77" && deltaOffset > 0) {
      close.stop();

      open.play();
      open.loop = THREE.LoopOnce;
      open.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.76" && deltaOffset < 0) {
      open.stop();
      close.play();
      close.loop = THREE.LoopOnce;
      close.clampWhenFinished = true;
    }

    mixer.update(delta);
  });

  return (
    <primitive object={scene} position={[0, 28, 16]} rotation={[rx, 0, 0]} />
  );
};

useGLTF.preload(stage_5th);
