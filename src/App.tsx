import "./App.css";

import {
  Environment,
  PerspectiveCamera,
  // OrbitControls,
} from "@react-three/drei";
// import classes from "./styles.module.scss";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { LenisRef, ReactLenis } from "lenis/react";
import { Leva, useControls } from "leva";
import { Suspense, useEffect, useRef, useState } from "react";
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

function App() {
  const [envRotation, setEnvRotation] = useState(new THREE.Euler());

  const lenisRef = useRef<LenisRef | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const cameraFov = useAppStore((state) => state.cameraFov);

  const appHeight = useAppHeight();

  const { envIntensity } = useControls({
    envIntensity: {
      value: 2.2,
      max: 5,
      min: 0,
      step: 0.1,
    },
  });

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
          {/* <WelcomeDuplicate /> */}
          <Welcome />
          <WWD />
          <div style={{ height: "30%" }} />
          <Industries />
          {/* <div style={{ height: "8%" }} /> */}
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
          gl={{
            precision: "highp",
            depth: false,
            powerPreference: "high-performance",
          }}
          style={{
            background: "#000",
            position: "fixed",
            top: 0,
            height: "100vh",
          }}
          shadows
        >
          <Suspense fallback={null}>
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
