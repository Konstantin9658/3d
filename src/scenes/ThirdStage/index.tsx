import { useGLTF } from "@react-three/drei";

import stage_3rd from "@/assets/models/3rd_stage.glb";

export const ThirdStage = () => {
  const { scene } = useGLTF(stage_3rd);

  return <primitive object={scene} position={[0, 0, 0]} />;
};
