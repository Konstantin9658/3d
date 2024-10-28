import { useGLTF } from "@react-three/drei";

import planet from "@/assets/models/planet.glb";

export const Planet = () => {
  const { scene } = useGLTF(planet);

  return <primitive object={scene} position={[-17, 40, -94]} />;
};
