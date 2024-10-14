import { useGLTF } from "@react-three/drei";
import stage_2nd from "@/assets/models/2nd_stage.glb";
// import stage_2nd from "@/model.glb";

export const SecondStage = () => {
  const { scene } = useGLTF(stage_2nd);

  return (
    <primitive
      object={scene}
      // scale={0.1}
      // rotation={[0, -45, 0]}
      position={[0, 0, -25]}
    />
  );
};
