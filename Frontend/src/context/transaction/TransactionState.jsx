import React, {useCallback, useContext} from "react";
import TransactionContext from "./TransactionContext";
import AlertContext from "../alert/AlertContext";
import backendUrl from "@/config";
import {handleApiError} from "@/utils/api";

const TransactionState = (props) => {
  const {showAlert} = useContext(AlertContext);
  const transactionTypes = ["Income", "Expense", "Transfer"];
  const getTransactionTypes = useCallback(async () => {
    return transactionTypes;
  }, []);

  //CREATE TRANSACTION
  const saveTransaction = useCallback(
    async (formData, navigate) => {
      try {
        const response = await fetch(`${backendUrl}/api/transaction/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authToken: localStorage.getItem("authToken"),
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
          handleApiError(data, showAlert);
          return;
        }
        showAlert(data.success, {
          variant: "success",
          duration: 1500,
        });
        navigate("/transactions");
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );
  //UPDATE
  const updateTransaction = useCallback(
    async (formData, transactionId, navigate) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/transaction/update/${transactionId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authToken: localStorage.getItem("authToken"),
            },
            body: JSON.stringify(formData),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          handleApiError(data, showAlert);
          return;
        }
        showAlert(data.success, {
          variant: "success",
          duration: 1500,
        });
        navigate("/transactions");
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  const getTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/transaction/get`, {
        method: "GET",
        headers: {
          authToken: localStorage.getItem("authToken"),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        handleApiError(data, showAlert);
        return;
      }
      return data.transactions;
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  }, [showAlert]);
  const getTransaction = useCallback(
    async (transactionId) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/transaction/get/${transactionId}`,
          {
            method: "GET",
            headers: {
              authToken: localStorage.getItem("authToken"),
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          handleApiError(data, showAlert);
          return;
        }
        return data.transaction;
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  const deleteTransaction = useCallback(async (transactionId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/transaction/delete/${transactionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authToken: localStorage.getItem("authToken"),
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        handleApiError(data, showAlert);
        return;
      }
      showAlert(data.success, {
        variant: "success",
        duration: 1500,
      });
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });

  return (
    <TransactionContext.Provider
      value={{
        getTransactionTypes,
        getTransactions,
        saveTransaction,
        updateTransaction,
        getTransaction,
        deleteTransaction,
      }}>
      {props.children}
    </TransactionContext.Provider>
  );
};

export default TransactionState;
