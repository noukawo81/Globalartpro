import axios from "axios";

// Configuration
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// Global response interceptor: handle network errors and 401 Unauthorized centrally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Network / connection error (no response from server)
    if (!err || !err.response) {
      console.error('API network error or server unreachable', err);
      alert("Impossible de contacter le serveur backend (http://localhost:3000).\nVérifiez qu'il est démarré: `cd backend && npm run dev`.");
      return Promise.reject(err);
    }
    const status = err?.response?.status;
    if (status === 401) {
      // Clear stored token and axios header
      try { localStorage.removeItem('ga_token'); } catch (e) {}
      try { delete API.defaults.headers.common['Authorization']; } catch (e) {}
      // Friendly prompt
      alert('Session expirée ou non autorisée (401). Veuillez vous reconnecter.');
    }
    return Promise.reject(err);
  }
);

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
  createListing: (payload) => API.post('/marketplace/list', payload).then(r => r.data),
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
  // Listings
  getMarketplaceListings: () => API.get('/marketplace/list').then(r => r.data),
  exhibitListing: (listingId) => API.post(`/marketplace/${listingId}/exhibit`).then(r => r.data),

  // ---- Portal Culture ----
  portalBuy: (userId, token = 'PI', amount = 0.00005) =>
    API.post('/portal/buy', { userId, token, amount }).then(r => r.data),
  // Share a media to the cultural portal feed
  shareToPortal: (payload) =>
    API.post('/portal/share', payload).then(r => r.data),
  getPortalPosts: () =>
    API.get('/portal/posts').then(r => r.data),

  getOrders: (userId) =>
    API.get("/marketplace/orders", { params: { userId } }).then((r) => r.data),

  // ---- GAPstudio ----
  generateArt: (prompt, module = "default") =>
    API.post("/gapstudio/generate", { prompt, module }).then((r) => r.data),

  getGenerationResult: (id) =>
    API.get(`/gapstudio/result/${id}`).then((r) => r.data),

  // ---- Museum (Galerie) ----
  getMuseum: (params = {}) =>
    API.get('/museum', { params }).then((r) => r.data),

  getMuseumItem: (id) =>
    API.get(`/museum/${id}`).then((r) => r.data),

  likeMuseumItem: (id) =>
    API.post(`/museum/${id}/like`).then((r) => r.data),

  commentMuseumItem: (id, content, parentId = null) =>
    API.post(`/museum/${id}/comment`, { content, parentId }).then((r) => r.data),

  exhibitMuseumItem: (id) =>
    API.post(`/museum/${id}/exhibit`).then((r) => r.data),

  // Admin
  adminGetMuseum: (params = {}) =>
    API.get('/museum/admin/list', { params }).then((r) => r.data),

  adminUpdateMuseumItem: (id, payload) =>
    API.put(`/museum/admin/${id}`, payload).then((r) => r.data),

  adminToggleVisibility: (id) =>
    API.post(`/museum/admin/${id}/toggle-visibility`).then((r) => r.data),

  adminArchiveItem: (id) =>
    API.post(`/museum/admin/${id}/archive`).then((r) => r.data),

  adminDeleteItem: (id) =>
    API.delete(`/museum/admin/${id}`).then((r) => r.data),

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