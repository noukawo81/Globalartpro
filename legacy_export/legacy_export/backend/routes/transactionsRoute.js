// backend/routes/transactionsRoute.js
import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// POST /api/gapstudio/pi-payment  --> enregistre la transaction
router.post("/pi-payment", async (req, res) => {
  try {
    const { amount, userWallet, itemName, metadata } = req.body;
    if (!amount || !userWallet || !itemName) {
      return res.status(400).json({ success: false, message: "Champs manquants" });
    }

    const tx = new Transaction({
      from: userWallet,
      to: process.env.PI_APP_WALLET || "pi_wallet_placeholder",
      amount,
      itemName,
      status: "pending",
      metadata: metadata || {},
    });

    await tx.save();
    console.log("💰 Nouvelle transaction (saved):", tx);
    return res.json({ success: true, transaction: tx, message: "Transaction enregistrée" });
  } catch (err) {
    console.error("pi-payment error:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur", details: err.message });
  }
});

// GET /api/gapstudio/transactions  --> liste toutes les transactions
router.get("/transactions", async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ date: -1 }).limit(200);
    return res.json({ success: true, transactions: txs });
  } catch (err) {
    console.error("transactions fetch error:", err);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

export default router;