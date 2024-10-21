import { MeshTransmissionMaterial, useGLTF } from "@react-three/drei";
import stage_1st from "@/assets/models/1st_stage.glb";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export const FirstStage = () => {
  const { scene, nodes } = useGLTF(stage_1st);

  const ref = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.traverse((node) => {
      console.log(node);
      if (node instanceof THREE.Mesh) {
        if (node.material instanceof THREE.MeshStandardMaterial) {
          if (["glass"].some((m) => node.material.name.includes(m))) {
            const mat = new THREE.MeshStandardMaterial({
              transmission: 1,
              roughness: 0,
              thickness: 3.5,
              ior: 1.5,
              chromaticAberration: 0.06,
              anisotropy: 0.1,
              distortion: 0,
              distortionScale: 0.3,
              temporalDistortion: 0.5,
              clearcoat: 1,
              attenuationDistance: 0.5,
              attenuationColor: "#ffffff",
            });

            node.material = mat;
          }
        }
      }
    });
  }, [scene]);

  return <primitive ref={ref} object={scene} position={[0, 0, -36]} />;
};
