import { PerspectiveCamera } from "@react-three/drei";

import {
  CAMERA_NAME,
  FAR_PERSPECTIVE_CAMERA,
  NEAR_PERSPECTIVE_CAMERA,
} from "@/consts";

export const Camera = () => {
  return (
    <PerspectiveCamera
      makeDefault
      name={CAMERA_NAME}
      near={NEAR_PERSPECTIVE_CAMERA}
      far={FAR_PERSPECTIVE_CAMERA}
    />
  );
};
