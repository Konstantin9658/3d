import { useGLTF } from "@react-three/drei";
import stage_2nd from "@/assets/models/2nd_stage.glb";

import { useMemo } from "react";
import { motion } from "framer-motion";

export const AnimatedText = ({ text }: { text: string }) => {
  const animationOrder = useMemo(() => {
    const indices = Array.from({ length: text.length }, (_, i) => i);
    const shuffledIndices = indices
      .map((index) => ({ index, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ index }) => index);

    return shuffledIndices;
  }, [text]);

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        position: "absolute",
        top: "10%",
        left: "10%",
        zIndex: 10,
      }}
    >
      {text.split("").map((letter: string, index: number) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: animationOrder.indexOf(index) * 0.2,
            duration: 0.5,
          }}
          style={{ display: "inline-block", fontSize: 50 }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};

export const SecondStage = () => {
  const { scene } = useGLTF(stage_2nd);

  return (
    <group>
      {/* <HtmlContent
        style={{ zIndex: 10000000, position: "absolute" }}
        center
        position={[0, 0, -1]}
      >
        <AnimatedText text="WHAT WE DO" />
      </HtmlContent> */}
      <primitive object={scene} position={[0, 0, -25]} />
    </group>
  );
};
