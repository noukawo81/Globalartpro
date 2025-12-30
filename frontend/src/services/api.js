import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "https://globalartpro-backend-production.up.railway.app/api/gapstudio";

// Existing API instance (kept for backward compatibility)
const API = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

// Root API instance pointing to /api root (used for chat and other generic endpoints)
const ROOT_BASE = import.meta.env.VITE_API_URL || '/api';
export const ROOT_API = axios.create({
  baseURL: ROOT_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

export const chat = {
  sendMessage: (payload) => ROOT_API.post('/chat/send', payload).then(r => r.data),
  getMessages: (userId, otherUserId) => ROOT_API.get('/chat/messages', { params: { userId, otherUserId } }).then(r => r.data),
  getConversations: (userId) => ROOT_API.get('/chat/conversations', { params: { userId } }).then(r => r.data),
};

export default API;