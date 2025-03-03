import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_6th from "@/assets/models/6th_stage.glb";

export const SixthStage = () => {
  console.log("Render 6th stage");
  const { scene, animations } = useGLTF(stage_6th);
  const { mixer, actions } = useAnimations(animations, scene);

  const scroll = useScroll();
  const lastOffset = useRef(scroll.offset);

  const open = actions["open"];
  const close = actions["close"];

  const hatchOpen = actions["hatch-open"];
  const hatchClose = actions["hatch-close"];

  useEffect(() => {
    console.log(scroll.offset);
  }, [scroll.offset]);

  useFrame((_, delta) => {
    if (!open || !close) return;
    if (!hatchOpen || !hatchClose) return;

    const deltaOffset = scroll.offset - lastOffset.current;

    lastOffset.current = scroll.offset;
    // console.log(scroll.offset);

    if (scroll.offset.toFixed(2) >= "0.82" && deltaOffset > 0) {
      close.stop();

      open.play();
      open.loop = THREE.LoopOnce;
      open.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.81" && deltaOffset < 0) {
      open.stop();
      close.play();
      close.loop = THREE.LoopOnce;
      close.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) >= "0.91" && deltaOffset > 0) {
      hatchClose.stop();

      hatchOpen.play();
      hatchOpen.loop = THREE.LoopOnce;
      hatchOpen.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.92" && deltaOffset < 0) {
      hatchOpen.stop();
      hatchClose.play();
      hatchClose.loop = THREE.LoopOnce;
      hatchClose.clampWhenFinished = true;
    }

    mixer.update(delta);
  });

  const rz = degToRad(180);
  return (
    <primitive object={scene} position={[0, 26, -12]} rotation={[0, 0, rz]} />
  );
};

useGLTF.preload(stage_6th);
