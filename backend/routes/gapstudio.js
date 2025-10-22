import express from "express";
import Replicate from "replicate";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Route racine : test API
router.get("/", (req, res) => {
  res.send("🚀 API GAP Studio est connectée et opérationnelle !");
});

router.get("/test", (req, res) => {
  res.json({ message: "Backend OK" });
});

// Route de génération IA
router.post("/generate", async (req, res) => {
  const { prompt, type } = req.body || {};

  try {
    if (type === "replicate-image") {
      if (!process.env.REPLICATE_API_TOKEN) {
        return res.status(500).json({
          error: "REPLICATE_API_TOKEN manquant sur le serveur. Ajoute-le dans backend/.env et redémarre le serveur."
        });
      }

      const output = await replicate.run(
        "stability-ai/stable-diffusion",
        { input: { prompt } }
      );

      // output peut être un tableau selon le modèle
      const imageUrl = Array.isArray(output) ? output[0] : output;
      return res.json({ imageUrl });
    }

    else if (type === "murf-tts") {
      if (!process.env.MURF_API_KEY) {
        // Fallback : audio de test si pas de clé Murf
        return res.json({
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          warning: "MURF_API_KEY non fournie — audio de test renvoyé."
        });
      }

      const murfRes = await axios.post(
        "https://api.murf.ai/v1/speech/generate",
        { text: prompt, voice: "en-US-WilliamNeural" },
        { headers: { "Authorization": `Bearer ${process.env.MURF_API_KEY}` } }
      );

      return res.json({ audioUrl: murfRes.data.audio_url });
    }

    else if (type === "musique") {
      return res.json({
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      });
    }

    else {
      return res.status(400).json({ error: "Type de création non supporté." });
    }
  } catch (error) {
    console.error("Erreur /generate :", error);
    return res.status(500).json({ error: error.message });
  }
});

// Route de paiement Pi (simulation)
router.post("/pi-payment", async (req, res) => {
  try {
    const { amount, userWallet, itemName } = req.body;

    if (!amount || !userWallet || !itemName) {
      return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    const transaction = {
      from: userWallet,
      to: process.env.PI_APP_WALLET || null,
      amount,
      itemName,
      status: "pending",
      date: new Date()
    };

    console.log("💰 Nouvelle transaction Pi :", transaction);

    return res.json({
      success: true,
      message: "Paiement Pi en cours...",
      transaction
    });
  } catch (error) {
    console.error("Erreur de paiement :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;
