import {
  useAnimations,
  useCursor,
  useGLTF,
  useScroll,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import stage_3rd from "@/assets/models/3rd_stage.glb";
import { useVideoMaterial } from "@/hooks/useVideoMaterial";

import animationsPlaceholder from "./animations.jpg";
import animationsHref from "./animations_256.mp4";
import {
  CLOSE_CLIP_1,
  CLOSE_CLIP_2,
  LOOP_ANIMATION,
  OPEN_CLIP_1,
  OPEN_CLIP_2,
} from "./consts";
import screenPlaceholder from "./screen.jpg";
import videoHref from "./screen_512.mp4";

// const INITIAL_OPACITY = 0.5;

export const ThirdStage = () => {
  console.log("Render 3rd stage");

  const group = useRef<THREE.Group<THREE.Object3DEventMap> | null>(null);

  const { nodes, materials, animations } = useGLTF(stage_3rd);
  const { actions, mixer } = useAnimations(animations, group);

  const nexMeshRef = useRef<THREE.Mesh | null>(null);
  const glowMeshRef = useRef<THREE.Mesh | null>(null);
  const sceneBounds = useRef(new THREE.Box3());
  const isSceneActive = useRef<boolean>(false);
  const isHovered = useRef<boolean>(false);

  const camera = useThree((state) => state.camera);

  useCursor(isHovered.current);
  useVideoMaterial(videoHref, screenPlaceholder, group, "screen");
  useVideoMaterial(animationsHref, animationsPlaceholder, group, "animations");

  const nexRef = useRef<THREE.Mesh | null>(null);

  const scroll = useScroll();
  const lastOffset = useRef(scroll.offset);

  const actionOpen_1 = actions[OPEN_CLIP_1];
  const actionClose_1 = actions[CLOSE_CLIP_1];

  const actionOpen_2 = actions[OPEN_CLIP_2];
  const actionClose_2 = actions[CLOSE_CLIP_2];

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useEffect(() => {
    if (!group.current) return;
    // Вычисляем границы сцены
    sceneBounds.current.setFromObject(group.current);
  }, []);

  useEffect(() => {
    if (!actions) return;
    const loopAnimation = actions[LOOP_ANIMATION];
    loopAnimation?.play();
  }, [actions]);

  useEffect(() => {
    if (!group.current) return;
    const nexMesh = nexRef.current;

    if (nexMesh instanceof THREE.Mesh) {
      nexMeshRef.current = nexMesh;

      const glowMesh = new THREE.Mesh(nexMesh.geometry, glowMaterial);
      glowMesh.position.copy(nexMesh.position);
      glowMeshRef.current = glowMesh;

      // Проверяем, есть ли родительский объект
      if (nexMesh.parent) {
        nexMesh.parent.add(glowMesh);
      }
    }
  }, [glowMaterial]);

  useEffect(() => {
    if (!actionClose_2) return;

    actionClose_2.play();
    actionClose_2.loop = THREE.LoopOnce;
    actionClose_2.clampWhenFinished = true;
  }, [actionClose_2]);

  useFrame(() => {
    if (!sceneBounds.current) return;

    // Проверяем, находится ли камера внутри границ сцены
    isSceneActive.current = sceneBounds.current.containsPoint(camera.position);
  });

  useFrame((_, delta) => {
    if (!isSceneActive.current) return;

    const deltaOffset = scroll.offset - lastOffset.current;

    lastOffset.current = scroll.offset;

    if (!actionClose_1 || !actionOpen_1 || !actionOpen_2 || !actionClose_2)
      return;

    if (scroll.offset.toFixed(2) >= "0.29" && deltaOffset > 0) {
      actionOpen_1.stop();

      actionClose_1.play();
      actionClose_1.loop = THREE.LoopOnce;
      actionClose_1.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.28" && deltaOffset < 0) {
      actionClose_1.stop();

      actionOpen_1.play();
      actionOpen_1.loop = THREE.LoopOnce;
      actionOpen_1.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) >= "0.44" && deltaOffset > 0) {
      actionClose_2.stop();

      actionOpen_2.play();
      actionOpen_2.loop = THREE.LoopOnce;
      actionOpen_2.clampWhenFinished = true;
    }

    if (scroll.offset.toFixed(2) <= "0.43" && deltaOffset < 0) {
      actionOpen_2.stop();

      actionClose_2.play();
      actionClose_2.loop = THREE.LoopOnce;
      actionClose_2.clampWhenFinished = true;
    }

    mixer.update(delta);
  });

  // TODO: when the NEX design comes out, please uncomment this code and make edits if needed
  // useFrame((state) => {
  //   if (!glowMeshRef.current || !isSceneActive.current) return;

  //   const material = glowMeshRef.current.material;

  //   if (Array.isArray(material)) return; // Если массив, игнорируем

  //   const basicMaterial = material as THREE.MeshBasicMaterial;

  //   const time = state.clock.elapsedTime;
  //   const sinOpacity = Math.sin(time * 1.5) * 0.2 + 0.2;

  //   // Определяем целевую прозрачность и цвет в зависимости от состояния ховера
  //   if (isHovered.current) {
  //     basicMaterial.opacity = THREE.MathUtils.lerp(
  //       basicMaterial.opacity,
  //       INITIAL_OPACITY,
  //       0.1
  //     );
  //     basicMaterial.color = new THREE.Color(0xffd700);
  //   } else {
  //     // Без ховера: мерцание золотым цветом
  //     basicMaterial.opacity = THREE.MathUtils.lerp(
  //       basicMaterial.opacity,
  //       sinOpacity,
  //       0.1
  //     );

  //     const baseColor = new THREE.Color(0xffffcc); // Базовый золотой цвет
  //     // const pulseColor = baseColor
  //     //   .clone()
  //     //   .lerp(
  //     //     new THREE.Color(0xffffcc),
  //     //     (Math.sin(state.clock.elapsedTime * 1.5) + 1) / 2
  //     //   );
  //     basicMaterial.color = baseColor;
  //   }

  //   basicMaterial.transparent = true;
  //   basicMaterial.needsUpdate = true;

  //   return () => basicMaterial.dispose();
  // });

  // const toggleHovered = () => {
  //   if (!isHovered.current) {
  //     isHovered.current = true;
  //     document.body.style.cursor = "pointer";
  //   } else {
  //     isHovered.current = false;
  //     document.body.style.cursor = "default";
  //   }
  // };

  return (
    <group ref={group} dispose={null} position={[0, 0, 0]}>
      <group name="Scene">
        <group
          name="Empty"
          position={[5.028, 0.989, -7.211]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <group
            name="Armature"
            position={[0.095, 0.357, 0.022]}
            rotation={[0, 0, -2.093]}
            scale={0.131}
          >
            <primitive object={nodes.neck} />
            <primitive object={nodes.Bone002} />
            <skinnedMesh
              name="cat"
              geometry={(nodes.cat as THREE.Mesh).geometry}
              material={materials.all_colors}
              skeleton={(nodes.cat as THREE.SkinnedMesh).skeleton}
            />
          </group>
        </group>
        <mesh
          name="window_glass"
          geometry={(nodes.window_glass as THREE.Mesh).geometry}
          material={materials.glass}
        />
        <mesh
          name="staff"
          geometry={(nodes.staff as THREE.Mesh).geometry}
          material={materials.all_colors}
        />
        <mesh
          name="sealing"
          geometry={(nodes.sealing as THREE.Mesh).geometry}
          material={materials.all_colors}
          rotation={[-Math.PI, 0, 0]}
        />
        <mesh
          name="plant"
          geometry={(nodes.plant as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[5.067, 0.832, 7.15]}
          rotation={[-0.003, 0.158, 0.01]}
          scale={0.799}
        />
        <mesh
          name="plant001"
          geometry={(nodes.plant001 as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[-4.923, 0.832, -6.906]}
          rotation={[-3.138, -0.733, -3.13]}
          scale={0.897}
        />
        <mesh
          name="floor"
          geometry={(nodes.floor as THREE.Mesh).geometry}
          material={materials.all_colors}
        />
        <mesh
          ref={nexRef}
          name="nex"
          geometry={(nodes.nex as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[5.569, 0.973, 0.359]}
          rotation={[0, -0.174, 0]}
          // onPointerEnter={toggleHovered}
          // onPointerLeave={toggleHovered}
        />
        <mesh
          name="wall"
          geometry={(nodes.wall as THREE.Mesh).geometry}
          material={materials.all_colors}
        />
        <mesh
          name="lamp_base"
          geometry={(nodes.lamp_base as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[5.746, 2.624, 3.933]}
        />
        <mesh
          name="armchairs"
          geometry={(nodes.armchairs as THREE.Mesh).geometry}
          material={materials.all_colors}
          position={[4.741, 0, -3.964]}
          rotation={[0, 0.218, 0]}
          scale={1.318}
        />
        <mesh
          name="animations"
          geometry={(nodes.animations as THREE.Mesh).geometry}
          material={materials.animations}
        />
        <mesh
          name="shadows"
          geometry={(nodes.shadows as THREE.Mesh).geometry}
          material={materials.shadow}
          position={[4.51, 0.001, 3.804]}
          rotation={[0, -0.208, 0]}
        />
        <mesh
          name="screen"
          geometry={(nodes.screen as THREE.Mesh).geometry}
          material={materials.screen}
        />
        <mesh
          name="screen_glass"
          geometry={(nodes.screen_glass as THREE.Mesh).geometry}
          material={materials.glass}
        />
        <mesh
          name="door_1L"
          geometry={(nodes.door_1L as THREE.Mesh).geometry}
          material={materials["3rd_stage_doors"]}
          position={[-2.2, 1, -8.401]}
        />
        <mesh
          name="door_1R"
          geometry={(nodes.door_1R as THREE.Mesh).geometry}
          material={materials["3rd_stage_doors"]}
          position={[2.2, 1, -8.401]}
        />
        <mesh
          name="dr2_top"
          geometry={(nodes.dr2_top as THREE.Mesh).geometry}
          material={materials["3rd_stage_doors"]}
          position={[0, -0.016, 8.272]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh
          name="dr2_bot"
          geometry={(nodes.dr2_bot as THREE.Mesh).geometry}
          material={materials["3rd_stage_doors"]}
          position={[0, -0.016, 8.372]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
        <mesh
          name="dr2_mid"
          geometry={(nodes.dr2_mid as THREE.Mesh).geometry}
          material={materials["3rd_stage_doors"]}
          position={[0, -0.016, 8.322]}
          rotation={[-Math.PI / 2, 0, 0]}
        />
      </group>
    </group>
  );
};

useGLTF.preload(stage_3rd);
