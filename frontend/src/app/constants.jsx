// frontend/src/app/Constants.jsx

const ENV = {
  // API
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  API_BASE: import.meta.env.VITE_API_BASE || "/api/gapstudio",

  // Auth
  JWT_STORAGE_KEY: "ga_token",
  USER_STORAGE_KEY: "ga_user",

  // Features
  ENABLE_MINING: true,
  ENABLE_DONATIONS: true,
  PI_NETWORK_ENABLED: import.meta.env.VITE_PI_ENABLED === "true",

  // Security
  API_TIMEOUT: 60 * 1000,                 // 60 seconds
  SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7 days
};

Object.freeze(ENV);
export default ENV;