import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Styles globaux
import "../index.css";

// App centralisée
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);