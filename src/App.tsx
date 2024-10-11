// import "./App.css";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import model from "./assets/models/full_scene.glb";
// import {
//   Environment,
//   PerspectiveCamera,
//   ScrollControls,
//   useAnimations,
//   useGLTF,
//   useScroll,
// } from "@react-three/drei";
// import {
//   Suspense,
//   useEffect,
//   useMemo,
//   useCallback,
//   useRef,
//   useState,
// } from "react";
// import * as THREE from "three";
// import { useControls } from "leva";
// import { FirstStage } from "./components/FirstStage";
// import { Planet } from "./components/Planet";
// import { SpaceStation } from "./components/SpaceStation";
// import { SecondStage } from "./components/SecondStage";
// import { ThirdStage } from "./components/ThirdStage";
// import { FourthStage } from "./components/FourthStage";
// import { FifthStage } from "./components/FifthStage";
// import { SixthStage } from "./components/SixthStage";
// import { SeventhStage } from "./components/SeventhStage";
// import { Effects } from "./components/Effects";
// import env2 from "./env.hdr";

// // Основной компонент сцены
// const MainScene = ({
//   setEnvRotation,
// }: {
//   setEnvRotation?: (euler: THREE.Euler) => void;
// }) => {
//   const [mouse, setMouse] = useState({ x: 0, y: 0 });

//   const { parallaxCoef } = useControls({
//     parallaxCoef: 0.01,
//   });

//   const { scene, cameras, animations } = useGLTF(model);
//   const { actions, mixer } = useAnimations(animations, scene);

//   const scroll = useScroll();
//   const camera = useThree((state) => state.camera); // Основная камера
//   const animatedCamera = useMemo(
//     () => (cameras.length > 0 ? cameras[0] : null),
//     [cameras]
//   );

//   const basePosition = useRef(new THREE.Vector3());
//   const baseQuaternion = useRef(new THREE.Quaternion());
//   const parallaxOffset = useRef(new THREE.Vector3());

//   const handleMouseMove = useCallback((event: MouseEvent) => {
//     setMouse({
//       x: (event.clientX / window.innerWidth) * 2 - 1,
//       y: -(event.clientY / window.innerHeight) * 2 + 1,
//     });
//   }, []);

//   useEffect(() => {
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [handleMouseMove]);

//   useEffect(() => {
//     if (cameras.length < 0 || !actions || !actions["Camera"]) return;

//     basePosition.current.copy(camera.position);
//     baseQuaternion.current.copy(camera.quaternion);

//     const action = actions["Camera"];
//     action.play();
//   }, [cameras, actions, camera]);

//   useFrame((_, delta) => {
//     if (!animatedCamera || !actions) return;

//     const action = actions["Camera"];
//     if (!action) return;

//     const scrollOffset = scroll.offset;
//     const duration = action.getClip().duration;

//     // Обновляем время анимации в зависимости от прокрутки
//     action.time = scrollOffset * duration;
//     mixer.update(delta);

//     animatedCamera.updateMatrixWorld();

//     // Плавное обновление позиции и поворота камеры из анимации
//     const targetPosition = animatedCamera.position;
//     const targetQuaternion = animatedCamera.quaternion;

//     // Только если расстояние между текущей и целевой позицией больше порога
//     if (camera.position.distanceTo(targetPosition) > 0.001) {
//       camera.position.lerp(targetPosition, 0.05);
//     }

//     // Только если разница в углах поворота больше порога
//     if (camera.quaternion.angleTo(targetQuaternion) > 0.001) {
//       camera.quaternion.slerp(targetQuaternion, 0.05);
//     }

//     // Применение параллакс-эффекта к камере
//     const parallaxX = mouse.x * parallaxCoef;
//     const parallaxY = mouse.y * parallaxCoef;

//     // Обновляем смещение параллакса относительно базовой позиции камеры
//     parallaxOffset.current.set(parallaxX, parallaxY, 0);
//     camera.position.add(parallaxOffset.current);

//     // Устанавливаем вращение окружения в зависимости от поворота камеры
//     const euler = new THREE.Euler().setFromQuaternion(camera.quaternion);
//     setEnvRotation?.(euler);
//   });

//   return <primitive object={scene} />;
// };

// function App() {
//   const { fov, linear } = useControls({
//     fov: 21.5,
//     linear: {
//       label: "linear",
//       value: true,
//     },
//   });

//   const [envRotation, setEnvRotation] = useState(new THREE.Euler());

//   const canvasKey = useMemo(() => `canvas-${linear}`, [linear]);

//   return (
//     <>
//       <Canvas linear={linear} key={canvasKey}>
//         <Suspense fallback={null}>
//           <Effects />
//           <Environment
//             files={env2}
//             environmentRotation={[envRotation.x, envRotation.y, envRotation.z]}
//           />
//           <PerspectiveCamera makeDefault fov={fov} name="Camera" />
//           <ScrollControls damping={0.7} pages={50} infinite>
//             <MainScene setEnvRotation={setEnvRotation} />
//             <Planet />
//             <SpaceStation />
//             <FirstStage />
//             <SecondStage />
//             <ThirdStage />
//             <FourthStage />
//             <FifthStage />
//             <SixthStage />
//             <SeventhStage />
//           </ScrollControls>
//         </Suspense>
//       </Canvas>
//     </>
//   );
// }

// export default App;

