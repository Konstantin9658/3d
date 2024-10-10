/// <reference types="vite/client" />

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
