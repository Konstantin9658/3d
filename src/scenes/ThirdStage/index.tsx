import stage_3rd from "@/assets/models/3rd_stage.glb";
import { useGLTF } from "@react-three/drei";

export const ThirdStage = () => {
  const { scene } = useGLTF(stage_3rd);

  return <primitive object={scene} position={[0, 0, 0]} />;
};
