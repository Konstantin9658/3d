import { useGLTF } from "@react-three/drei";
import spaceStation from "@/assets/models/space_station.glb";

export const SpaceStation = () => {
  const { scene } = useGLTF(spaceStation);

  return <primitive object={scene} position={[22, 0, -108]} />;
};
