import { RefObject, useEffect, useMemo, useRef } from "react";
import {
  FrontSide,
  Group,
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  VideoTexture,
} from "three";

import { useAppStore } from "@/store/app";

export const useVideoMaterial = (
  videoHref: string,
  imageHref: string,
  ref: RefObject<Group>,
  nodeMaterialName: string,
  additionalInstructions?: (mat: MeshStandardMaterial) => void
) => {
  const mat = useRef<MeshStandardMaterial | null>(null);

  const isVideoTexturesEnabled = useAppStore(
    (state) => state.isVideoTexturesEnabled
  );

  const videoHandle = useRef<HTMLVideoElement | null>(null);
  const texture = useMemo(() => {
    if (isVideoTexturesEnabled) {
      if (videoHandle.current) videoHandle.current.remove();
      const video = document.createElement("video");
      video.src = videoHref;
      video.loop = true;
      video.muted = true;
      video.play();
      videoHandle.current = video;
      return new VideoTexture(video);
    }

    return new TextureLoader().load(imageHref);
  }, [imageHref, isVideoTexturesEnabled, videoHref]);

  useEffect(() => {
    if (!ref.current) return;

    ref.current.traverse((node) => {
      if (node instanceof Mesh) {
        if (node.material instanceof MeshStandardMaterial) {
          if (node.material.name !== nodeMaterialName) return;

          node.material.toneMapped = false;
          node.material.side = FrontSide;
          node.material.map = texture;
          node.material.map.flipY = false;
          node.material.map.minFilter = LinearFilter;
          node.material.emissiveMap = texture;

          if (additionalInstructions) additionalInstructions(node.material);

          node.material.needsUpdate = true;

          mat.current = node.material;
        }
      }
    });

    return () => {
      mat.current?.dispose();
    };
  }, [
    ref,
    isVideoTexturesEnabled,
    nodeMaterialName,
    additionalInstructions,
    texture,
  ]);
};
