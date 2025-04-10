import React, {useCallback, useContext} from "react";
import AlertContext from "../alert/AlertContext";
import backendUrl from "@/config";
import AccountContext from "./AccountContext";

const AccountState = (props) => {
  const {showAlert} = useContext(AlertContext);
  const type = ["Cash", "Bank", "Credit Card", "Digital Wallet"];
  const getTypes = useCallback(async () => {
    return type;
  });
  const createAccount = useCallback(async (formData) => {
    try {
      const {name, type, balance = 0} = formData;
      const response = await fetch(`${backendUrl}/api/account/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: localStorage.getItem("authToken"),
        },
        body: JSON.stringify({name, type, balance: parseFloat(balance)}),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          data.errors.map((err) => {
            showAlert(err.errors.msg, {
              variant: "danger",
            });
          });
        } else {
          showAlert(data.error, {
            variant: "danger",
          });
        }
        return;
      }
      showAlert("Account added succesfully", {
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });

  const updateAccount = useCallback(async (formData, accountId, navigate) => {
    try {
      const {name, type, balance} = formData;
      console.log("Update response:", balance);
      const response = await fetch(
        `${backendUrl}/api/account/update/${accountId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authToken: localStorage.getItem("authToken"),
          },
          body: JSON.stringify({name, type, balance: parseFloat(balance)}),
        }
      );
      const data = await response.json();
      console.log("Update response:", data);
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          data.errors.map((err) => {
            showAlert(err.errors.msg, {
              variant: "danger",
            });
          });
        } else {
          showAlert(data.error, {
            variant: "danger",
          });
        }
        return;
      }
      showAlert("Account updated succesfully", {
        variant: "success",
        duration: 2000,
      });
      navigate("/accounts");
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });

  const archiveAccount = useCallback(async (accountId, navigate) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/account/archive/${accountId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authToken: localStorage.getItem("authToken"),
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          data.errors.map((err) => {
            showAlert(err.errors.msg, {
              variant: "danger",
            });
          });
        } else {
          showAlert(data.error, {
            variant: "danger",
          });
        }
        return;
      }
      showAlert("Success", {
        variant: "success",
        duration: 2000,
      });
      navigate("/accounts");
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });

  const getAccount = useCallback(async (accountId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/account/get/${accountId}`,
        {
          method: "GET",
          headers: {authToken: localStorage.getItem("authToken")},
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          data.errors.map((err) => {
            showAlert(err.errors.msg, {
              variant: "danger",
            });
          });
        } else {
          showAlert(data.error, {
            variant: "danger",
          });
        }
        return;
      }
      return data.account;
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });
  const getAccounts = useCallback(async (archived) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/account/get?archived=${archived}`,
        {
          method: "GET",
          headers: {authToken: localStorage.getItem("authToken")},
        }
      );

      const data = await response.json();
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          data.errors.map((err) => {
            showAlert(err.errors.msg, {
              variant: "danger",
            });
          });
        } else {
          showAlert(data.error, {
            variant: "danger",
          });
        }
        return;
      }
      return data.accounts;
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });
  return (
    <AccountContext.Provider
      value={{
        createAccount,
        getTypes,
        getAccount,
        updateAccount,
        getAccounts,
        archiveAccount,
      }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export default AccountState;
