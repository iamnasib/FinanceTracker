const backendUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL_LOCAL
    : import.meta.env.VITE_BACKEND_URL_PROD;

export default backendUrl;
