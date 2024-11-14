import * as THREE from "three";

export const playAction = (action: THREE.AnimationAction) => {
  action.reset().play();
  action.loop = THREE.LoopOnce;
  action.clampWhenFinished = true;
};
