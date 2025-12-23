import axios from "axios";
import CONST from "../app/constants.jsx";

const API = axios.create({
  baseURL: CONST.API_URL || CONST.API_BASE,
  timeout: CONST.API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

// Interceptor : ajouter token automatiquement
API.interceptors.request.use((config) => {
  const token = localStorage.getItem(ENV.JWT_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor : gérer les erreurs 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CONST.JWT_STORAGE_KEY);
      localStorage.removeItem(CONST.USER_STORAGE_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;