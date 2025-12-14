// backend/routes/generateRoute.js
import express from "express";
import Replicate from "replicate";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Helper: image fallback (public sample)
const FALLBACK_IMAGE = "https://via.placeholder.com/1024x1024.png?text=GAPstudio+placeholder";

router.post("/generate", async (req, res) => {
  try {
    const { prompt, type } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt manquant." });

    // Si user demande image via replicate
    if (type === "replicate-image") {
      try {
        const output = await replicate.run(
          // tentative d'appel : si ton token/mode ne marche pas, on catchera l'erreur
          "black-forest-labs/flux-schnell",
          { input: { prompt, width: 1024, height: 1024 } }
        );

        const imageUrl = Array.isArray(output) ? output[0] : output;
        if (!imageUrl) throw new Error("Aucune URL retournée par Replicate");
        return res.json({ success: true, type, imageUrl });
      } catch (repErr) {
        console.error("Replicate error:", repErr?.response?.data || repErr.message || repErr);
        // fallback : renvoyer une image de secours + indiquer l'erreur (pour debug)
        return res.status(200).json({
          success: false,
          message: "Replicate a échoué — image de secours renvoyée.",
          details: repErr?.response?.data || repErr.message || String(repErr),
          imageUrl: FALLBACK_IMAGE,
        });
      }
    }

    // Murf TTS -> proxy (simplifié)
    if (type === "murf-tts") {
      if (!process.env.MURF_API_KEY) {
        return res.status(500).json({ success: false, message: "MURF_API_KEY manquante" });
      }
      // Exemple générique — adapte à ta doc Murf si nécessaire
      const murfRes = await axios.post(
        "https://api.murf.ai/v1/speech/generate",
        { text: prompt, voice: "en-US-WilliamNeural" },
        { headers: { Authorization: `Bearer ${process.env.MURF_API_KEY}` }, responseType: "json" }
      );
      return res.json({ success: true, type, audioUrl: murfRes.data.audio_url });
    }

    // musique demo
    if (type === "musique") {
      return res.json({
        success: true,
        type,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      });
    }

    return res.status(400).json({ success: false, message: "Type non supporté" });
  } catch (err) {
    console.error("/generate error:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur", details: err.message || err });
  }
});

export default router;