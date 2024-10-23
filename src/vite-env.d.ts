/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.glb" {
  const path: string;
  export default path;
}

declare module "*.hdr" {
  const path: string;
  export default path;
}

declare module "*.gltf" {
  const path: string;
  export default path;
}
