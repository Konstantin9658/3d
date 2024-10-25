import planet from "@/assets/models/planet.glb";
import { useGLTF } from "@react-three/drei";

export const Planet = () => {
  const { scene } = useGLTF(planet);

  return <primitive object={scene} position={[-17, 40, -94]} />;
};
