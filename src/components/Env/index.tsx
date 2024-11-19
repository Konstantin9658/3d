import { Environment } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

import env from "@/assets/hdr/kloofendal_28d_misty_1k.hdr";
import { useAppStore } from "@/store/app";

const useStableEnvRotation = () => {
  const envRotation = useAppStore((state) => state.envRotation);
  const prevRotation = useRef(envRotation);

  const [stableRotation, setStableRotation] = useState(envRotation);

  useEffect(() => {
    if (
      envRotation.x !== prevRotation.current.x ||
      envRotation.y !== prevRotation.current.y ||
      envRotation.z !== prevRotation.current.z
    ) {
      setStableRotation(envRotation);
      prevRotation.current = envRotation;
    }
  }, [envRotation]);

  return stableRotation;
};

export const Env = () => {
  const envRotation = useStableEnvRotation();

  return (
    <Environment
      files={env}
      environmentIntensity={2.2}
      environmentRotation={[envRotation.x, envRotation.y, envRotation.z]}
    />
  );
};
