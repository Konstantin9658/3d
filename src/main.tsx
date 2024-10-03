import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import extension from "@theatre/r3f/dist/extension";
import studio from "@theatre/studio";

studio.extend(extension);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