import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./assets/models/full_scene.glb";
import {
  Environment,
  PerspectiveCamera,
  ScrollControls,
  useAnimations,
  useGLTF,
  useScroll,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { FirstStage } from "./components/FirstStage";
import { Planet } from "./components/Planet";
import { SpaceStation } from "./components/SpaceStation";
import { SecondStage } from "./components/SecondStage";
import { ThirdStage } from "./components/ThirdStage";
import { FourthStage } from "./components/FourthStage";
import { FifthStage } from "./components/FifthStage";
import { SixthStage } from "./components/SixthStage";
import { SeventhStage } from "./components/SeventhStage";
import { Effects } from "./components/Effects";
import env2 from "./env2.hdr";
import env100 from "@/assets/hdr/dam_wall_1k-100.hdr";
import env200 from "@/assets/hdr/dam_wall_1k-200.hdr";
import env300 from "@/assets/hdr/dam_wall_1k-300.hdr";
import env400 from "@/assets/hdr/dam_wall_1k-400.hdr";
import env500 from "@/assets/hdr/dam_wall_1k-500.hdr";
import env600 from "@/assets/hdr/dam_wall_1k-600.hdr";
import env700 from "@/assets/hdr/dam_wall_1k-700.hdr";
import env800 from "@/assets/hdr/dam_wall_1k-800.hdr";
import env900 from "@/assets/hdr/dam_wall_1k-900.hdr";

// Основной компонент сцены
const MainScene = ({
  setEnvRotation,
}: {
  setEnvRotation?: (euler: THREE.Euler) => void;
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrolling, setScrolling] = useState(false); // Состояние активности скролла
  const [lastScrollOffset, setLastScrollOffset] = useState(0); // Для отслеживания изменения скролла
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null); // Таймер для остановки анимации
  const { parallaxCoef } = useControls({
    parallaxCoef: 0.01,
  });

  const { scene, cameras, animations } = useGLTF(model);
  const { actions, mixer } = useAnimations(animations, scene);

  const scroll = useScroll();
  const camera = useThree((state) => state.camera); // Основная камера
  const animatedCamera = useMemo(
    () => (cameras.length > 0 ? cameras[0] : null),
    [cameras]
  );

  console.log(scrolling);

  const basePosition = useRef(new THREE.Vector3());
  const baseQuaternion = useRef(new THREE.Quaternion());
  const parallaxOffset = useRef(new THREE.Vector3());

  useEffect(() => {
    if (animatedCamera) {
      // Копируем позицию и ориентацию камеры, чтобы не было рывков
      camera.position.copy(animatedCamera.position);
      camera.quaternion.copy(animatedCamera.quaternion);
    }
  }, [animatedCamera, camera]);

  // Функция для отслеживания мыши
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Инициализация камеры и анимации
  useEffect(() => {
    if (cameras.length < 0 || !actions || !actions["Camera"]) return;

    basePosition.current.copy(camera.position);
    baseQuaternion.current.copy(camera.quaternion);

    const action = actions["Camera"];
    // actions
    action.play();
  }, [cameras, actions, camera]);

  // Основной рендер-цикл
  useFrame((_, delta) => {
    if (!animatedCamera || !actions) return;

    const action = actions["Camera"];
    if (!action) return;

    const scrollOffset = scroll.offset;

    // Проверяем, изменился ли скролл
    if (scrollOffset !== lastScrollOffset) {
      setScrolling(true); // Скролл активен

      // Сброс таймера остановки анимации
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Устанавливаем таймер для остановки анимации
      scrollTimeout.current = setTimeout(() => {
        setScrolling(false); // Скролл завершен
      }, 1000); // 1 секунда задержки

      setLastScrollOffset(scrollOffset); // Обновляем последнее значение прокрутки
    }

    // Если скроллинг активен, продолжаем анимацию
    // if (scrolling) {
    const duration = action.getClip().duration;

    // Обновляем время анимации в зависимости от прокрутки
    action.time = scrollOffset * duration;
    mixer.update(delta);

    animatedCamera.updateMatrixWorld();

    // Плавное обновление позиции и поворота камеры из анимации
    camera.position.lerp(animatedCamera.position, 0.1);
    camera.quaternion.slerp(animatedCamera.quaternion, 0.1);

    // Применение параллакс-эффекта к камере
    const parallaxX = mouse.x * parallaxCoef;
    const parallaxY = mouse.y * parallaxCoef;

    // Обновляем смещение параллакса относительно базовой позиции камеры
    parallaxOffset.current.set(parallaxX, parallaxY, 0);
    camera.position.add(parallaxOffset.current);

    // Устанавливаем вращение окружения в зависимости от поворота камеры
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "ZYX");
    setEnvRotation?.(euler);
    // }
  });

  return <primitive object={scene} />;
};

function App() {
  const { fov, linear, env } = useControls({
    fov: 21.5,
    linear: {
      label: "linear",
      value: true,
    },
    env: {
      value: env2,
      options: {
        default: env2,
        100: env100,
        200: env200,
        300: env300,
        400: env400,
        500: env500,
        600: env600,
        700: env700,
        800: env800,
        900: env900,
      },
    },
  });

  const [envRotation, setEnvRotation] = useState(new THREE.Euler());

  const canvasKey = useMemo(() => `canvas-${linear}`, [linear]);

  return (
    <>
      <Canvas linear={linear} key={canvasKey} style={{ background: "#000" }}>
        <Suspense fallback={null}>
          <Effects />
          <Environment
            files={env}
            environmentRotation={[envRotation.x, envRotation.y, envRotation.z]}
          />
          <PerspectiveCamera
            makeDefault
            fov={fov}
            name="Camera"
            near={1.7}
            far={100}
          />
          <ScrollControls damping={0.7} pages={50} infinite>
            <MainScene setEnvRotation={setEnvRotation} />
            <Planet />
            <SpaceStation />
            <FirstStage />
            <SecondStage />
            <ThirdStage />
            <FourthStage />
            <FifthStage />
            <SixthStage />
            <SeventhStage />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
