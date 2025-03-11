import React, {useContext} from "react";
import AuthContext from "./authContext";
import backendUrl from "../../config";

const AuthState = (props) => {
  //Function to signup the user
  const signup = async () => {
    try {
    } catch (error) {}
  };

  //Function to check if the user is authenticated
  const isAuthenticated = async () => {
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
      return;
    }
  };

  return (
    <AuthContext.Provider value={"Ss"}>{props.children}</AuthContext.Provider>
  );
};

export default AuthState;
