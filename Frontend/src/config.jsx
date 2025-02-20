const backendUrl =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_URL_LOCAL
    : process.env.REACT_APP_BACKEND_URL_PROD;

export default backendUrl;
