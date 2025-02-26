import { useAnimations, useGLTF, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import stage_2nd from "@/assets/models/2nd_stage.glb";

import { SCROLL_ACTION } from "./consts";
import { WwdHoverAction, WwdLoopAnimations, WwdUnhoverAction } from "./types";

export const SecondStage = () => {
  console.log("Render 2nd stage");

  const group = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);

  const { animations, nodes, materials } = useGLTF(stage_2nd);
  const { actions, mixer } = useAnimations(animations, group);

  const camera = useThree((state) => state.camera);

  const sceneBounds = useRef(new THREE.Box3());
  const isSceneActive = useRef<boolean>(false);

  const scroll = useScroll();

  useEffect(() => {
    if (!actions) return;

    // const actionScroll = actions[SCROLL_ACTION];
    const actionLoopAnimations = Object.values(WwdLoopAnimations);

    // if (!actionScroll) return;

    actionLoopAnimations.forEach((_, index) => {
      actions[actionLoopAnimations[index]]?.play();
      actions[actionLoopAnimations[index]]?.setDuration(2);
    });

    // actionScroll.play();
  }, [actions]);

  useEffect(() => {
    if (!group.current) return;
    // Вычисляем границы сцены
    sceneBounds.current.setFromObject(group.current);
  }, [group]);

  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        if (node.material instanceof THREE.MeshStandardMaterial) {
          if (node.material.name === "glass") {
            node.material.toneMapped = false;
            node.material.roughness = 0.5;
            node.material.needsUpdate = true;
          }
        }
      }
    });
  }, []);

  useFrame(() => {
    if (!sceneBounds.current) return;

    // Проверяем, находится ли камера внутри границ сцены
    isSceneActive.current = sceneBounds.current.containsPoint(camera.position);
  });

  useFrame((_, delta) => {
    if (!isSceneActive.current) return;

    if (!actions) return;

    const actionScroll = actions[SCROLL_ACTION];

    if (!actionScroll) return;

    const duration = actionScroll.getClip().duration;

    if (scroll.delta !== 0) {
      actionScroll.time = scroll.offset * duration;
      actionScroll.play();
    } else {
      actionScroll.paused = true;
      actionScroll.clampWhenFinished = true;
    }

    mixer.update(delta);
  });

  const hover_1 = actions[WwdHoverAction.WWD_1_Hover];
  const hover_2 = actions[WwdHoverAction.WWD_2_Hover];
  const hover_3 = actions[WwdHoverAction.WWD_3_Hover];
  const hover_4 = actions[WwdHoverAction.WWD_4_Hover];
  const hover_5 = actions[WwdHoverAction.WWD_5_Hover];
  const hover_6 = actions[WwdHoverAction.WWD_6_Hover];
  const hover_7 = actions[WwdHoverAction.WWD_7_Hover];
  const hover_8 = actions[WwdHoverAction.WWD_8_Hover];
  const hover_9 = actions[WwdHoverAction.WWD_9_Hover];

  const unhover_1 = actions[WwdUnhoverAction.WWD_1_Unhover];
  const unhover_2 = actions[WwdUnhoverAction.WWD_2_Unhover];
  const unhover_3 = actions[WwdUnhoverAction.WWD_3_Unhover];
  const unhover_4 = actions[WwdUnhoverAction.WWD_4_Unhover];
  const unhover_5 = actions[WwdUnhoverAction.WWD_5_Unhover];
  const unhover_6 = actions[WwdUnhoverAction.WWD_6_Unhover];
  const unhover_7 = actions[WwdUnhoverAction.WWD_7_Unhover];
  const unhover_8 = actions[WwdUnhoverAction.WWD_8_Unhover];
  const unhover_9 = actions[WwdUnhoverAction.WWD_9_Unhover];

  return (
    // <primitive
    //   object={scene}
    //   position={[0, 0, -25]}
    //   onPointerMove={handleMouseMove}
    // />

    <group ref={group} dispose={null} position={[0, 0, -25]}>
      <group name="Scene">
        <mesh
          name="2nd_stage_platform"
          geometry={(nodes["2nd_stage_platform"] as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[0, 0, 3.987]}
          rotation={[0, -Math.PI / 2, 0]}
        >
          <group name="wwd_1" rotation={[-Math.PI, 1.266, -Math.PI]}>
            <mesh
              name="wwd_1_object"
              geometry={(nodes.wwd_1_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_1_bottom"
              geometry={(nodes.wwd_1_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_1_glass"
              geometry={(nodes.wwd_1_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_1_lamp_L"
              geometry={(nodes.wwd_1_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_1_lamp_R"
              geometry={(nodes.wwd_1_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd_base"
              geometry={(nodes.wwd_base as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
            <mesh
              name="wwd1_collider"
              visible={false}
              geometry={(nodes.wwd1_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_1 || !unhover_1) return;

                unhover_1.stop();

                hover_1.reset().play();
                hover_1.loop = THREE.LoopOnce;
                hover_1.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_1 || !hover_1) return;

                hover_1.stop();

                unhover_1.reset().play();
                unhover_1.loop = THREE.LoopOnce;
                unhover_1.clampWhenFinished = true;
              }}
            />
          </group>
          <group name="wwd_2" rotation={[-Math.PI, 1.56, -Math.PI]}>
            <mesh
              name="wwd_2_object"
              geometry={(nodes.wwd_2_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_2_glass"
              geometry={(nodes.wwd_2_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_2_lamp_L"
              geometry={(nodes.wwd_2_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_2_lamp_R"
              geometry={(nodes.wwd_2_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd_2_bottom"
              geometry={(nodes.wwd_2_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd2_collider"
              visible={false}
              geometry={(nodes.wwd2_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_2 || !unhover_2) return;

                unhover_2.stop();

                hover_2.reset().play();
                hover_2.loop = THREE.LoopOnce;
                hover_2.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_2 || !hover_2) return;

                hover_2.stop();

                unhover_2.reset().play();
                unhover_2.loop = THREE.LoopOnce;
                unhover_2.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_1"
              geometry={(nodes.wwd_base_1 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_3" rotation={[0, 1.287, 0]}>
            <mesh
              name="wwd_3_object"
              geometry={(nodes.wwd_3_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_3_bottom"
              geometry={(nodes.wwd_3_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_3_glass"
              geometry={(nodes.wwd_3_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_3_lamp_L"
              geometry={(nodes.wwd_3_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_3_lamp_R"
              geometry={(nodes.wwd_3_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd3_collider"
              visible={false}
              geometry={(nodes.wwd3_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_3 || !unhover_3) return;

                unhover_3.stop();

                hover_3.reset().play();
                hover_3.loop = THREE.LoopOnce;
                hover_3.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_3 || !hover_3) return;

                hover_3.stop();

                unhover_3.reset().play();
                unhover_3.loop = THREE.LoopOnce;
                unhover_3.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_2"
              geometry={(nodes.wwd_base_2 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_4" rotation={[0, 0.992, 0]}>
            <mesh
              name="wwd_4_object"
              geometry={(nodes.wwd_4_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_4_bottom"
              geometry={(nodes.wwd_4_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_4_glass"
              geometry={(nodes.wwd_4_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_4_lamp_L"
              geometry={(nodes.wwd_4_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_4_lamp_R"
              geometry={(nodes.wwd_4_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd4_collider"
              visible={false}
              geometry={(nodes.wwd4_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_4 || !unhover_4) return;

                unhover_4.stop();

                hover_4.reset().play();
                hover_4.loop = THREE.LoopOnce;
                hover_4.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_4 || !hover_4) return;

                hover_4.stop();

                unhover_4.reset().play();
                unhover_4.loop = THREE.LoopOnce;
                unhover_4.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_3"
              geometry={(nodes.wwd_base_3 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_5_5" rotation={[0, 0.698, 0]}>
            <mesh
              name="wwd_5_object"
              geometry={(nodes.wwd_5_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_5_bottom"
              geometry={(nodes.wwd_5_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_5_glass"
              geometry={(nodes.wwd_5_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_5_lamp_L"
              geometry={(nodes.wwd_5_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_5_lamp_R"
              geometry={(nodes.wwd_5_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd5_collider"
              visible={false}
              geometry={(nodes.wwd5_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_5 || !unhover_5) return;

                unhover_5.stop();

                hover_5.reset().play();
                hover_5.loop = THREE.LoopOnce;
                hover_5.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_5 || !hover_5) return;

                hover_5.stop();

                unhover_5.reset().play();
                unhover_5.loop = THREE.LoopOnce;
                unhover_5.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_4"
              geometry={(nodes.wwd_base_4 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_6" rotation={[0, 0.404, 0]}>
            <mesh
              name="wwd_6_object"
              geometry={(nodes.wwd_6_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_6_bottom"
              geometry={(nodes.wwd_6_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_6_glass"
              geometry={(nodes.wwd_6_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_6_lamp_L"
              geometry={(nodes.wwd_6_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_6_lamp_R"
              geometry={(nodes.wwd_6_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd6_collider"
              visible={false}
              geometry={(nodes.wwd6_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_6 || !unhover_6) return;

                unhover_6.stop();

                hover_6.reset().play();
                hover_6.loop = THREE.LoopOnce;
                hover_6.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_6 || !hover_6) return;

                hover_6.stop();

                unhover_6.reset().play();
                unhover_6.loop = THREE.LoopOnce;
                unhover_6.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_5"
              geometry={(nodes.wwd_base_5 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_7" rotation={[0, 0.109, 0]}>
            <mesh
              name="wwd_7_object"
              geometry={(nodes.wwd_7_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_7_bottom"
              geometry={(nodes.wwd_7_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_7_glass"
              geometry={(nodes.wwd_7_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_7_lamp_L"
              geometry={(nodes.wwd_7_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_7_lamp_R"
              geometry={(nodes.wwd_7_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd7_collider"
              visible={false}
              geometry={(nodes.wwd7_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_7 || !unhover_7) return;

                unhover_7.stop();

                hover_7.reset().play();
                hover_7.loop = THREE.LoopOnce;
                hover_7.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_7 || !hover_7) return;

                hover_7.stop();

                unhover_7.reset().play();
                unhover_7.loop = THREE.LoopOnce;
                unhover_7.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_6"
              geometry={(nodes.wwd_base_6 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_8" rotation={[0, -0.185, 0]}>
            <mesh
              name="wwd_8_object"
              geometry={(nodes.wwd_8_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_8_bottom"
              geometry={(nodes.wwd_8_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_8_glass"
              geometry={(nodes.wwd_8_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_8_lamp_L"
              geometry={(nodes.wwd_8_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_8_lamp_R"
              geometry={(nodes.wwd_8_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd8_collider"
              visible={false}
              geometry={(nodes.wwd8_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_8 || !unhover_8) return;

                unhover_8.stop();

                hover_8.reset().play();
                hover_8.loop = THREE.LoopOnce;
                hover_8.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_8 || !hover_8) return;

                hover_8.stop();

                unhover_8.reset().play();
                unhover_8.loop = THREE.LoopOnce;
                unhover_8.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_7"
              geometry={(nodes.wwd_base_7 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
          <group name="wwd_9" rotation={[0, -0.479, 0]}>
            <mesh
              name="wwd_9_object"
              geometry={(nodes.wwd_9_object as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 2.12, -6.456]}
              rotation={[0, 1.571, 0]}
            />
            <mesh
              name="wwd_9_bottom"
              geometry={(nodes.wwd_9_bottom as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0, 0.962, -5.962]}
            />
            <mesh
              name="wwd_9_glass"
              geometry={(nodes.wwd_9_glass as THREE.Mesh).geometry}
              material={materials.glass}
              position={[0, 1.873, -5.992]}
            />
            <mesh
              name="wwd_9_lamp_L"
              geometry={(nodes.wwd_9_lamp_L as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[-0.634, 1.873, -6.472]}
            />
            <mesh
              name="wwd_9_lamp_R"
              geometry={(nodes.wwd_9_lamp_R as THREE.Mesh).geometry}
              material={materials.all_colors}
              position={[0.629, 1.873, -6.472]}
            />
            <mesh
              name="wwd9_collider"
              visible={false}
              geometry={(nodes.wwd9_collider as THREE.Mesh).geometry}
              position={[0, 1.878, -5.641]}
              onPointerEnter={(e) => {
                e.stopPropagation();
                if (!hover_9 || !unhover_9) return;

                unhover_9.stop();

                hover_9.reset().play();
                hover_9.loop = THREE.LoopOnce;
                hover_9.clampWhenFinished = true;
              }}
              onPointerLeave={(e) => {
                e.stopPropagation();
                if (!unhover_9 || !hover_9) return;

                hover_9.stop();

                unhover_9.reset().play();
                unhover_9.loop = THREE.LoopOnce;
                unhover_9.clampWhenFinished = true;
              }}
            />
            <mesh
              name="wwd_base_8"
              geometry={(nodes.wwd_base_8 as THREE.Mesh).geometry}
              material={materials.all_colors}
            />
          </group>
        </mesh>
        <mesh
          name="ceiling"
          geometry={(nodes.ceiling as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[0, 12, 3.987]}
        />
        <mesh
          name="2nd_floor"
          geometry={(nodes["2nd_floor"] as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[0, 0, 3.987]}
        />
      </group>
    </group>
  );
};

useGLTF.preload(stage_2nd);
