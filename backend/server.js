import express from "express";
import Replicate from "replicate";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

// --- Routes GAP Studio ---
const router = express.Router();
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

router.get("/", (req, res) => {
  res.send("🚀 API GAP Studio est connectée et opérationnelle !");
});

router.get("/test", (req, res) => {
  res.json({ message: "Backend OK" });
});

router.post("/generate", async (req, res) => {
  const { prompt, type } = req.body;
  try {
    if (type === "replicate-image") {
      const output = await replicate.run(
        "stability-ai/stable-diffusion",
        { input: { prompt } }
      );
      res.json({ imageUrl: output[0] });
    } else if (type === "murf-tts") {
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

router.post("/pi-payment", async (req, res) => {
  try {
    const { amount, userWallet, itemName } = req.body;
    if (!amount || !userWallet || !itemName) {
      return res.status(400).json({ success: false, message: "Champs manquants" });
    }
    const transaction = {
      from: userWallet,
      to: process.env.PI_APP_WALLET,
      amount,
      itemName,
      status: "pending",
      date: new Date(),
    };
    console.log("💰 Nouvelle transaction Pi :", transaction);
    res.json({
      success: true,
      message: "Paiement Pi en cours...",
      transaction,
    });
  } catch (error) {
    console.error("Erreur de paiement :", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// --- Utilisation des routes ---
app.use("/api/gapstudio", router);

// --- Lancement du serveur ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur le port ${PORT}`);
});