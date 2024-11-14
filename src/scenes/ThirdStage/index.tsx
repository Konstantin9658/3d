import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import stage_3rd from "@/assets/models/3rd_stage.glb";
import { useEmissiveNoToneMapped } from "@/hooks/useEmissiveNoToneMapped";
import { useVideoMaterial } from "@/hooks/useVideoMaterial";

import { CLOSE_CLIP, COLLIDER_NAME, LOOP_ANIMATION, OPEN_CLIP } from "./consts";
import imageHref from "./screen.jpg";
import videoHref from "./screen_512.mp4";
import { handleActionDoor } from "./utils";

export const ThirdStage = () => {
  const { scene, animations } = useGLTF(stage_3rd);
  const { actions } = useAnimations(animations, scene);

  const ref = useRef<THREE.Group | null>(null);

  const [isOpenDoor, setOpenDoor] = useState(true);

  const camera = useThree((state) => state.camera);

  const colliderToCamera = useRef(new THREE.Vector3());
  const colliderWorldPosition = useRef(new THREE.Vector3());
  const colliderRef = useRef(scene.getObjectByName(COLLIDER_NAME));

  useVideoMaterial(videoHref, imageHref, ref, "screen", (mat) => {
    mat.emissive = new THREE.Color("white");
  });

  useEmissiveNoToneMapped(scene);

  useEffect(() => {
    if (!actions) return;

    const loopAnimation = actions[LOOP_ANIMATION];

    loopAnimation?.play();
  }, [actions]);

  useEffect(() => {
    const actionsOpen = actions[OPEN_CLIP];
    const actionsClose = actions[CLOSE_CLIP];

    if (!actionsOpen || !actionsClose) return;

    if (isOpenDoor) {
      actionsClose.stop();
      handleActionDoor(actionsOpen);
      return;
    } else {
      actionsOpen.stop();
      handleActionDoor(actionsClose);
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

    const collider = colliderRef.current;

    // Вектор от коллайдера к камере
    colliderToCamera.current
      .copy(camera.position)
      .sub(colliderWorldPosition.current)
      .normalize();

    // Проверка направления пересечения с помощью скалярного произведения
    const dotProduct = colliderToCamera.current.dot(
      collider.geometry.normals
        ? collider.geometry.normals[0]
        : new THREE.Vector3(0, 0, -1)
    );

    return setOpenDoor(dotProduct > 0);
  });

  return <primitive object={scene} position={[0, 0, 0]} ref={ref} />;
};
