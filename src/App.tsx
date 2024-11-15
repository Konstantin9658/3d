import "./App.css";

import {
  Environment,
  PerspectiveCamera,
  // OrbitControls,
} from "@react-three/drei";
// import classes from "./styles.module.scss";
import { Canvas, useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { LenisRef, ReactLenis } from "lenis/react";
import { Leva, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import env from "@/assets/hdr/kloofendal_28d_misty_1k.hdr";

import { Effects } from "./components/Effects";
import { Header } from "./components/Header";
import {
  CAMERA_NAME,
  FAR_PERSPECTIVE_CAMERA,
  NEAR_PERSPECTIVE_CAMERA,
} from "./consts";
import { useAppHeight } from "./hooks/useAppHeight";
import { FifthStage } from "./scenes/FifthStage";
import { FirstStage } from "./scenes/FirstStage";
import { FourthStage } from "./scenes/FourthStage";
import { MainScene } from "./scenes/MainScene";
import { Planet } from "./scenes/Planet";
import { SecondStage } from "./scenes/SecondStage";
import { SeventhStage } from "./scenes/SeventhStage";
import { SixthStage } from "./scenes/SixthStage";
import { SpaceStation } from "./scenes/SpaceStation";
import { ThirdStage } from "./scenes/ThirdStage";
import { Cases } from "./sections/Cases";
import { Footer } from "./sections/Footer";
import { Industries } from "./sections/Industries";
import { MobileApps } from "./sections/MobileApps";
import { Welcome } from "./sections/Welcome";
import { WelcomeDuplicate } from "./sections/Welcome/WelcomeDuplicate";
import { WWD } from "./sections/WWD";
import { useAppStore } from "./store/app";

const StarryBackground = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Генерация звёзд
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starsCount = 50000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2000; // x
      positions[i + 1] = (Math.random() - 0.5) * 2000; // y
      positions[i + 2] = (Math.random() - 0.5) * 2000; // z
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Текстура для круглых звёзд
  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.6)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Материал звёзд
  const starsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 2.5,
      map: starTexture,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });
  }, [starTexture]);

  // Медленное вращение
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00002; // Замедленное вращение
    }
  });

  return (
    <points ref={pointsRef} geometry={starsGeometry} material={starsMaterial} />
  );
};

function App() {
  const [envRotation, setEnvRotation] = useState(new THREE.Euler());

  const lenisRef = useRef<LenisRef | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const cameraFov = useAppStore((state) => state.cameraFov);
  const setVideoTexturesEnabled = useAppStore(
    (state) => state.setVideoTexturesEnabled
  );

  const appHeight = useAppHeight();

  const { envIntensity, videoEnabled } = useControls({
    envIntensity: {
      value: 2.2,
      max: 5,
      min: 0,
      step: 0.1,
    },
    videoEnabled: { label: "video", value: true },
  });

  useEffect(() => {
    setVideoTexturesEnabled(videoEnabled);
  }, [setVideoTexturesEnabled, videoEnabled]);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <>
      <ReactLenis
        root
        ref={lenisRef}
        options={{ infinite: true, lerp: 0.03, syncTouch: true }}
      >
        <div
          ref={contentRef}
          style={{
            width: "100%",
            height: `${appHeight}px`,
            position: "absolute",
            top: 0,
          }}
        >
          <Header />
          <Welcome />
          <WWD />
          <div style={{ height: "30%" }} />
          <Industries />
          <MobileApps />
          <Cases />
          <Footer />
          <div style={{ overflow: "hidden", height: "100vh" }}>
            <WelcomeDuplicate />
          </div>
        </div>
        <Leva collapsed />
        <Canvas
          linear
          style={{
            background: "#000",
            position: "fixed",
            top: 0,
            height: "100vh",
          }}
          shadows
        >
          <Suspense fallback={null}>
            <StarryBackground />
            <Effects />
            <PerspectiveCamera
              makeDefault
              fov={cameraFov}
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
