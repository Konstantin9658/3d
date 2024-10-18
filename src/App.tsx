import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./assets/models/full_scene.glb";
import {
  Environment,
  PerspectiveCamera,
  ScrollControls,
  // OrbitControls,
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
import env from "@/assets/hdr/kloofendal_28d_misty_1k.hdr";

const PARALLAX_COEF = 0.01;

// Основной компонент сцены
const MainScene = ({
  setEnvRotation,
}: {
  setEnvRotation?: (euler: THREE.Euler) => void;
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  // const [scrolling, setScrolling] = useState(false); // Состояние активности скролла
  // const [lastScrollOffset, setLastScrollOffset] = useState(0); // Для отслеживания изменения скролла
  // const scrollTimeout = useRef<NodeJS.Timeout | null>(null); // Таймер для остановки анимации

  const { scene, cameras, animations } = useGLTF(model);
  const { actions, mixer } = useAnimations(animations, scene);

  const scroll = useScroll();
  const camera = useThree((state) => state.camera); // Основная камера
  const animatedCamera = useMemo(
    () => (cameras.length > 0 ? cameras[0] : null),
    [cameras]
  );

  const basePosition = useRef(new THREE.Vector3());
  const baseQuaternion = useRef(new THREE.Quaternion());
  const parallaxOffset = useRef(new THREE.Vector3());

  useEffect(() => {
    if (animatedCamera) {
      // Копируем позицию и ориентацию камеры, чтобы не было рывков
      camera.position.copy(animatedCamera.position);
      camera.quaternion.copy(animatedCamera.quaternion);
      camera.castShadow = true;
      animatedCamera.castShadow = true;
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
    action.clampWhenFinished = true;
    action.play();
  }, [cameras, actions, camera]);

  // Основной рендер-цикл
  useFrame((_, delta) => {
    if (!animatedCamera || !actions) return;

    const action = actions["Camera"];
    if (!action) return;

    const scrollOffset = scroll.offset;

    // Проверяем, изменился ли скролл
    // if (scrollOffset !== lastScrollOffset) {
    //   setScrolling(true); // Скролл активен

    //   // Сброс таймера остановки анимации
    //   if (scrollTimeout.current) {
    //     clearTimeout(scrollTimeout.current);
    //   }

    //   // Устанавливаем таймер для остановки анимации
    //   scrollTimeout.current = setTimeout(() => {
    //     setScrolling(false); // Скролл завершен
    //   }, 1000); // 1 секунда задержки

    //   setLastScrollOffset(scrollOffset); // Обновляем последнее значение прокрутки
    // }

    // if (!scrolling) return (action.paused = true);

    // Если скроллинг активен, продолжаем анимацию
    const duration = action.getClip().duration;

    // Обновляем время анимации в зависимости от прокрутки
    action.time = scrollOffset * duration;
    mixer.update(delta);

    animatedCamera.updateMatrixWorld();

    // Плавное обновление позиции и поворота камеры из анимации
    camera.position.lerp(animatedCamera.position, 0.05);
    camera.quaternion.slerp(animatedCamera.quaternion, 0.05);

    // Применение параллакс-эффекта к камере
    const parallaxX = mouse.x * PARALLAX_COEF;
    const parallaxY = mouse.y * PARALLAX_COEF;

    // Обновляем смещение параллакса относительно базовой позиции камеры
    parallaxOffset.current.set(parallaxX, parallaxY, 0);
    camera.position.add(parallaxOffset.current);

    // Устанавливаем вращение окружения в зависимости от поворота камеры
    const euler = new THREE.Euler().setFromQuaternion(camera.quaternion, "ZYX");
    setEnvRotation?.(euler);
  });

  return <primitive object={scene} />;
};

function App() {
  const { fov, linear, envIntensity } = useControls({
    fov: 21.5,
    envIntensity: {
      value: 0.5,
      max: 5,
      min: 0,
      step: 0.1,
    },
    linear: {
      label: "linear",
      value: true,
    },
  });

  const [envRotation, setEnvRotation] = useState(new THREE.Euler());

  const canvasKey = useMemo(() => `canvas-${linear}`, [linear]);

  return (
    <>
      <Canvas
        linear={linear}
        key={canvasKey}
        style={{ background: "#000" }}
        shadows
        // gl={{
        //   depth: false,
        //   stencil: false,
        //   antialias: false,
        //   logarithmicDepthBuffer: false,
        // }}
      >
        <Suspense fallback={null}>
          <Effects />
          <PerspectiveCamera
            makeDefault
            fov={fov}
            name="Camera"
            near={1.7}
            far={100}
          />
          <Environment
            files={env}
            environmentIntensity={envIntensity}
            environmentRotation={[envRotation.x, envRotation.y, envRotation.z]}
          />
          {/* <OrbitControls makeDefault /> */}
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
