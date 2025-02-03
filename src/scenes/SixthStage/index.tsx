import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_6th from "@/assets/models/6th_stage.glb";

export const SixthStage = () => {
  console.log("Render 6th stage");
  const { scene } = useGLTF(stage_6th);

  const rx = degToRad(180);
  return (
    <primitive object={scene} position={[0, 28, -12]} rotation={[rx, 0, 0]} />
  );
};

useGLTF.preload(stage_6th);
