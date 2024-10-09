import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import model from "./assets/models/full_scene.glb";
import planet from "./assets/models/planet.glb";
import spaceStation from "./assets/models/space_station.glb";
import stage_1st from "./assets/models/1st_stage.glb";
import stage_2nd from "./assets/models/2nd_stage.glb";
import stage_3rd from "./assets/models/3rd_stage.glb";
import stage_4th from "./assets/models/4th_stage.glb";
import stage_5th from "./assets/models/5th_stage.glb";
import stage_6th from "./assets/models/6th_stage.glb";
import stage_7th from "./assets/models/7th_stage.glb";
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
  useLayoutEffect,
} from "react";
import * as THREE from "three";
import { useControls } from "leva";
import { EffectComposer } from "@react-three/postprocessing";
import {
  BlendFunction,
  BloomEffect,
  BrightnessContrastEffect,
  ChromaticAberrationEffect,
  EdgeDetectionMode,
  Effect,
  EffectComposer as RawEffectComposer,
  EffectPass,
  HueSaturationEffect,
  KernelSize,
  PredicationMode,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
  VignetteEffect,
} from "postprocessing";
import { Vector2 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const updateLastComposerEffect = (effectComposer: RawEffectComposer) => {
  for (let i = 0; i < effectComposer.passes.length; i++) {
    const pass = effectComposer.passes[i];

    if (pass.name === "EffectPass") {
      pass.renderToScreen = i === effectComposer.passes.length - 1;
    }
  }
};
const ppMediumOrHigh = true;
const isAAEnabled = true;

export const Effects = () => {
  const effectComposer = useRef<RawEffectComposer>(null);

  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  useLayoutEffect(() => {
    if (!effectComposer.current || !effectComposer.current.passes) return;
    updateLastComposerEffect(effectComposer.current);
  });

  useEffect(() => {
    const composer = effectComposer.current;

    if (!camera || !scene || camera.name !== "Camera" || !composer) return;

    composer.reset();
    composer.addPass(new RenderPass(scene, camera));

    const effects: Effect[] = [];

    if (ppMediumOrHigh) {
      effects.push(
        new BloomEffect({
          mipmapBlur: true,
          blendFunction: BlendFunction.SCREEN,
          kernelSize: KernelSize.LARGE,
          luminanceThreshold: 1,
          luminanceSmoothing: 0,
          intensity: 0.65,
        })
      );
    }

    if (ppMediumOrHigh) {
      effects.push(
        new ChromaticAberrationEffect({
          blendFunction: BlendFunction.NORMAL,
          offset: new Vector2(0.0004, 0.0004),
          radialModulation: false,
          modulationOffset: 0.15,
        })
      );
    }

    if (ppMediumOrHigh) {
      effects.push(
        new VignetteEffect({
          offset: 0.05,
          darkness: 0.2,
        })
      );
    }

    effects.push(
      new HueSaturationEffect({
        hue: 0,
        saturation: degToRad(7),
      })
    );
    effects.push(
      new BrightnessContrastEffect({
        brightness: 0.2,
        contrast: -0.25,
      })
    );

    if (isAAEnabled) {
      const smaaPass = new EffectPass(
        camera,
        new SMAAEffect({
          edgeDetectionMode: EdgeDetectionMode.COLOR,
          predicationMode: PredicationMode.DISABLED,
          preset: SMAAPreset.MEDIUM,
        })
      );
      composer.addPass(smaaPass);
    }

    if (effects.length) composer.addPass(new EffectPass(camera, ...effects));

    updateLastComposerEffect(effectComposer.current);

    return () => composer.reset();
  }, [camera, scene]);

  return (
    <EffectComposer multisampling={0} ref={effectComposer}>
      {/* Обман для свойства children */}
      <></>
    </EffectComposer>
  );
};

const Planet = () => {
  const { scene } = useGLTF(planet);

  return <primitive object={scene} position={[-17, 40, -94]} />;
};

const SpaceStation = () => {
  const { scene } = useGLTF(spaceStation);

  return <primitive object={scene} position={[22, 0, -108]} />;
};

const FirstStage = () => {
  const { scene } = useGLTF(stage_1st);

  return <primitive object={scene} position={[0, 0, -36]} />;
};

const SecondStage = () => {
  const { scene } = useGLTF(stage_2nd);

  return <primitive object={scene} position={[0, 0, -25]} />;
};

const ThirdStage = () => {
  const { scene } = useGLTF(stage_3rd);

  return <primitive object={scene} position={[0, 0, 0]} />;
};

const FourthStage = () => {
  const { scene } = useGLTF(stage_4th);

  const rx = degToRad(-90);

  return (
    <primitive object={scene} position={[0, 0, 22]} rotation={[rx, 0, 0]} />
  );
};

const FifthStage = () => {
  const { scene } = useGLTF(stage_5th);

  const rx = degToRad(-180);

  return (
    <primitive object={scene} position={[0, 28, 8]} rotation={[rx, 0, 0]} />
  );
};

const SixthStage = () => {
  const { scene } = useGLTF(stage_6th);

  useEffect(() => {
    console.log(scene.traverse((obj) => console.log(obj.name)));
  }, [scene]);

  const rx = degToRad(180);
  return (
    <primitive object={scene} position={[0, 28, -12]} rotation={[rx, 0, 0]} />
  );
};

const SeventhStage = () => {
  const { scene } = useGLTF(stage_7th);

  const rz = degToRad(180);

  return (
    <primitive object={scene} position={[0, 28, -16]} rotation={[0, 0, rz]} />
  );
};

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
          {/* <Effects /> */}
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
