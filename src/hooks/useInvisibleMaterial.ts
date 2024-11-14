import { MutableRefObject, useEffect } from "react";
import * as THREE from "three";

export const useInvisibleMaterial = (
  colliders: MutableRefObject<
    THREE.Object3D | (THREE.Object3D | undefined)[] | undefined
  >
) => {
  useEffect(() => {
    if (!colliders.current) return;

    // Преобразуем в массив и отфильтровываем `undefined` элементы
    const collidersArray = Array.isArray(colliders.current)
      ? colliders.current.filter(
          (collider): collider is THREE.Object3D => collider !== undefined
        )
      : [colliders.current];

    collidersArray.forEach((collider) => {
      if (collider instanceof THREE.Mesh) {
        (collider.material as THREE.Material).visible = false;
      }
    });
  }, [colliders]);
};
