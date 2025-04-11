import React, {useCallback, useContext, useMemo} from "react";
import CategoryContext from "./CategoryContext";
import AlertContext from "../alert/AlertContext";
import backendUrl from "@/config";
import {handleApiError} from "@/utils/api";

const CategoryState = (props) => {
  const {showAlert} = useContext(AlertContext);
  const type = ["Income", "Expense"];
  const getTypes = useCallback(async () => {
    return type;
  }, []);

  //CREATE CATEGORY API CALL
  const createCategory = useCallback(
    async (formData, navigate) => {
      try {
        const {name, type} = formData;
        const response = await fetch(`${backendUrl}/api/category/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authToken: localStorage.getItem("authToken"),
          },
          body: JSON.stringify({name, type}),
        });
        const data = await response.json();
        if (!response.ok) {
          handleApiError(data, showAlert);
          return;
        }
        showAlert("Category added successfully", {
          variant: "success",
          duration: 2000,
        });
        navigate("/categories");
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  //UPDATE CATEGORY API CALL
  const updateCategory = useCallback(
    async (formData, categoryId, navigate) => {
      try {
        const {name} = formData;
        const response = await fetch(
          `${backendUrl}/api/category/update/${categoryId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              authToken: localStorage.getItem("authToken"),
            },
            body: JSON.stringify({name}),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          handleApiError(data, showAlert);
          return;
        }
        showAlert("Category updated successfully", {
          variant: "success",
          duration: 2000,
        });
        navigate("/categories");
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  //ARCHIVE CATEGORY API CALL
  const archiveCategory = useCallback(
    async (categoryId) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/category/archive/${categoryId}`,
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
          handleApiError(data, showAlert);
          return;
        }
        showAlert("Success", {
          variant: "success",
          duration: 2000,
        });
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  // GET CATEGORIES API CALL
  const getCategories = useCallback(
    async (archived) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/category/get?archived=${archived}`,
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
        return data.categories;
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  //GET SINGLE CATEGORY API CALL
  const getCategory = useCallback(
    async (categoryId) => {
      try {
        const response = await fetch(
          `${backendUrl}/api/category/get/${categoryId}`,
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
        return data.category;
      } catch (error) {
        showAlert(error.message, {
          variant: "danger",
        });
      }
    },
    [showAlert]
  );

  const contextValue = useMemo(
    () => ({
      createCategory,
      getTypes,
      getCategories,
      archiveCategory,
      getCategory,
      updateCategory,
    }),
    [
      createCategory,
      getTypes,
      getCategories,
      archiveCategory,
      getCategory,
      updateCategory,
    ]
  );

  return (
    <CategoryContext.Provider value={contextValue}>
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryState;
