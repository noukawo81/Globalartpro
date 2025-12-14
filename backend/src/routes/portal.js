import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';

const router = express.Router();

// Buy portal premium
router.post('/buy', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId = req.user?.id, token = 'PI', amount = 0.00005 } = req.body;
  if (!userId || typeof amount !== 'number') return res.status(400).json({ error: 'userId and numeric amount required' });
  const db = readDB();
  ensureAccount(userId);
  if ((db.accounts[userId].balances[token] || 0) < amount) return res.status(400).json({ error: 'insufficient balance' });
  db.accounts[userId].balances[token] -= amount;
  const tx = { id: `tx-portal-${Date.now()}`, accountId: userId, type: 'DEBIT', token, amount: -amount, description: 'Portal premium purchase', datetime: new Date().toISOString(), status: 'CONFIRMED' };
  db.transactions.push(tx);
  logAudit({ type: 'portal_buy', userId, token, amount });
  writeDB(db);
  // simulate granting access
  res.json({ ok: true, granted: true, balance: db.accounts[userId].balances });
});

export default router;
