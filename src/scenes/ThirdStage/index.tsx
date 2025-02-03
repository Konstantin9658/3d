import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const INITIAL_OPACITY = 0.5;

export const ThirdStage = () => {
  console.log("Render 3rd stage");

  const { scene, animations } = useGLTF(stage_3rd);
  const { actions } = useAnimations(animations, scene);

  const [isOpenDoorLeft, setOpenDoorLeft] = useState(true);
  const [isOpenDoorRight, setOpenDoorRight] = useState(false);

  const sceneRef = useRef<THREE.Group | null>(null);

  const colliderToCamera = useRef(new THREE.Vector3());
  const colliderWorldPosition = useRef(new THREE.Vector3());
  const colliderLeftRef = useRef(scene.getObjectByName(COLLIDER_NAME_1));
  const colliderRightRef = useRef(scene.getObjectByName(COLLIDER_NAME_2));

  const nexMeshRef = useRef<THREE.Mesh | null>(null);
  const glowMeshRef = useRef<THREE.Mesh | null>(null);

  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const sceneBounds = useRef(new THREE.Box3());

  const isHovered = useRef<boolean>(false);
  const isSceneActive = useRef<boolean>(false);

  const camera = useThree((state) => state.camera);

  useVideoMaterial(videoHref, imageHref, sceneRef, "screen");
  useEmissiveNoToneMapped(scene);
  useInvisibleMaterial(colliderLeftRef);

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    // Вычисляем границы сцены
    sceneBounds.current.setFromObject(scene);
  }, [scene]);

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

  useEffect(() => {
    const nexMesh = scene.getObjectByName("nex");

    if (nexMesh instanceof THREE.Mesh) {
      nexMeshRef.current = nexMesh;

      const glowMesh = new THREE.Mesh(nexMesh.geometry, glowMaterial);
      glowMesh.position.copy(nexMesh.position);
      glowMeshRef.current = glowMesh;

      // Проверяем, есть ли родительский объект
      if (nexMesh.parent) {
        nexMesh.parent.add(glowMesh);
      }
    }
  }, [scene, glowMaterial]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!nexMeshRef.current || !glowMeshRef.current) return;

      // Обновляем координаты мыши
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Устанавливаем луч
      raycaster.current.setFromCamera(mouse.current, camera);

      // Проверяем пересечение
      const intersects = raycaster.current.intersectObject(nexMeshRef.current);

      if (intersects.length > 0) {
        isHovered.current = true;
        document.body.style.cursor = "pointer";
      } else {
        isHovered.current = false;
        document.body.style.cursor = "default";
      }
    },
    [camera]
  );

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove]);

  useFrame(() => {
    if (!sceneBounds.current) return;

    // Проверяем, находится ли камера внутри границ сцены
    isSceneActive.current = sceneBounds.current.containsPoint(camera.position);
  });

  useFrame(() => {
    if (!isSceneActive.current) return;

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

    const newIsOpenDoorLeft = dotProductLeft > 0;
    const newIsOpenDoorRight = dotProductRight < 0;

    if (newIsOpenDoorLeft !== isOpenDoorLeft) {
      setOpenDoorLeft(newIsOpenDoorLeft);
    }
    if (newIsOpenDoorRight !== isOpenDoorRight) {
      setOpenDoorRight(newIsOpenDoorRight);
    }
  });

  useFrame((state) => {
    if (!glowMeshRef.current || !isSceneActive.current) return;

    const material = glowMeshRef.current.material;

    if (Array.isArray(material)) return; // Если массив, игнорируем

    const basicMaterial = material as THREE.MeshBasicMaterial;

    const time = state.clock.elapsedTime;
    const sinOpacity = Math.sin(time * 1.5) * 0.2 + 0.2;

    // Определяем целевую прозрачность и цвет в зависимости от состояния ховера
    if (isHovered.current) {
      basicMaterial.opacity = THREE.MathUtils.lerp(
        basicMaterial.opacity,
        INITIAL_OPACITY,
        0.1
      );
      basicMaterial.color = new THREE.Color(0xffd700);
    } else {
      // Без ховера: мерцание золотым цветом
      basicMaterial.opacity = THREE.MathUtils.lerp(
        basicMaterial.opacity,
        sinOpacity,
        0.1
      );

      const baseColor = new THREE.Color(0xffffcc); // Базовый золотой цвет
      // const pulseColor = baseColor
      //   .clone()
      //   .lerp(
      //     new THREE.Color(0xffffcc),
      //     (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2
      //   );
      basicMaterial.color = baseColor;
    }

    basicMaterial.transparent = true;
    basicMaterial.needsUpdate = true;
  });

  return <primitive object={scene} position={[0, 0, 0]} ref={sceneRef} />;
};

useGLTF.preload(stage_3rd);
