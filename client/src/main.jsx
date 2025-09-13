import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Web3AuthContextProvider } from "./context/Web3AuthContext.jsx";

import { Buffer } from "buffer";
if (!window.Buffer) {
  window.Buffer = Buffer;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Web3AuthContextProvider>
      <App />
    </Web3AuthContextProvider>
  </StrictMode>
);
