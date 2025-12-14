import ENV from '../../../config/env.js';
import { api as globalApi } from '@/services/api.js';

// Base API
const API_BASE = (import.meta.env.VITE_API_BASE || `${ENV.API_BASE_URL}/gapstudio`).replace(/\/$/, "");

// Simulated image fallback
const SIMULATED_IMAGE = "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=60";
const DEFAULT_TIMEOUT = 15000;

// ============ UTILS ============

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchWithTimeout(url, opts = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const token = globalApi.getToken();
    const headers = { ...(opts.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    const res = await fetch(url, { signal: controller.signal, ...opts, headers });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// ============ API METHODS ============

// Health check
async function ping() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/_health`, { method: "GET" }, 2500);
    return res.ok;
  } catch {
    return false;
  }
}

// Image generation (text → img)
async function generateImage(payload = {}) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(`Backend error: ${res.status} ${text || res.statusText}`);
    }

    const data = await res.json();

    if (data?.url) return data;
    if (data?.images?.[0]) return { url: data.images[0], raw: data };

    return { url: data?.image || null, raw: data };
  } catch (err) {
    console.warn("generateImage fallback:", err.message || err);
    await delay(900);
    return { url: SIMULATED_IMAGE, message: "Réponse simulée (mode local)." };
  }
}

// Image generation + file upload
async function generateImageWithFile(formData) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/generate-image`, {
      method: "POST",
      body: formData,
    }, DEFAULT_TIMEOUT + 5000);

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(`Backend error: ${res.status} ${text || res.statusText}`);
    }

    const data = await res.json();
    if (data?.url) return data;
    if (data?.images?.[0]) return { url: data.images[0], raw: data };

    return { url: data?.image || null, raw: data };
  } catch (err) {
    console.warn("generateImageWithFile fallback:", err.message || err);
    await delay(1200);
    return { url: SIMULATED_IMAGE, message: "Réponse simulée (mode local)." };
  }
}

// Feature transform (upscale, style, etc.)
async function applyFeature(payload = {}) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/apply-feature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => null);
      throw new Error(`Backend error: ${res.status} ${text || res.statusText}`);
    }

    const data = await res.json();
    if (data?.url) return data;
    return { url: data?.image || data?.url || null, raw: data };
  } catch (err) {
    console.warn("applyFeature fallback:", err.message || err);
    await delay(800);
    return { url: payload.imageUrl || SIMULATED_IMAGE, message: "Simulation: feature non disponible." };
  }
}

// Mint NFT
async function mintNFT(image, title) {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/mint-nft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image, title }),
    });

    if (!res.ok) throw new Error(`Mint error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("mintNFT error:", err.message);
    return { tx: `tx-sim-${Date.now()}`, nftId: `nft-${Date.now()}`, title, image };
  }
}

// Export object
export const gapstudioAPI = {
  API_BASE,
  ping,
  generateImage,
  generateImageWithFile,
  applyFeature,
  mintNFT,
};

// Default export (pour rétro-compatibilité)
export default gapstudioAPI;