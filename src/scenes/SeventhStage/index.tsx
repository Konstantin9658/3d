import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_7th from "@/assets/models/7th_stage.glb";

export const SeventhStage = () => {
  console.log("Render 7th stage");
  const { scene } = useGLTF(stage_7th);

  const rz = degToRad(180);

  return (
    <primitive object={scene} position={[0, 28, -16]} rotation={[0, 0, rz]} />
  );
};

useGLTF.preload(stage_7th);