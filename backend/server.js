import express from "express";
import Replicate from "replicate";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import transactionRoutes from "./routes/transactionsRoute.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// helpers
const mask = (s) => (s ? `${s.slice(0, 4)}...${s.slice(-4)}` : false);
const getEnv = (names) => {
  for (const n of names) {
    if (process.env[n]) return process.env[n];
  }
  return undefined;
};

// read envs with common aliases
const REPLICATE_TOKEN = getEnv(["REPLICATE_API_TOKEN", "REPLICATE_API"]);
const MURF_KEY = getEnv(["MURF_API_KEY", "MURF_API"]);
const PI_WALLET = getEnv(["PI_APP_WALLET", "PI_APP"]);
const MONGO_URI = process.env.MONGO_URI || process.env.MONGOURL || "";

// startup logs (masqué)
console.log("🔑 Vérification des clés :", {
  REPLICATE: !!REPLICATE_TOKEN,
  REPLICATE_masked: mask(REPLICATE_TOKEN),
  MURF: !!MURF_KEY,
  MURF_masked: mask(MURF_KEY),
  PI_APP: !!PI_WALLET,
  PI_masked: mask(PI_WALLET),
  MONGO: !!MONGO_URI,
  MONGO_masked: mask(MONGO_URI),
});

// --- Connexion MongoDB ---
if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    })
    .then(() => console.log("✅ MongoDB connecté avec succès"))
    .catch((err) => {
      console.error("❌ Erreur MongoDB (détails) :", err?.message || err);
      console.error(err);
    });
} else {
  console.warn("⚠️ MONGO_URI non défini — la DB ne sera pas connectée.");
}

// --- Routes GAP Studio ---
const router = express.Router();
const replicate = REPLICATE_TOKEN ? new Replicate({ auth: REPLICATE_TOKEN }) : null;

router.get("/", (req, res) => {
  res.send("🚀 API GAP Studio est connectée et opérationnelle !");
});

router.get("/test", (req, res) => {
  res.json({ message: "Backend OK" });
});

router.post("/generate", async (req, res) => {
  const { prompt, type } = req.body;
  try {
    if (!prompt) return res.status(400).json({ error: "Prompt manquant" });

    if (type === "replicate-image") {
      if (!replicate) return res.status(401).json({ error: "Clé Replicate manquante" });

      const output = await replicate.run("stability-ai/stable-diffusion", {
        input: { prompt },
      });

      const imageUrl = Array.isArray(output) ? output[0] : output;
      return res.json({ imageUrl });
    }

    if (type === "murf-tts") {
      if (!MURF_KEY) return res.status(401).json({ error: "Clé Murf manquante" });

      const murfRes = await axios.post(
        "https://api.murf.ai/v1/speech/generate",
        { text: prompt, voice: "en-US-WilliamNeural" },
        { headers: { Authorization: `Bearer ${MURF_KEY}` } }
      );

      return res.json({ audioUrl: murfRes.data?.audio_url || murfRes.data });
    }

    if (type === "musique") {
      return res.json({
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      });
    }

    return res.status(400).json({ error: "Type de création non supporté." });
  } catch (error) {
    console.error("Erreur /generate :", error?.response?.data || error.message || error);
    return res.status(500).json({ error: error?.message || "Erreur serveur" });
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
      to: PI_WALLET || "PI_APP_WALLET_NOT_SET",
      amount,
      itemName,
      status: "pending",
      date: new Date(),
    };

    console.log("💰 Nouvelle transaction Pi :", transaction);

    return res.json({
      success: true,
      message: "Paiement Pi en cours...",
      transaction,
    });
  } catch (error) {
    console.error("Erreur de paiement :", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

// --- Monter les routes API AVANT de servir le frontend ---
app.use("/api/gapstudio", router);
app.use("/api/transactions", transactionRoutes);

// --- Servir le frontend build/dist si présent (catch-all APRÈS les routes API) ---
const possibleClientPaths = [
  path.join(__dirname, "..", "frontend", "build"),
  path.join(__dirname, "..", "frontend", "dist"),
];

let clientStaticPath = null;
for (const p of possibleClientPaths) {
  if (fs.existsSync(p)) {
    clientStaticPath = p;
    break;
  }
}

console.log("DEBUG: checked client paths:", possibleClientPaths, "selected =", clientStaticPath);

if (clientStaticPath) {
  app.use(express.static(clientStaticPath));

  // Remplacement robuste du catch-all (évite PathError lié à "/*")
  app.use((req, res, next) => {
    // ne servir index.html que pour les requêtes GET qui acceptent du HTML
    if (req.method !== "GET") return next();
    const accept = (req.headers.accept || "");
    if (!accept.includes("text/html")) return next();

    res.sendFile(path.join(clientStaticPath, "index.html"), (err) => {
      if (err) return next(err);
    });
  });
} else {
// ...existing code...
// middleware d'erreur final
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: "Internal Server Error" });
});
  // si pas de build local, rediriger la racine vers le frontend déployé (Netlify...)
  app.get("/", (req, res) => {
    const front = process.env.FRONTEND_URL;
    if (front) return res.redirect(front);
    res.send("API GlobalArtPro — backend actif. Utilise /api/gapstudio ou /api/transactions");
  });
}
// --- Lancement du serveur ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur le port ${PORT}`);
});