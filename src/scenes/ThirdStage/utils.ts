import * as THREE from "three";

export const handleActionDoor = (action: THREE.AnimationAction) => {
  action.reset().play();
  action.loop = THREE.LoopOnce;
  action.clampWhenFinished = true;
};
