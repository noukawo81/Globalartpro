import express from "express";
import Replicate from "replicate";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// support noms alternatifs dans .env
process.env.REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API;
process.env.MURF_API_KEY = process.env.MURF_API_KEY || process.env.MURF_API;
process.env.PI_APP_WALLET = process.env.PI_APP_WALLET || process.env.PI_APP;

const router = express.Router();
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN || null;
const REPLICATE_MODEL = process.env.REPLICATE_MODEL || "stability-ai/stable-diffusion";
const replicate = REPLICATE_TOKEN ? new Replicate({ auth: REPLICATE_TOKEN }) : null;

console.log("REPLICATE_TOKEN present:", !!REPLICATE_TOKEN);

// Route racine
router.get("/", (req, res) => {
  res.send("🚀 API GAP Studio est connectée et opérationnelle !");
});

// Endpoint de debug pour vérifier le token Replicate
router.get("/replicate-test", async (req, res) => {
  if (!REPLICATE_TOKEN) {
    return res.status(500).json({ ok: false, message: "REPLICATE_API_TOKEN manquant." });
  }
  try {
    const r = await axios.get("https://api.replicate.com/v1/models", {
      headers: { Authorization: `Token ${REPLICATE_TOKEN}` },
    });
    return res.json({ ok: true, note: "Token valide (liste des modèles récupérée).", modelsCount: Array.isArray(r.data) ? r.data.length : "unknown" });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Échec test Replicate", details: err.response?.data || err.message });
  }
});

// Route de génération IA (images, audio, etc.)
router.post("/generate", async (req, res) => {
  const { prompt, type } = req.body || {};

  try {
    if (!prompt) return res.status(400).json({ success: false, message: "Champ 'prompt' requis." });

    // --- Génération d'image via Replicate ---
    if (type === "replicate-image") {
      if (!REPLICATE_TOKEN || !replicate) {
        return res.status(500).json({
          success: false,
          message: "REPLICATE_API_TOKEN manquant côté serveur. Ajoute-le dans backend/.env et redémarre le serveur.",
        });
      }

      try {
        const output = await replicate.run(REPLICATE_MODEL, {
          input: { prompt, width: 1024, height: 1024 },
        });

        const imageUrl = Array.isArray(output) ? output[0] : output;
        return res.json({ success: true, type, imageUrl, message: "Image générée avec succès 🎨" });
      } catch (err) {
        console.error("❌ Erreur Replicate:", err.response?.data || err.message);
        return res.status(500).json({
          success: false,
          message: "Erreur lors de l'appel à Replicate.",
          details: err.response?.data || err.message,
        });
      }
    }

    // --- Synthèse vocale (Murf AI) ---
    else if (type === "murf-tts") {
      if (!process.env.MURF_API_KEY) {
        return res.json({
          success: true,
          type,
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          warning: "MURF_API_KEY non fournie — audio de test renvoyé.",
        });
      }

      try {
        const murfRes = await axios.post(
          "https://api.murf.ai/v1/speech/generate",
          { text: prompt, voice: "en-US-WilliamNeural" },
          { headers: { Authorization: `Bearer ${process.env.MURF_API_KEY}` } }
        );
        return res.json({ success: true, type, audioUrl: murfRes.data.audio_url, message: "Audio généré avec succès 🎧" });
      } catch (err) {
        console.error("❌ Erreur Murf:", err.response?.data || err.message);
        return res.status(500).json({ success: false, message: "Erreur Murf", details: err.response?.data || err.message });
      }
    }

    // --- Musique par défaut ---
    else if (type === "musique") {
      return res.json({
        success: true,
        type,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        message: "Musique générée avec succès 🎵",
      });
    }

    // --- Type non reconnu ---
    else {
      return res.status(400).json({ success: false, message: "Type de génération non supporté." });
    }
  } catch (error) {
    console.error("❌ Erreur complète /generate :", error);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la génération.",
      details: error.response?.data || error.message,
    });
  }
});

export default router;