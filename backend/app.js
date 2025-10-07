const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB (remplace l'URL par la tienne si besoin)
mongoose.connect("mongodb://localhost:27017/gapstudio", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
const gapstudioRoutes = require("./routes/gapstudio");
app.use("/api/gapstudio", gapstudioRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend GAP Studio lancé sur http://localhost:${PORT}`);
});