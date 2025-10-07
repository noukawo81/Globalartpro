const express = require("express");
const router = express.Router();
const Replicate = require("replicate");
const axios = require("axios");
require("dotenv").config();

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

router.get("/test", (req, res) => {
  res.json({ message: "Backend OK" });
});

// Route de génération IA sans OpenAI
router.post("/generate", async (req, res) => {
  const { prompt, type } = req.body;

  try {
    if (type === "replicate-image") {
      // Génération d'image avec Replicate (Stable Diffusion)
      const output = await replicate.run(
        "stability-ai/stable-diffusion",
        { input: { prompt } }
      );
      res.json({ imageUrl: output[0] });
    } else if (type === "murf-tts") {
      // Génération voix avec Murf AI
      const murfRes = await axios.post(
        "https://api.murf.ai/v1/speech/generate",
        {
          text: prompt,
          voice: "en-US-WilliamNeural"
        },
        {
          headers: { "Authorization": `Bearer ${process.env.MURF_API_KEY}` }
        }
      );
      res.json({ audioUrl: murfRes.data.audio_url });
    } else if (type === "musique") {
      // Audio de test
      res.json({
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      });
    } else {
      res.status(400).json({ error: "Type de création non supporté." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;