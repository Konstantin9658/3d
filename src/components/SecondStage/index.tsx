import { useGLTF } from "@react-three/drei";
import stage_2nd from "@/assets/models/2nd_stage.glb";

export const SecondStage = () => {
  const { scene } = useGLTF(stage_2nd);

  return <primitive object={scene} position={[0, 0, -25]} />;
};