import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

import spaceStation from "@/assets/models/space_station.glb";

export const SpaceStation = () => {
  const { scene, animations } = useGLTF(spaceStation);

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions || !actions["Scene"]) return;

    const action = actions["Scene"];
    action.play();
  }, [actions, animations]);

  return <primitive object={scene} position={[22, 0, -108]} />;
};

useGLTF.preload(spaceStation);
