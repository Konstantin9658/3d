import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

import stage_3rd from "@/assets/models/3rd_stage.glb";
import { useEmissiveNoToneMapped } from "@/hooks/useEmissiveNoToneMapped";
import { useInvisibleMaterial } from "@/hooks/useInvisibleMaterial";
import { useVideoMaterial } from "@/hooks/useVideoMaterial";
import { playAction } from "@/utils";

import {
  CLOSE_CLIP_1,
  CLOSE_CLIP_2,
  COLLIDER_NAME_1,
  COLLIDER_NAME_2,
  LOOP_ANIMATION,
  OPEN_CLIP_1,
  OPEN_CLIP_2,
} from "./consts";
import imageHref from "./screen.jpg";
import videoHref from "./screen_1024.mp4";

export const ThirdStage = () => {
  const { scene, animations } = useGLTF(stage_3rd);
  const { actions } = useAnimations(animations, scene);

  const ref = useRef<THREE.Group | null>(null);

  const [isOpenDoorLeft, setOpenDoorLeft] = useState(true);
  const [isOpenDoorRight, setOpenDoorRight] = useState(false);

  const camera = useThree((state) => state.camera);

  const colliderToCamera = useRef(new THREE.Vector3());
  const colliderWorldPosition = useRef(new THREE.Vector3());
  const colliderLeftRef = useRef(scene.getObjectByName(COLLIDER_NAME_1));
  const colliderRightRef = useRef(scene.getObjectByName(COLLIDER_NAME_2));

  useVideoMaterial(videoHref, imageHref, ref, "screen");

  useEmissiveNoToneMapped(scene);
  useInvisibleMaterial(colliderLeftRef);

  useEffect(() => {
    if (!actions) return;
    const loopAnimation = actions[LOOP_ANIMATION];

    loopAnimation?.play();
  }, [actions]);

  useEffect(() => {
    const actionsOpen = actions[OPEN_CLIP_1];
    const actionsClose = actions[CLOSE_CLIP_1];

    if (!actionsOpen || !actionsClose) return;

    if (isOpenDoorLeft) {
      actionsClose.stop();
      return playAction(actionsOpen);
    } else {
      actionsOpen.stop();
      return playAction(actionsClose);
    }
  }, [actions, isOpenDoorLeft]);

  useEffect(() => {
    const actionsOpen = actions[OPEN_CLIP_2];
    const actionsClose = actions[CLOSE_CLIP_2];

    if (!actionsOpen || !actionsClose) return;

    if (isOpenDoorRight) {
      actionsClose.stop();
      return playAction(actionsOpen);
    } else {
      actionsOpen.stop();
      return playAction(actionsClose);
    }
  }, [actions, isOpenDoorRight]);

  useFrame(() => {
    if (
      !colliderLeftRef.current ||
      !(colliderLeftRef.current instanceof THREE.Mesh)
    )
      return;
    if (
      !colliderRightRef.current ||
      !(colliderRightRef.current instanceof THREE.Mesh)
    )
      return;
    // Вектор от коллайдера к камере
    colliderToCamera.current
      .copy(camera.position)
      .sub(colliderWorldPosition.current)
      .normalize();

    // Проверка направления пересечения с помощью скалярного произведения
    const dotProductLeft = colliderToCamera.current.dot(
      colliderLeftRef.current.geometry.normals
        ? colliderLeftRef.current.geometry.normals[0]
        : new THREE.Vector3(0, 0, -1)
    );

    const dotProductRight = colliderToCamera.current.dot(
      colliderRightRef.current.geometry.normals
        ? colliderRightRef.current.geometry.normals[0]
        : new THREE.Vector3(0, 0, -1)
    );

    setOpenDoorLeft(dotProductLeft > 0);
    setOpenDoorRight(dotProductRight < 0);
  });

  return <primitive object={scene} position={[0, 0, 0]} ref={ref} />;
};
