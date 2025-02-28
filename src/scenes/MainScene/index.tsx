import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
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
// import { useScrollOffset } from "@/hooks/useAppHeight";
import { useMergeVertices } from "@/hooks/useMergeVertices";
import { useAppStore } from "@/store/app";

export const MainScene = () => {
  console.log("Main scene render");

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

  const scroll = useScroll();

  const appLoaded = useAppStore((state) => state.appLoaded);

  const animatedCamera = useMemo(
    () => (cameras.length > 0 ? cameras[0] : null),
    [cameras]
  );

  // Инициализация камеры и анимации
  useEffect(() => {
    basePosition.current.copy(camera.position);
    baseQuaternion.current.copy(camera.quaternion);
  }, [camera.position, camera.quaternion]);

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

  // const targetScroll = useRef(0);

  // useFrame(() => {
  //   targetScroll.current += (scroll.offset - targetScroll.current) * 0.5;

  //   // Если достигли конца — сбрасываем в начало
  //   if (targetScroll.current >= 1) {
  //     targetScroll.current = 0;
  //   } else if (targetScroll.current <= 0) {
  //     targetScroll.current = 1;
  //   }

  //   scroll.offset = targetScroll.current;
  // });

  useEffect(() => {
    if (!actions) return;

    const cameraMove = actions[CAMERA_NAME];

    if (!cameraMove) return;

    cameraMove.play();
    cameraMove.loop = THREE.LoopOnce;
    cameraMove.clampWhenFinished = true;
  }, [actions]);

  useEffect(() => {
    debouncedResize();
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, [debouncedResize]);

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

  // Основной рендер-цикл
  useFrame((_, delta) => {
    if (!appLoaded || !animatedCamera || !actions) return;

    const action = actions[CAMERA_NAME];

    if (!action) return;

    const duration = action.getClip().duration;
    const targetTime = scroll.offset * duration;

    // Проверка на прокрутку: если delta = 0 - значит скролла нет
    // if (scroll.delta !== 0) {
    action.time = THREE.MathUtils.lerp(action.time, targetTime, delta * 5);

    // Устанавливаем вращение окружения в зависимости от поворота камеры
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "ZYX");
    setEnvRotation(euler);
    // console.log(action.time);
    // action.loop = THREE.LoopOnce;
    // action.play();
    // } else {
    // action.paused = true;
    // action.clampWhenFinished = true;
    // }

    // console.log(scroll.offset, "Main");

    // Плавное обновление позиции и поворота камеры из анимации
    camera.position.lerp(animatedCamera.position, 0.2);
    camera.quaternion.slerp(animatedCamera.quaternion, 0.2);

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

    animatedCamera.updateMatrixWorld();

    if (!action.isRunning()) return;
    // console.log("delta update");
    // if (scroll.offset === 1) {
    //   action.time = 0;

    //   scroll.offset = 0;
    // }

    mixer.update(delta);
  });

  return <primitive object={scene} />;
};

// useGLTF.preload(model);

// import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
// import { useFrame, useThree } from "@react-three/fiber";
// import { useCallback, useEffect, useMemo, useRef } from "react";
// import { useDebounce } from "rooks";
// import * as THREE from "three";

// import model from "@/assets/models/full_scene.glb";
// import {
//   CAMERA_NAME,
//   PARALLAX_COEF,
//   REFERENCE_FOV,
//   REFERENCE_HEIGHT,
//   REFERENCE_WIDTH,
// } from "@/consts";
// // import { useScrollOffset } from "@/hooks/useAppHeight";
// import { useMergeVertices } from "@/hooks/useMergeVertices";
// import { useAppStore } from "@/store/app";

// export const MainScene = () => {
//   console.log("Main scene render");

//   const mouseMove = useRef({ x: 0, y: 0 });
//   const basePosition = useRef(new THREE.Vector3());
//   const parallaxOffset = useRef(new THREE.Vector3());
//   const baseQuaternion = useRef(new THREE.Quaternion());

//   const setEnvRotation = useAppStore((state) => state.setEnvRotation);

//   const { scene, cameras, animations } = useGLTF(model);
//   const { actions, mixer } = useAnimations(animations, scene);

