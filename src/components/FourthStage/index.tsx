import stage_4th from "@/assets/models/4th_stage.glb";
import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export const FourthStage = () => {
  const { scene } = useGLTF(stage_4th);

  const rx = degToRad(-90);

  return (
    <primitive object={scene} position={[0, 0, 22]} rotation={[rx, 0, 0]} />
  );
};
