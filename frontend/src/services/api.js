import axios from "axios";

// Configuration
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// ============ API Object ============
export const api = {
  // ---- Auth ----
  register: (name, email, password, role = "visitor") =>
    API.post("/auth/register", { name, email, password, role }).then((r) => r.data),

  login: (email, password) =>
    API.post("/auth/login", { email, password }).then((r) => r.data),

  // ---- Token Helpers ----
  setToken: (token) => {
    if (token) {
      localStorage.setItem("ga_token", token);
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("ga_token");
      delete API.defaults.headers.common['Authorization'];
    }
  },
  getToken: () => localStorage.getItem("ga_token"),
  clearToken: () => {
    localStorage.removeItem("ga_token");
    delete API.defaults.headers.common['Authorization'];
  },

  // ---- Artists / Artworks ----
  getArtists: () => API.get("/artists").then((r) => r.data),
  getArtist: (id) => API.get(`/artists/${id}`).then((r) => r.data),
  updateArtist: (id, payload) => API.put(`/artists/${id}`, payload).then((r) => r.data),
  uploadArtistMedia: (id, formData) => API.post(`/artists/${id}/media`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  generateInvite: (id) => API.post(`/artists/${id}/invite`).then((r) => r.data),
  getArtworks: () => API.get("/artworks").then((r) => r.data),

  // ---- ARTC (Mining & Token) ----
  getARTCBalance: (userId) => 
    API.get("/artc/balance", { params: { userId } }).then((r) => r.data),

  mineARTC: (userId) => 
    API.post("/artc/mine", { userId }).then((r) => r.data),

  transferARTC: (fromUserId, toUserId, amount) => 
    API.post("/artc/transfer", { fromUserId, toUserId, amount }).then((r) => r.data),

  getARTCTransactions: (userId) => 
    API.get("/artc/transactions", { params: { userId } }).then((r) => r.data),

  // Mining session helpers
  startMiningSession: (userId, durationMs = 24 * 60 * 60 * 1000) =>
    API.post("/artc/start", { userId, durationMs }).then((r) => r.data),

  getMiningStatus: (userId) =>
    API.get("/artc/status", { params: { userId } }).then((r) => r.data),

  claimMining: (userId) =>
    API.post("/artc/claim", { userId }).then((r) => r.data),

  // ---- Donations ----
  createDonation: (amount, currency = "pi") =>
    API.post("/donations/create", { amount, currency }).then((r) => r.data),

  // ---- Marketplace ----
  buyArtwork: (artworkId, paymentMethod) =>
    API.post("/marketplace/buy", { artworkId, paymentMethod }).then((r) => r.data),
  marketplaceBuy: (buyerId, sellerId, productId, amount, token = 'ARTC') =>
    API.post('/marketplace/buy', { userId: buyerId, sellerId, productId, amount, token }).then(r => r.data),

  // ---- Portal Culture ----
  portalBuy: (userId, token = 'PI', amount = 0.00005) =>
    API.post('/portal/buy', { userId, token, amount }).then(r => r.data),

  getOrders: (userId) =>
    API.get("/marketplace/orders", { params: { userId } }).then((r) => r.data),

  // ---- GAPstudio ----
  generateArt: (prompt, module = "default") =>
    API.post("/gapstudio/generate", { prompt, module }).then((r) => r.data),

  getGenerationResult: (id) =>
    API.get(`/gapstudio/result/${id}`).then((r) => r.data),

  // ---- Certificates ----
  generateCertificate: (holderName, certLevel) =>
    API.post("/certificates/generate", { holderName, certLevel }).then((r) => r.data),

  verifyCertificate: (certId) =>
    API.get(`/certificates/verify/${certId}`).then((r) => r.data),
};

// ============ Helper Functions ============
export const fetchWithAuth = (url, options = {}) => {
  const token = api.getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
    },
  });
};

export default API;