//   const camera = useThree((state) => state.camera);
//   const size = useThree((state) => state.size);

//   const scenes = useThree((state) => state.scene);

//   useMergeVertices(scenes);

//   const scroll = useScroll();

//   const appLoaded = useAppStore((state) => state.appLoaded);

//   const animatedCamera = useMemo(
//     () => (cameras.length > 0 ? cameras[0] : null),
//     [cameras]
//   );

//   // Инициализация камеры и анимации
//   useEffect(() => {
//     basePosition.current.copy(camera.position);
//     baseQuaternion.current.copy(camera.quaternion);
//   }, [camera.position, camera.quaternion]);

//   const handleResize = useCallback(() => {
//     const widthFactor = REFERENCE_WIDTH / size.width;
//     const heightFactor = size.height / REFERENCE_HEIGHT;

//     const newFov = REFERENCE_FOV * widthFactor * heightFactor;

//     const clampedFov = Math.min(Math.max(newFov, 1), 120);

//     if (camera instanceof THREE.PerspectiveCamera) camera.fov = clampedFov;
//     camera.updateProjectionMatrix();
//   }, [camera, size.height, size.width]);

//   // Функция для отслеживания мыши
//   const handleMouseMove = (event: MouseEvent) => {
//     mouseMove.current = {
//       x: (event.clientX / window.innerWidth) * 2 - 1,
//       y: -(event.clientY / window.innerHeight) * 2 + 1,
//     };
//   };

//   const debouncedResize = useDebounce(handleResize, 300);

//   useEffect(() => {
//     debouncedResize();
//     window.addEventListener("resize", debouncedResize);

//     return () => {
//       window.removeEventListener("resize", debouncedResize);
//     };
//   }, [debouncedResize]);

//   useEffect(() => {
//     if (animatedCamera) {
//       // Копируем позицию и ориентацию камеры, чтобы не было рывков
//       camera.position.copy(animatedCamera.position);
//       camera.quaternion.copy(animatedCamera.quaternion);
//       camera.castShadow = true;
//       animatedCamera.castShadow = true;
//     }
//   }, [animatedCamera, camera]);

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   // Инициализация камеры и анимации
//   useEffect(() => {
//     if (cameras.length < 0 || !actions || !actions[CAMERA_NAME]) return;

//     basePosition.current.copy(camera.position);
//     baseQuaternion.current.copy(camera.quaternion);

//     // const action = actions[CAMERA_NAME];

//     // action.play();
//   }, [cameras, actions, camera, mixer, animatedCamera?.position]);

//   // Основной рендер-цикл
//   useFrame((_, delta) => {
//     if (!appLoaded || !animatedCamera || !actions) return;

//     const action = actions[CAMERA_NAME];

//     if (!action) return;

//     const duration = action.getClip().duration;

//     // Проверка на прокрутку: если delta = 0 - значит скролла нет
//     if (scroll.delta !== 0) {
//       action.time = scroll.offset * duration;

//       // Устанавливаем вращение окружения в зависимости от поворота камеры
//       const euler = new THREE.Euler().setFromQuaternion(
//         camera.quaternion,
//         "ZYX"
//       );
//       setEnvRotation(euler);
//       action.play();
//     } else {
//       action.paused = true;
//       action.clampWhenFinished = true;
//     }

//     // Плавное обновление позиции и поворота камеры из анимации
//     camera.position.lerp(animatedCamera.position, 0.3);
//     camera.quaternion.slerp(animatedCamera.quaternion, 0.3);

//     // Применение параллакс-эффекта
//     const parallaxX = THREE.MathUtils.lerp(
//       parallaxOffset.current.x,
//       mouseMove.current.x * PARALLAX_COEF,
//       0.2
//     );
//     const parallaxY = THREE.MathUtils.lerp(
//       parallaxOffset.current.y,
//       mouseMove.current.y * PARALLAX_COEF,
//       0.2
//     );

//     parallaxOffset.current.set(parallaxX, parallaxY, 0);
//     camera.position.add(parallaxOffset.current);

//     animatedCamera.updateMatrixWorld();

//     if (!action.isRunning()) return;

//     mixer.update(delta);
//   });

//   return <primitive object={scene} />;
// };

// useGLTF.preload(model);
