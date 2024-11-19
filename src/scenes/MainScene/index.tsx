import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDebounce } from "rooks";
import * as THREE from "three";

import model from "@/assets/models/full_scene.glb";
import {
  CAMERA_NAME,
  PARALLAX_COEF,
  REFERENCE_FOV,
  REFERENCE_HEIGHT,
  REFERENCE_WIDTH,
} from "@/consts";
import { useMergeVertices } from "@/hooks/useMergeVertices";
import { useAppStore } from "@/store/app";

export const MainScene = () => {
  const scrollOffset = useRef(0);
  const prevScrollOffset = useRef(0); // Для отслеживания изменений прокрутки
  const mouseMove = useRef({ x: 0, y: 0 });
  const basePosition = useRef(new THREE.Vector3());
  const parallaxOffset = useRef(new THREE.Vector3());
  const baseQuaternion = useRef(new THREE.Quaternion());

  const setEnvRotation = useAppStore((state) => state.setEnvRotation);

  const { scene, cameras, animations } = useGLTF(model);
  const { actions, mixer } = useAnimations(animations, scene);

  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const scenes = useThree((state) => state.scene);

  useMergeVertices(scenes);

  const animatedCamera = useMemo(
    () => (cameras.length > 0 ? cameras[0] : null),
    [cameras]
  );

  // Инициализация камеры и анимации
  useEffect(() => {
    if (cameras.length < 0 || !actions || !actions[CAMERA_NAME]) return;

    basePosition.current.copy(camera.position);
    baseQuaternion.current.copy(camera.quaternion);

    const action = actions[CAMERA_NAME];
    action.play();
  }, [cameras, actions, camera]);

  const handleResize = useCallback(() => {
    const widthFactor = REFERENCE_WIDTH / size.width;
    const heightFactor = size.height / REFERENCE_HEIGHT;

    const newFov = REFERENCE_FOV * widthFactor * heightFactor;

    const clampedFov = Math.min(Math.max(newFov, 1), 120);

    if (camera instanceof THREE.PerspectiveCamera) camera.fov = clampedFov;
    camera.updateProjectionMatrix();
  }, [camera, size.height, size.width]);

  // Функция для отслеживания мыши
  const handleMouseMove = (event: MouseEvent) => {
    mouseMove.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  };

  const debouncedResize = useDebounce(handleResize, 300);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [debouncedResize, handleResize]);

  useEffect(() => {
    if (animatedCamera) {
      // Копируем позицию и ориентацию камеры, чтобы не было рывков
      camera.position.copy(animatedCamera.position);
      camera.quaternion.copy(animatedCamera.quaternion);
      camera.castShadow = true;
      animatedCamera.castShadow = true;
    }
  }, [animatedCamera, camera]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Инициализация камеры и анимации
  useEffect(() => {
    if (cameras.length < 0 || !actions || !actions[CAMERA_NAME]) return;

    basePosition.current.copy(camera.position);
    baseQuaternion.current.copy(camera.quaternion);

    const action = actions[CAMERA_NAME];

    action.play();
  }, [cameras, actions, camera]);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY / (window.innerHeight * 50 - 1000);
      scrollOffset.current = offset;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Основной рендер-цикл
  useFrame((_, delta) => {
    if (!animatedCamera || !actions) return;

    const action = actions[CAMERA_NAME];

    if (!action) return;

    const duration = action.getClip().duration;

    // Сравниваем предыдущий и текущий скролл, чтобы понять, изменился ли он
    if (prevScrollOffset.current !== scrollOffset.current) {
      // Если прокрутка изменилась, продолжаем анимацию
      action.time = scrollOffset.current * duration;
      prevScrollOffset.current = scrollOffset.current; // Обновляем предыдущий скролл
    } else {
      // Если прокрутка не изменилась, приостанавливаем анимацию
      action.paused = true;
    }

    mixer.update(delta);

    animatedCamera.updateMatrixWorld();

    // Плавное обновление позиции и поворота камеры из анимации
    camera.position.lerp(animatedCamera.position, 0.3);
    camera.quaternion.slerp(animatedCamera.quaternion, 0.3);

    // Применение параллакс-эффекта
    const parallaxX = THREE.MathUtils.lerp(
      parallaxOffset.current.x,
      mouseMove.current.x * PARALLAX_COEF,
      0.2
    );
    const parallaxY = THREE.MathUtils.lerp(
      parallaxOffset.current.y,
      mouseMove.current.y * PARALLAX_COEF,
      0.2
    );

    parallaxOffset.current.set(parallaxX, parallaxY, 0);
    camera.position.add(parallaxOffset.current);

    // Устанавливаем вращение окружения в зависимости от поворота камеры
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "ZYX");
    setEnvRotation(euler);
  });

  return <primitive object={scene} />;
};
