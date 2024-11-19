import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const StarryBackground = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Генерация звёзд
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starsCount = 80000;
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      const distance = Math.random() * 1800 + 450; // Ограничиваем минимальную дистанцию
      const angle1 = Math.random() * Math.PI * 2; // Случайный угол
      const angle2 = Math.acos(Math.random() * 2 - 1); // Для равномерного распределения на сфере

      const x = distance * Math.sin(angle2) * Math.cos(angle1);
      const y = distance * Math.sin(angle2) * Math.sin(angle1);
      const z = distance * Math.cos(angle2);

      positions[i * 3] = x; // x
      positions[i * 3 + 1] = y; // y
      positions[i * 3 + 2] = z; // z
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // Текстура для звёзд с бело-голубым градиентом и четкими краями
  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, "rgba(173, 216, 230, 1)"); // Голубой переход
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
      size: 3.5, // Увеличенный размер для более заметных звёзд
      map: starTexture,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });
  }, [starTexture]);

  // Обновление анимации в useFrame
  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.00003; // Медленное вращение для эффекта погружения

      const material = pointsRef.current.material as THREE.PointsMaterial;

      // Мерцание через случайный шум
      const time = Date.now() * 0.0002;
      const flickerValue =
        0.7 + 0.05 * Math.sin(time + Math.random() * Math.PI); // Добавление рандомизации
      material.opacity = flickerValue; // Обновляем прозрачность
    }
  });

  return (
    <points ref={pointsRef} geometry={starsGeometry} material={starsMaterial} />
  );
};
