import "./App.css";

// import classes from "./styles.module.scss";
import { Canvas, useFrame } from "@react-three/fiber";
import { LenisRef, ReactLenis } from "lenis/react";
// import { Leva, useControls } from "leva";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import { Camera } from "./components/Camera";
import { Effects } from "./components/Effects";
import { Env } from "./components/Env";
import { Header } from "./components/Header";
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

// const StarryBackground = () => {
//   const pointsRef = useRef<THREE.Points>(null);

//   // Генерация звёзд
//   const starsGeometry = useMemo(() => {
//     const geometry = new THREE.BufferGeometry();
//     const starsCount = 80000;
//     const positions = new Float32Array(starsCount * 3);

//     for (let i = 0; i < starsCount * 3; i += 3) {
//       const distance = Math.random() * 2000 - 1000;
//       positions[i] = Math.cos(Math.random() * Math.PI * 2) * distance; // x
//       positions[i + 1] = (Math.random() - 0.5) * 2000; // y
//       positions[i + 2] = Math.sin(Math.random() * Math.PI * 2) * distance; // z
//     }

//     geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     return geometry;
//   }, []);

//   // Текстура для звёзд с бело-голубым градиентом и четкими краями
//   const starTexture = useMemo(() => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 128;
//     canvas.height = 128;
//     const ctx = canvas.getContext("2d");

//     if (ctx) {
//       const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
//       gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Яркий белый центр
//       gradient.addColorStop(0.3, "rgba(173, 216, 230, 0.8)"); // Голубой переход
//       gradient.addColorStop(0.6, "rgba(0, 0, 255, 0.5)"); // Прозрачный синий
//       gradient.addColorStop(0.8, "rgba(0, 0, 0, 0.2)"); // Тёмный переход
//       gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Полностью прозрачный край
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, 128, 128);
//     }

//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;
//     return texture;
//   }, []);

//   // Материал звёзд
//   const starsMaterial = useMemo(() => {
//     return new THREE.PointsMaterial({
//       size: 3.5, // Увеличенный размер для более заметных звёзд
//       map: starTexture,
//       sizeAttenuation: true,
//       transparent: true,
//       opacity: 0.9,
//     });
//   }, [starTexture]);

//   // Обновление анимации в useFrame
//   useFrame(() => {
//     if (pointsRef.current) {
//       pointsRef.current.rotation.y += 0.00003; // Медленное вращение для эффекта погружения

//       const material = pointsRef.current.material as THREE.PointsMaterial;

//       // Мерцание через случайный шум
//       const time = Date.now() * 0.0002;
//       const flickerValue = 0.7 + 0.05 * Math.sin(time + Math.random() * Math.PI); // Добавление рандомизации
//       material.opacity = flickerValue; // Обновляем прозрачность
//     }
//   });

//   return (
//     <points ref={pointsRef} geometry={starsGeometry} material={starsMaterial} />
//   );
// };

const StarryBackground = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Генерация звёзд
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starsCount = 80000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3); // Для хранения RGB цветов
    const flickerOffsets = new Float32Array(starsCount); // Для индивидуального мерцания

    for (let i = 0; i < starsCount; i++) {
      const distance = Math.random() * 1800 + 200; // Ограничиваем минимальную дистанцию (от 200 до 2000)
      const angle1 = Math.random() * Math.PI * 2; // Случайный угол
      const angle2 = Math.acos(Math.random() * 2 - 1); // Для равномерного распределения на сфере

      const x = distance * Math.sin(angle2) * Math.cos(angle1);
      const y = distance * Math.sin(angle2) * Math.sin(angle1);
      const z = distance * Math.cos(angle2);

      positions[i * 3] = x; // x
      positions[i * 3 + 1] = y; // y
      positions[i * 3 + 2] = z; // z

      // Случайные цвета звезд: красный, зеленый, синий, желтоватый, белый
      colors[i * 3] = Math.random() * 0.6 + 0.4; // R (от 0.4 до 1)
      colors[i * 3 + 1] = Math.random() * 0.6 + 0.4; // G (от 0.4 до 1)
      colors[i * 3 + 2] = Math.random() * 0.6 + 0.4; // B (от 0.4 до 1)

      // Уникальный сдвиг фазы для мерцания
      flickerOffsets[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3)); // Добавляем цвета
    geometry.setAttribute(
      "flickerOffset",
      new THREE.BufferAttribute(flickerOffsets, 1)
    ); // Добавляем индивидуальные смещения для мерцания

    return geometry;
  }, []);

  // Создание текстуры для круглой формы звёзд
  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, 128, 128); // Фон черный (прозрачность зависит от alpha)

      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Белый центр
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // Прозрачный край
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Материал звёзд
  const starsMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 3, // Размер звёзд
      map: starTexture, // Используем текстуру для круглой формы
      vertexColors: true, // Цвета из геометрии
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });
  }, [starTexture]);

  // Анимация мерцания и вращения
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00001; // Медленное вращение для эффекта погружения

      // const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const flickerOffsets = pointsRef.current.geometry.attributes.flickerOffset
        .array as Float32Array;

      const time = Date.now() * 0.002;
      for (let i = 0; i < flickerOffsets.length; i++) {
        const flickerValue = 0.8 + 0.2 * Math.sin(time + flickerOffsets[i]);
        const material = pointsRef.current.material as THREE.PointsMaterial;
        material.opacity = flickerValue; // Обновляем прозрачность индивидуально
      }
    }
  });

  return (
    <points ref={pointsRef} geometry={starsGeometry} material={starsMaterial} />
  );
};

function App() {
  const lenisRef = useRef<LenisRef | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

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
            height: `${window.innerHeight * 50}px`,
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
        {/* <Leva collapsed /> */}
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
          </Suspense>
        </Canvas>
      </ReactLenis>
    </>
  );
}

export default App;
