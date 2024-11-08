import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import stage_3rd from "@/assets/models/3rd_stage.glb";

const COLLIDER_NAME = "collider_3st_1";

const CLOSE_CLIP = "1doors_close";
const OPEN_CLIP = "1doors_open";

export const ThirdStage = () => {
  const { scene, animations } = useGLTF(stage_3rd);
  const { actions } = useAnimations(animations, scene);

  const camera = useThree((state) => state.camera);
  const colliderRef = useRef(scene.getObjectByName(COLLIDER_NAME));

  const prevCameraPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    // Скрытие коллайдера, если это Mesh
    if (
      colliderRef.current instanceof THREE.Mesh &&
      colliderRef.current.material instanceof THREE.Material
    ) {
      colliderRef.current.material.visible = false;
    }
  }, []);

  useFrame(() => {
    if (!colliderRef.current || !(colliderRef.current instanceof THREE.Mesh))
      return;

    const actionsOpen = actions[OPEN_CLIP];
    const actionsClose = actions[CLOSE_CLIP];

    if (!actionsOpen || !actionsClose) return;

    const collider = colliderRef.current;
    const colliderWorldPosition = new THREE.Vector3();
    collider.getWorldPosition(colliderWorldPosition);

    const currentCameraPosition = camera.position.clone();
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Вектор от коллайдера к камере
    const colliderToCamera = currentCameraPosition
      .clone()
      .sub(colliderWorldPosition)
      .normalize();

    // Проверка направления пересечения с помощью скалярного произведения
    const dotProduct = colliderToCamera.dot(
      collider.geometry.normals
        ? collider.geometry.normals[0]
        : new THREE.Vector3(0, 0, -1)
    );

    if (dotProduct > 0) {
      // console.log("Коллайдер пересечен с задней стороны");
      actionsClose.reset().play();
      actionsClose.loop = THREE.LoopOnce;
      actionsClose.clampWhenFinished = true;
    } else {
      // console.log("Коллайдер пересечен с передней стороны");
      actionsOpen.reset().play();
      actionsOpen.loop = THREE.LoopOnce;
      actionsOpen.clampWhenFinished = true;
    }

    // Обновление последней позиции камеры
    prevCameraPosition.current.copy(currentCameraPosition);
  });

  return <primitive object={scene} position={[0, 0, 0]} />;
};
