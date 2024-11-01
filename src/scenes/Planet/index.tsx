import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

// import * as THREE from "three";
import planet from "@/assets/models/planet.glb";

export const Planet = () => {
  const { scene,animations } = useGLTF(planet);

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!actions || !actions["Scene"]) return;

    const action = actions["Scene"];
    action.play();
    // action.setDuration(40)
  }, [actions, animations]);

  // useEffect(() => {
  //   scene.traverse((object) => {
  //     if (object instanceof THREE.Mesh && object.material) {
  //       if (Array.isArray(object.material)) {
  //         object.material.forEach((mat) => {
  //           mat.wireframe = true;
  //         });
  //       } else {
  //         object.material.wireframe = true;
  //       }
  //     }
  //   });
  // }, [scene]);

  return <primitive object={scene} position={[-17, 40, -94]} />;
};
