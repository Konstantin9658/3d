import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_5th from "@/assets/models/5th_stage.glb";

export const FifthStage = () => {
  console.log("Render 5th stage");

  const { scene } = useGLTF(stage_5th);

  const rx = degToRad(-180);

  return (
    <primitive object={scene} position={[0, 28, 16]} rotation={[rx, 0, 0]} />
  );
};

useGLTF.preload(stage_5th);
