import axios from "axios";

// URL utilisée au build via VITE_API_URL ; fallback vers ton backend déployé
const BASE =
  import.meta.env.VITE_API_URL ||
  "https://globalartpro-backend-production.up.railway.app/api/gapstudio";

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

export default API;