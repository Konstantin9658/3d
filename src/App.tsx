import "./App.css";

import {
  Environment,
  PerspectiveCamera,
  // OrbitControls,
} from "@react-three/drei";
// import classes from "./styles.module.scss";
import { Canvas } from "@react-three/fiber";
import { ReactLenis } from "lenis/react";
import { Leva, useControls } from "leva";
import { Suspense, useState } from "react";
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
import { Welcome } from "./sections/Welcome";
import { WWD } from "./sections/WWD";
import { useAppStore } from "./store/app";

function App() {
  const [envRotation, setEnvRotation] = useState(new THREE.Euler());

  const cameraFov = useAppStore((state) => state.cameraFov);

  const { envIntensity } = useControls({
    envIntensity: {
      value: 0.5,
      max: 5,
      min: 0,
      step: 0.1,
    },
  });

  const appHeight = useAppHeight();

  return (
    <>
      <ReactLenis
        root
        options={{ infinite: true, lerp: 0.03, syncTouch: true }}
      >
        <div
          style={{
            width: "100%",
            height: `${appHeight}px`,
            position: "absolute",
          }}
        >
          <Header />
          <Welcome />
          <WWD />
        </div>

        <Leva collapsed />
        <Canvas
          linear
          style={{
            background: "#000",
            position: "fixed",
            top: 0,
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
            {/* <fog attach="fog" color="#234243" near={1} far={110} /> */}
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
