import { useEffect } from "react";
import * as THREE from "three";

const isEmissiveMaterial = (mat: THREE.MeshStandardMaterial) =>
  mat.emissive.r || mat.emissive.g || mat.emissive.b;

export const useEmissiveNoToneMapped = (
  scene: THREE.Group,
  additionalInstructions?: (mat: THREE.MeshStandardMaterial) => void
) => {
  useEffect(() => {
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.material instanceof THREE.MeshStandardMaterial) {
          if (isEmissiveMaterial(node.material)) {
            node.material.toneMapped = false;

            if (additionalInstructions) additionalInstructions(node.material);

            node.material.needsUpdate = true;
          }
        }
      }
    });
  }, [additionalInstructions, scene]);
};
