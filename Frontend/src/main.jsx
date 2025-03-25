import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AlertState from "./context/alert/AlertState.jsx";
import AuthState from "./context/auth/AuthState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertState>
      <AuthState>
        <App />
      </AuthState>
    </AlertState>
  </StrictMode>
);
