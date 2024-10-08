import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./model.glb";
import model2 from "./scene.glb";
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

// Основной компонент сцены
const MainScene = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [animatedCamera, setAnimatedCamera] = useState<THREE.Camera | null>(
    null
  );

  const { parallaxCoef, currentModel } = useControls({
    parallaxCoef: 0.01,
    currentModel: {
      options: {
        "12k frames": model2,
        "3k frames": model,
      },
    },
  });

  const { scene, cameras, animations } = useGLTF(currentModel);
  const { actions, mixer } = useAnimations(animations, scene);

  const scroll = useScroll();
  const camera = useThree((state) => state.camera); // Основная камера

  const prevMouse = useRef({ x: 0, y: 0 });
  const basePosition = useRef(new THREE.Vector3()); // Базовая позиция камеры
  const baseQuaternion = useRef(new THREE.Quaternion()); // Базовый поворот камеры
  const parallaxOffset = useRef(new THREE.Vector3()); // Параллакс-смещение

  useEffect(() => {
    // Обработчик движения мыши
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (cameras.length < 0 || !actions || !actions["Camera"]) return;

    setAnimatedCamera(cameras[0]); // Устанавливаем анимированную камеру
    basePosition.current.copy(camera.position); // Сохраняем базовую позицию
    baseQuaternion.current.copy(camera.quaternion); // Сохраняем базовый quaternion

    const action = actions["Camera"];
    action.play();
    action.paused = true; // Останавливаем проигрывание анимации
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

    prevMouse.current = { x: parallaxX, y: parallaxY };
  });

  const sceneMemo = useMemo(() => <primitive object={scene} />, [scene]);

  return sceneMemo;
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
  const { fov, environment = "night" } = useControls({
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
        {environment && <Environment preset={environment as Preset} />}
        <PerspectiveCamera makeDefault fov={fov} />

        <Suspense fallback={null}>
          <ScrollControls damping={0.7} pages={50} infinite>
            <MainScene />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
