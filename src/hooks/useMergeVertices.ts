import { useEffect } from "react";
import * as THREE from "three";
import { mergeVertices } from "three-stdlib";

export const useMergeVertices = (scene: THREE.Scene | null) => {
  useEffect(() => {
    if (!scene) return;

    scene.traverse((object: THREE.Object3D) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry instanceof THREE.BufferGeometry) {
        // Объединяем вершины
        const mergedGeometry = mergeVertices(mesh.geometry);
        mesh.geometry = mergedGeometry;
      }
    });
  }, [scene]);
};
