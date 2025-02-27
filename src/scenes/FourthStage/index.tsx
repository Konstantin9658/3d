import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import stage_4th from "@/assets/models/4th_stage.glb";

export const FourthStage = () => {
  console.log("Render 4th stage");

  const group = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);

  const { nodes, materials, animations } = useGLTF(stage_4th);
  const { actions, mixer } = useAnimations(animations, group);

  const camera = useThree((state) => state.camera);

  const rx = degToRad(-65);

  const sceneBounds = useRef(new THREE.Box3());
  const isSceneActive = useRef<boolean>(false);

  const scroll = useScroll();

  useEffect(() => {
    if (!actions) return;

    const actionFanLoop = actions["industry-3-loop"];

    if (!actionFanLoop) return;

    actionFanLoop.play();
  }, [actions]);

  useEffect(() => {
    if (!group.current) return;

    sceneBounds.current.setFromObject(group.current);
  }, []);

  useFrame(() => {
    if (!sceneBounds.current) return;
    isSceneActive.current = sceneBounds.current.containsPoint(camera.position);
  });

  // useFrame((_, delta) => {
  //   if (!actions || !isSceneActive.current) return;

  //   const actionScroll = actions["controller"];
  //   if (!actionScroll) return;

  //   const duration = actionScroll.getClip().duration;
  //   const targetTime = scroll.offset * duration;

  //   if (scroll.delta !== 0) {
  //     actionScroll.time = THREE.MathUtils.lerp(actionScroll.time, targetTime, delta * 10);
  //     actionScroll.play();
  //   } else {
  //     actionScroll.paused = true;
  //     actionScroll.clampWhenFinished = true;
  //   }

  //   console.log(scroll.offset, "4th stage");

  //   mixer.update(delta);
  // });

  useFrame((_, delta) => {
    if (!actions || !isSceneActive.current) return;

    const actionScroll = actions["controller"];
    if (!actionScroll) return;

    const duration = actionScroll.getClip().duration;
    const targetTime = scroll.offset * duration;

    actionScroll.time = THREE.MathUtils.lerp(
      actionScroll.time,
      targetTime,
      delta * 5
    );
    actionScroll.paused = false;
    actionScroll.clampWhenFinished = false; // Отключаем
    actionScroll.play();

    if (!actionScroll.isRunning()) return;

    mixer.update(delta);
  });

  const hoverAction1 = actions["hover-1"];
  const unhoverAction1 = actions["unhover-1"];
  const hoverAction3 = actions["hover-3"];
  const unhoverAction3 = actions["unhover-3"];

  return (
    <group
      ref={group}
      dispose={null}
      position={[0, 10.7, 39]}
      rotation={[rx, 0, 0]}
    >
      <group name="Scene">
        <group name="controller" rotation={[Math.PI / 2, 0, -Math.PI / 4]}>
          <group name="room_1" rotation={[Math.PI / 2, -Math.PI / 6, Math.PI]}>
            <mesh
              name="read_more_1"
              geometry={(nodes.read_more_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="body"
              geometry={(nodes.body as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
            <mesh
              name="shadows"
              geometry={(nodes.shadows as THREE.Mesh).geometry}
              material={materials.shadow}
              position={[1.172, 0.12, 5.653]}
              scale={0.492}
            />
            <mesh
              name="collider_1"
              visible={false}
              geometry={(nodes.collider_1 as THREE.Mesh).geometry}
              material={(nodes.collider_1 as THREE.Mesh).material}
              position={[0, 1.868, 6.537]}
              scale={1.152}
              onPointerOut={() => {
                if (!unhoverAction1 || !hoverAction1) return;

                hoverAction1.stop();

                unhoverAction1.reset().play();
                unhoverAction1.loop = THREE.LoopOnce;
                unhoverAction1.clampWhenFinished = true;

                document.body.style.cursor = "default";
              }}
              onPointerEnter={() => {
                if (!hoverAction1 || !unhoverAction1) return;

                unhoverAction1.stop();

                hoverAction1.reset().play();
                hoverAction1.loop = THREE.LoopOnce;
                hoverAction1.clampWhenFinished = true;

                document.body.style.cursor = "pointer";
              }}
            />
            <mesh
              name="screen_light"
              geometry={(nodes.screen_light as THREE.Mesh).geometry}
              material={materials.screen}
              position={[0, 0, 6.287]}
            />
          </group>
          <group name="room_2" rotation={[Math.PI / 2, -Math.PI / 3, Math.PI]}>
            <mesh
              name="read_more_2"
              geometry={(nodes.read_more_2 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room2"
              geometry={(nodes.room2 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group name="room_2001" rotation={[-Math.PI / 2, Math.PI / 3, 0]}>
            <mesh
              name="read_more_2_1"
              geometry={(nodes.read_more_2_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room2_1"
              geometry={(nodes.room2_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group name="room_3" rotation={[-Math.PI / 2, -Math.PI / 2, 0]}>
            <mesh
              name="read_more_3"
              geometry={(nodes.read_more_3 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="fan"
              geometry={(nodes.fan as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 1.339, 5.582]}
            />
            <mesh
              name="fan001"
              geometry={(nodes.fan001 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.87, 1.339, 5.515]}
              rotation={[0, -0.157, 0]}
            />
            <mesh
              name="fan002"
              geometry={(nodes.fan002 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.87, 1.339, 5.515]}
              rotation={[0, 0.157, 0]}
            />
            <mesh
              name="collider_3"
              visible={false}
              geometry={(nodes.collider_3 as THREE.Mesh).geometry}
              material={(nodes.collider_3 as THREE.Mesh).material}
              position={[0, 1.868, 6.537]}
              scale={1.152}
              onPointerLeave={() => {
                if (!unhoverAction3 || !hoverAction3) return;

                hoverAction3.stop();
                unhoverAction3.reset().play();
                unhoverAction3.loop = THREE.LoopOnce;
                unhoverAction3.clampWhenFinished = true;

                document.body.style.cursor = "default";
              }}
              onPointerEnter={() => {
                if (!hoverAction3 || !unhoverAction3) return;

                unhoverAction3.stop();
                hoverAction3.reset().play();
                hoverAction3.loop = THREE.LoopOnce;
                hoverAction3.clampWhenFinished = true;

                document.body.style.cursor = "pointer";
              }}
            />
            <mesh
              name="fandw"
              geometry={(nodes.fandw as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
            <mesh
              name="shadow001"
              geometry={(nodes.shadow001 as THREE.Mesh).geometry}
              material={materials.shadow}
              position={[1.021, 0.12, 5.594]}
              scale={0.559}
            />
          </group>
          <group name="room_3001" rotation={[-Math.PI / 2, Math.PI / 2, 0]}>
            <mesh
              name="read_more_3_1"
              geometry={(nodes.read_more_3_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="fan_1"
              geometry={(nodes.fan_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 1.339, 5.582]}
            />
            <mesh
              name="fan001_1"
              geometry={(nodes.fan001_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.87, 1.339, 5.515]}
              rotation={[0, -0.157, 0]}
            />
            <mesh
              name="fan002_1"
              geometry={(nodes.fan002_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.87, 1.339, 5.515]}
              rotation={[0, 0.157, 0]}
            />
            <mesh
              name="collider_3_1"
              visible={false}
              geometry={(nodes.collider_3_1 as THREE.Mesh).geometry}
              material={(nodes.collider_3_1 as THREE.Mesh).material}
              position={[0, 1.868, 6.537]}
              scale={1.152}
            />
            <mesh
              name="fandw_1"
              geometry={(nodes.fandw_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
            <mesh
              name="shadow001_1"
              geometry={(nodes.shadow001_1 as THREE.Mesh).geometry}
              material={materials.shadow}
              position={[1.021, 0.12, 5.594]}
              scale={0.559}
            />
          </group>
          <group name="room_4" rotation={[-Math.PI / 2, -Math.PI / 3, 0]}>
            <mesh
              name="read_more_4"
              geometry={(nodes.read_more_4 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room4"
              geometry={(nodes.room4 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group
            name="room_4001"
            rotation={[Math.PI / 2, Math.PI / 3, Math.PI]}
          >
            <mesh
              name="read_more_4_1"
              geometry={(nodes.read_more_4_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room4_1"
              geometry={(nodes.room4_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group name="room_5" rotation={[-Math.PI / 2, -Math.PI / 6, 0]}>
            <mesh
              name="read_more_5"
              geometry={(nodes.read_more_5 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room5"
              geometry={(nodes.room5 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group
            name="room_5001"
            rotation={[Math.PI / 2, Math.PI / 6, Math.PI]}
          >
            <mesh
              name="read_more_5_1"
              geometry={(nodes.read_more_5_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room5_1"
              geometry={(nodes.room5_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group name="room_6" rotation={[-Math.PI / 2, 0, 0]}>
            <mesh
              name="read_more_6"
              geometry={(nodes.read_more_6 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room6"
              geometry={(nodes.room6 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <group name="room_6001" rotation={[Math.PI / 2, 0, Math.PI]}>
            <mesh
              name="read_more_6_1"
              geometry={(nodes.read_more_6_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.82, 7.144]}
              rotation={[Math.PI / 2, 0, 0]}
            />
            <mesh
              name="room6_1"
              geometry={(nodes.room6_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0, 6.287]}
            />
          </group>
          <mesh
            name="dividers"
            geometry={(nodes.dividers as THREE.Mesh).geometry}
            material={materials.all_colors}
            rotation={[-Math.PI / 2, -Math.PI / 6, 0]}
          />
          <mesh
            name="windows"
            geometry={(nodes.windows as THREE.Mesh).geometry}
            material={materials.glass}
            position={[0, 0, -1.256]}
            rotation={[-Math.PI / 2, -Math.PI / 6, 0]}
          />
        </group>
        <mesh
          name="collider_4th"
          visible={false}
          geometry={(nodes.collider_4th as THREE.Mesh).geometry}
          material={(nodes.collider_4th as THREE.Mesh).material}
        />
      </group>
    </group>
  );
};

useGLTF.preload(stage_4th);
