import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_4th from "@/assets/models/4th_stage.glb";

export const FourthStage = () => {
  const { scene } = useGLTF(stage_4th);

  const rx = degToRad(-90);

  return (
    <primitive object={scene} position={[0, 14, 22]} rotation={[rx, 0, 0]} />
  );
};
