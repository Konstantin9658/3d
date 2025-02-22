import "./App.css";

import { Loader, Preload, Stars } from "@react-three/drei";
// import classes from "./styles.module.scss";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { LenisRef, ReactLenis } from "lenis/react";
// import { Leva, useControls } from "leva";
import { Suspense, useEffect, useRef } from "react";

import { Camera } from "./components/Camera";
import { Effects } from "./components/Effects";
import { Env } from "./components/Env";
import { Header } from "./components/Header";
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
  const lenisRef = useRef<LenisRef | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const appHeight = useAppHeight();

  const setAppLoaded = useAppStore((state) => state.setAppLoaded);

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => gsap.ticker.remove(update);
  }, []);

  const handleLoading = (active: boolean) => {
    if (!active) {
      document.body.style.overflow = "";
      setAppLoaded(true);
    } else {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
      setAppLoaded(false);
    }

    return active;
  };

  return (
    <>
      <ReactLenis
        root
        ref={lenisRef}
        options={{ infinite: true, lerp: 0.03, syncTouch: true }}
      >
        {/* <Leva collapsed /> */}
        <Suspense fallback={null}>
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
            <div style={{ height: "26%" }} />
            <Industries />
            <div style={{ height: "15%" }} />
            <MobileApps />
            <Cases />
            <div style={{ height: "3%" }} />
            <Footer />
            <div style={{ overflow: "hidden", height: "100vh" }}>
              <WelcomeDuplicate />
            </div>
          </div>
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
            <Preload all />
            <Stars
              radius={130}
              count={8000}
              depth={100}
              factor={7}
              fade
              speed={0.5}
              saturation={0}
            />
            <Effects />
            <Camera />
            <Env />
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
          </Canvas>
        </Suspense>
        <Loader
          containerStyles={{ position: "fixed", top: 0 }}
          initialState={handleLoading}
        />
      </ReactLenis>
    </>
  );
}

export default App;
