import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./assets/models/full_scene.glb";
import {
  Environment,
  PerspectiveCamera,
  // OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Leva, useControls } from "leva";
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
import {
  CAMERA_NAME,
  FAR_PERSPECTIVE_CAMERA,
  NEAR_PERSPECTIVE_CAMERA,
  PARALLAX_COEF,
} from "./consts";
import { ReactLenis, useLenis } from "lenis/react";
import { useAppHeight } from "./hooks/useAppHeight";
import { useAppStore } from "./store/app";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  Observer,
  ScrollToPlugin,
  TextPlugin
);

// Основной компонент сцены
const MainScene = ({
  setEnvRotation,
}: {
  setEnvRotation?: (euler: THREE.Euler) => void;
}) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const appHeight = useAppHeight();

  const scrollOffset = useAppStore((state) => state.scrollOffset);
  const setScrollOffset = useAppStore((state) => state.setScrollOffset);

  const lenis = useLenis(({ scroll }) => {
    setScrollOffset(scroll / (appHeight - 1000));
  }, []);

  const { scene, cameras, animations } = useGLTF(model);
  const { actions, mixer } = useAnimations(animations, scene);

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
    if (cameras.length < 0 || !actions || !actions[CAMERA_NAME]) return;

    basePosition.current.copy(camera.position);
    baseQuaternion.current.copy(camera.quaternion);

    const action = actions[CAMERA_NAME];
    // action.clampWhenFinished = true;
    action.play();
    // console.log(window.scrollY);
  }, [cameras, actions, camera]);

  // Основной рендер-цикл
  useFrame((_, delta) => {
    if (!animatedCamera || !actions) return;

    const action = actions[CAMERA_NAME];
    if (!action) return;

    if (lenis?.isSmooth) {
      action.paused = true;
    }

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
  const [envRotation, setEnvRotation] = useState(new THREE.Euler());

  const { fov, envIntensity } = useControls({
    fov: 21.5,
    envIntensity: {
      value: 0.5,
      max: 5,
      min: 0,
      step: 0.1,
    },
  });

  const appHeight = useAppHeight();

  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;
    // Анимация появления букв
    const letters = textRef.current.querySelectorAll(".letter");

    const shuffledLetters = gsap.utils.shuffle([...letters]);

    gsap.set(shuffledLetters, {
      opacity: 0,
      scale: 0.95,
      filter: "blur(5px)",
    }); // начальное состояние всех букв

    const tl = gsap
      .timeline({
        paused: true,
        scrollTrigger: {
          start: "top 50%",
          end: "bottom -6000px",
          scrub: 1,
          pin: "#pin",
          markers: true,
        },
      })
      .to(shuffledLetters, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        stagger: 0.01,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(
        shuffledLetters,
        {
          opacity: 0,
          scale: 0.95,
          filter: "blur(5px)",
          stagger: 0.01,
          duration: 0.1,
          ease: "power2.out",
        },
        ">"
      );

    return () => void tl.kill();
  }, []);

  return (
    <>
      <ReactLenis root options={{ infinite: true, lerp: 0.03 }}>
        <div
          style={{
            width: "100%",
            height: `${appHeight}px`,
            position: "absolute",
          }}
        >
          <div
            id="start"
            style={{
              display: "flex",
              gap: "4px",
              position: "absolute",
              top: 0,
              left: 0,
              height: "100vh",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            }}
          >
            <div ref={textRef} id="pin">
              {"what we do".split("").map((letter, index) => (
                <span
                  key={index}
                  className="letter"
                  style={{
                    display: "inline-block",
                    fontSize: 50,
                    fontWeight: 700,
                    color: "#fff",
                    opacity: 0,
                    textTransform: "uppercase",
                    margin: "0 4px",
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Leva collapsed />
        <Canvas
          linear
          style={{ background: "#000", position: "fixed" }}
          shadows
        >
          <Suspense fallback={null}>
            <Effects />
            <PerspectiveCamera
              makeDefault
              fov={fov}
              name={CAMERA_NAME}
              near={NEAR_PERSPECTIVE_CAMERA}
              far={FAR_PERSPECTIVE_CAMERA}
            />
            <Environment
              files={env}
              environmentIntensity={envIntensity}
              environmentRotation={[
                envRotation.x,
                envRotation.y,
                envRotation.z,
              ]}
            />
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
          </Suspense>
        </Canvas>
      </ReactLenis>
    </>
  );
}

export default App;
