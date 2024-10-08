import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./model.glb";
import model2 from "./scene.glb";
import model3 from "./model3.glb";
import {
  Environment,
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

// Основной компонент сцены
const MainScene = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { parallaxCoef, currentModel } = useControls({
    parallaxCoef: 0.01,
    currentModel: {
      options: {
        "600 frames": model3,
        "12k frames": model2,
        "3k frames": model,
      },
    },
  });

  console.log(currentModel);

  const { scene, cameras, animations } = useGLTF(model3);
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

  // const memoziedScene = useMemo(
  //   () => ,
  //   [scene, currentModel]
  // );

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
          {environment && <Environment preset={environment as Preset} />}
          <PerspectiveCamera makeDefault fov={fov} />

          <ScrollControls damping={0.7} pages={50} infinite>
            <MainScene />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
