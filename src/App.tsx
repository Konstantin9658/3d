import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./assets/models/full_scene.glb";

import {
  Environment,
  // OrbitControls,
  PerspectiveCamera,
  ScrollControls,
  useAnimations,
  useGLTF,
  useScroll,
} from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
} from "react";
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

// Основной компонент сцены
const MainScene = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

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

  const basePosition = useRef(new THREE.Vector3());
  const baseQuaternion = useRef(new THREE.Quaternion());
  const parallaxOffset = useRef(new THREE.Vector3());

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setMouse({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (cameras.length < 0 || !actions || !actions["Camera"]) return;

    basePosition.current.copy(camera.position);
    baseQuaternion.current.copy(camera.quaternion);

    const action = actions["Camera"];
    action.play();
  }, [cameras, actions, camera]);

  useFrame((_, delta) => {
    if (!animatedCamera || !actions) return;

    const action = actions["Camera"];
    if (!action) return;

    const scrollOffset = scroll.offset;
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
  });

  return <primitive object={scene} />;
};

type Preset =
  | "apartment"
  | "city"
  | "dawn"
  | "forest"
  | "lobby"
  | "night"
  | "park"
  | "studio"
  | "sunset"
  | "warehouse"
  | undefined;

function App() {
  const { fov, environment } = useControls({
    fov: 21.5,
    environment: {
      options: {
        none: undefined,
        apartment: "apartment",
        city: "city",
        dawn: "dawn",
        forest: "forest",
        lobby: "lobby",
        night: "night",
        park: "park",
        studio: "studio",
        sunset: "sunset",
        warehouse: "warehouse",
      },
    },
  });

  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <Effects />
          {environment && <Environment preset={environment as Preset} />}
          <PerspectiveCamera makeDefault fov={fov} name="Camera" />
          {/* <OrbitControls makeDefault /> */}
          <ScrollControls damping={0.7} pages={50} infinite>
            <MainScene />
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
