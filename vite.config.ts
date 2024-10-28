import eslintPlugin from "@nabla/vite-plugin-eslint";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import dns from "dns";
import path from "path";
import postcssLogical from "postcss-logical";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.glb", "**/*.gltf", "**/*.hdr"],
  server: {
    host: "localhost",
    port: 3000,
  },
  plugins: [react(), svgr(), eslintPlugin()],
  esbuild: { jsx: "automatic" },
  build: {
    sourcemap: process.env.NODE_ENV === "production" ? false : true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer, postcssLogical],
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
});
