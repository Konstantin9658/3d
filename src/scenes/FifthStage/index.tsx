import stage_5th from "@/assets/models/5th_stage.glb";
import { useGLTF } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export const FifthStage = () => {
  const { scene } = useGLTF(stage_5th);

  const rx = degToRad(-180);

  return (
    <primitive object={scene} position={[0, 28, 8]} rotation={[rx, 0, 0]} />
  );
};
