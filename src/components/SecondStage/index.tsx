import { useAnimations, useGLTF } from "@react-three/drei";
import stage_2nd from "@/assets/models/2nd_stage.glb";
import { useFrame } from "@react-three/fiber";
import { useAppStore } from "@/store/app";
import { SECOND_STAGE_ANIM } from "@/consts";
import { useEffect } from "react";
import { useLenis } from "lenis/react";

export const SecondStage = () => {
  const { scene, cameras, animations } = useGLTF(stage_2nd);
  const { actions, mixer } = useAnimations(animations, scene);

  const scrollOffset = useAppStore((state) => state.scrollOffset);

  const lenis = useLenis();

  useEffect(() => {
    if (cameras.length < 0 || !actions || !actions[SECOND_STAGE_ANIM]) return;

    const action = actions[SECOND_STAGE_ANIM];
    action.clampWhenFinished = true;
    action.play();
  }, [cameras, actions]);

  useFrame((_, delta) => {
    if (!actions) return;

    if (!lenis?.isSmooth) return;

    const action = actions[SECOND_STAGE_ANIM];
    if (!action) return;

    const duration = action.getClip().duration;

    action.time = scrollOffset * duration;
    mixer.update(delta);
  });

  return <primitive object={scene} position={[0, 0, -25]} />;
};
