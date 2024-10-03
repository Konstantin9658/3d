import "./App.css";
import { Canvas } from "@react-three/fiber";
import model from "./scene.glb";
import {
  Environment,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useLayoutEffect } from "react";
// import * as THREE from "three";
import studio from "@theatre/studio";
import { getProject } from "@theatre/core";
import { SheetProvider, PerspectiveCamera } from "@theatre/r3f";

const demoSheet = getProject("Demo Project").sheet("Demo Sheet");
studio.initialize();

// const interpolate = function (
//   value: number,
//   [s1, s2]: [number, number],
//   [t1, t2]: [number, number],
//   slope = 0.5
// ) {
//   //If the value is out of the source range, floor to min/max target values
//   if (value < Math.min(s1, s2)) {
//     return Math.min(s1, s2) === s1 ? t1 : t2;
//   }

//   if (value > Math.max(s1, s2)) {
//     return Math.max(s1, s2) === s1 ? t1 : t2;
//   }

//   //Reverse the value, to make it correspond to the target range (this is a side-effect of the bezier calculation)
//   value = s2 - value;

//   const C1 = { x: s1, y: t1 }; //Start of bezier curve
//   const C3 = { x: s2, y: t2 }; //End of bezier curve
//   const C2 = {
//     //Control point
//     x: C3.x,
//     y: C1.y + Math.abs(slope) * (C3.y - C1.y),
//   };

//   //Find out how far the value is on the curve
//   const percent = value / (C3.x - C1.x);

//   return C1.y * b1(percent) + C2.y * b2(percent) + C3.y * b3(percent);

//   function b1(t: number) {
//     return t * t;
//   }
//   function b2(t: number) {
//     return 2 * t * (1 - t);
//   }
//   function b3(t: number) {
//     return (1 - t) * (1 - t);
//   }
// };

const MainScene = ({ ...props }: JSX.IntrinsicElements["group"]) => {
  // const scroll = useScroll();

  const { scene, nodes } = useGLTF(model);
  // const { actions } = useAnimations(animations, scene);
  // const camera = useThree((state) => state.camera);

  useLayoutEffect(() =>
    Object.values(nodes).forEach(
      (node) => (node.receiveShadow = node.castShadow = true)
    )
  );

  // const duration = useMemo(() => {
  //   return actions["Camera"]?.getClip().duration || 0;
  // }, [actions]);

  // useEffect(() => {
  //   if (!actions["Camera"]) return;
  //   camera.animations = [actions["Camera"].getClip()];
  // }, [actions, camera]);

  // useFrame(() => {
  //   const action = actions["Camera"];

  //   // console.log(action);

  //   if (!action) return;

  //   // console.log(action.getClip().duration);

  //   // The offset is between 0 and 1, you can apply it to your models any way you like
  //   const offset = 1 - scroll.offset;

  //   action.time = interpolate(offset, [0, 1], [0, duration]);
  // });

  return <primitive object={scene} {...props} />;
};

function App() {
  return (
    <Canvas>
      <SheetProvider sheet={demoSheet}>
        <OrbitControls />
        <Environment preset="city" />
        <PerspectiveCamera makeDefault theatreKey="Camera" />
        <Suspense fallback={null}>
          {/* <ScrollControls damping={0.5} pages={1}> */}
          <MainScene />
          {/* </ScrollControls> */}
        </Suspense>
      </SheetProvider>
    </Canvas>
  );
}

export default App;
