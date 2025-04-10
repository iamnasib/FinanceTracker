import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AlertState from "./context/alert/AlertState.jsx";
import AuthState from "./context/auth/AuthState";
import AccountState from "./context/account/AccountState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertState>
      <AccountState>
        <AuthState>
          <App />
        </AuthState>
      </AccountState>
    </AlertState>
  </StrictMode>
);
