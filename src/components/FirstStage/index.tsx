import { useGLTF } from "@react-three/drei";
import stage_1st from "@/assets/models/1st_stage.glb";

export const FirstStage = () => {
  const { scene } = useGLTF(stage_1st);

  return <primitive object={scene} position={[0, 0, -36]} />;
};
