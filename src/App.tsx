import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./scene.glb";
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
  const scroll = useScroll();
  const { scene, cameras, animations } = useGLTF(model);
  const camera = useThree((state) => state.camera); // Основная камера
  const { actions, mixer } = useAnimations(animations, scene);
  const [animatedCamera, setAnimatedCamera] = useState<THREE.Camera | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const { parallaxCoef } = useControls({ parallaxCoef: 0.01 });

  const basePosition = useRef(new THREE.Vector3()); // Базовая позиция камеры
  const baseQuaternion = useRef(new THREE.Quaternion()); // Базовый поворот камеры
  const parallaxOffset = useRef(new THREE.Vector3()); // Параллакс-смещение

  const prevMouse = useRef({ x: 0, y: 0 });

  // Обработчик движения мыши
  const handleMouseMove = (event: MouseEvent) => {
    setMouse({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (cameras.length > 0) {
      setAnimatedCamera(cameras[0]); // Устанавливаем анимированную камеру
      basePosition.current.copy(camera.position); // Сохраняем базовую позицию
      baseQuaternion.current.copy(camera.quaternion); // Сохраняем базовый quaternion
    }

    if (actions && actions["Camera"]) {
      const action = actions["Camera"];
      action.play();
      action.paused = true; // Останавливаем проигрывание анимации
    }
  }, [cameras, actions, camera]);

  useFrame((_, delta) => {
    if (animatedCamera && actions) {
      const action = actions["Camera"];
      if (!action) return;

      const duration = action.getClip().duration;
      const scrollOffset = scroll.offset;

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
    }
  });

  const sceneMemo = useMemo(() => <primitive object={scene} />, [scene]);

  return sceneMemo;
};

function App() {
  const cameraControlsRef = useRef<THREE.PerspectiveCamera | null>(null);
  const { fov } = useControls({ fov: 21.5 });

  return (
    <Canvas>
      <Environment preset="city" />
      <PerspectiveCamera makeDefault fov={fov} ref={cameraControlsRef} />

      <Suspense fallback={null}>
        <ScrollControls damping={0.7} pages={50} infinite>
          <MainScene />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

export default App;
