import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "rooks";
import * as THREE from "three";

import model from "@/assets/models/full_scene.glb";
import { CAMERA_NAME, PARALLAX_COEF } from "@/consts";
import { useAppHeight } from "@/hooks/useAppHeight";
import { useAppStore } from "@/store/app";

export const MainScene = ({
  setEnvRotation,
}: {
  setEnvRotation?: (euler: THREE.Euler) => void;
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const appHeight = useAppHeight();

  const scrollOffset = useAppStore((state) => state.scrollOffset);
  const setScrollOffset = useAppStore((state) => state.setScrollOffset);
  const setCameraFov = useAppStore((state) => state.setCameraFov);

  const lenis = useLenis(({ scroll }) => {
    setScrollOffset(scroll / (appHeight - 1000));
  }, []);

  const { scene, cameras, animations } = useGLTF(model);
  const { actions, mixer } = useAnimations(animations, scene);

  const camera = useThree((state) => state.camera); // Основная камера
  const size = useThree((state) => state.size);

  const animatedCamera = useMemo(
    () => (cameras.length > 0 ? cameras[0] : null),
    [cameras]
  );

  const basePosition = useRef(new THREE.Vector3());
  const baseQuaternion = useRef(new THREE.Quaternion());
  const parallaxOffset = useRef(new THREE.Vector3());

  const handleResize = useCallback(() => {
    const widthFactor = 1920 / size.width;
    const heightFactor = size.height / 1080;

    const newFov = 25 * widthFactor * heightFactor;

    const clampedFov = Math.min(Math.max(newFov, 1), 120);

    setCameraFov(clampedFov);
    camera.updateProjectionMatrix();
  }, [camera, setCameraFov, size.height, size.width]);

  // Функция для отслеживания мыши
  const handleMouseMove = (event: MouseEvent) => {
    setMouse({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
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

    if (!lenis?.isSmooth) {
      action.paused = true;
    } else action.play();
  }, [cameras, actions, camera, lenis?.isSmooth]);

  // Основной рендер-цикл
  useFrame((_, delta) => {
    if (!animatedCamera || !actions) return;

    const action = actions[CAMERA_NAME];

    if (!action) return;

    const duration = action.getClip().duration;

    // Обновляем время анимации в зависимости от прокрутки
    action.time = scrollOffset * duration;
    mixer.update(delta);

    animatedCamera.updateMatrixWorld();

    // Плавное обновление позиции и поворота камеры из анимации
    camera.position.lerp(animatedCamera.position, 0.3);
    camera.quaternion.slerp(animatedCamera.quaternion, 0.3);

    // Применение параллакс-эффекта к камере
    const parallaxX = THREE.MathUtils.lerp(
      parallaxOffset.current.x,
      mouse.x * PARALLAX_COEF,
      0.2
    );
    const parallaxY = THREE.MathUtils.lerp(
      parallaxOffset.current.y,
      mouse.y * PARALLAX_COEF,
      0.2
    );

    // Обновляем смещение параллакса относительно базовой позиции камеры
    parallaxOffset.current.set(parallaxX, parallaxY, 0);
    camera.position.add(parallaxOffset.current);

    // Устанавливаем вращение окружения в зависимости от поворота камеры
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "ZYX");
    setEnvRotation?.(euler);
  });

  return <primitive object={scene} />;
};
