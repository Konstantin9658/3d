import { Environment } from "@react-three/drei";

import env from "@/assets/hdr/kloofendal_28d_misty_1k.hdr";
import { useAppStore } from "@/store/app";

export const Env = () => {
  const envRotation = useAppStore((state) => state.envRotation);

  return (
    <Environment
      files={env}
      environmentIntensity={2.2}
      environmentRotation={[envRotation.x, envRotation.y, envRotation.z]}
    />
  );
};
