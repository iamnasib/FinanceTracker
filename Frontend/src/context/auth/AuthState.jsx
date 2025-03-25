import React, {useCallback, useContext} from "react";
import AuthContext from "./authContext";
import backendUrl from "../../config";
import AlertContext from "../alert/AlertContext";

const AuthState = (props) => {
  const {showAlert} = useContext(AlertContext);
  //Function to signup the user
  const signup = useCallback(async (formData) => {
    try {
      const {email, password, name} = formData;
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, password}),
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
      //store the authToken of the user
      localStorage.setItem("authToken", data.authToken);
      showAlert("Account Created Succesfully", {
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      showAlert(error.message, {
        variant: "danger",
      });
    }
  });

  //Function to check if the user is authenticated
  const isAuthenticated = useCallback(async () => {
    try {
      if (!localStorage.getItem("authToken")) {
        return false;
      }
      const response = await fetch(`${backendUrl}/api/auth/get-user`, {
        method: "GET",
        headers: {
          authToken: localStorage.getItem("authToken"),
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  });

  return (
    <AuthContext.Provider value={{isAuthenticated, signup}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
