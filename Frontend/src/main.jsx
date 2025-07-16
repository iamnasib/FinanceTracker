import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AlertState from "./context/alert/AlertState.jsx";
import AuthState from "./context/auth/AuthState";
import AccountState from "./context/account/AccountState";
import CategoryState from "./context/category/CategoryState";
import TransactionState from "./context/transaction/TransactionState";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AlertState>
      <AuthState>
        <AccountState>
          <CategoryState>
            <TransactionState>
              <App />
            </TransactionState>
          </CategoryState>
        </AccountState>
      </AuthState>
    </AlertState>
  </StrictMode>
);
