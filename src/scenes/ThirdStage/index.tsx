import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import stage_3rd from "@/assets/models/3rd_stage.glb";

const COLLIDER_NAME = "collider_3st_1";
const CLOSE_CLIP = "1doors_close";
const OPEN_CLIP = "1doors_open";

export const ThirdStage = () => {
  const { scene, animations } = useGLTF(stage_3rd);
  const { actions } = useAnimations(animations, scene);

  const [isOpenDoor, setOpenDoor] = useState(true);

  const camera = useThree((state) => state.camera);
  const colliderRef = useRef(scene.getObjectByName(COLLIDER_NAME));
  const prevCameraPosition = useRef(new THREE.Vector3());

  useEffect(() => {
    const actionsOpen = actions[OPEN_CLIP];
    const actionsClose = actions[CLOSE_CLIP];

    if (!actionsOpen || !actionsClose) return;

    if (isOpenDoor) {
      actionsClose.stop();
      actionsOpen.reset().play();
      actionsOpen.loop = THREE.LoopOnce;
      actionsOpen.clampWhenFinished = true;
      return;
    } else {
      actionsOpen.stop();
      actionsClose.reset().play();
      actionsClose.loop = THREE.LoopOnce;
      actionsClose.clampWhenFinished = true;
      return;
    }
  }, [actions, isOpenDoor]);

  useEffect(() => {
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

    // Установите время анимации в 0 перед ее воспроизведением
    if (dotProduct > 0) {
      return setOpenDoor(true);
    } else {
      return setOpenDoor(false);
    }

    // Обновление последней позиции камеры
    prevCameraPosition.current.copy(currentCameraPosition);
  });

  return <primitive object={scene} position={[0, 0, 0]} />;
};
