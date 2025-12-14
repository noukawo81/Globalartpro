import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';

const router = express.Router();

// pricing
const COST_IA = 1; // 1 IA credit per generation
const COST_ARTC = 5; // fallback cost in ARTC

router.post('/generate', jwtAuth, (req, res) => {
  const { prompt, module = 'default' } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'user not authenticated' });

  const db = readDB();
  ensureAccount(userId);
  const acc = db.accounts[userId];

  // Attempt to consume IA credits first
  if ((acc.balances?.IA || 0) >= COST_IA) {
    acc.balances.IA -= COST_IA;
    db.transactions.push({ id: `tx-g-${Date.now()}`, accountId: userId, type: 'DEBIT', token: 'IA', amount: -COST_IA, description: `GapStudio generation (IA) - ${prompt.slice(0, 20)}`, datetime: new Date().toISOString(), status: 'CONFIRMED' });
    logAudit({ type: 'gap_generate', userId, method: 'IA', cost: COST_IA });
  } else if ((acc.balances?.ARTC || 0) >= COST_ARTC) {
    acc.balances.ARTC -= COST_ARTC;
    db.transactions.push({ id: `tx-g-${Date.now()}`, accountId: userId, type: 'DEBIT', token: 'ARTC', amount: -COST_ARTC, description: `GapStudio generation (ARTC) - ${prompt.slice(0, 20)}`, datetime: new Date().toISOString(), status: 'CONFIRMED' });
    logAudit({ type: 'gap_generate', userId, method: 'ARTC', cost: COST_ARTC });
  } else {
    return res.status(402).json({ error: 'insufficient funds' });
  }
  writeDB(db);

  // Simulation: generate placeholder image
  const generationId = `gen-${Date.now()}`;
  const imageUrl = `https://via.placeholder.com/512x512?text=${encodeURIComponent(prompt.slice(0, 20))}`;
  res.json({ id: generationId, prompt, module, imageUrl, status: 'completed', createdAt: new Date().toISOString() });
});

router.get('/result/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    status: 'completed',
    imageUrl: 'https://via.placeholder.com/512x512?text=Generated+Art',
  });
});

export default router;