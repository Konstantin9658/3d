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
import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";

const MainScene = () => {
  const scroll = useScroll();
  const { scene, cameras, animations } = useGLTF(model);
  const camera = useThree((state) => state.camera);
  const { actions, mixer } = useAnimations(animations, scene);
  const [animatedCamera, setAnimatedCamera] = useState<THREE.Camera | null>(
    null
  );

  useEffect(() => {
    if (cameras.length > 0) {
      setAnimatedCamera(cameras[0]);
    }

    if (actions && Object.keys(actions).length > 0 && actions["Camera"]) {
      const action = actions["Camera"];
      // action.clampWhenFinished = true;
      action.play();
    }
  }, [cameras, actions]);

  useFrame((_, delta) => {
    if (animatedCamera && actions) {
      const action = actions["Camera"];
      if (!action) return;

      const duration = action.getClip().duration;
      const scrollOffset = scroll.offset;

      action.time = scrollOffset * duration;
      mixer.update(delta);

      animatedCamera.updateMatrixWorld();
      camera.position.lerp(animatedCamera.position, 0.1);
      camera.quaternion.slerp(animatedCamera.quaternion, 0.1);
    }
  });

  return <primitive object={scene} />;
};

function App() {
  return (
    <Canvas>
      <Environment preset="city" />
      <PerspectiveCamera makeDefault fov={27} />
      <Suspense fallback={null}>
        <ScrollControls damping={0.7} pages={50} infinite>
          <MainScene />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

export default App;
