import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';
const router = express.Router();

router.post('/register', jwtAuth, (req, res) => {
  const { userId: bodyUser } = req.body;
  // userId should match token id (for security), use token id by default
  const tokenUser = req.user?.id;
  const id = bodyUser || tokenUser;
  if (!id) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  if (db.accounts[id]) return res.json({ ok: true, account: db.accounts[id] });
  db.accounts[id] = { userId: id, balances: { ARTC: 10, PI: 0, IA: 100 }, createdAt: new Date().toISOString() };
  writeDB(db);
  res.json({ ok: true, account: db.accounts[id] });
});

router.get('/balance', jwtAuth, (req, res) => {
  const userId = req.query.userId || req.user?.id;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  const acc = db.accounts[userId] || { balances: { ARTC: 0, PI: 0, IA: 0 } };
  // Assume 1 ARTC = 0.01 USD
  const usd = (acc.balances?.ARTC || 0) * 0.01;
  res.json({ userId, balances: acc.balances, usd });
});

router.post('/send', jwtAuth, ownerAuth({ body: 'fromUserId' }), (req, res) => {
  const { fromUserId, toUserId, token = 'ARTC', amount } = req.body;
  // Enforce fromUserId equals authenticated user unless admin
  const authUser = req.user?.id;
  if (!fromUserId || !toUserId || typeof amount !== 'number') return res.status(400).json({ error: 'fromUserId, toUserId and numeric amount required' });
  if (fromUserId !== authUser) return res.status(403).json({ error: 'Forbidden: fromUserId must be authenticated user' });
  const db = readDB();
  ensureAccount(fromUserId); ensureAccount(toUserId);
  if ((db.accounts[fromUserId].balances[token] || 0) < amount) return res.status(400).json({ error: 'insufficient balance' });
  db.accounts[fromUserId].balances[token] -= amount;
  db.accounts[toUserId].balances[token] = (db.accounts[toUserId].balances[token] || 0) + amount;
  const txOut = { id: `tx-${Date.now()}`, accountId: fromUserId, type: 'DEBIT', token, amount: -amount, description: `Send to ${toUserId}`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
  const txIn = { id: `tx-${Date.now()}-in`, accountId: toUserId, type: 'CREDIT', token, amount, description: `Receive from ${fromUserId}`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
  db.transactions.push(txOut, txIn);
  db.notifications = db.notifications || [];
  db.notifications.push({ id: `note-${Date.now()}`, userId: fromUserId, title: 'Paiement envoyé', message: `Vous avez envoyé ${amount} ${token} à ${toUserId}`, ts: new Date().toISOString(), read: false });
  db.notifications.push({ id: `note-${Date.now()}-2`, userId: toUserId, title: 'Paiement reçu', message: `Vous avez reçu ${amount} ${token} de ${fromUserId}`, ts: new Date().toISOString(), read: false });
  logAudit({ type: 'transfer', from: fromUserId, to: toUserId, token, amount });
  writeDB(db);
  res.json({ ok: true, from: db.accounts[fromUserId], to: db.accounts[toUserId] });
});

router.get('/transactions', jwtAuth, (req, res) => {
  const userId = req.query.userId || req.user?.id;
  const db = readDB();
  const all = db.transactions || [];
  res.json(userId ? all.filter(t => t.accountId === userId) : all);
});

router.post('/deposit', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId = req.user?.id, token = 'PI', amount } = req.body;
  if (!userId || typeof amount !== 'number') return res.status(400).json({ error: 'userId and numeric amount required' });
  if (String(req.user?.id) !== String(userId)) return res.status(403).json({ error: 'forbidden: user must be authenticated' });
  const db = readDB();
  ensureAccount(userId);
  // deposit is considered PENDING in case manual verification required
  const tx = { id: `dep-${Date.now()}`, accountId: userId, type: 'DEPOSIT', token, amount, datetime: new Date().toISOString(), status: 'PENDING' };
  db.transactions.push(tx);
  db.notifications = db.notifications || [];
  db.notifications.push({ id: `note-${Date.now()}`, userId, title: 'Dépôt demandé', message: `Demande de dépôt ${amount} ${token} en attente`, ts: new Date().toISOString(), read: false });
  logAudit({ type: 'deposit_requested', userId, txId: tx.id, token, amount });
  writeDB(db);
  res.json({ ok: true, tx });
});

router.get('/nfts', jwtAuth, (req, res) => {
  const userId = req.query.userId || req.user?.id;
  const db = readDB();
  const all = db.nfts || [];
  const mine = userId ? all.filter(n => n.owner === userId) : all;
  res.json(mine);
});

router.post('/nft/mint', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId = req.user?.id, metadata } = req.body;
  if (!userId || !metadata) return res.status(400).json({ error: 'userId and metadata required' });
  if (String(req.user?.id) !== String(userId)) return res.status(403).json({ error: 'forbidden: user must be authenticated' });
  const db = readDB();
  ensureAccount(userId);
  const nft = { id: `nft-${Date.now()}`, owner: userId, metadata, createdAt: new Date().toISOString() };
  db.nfts.push(nft);
  const tx = { id: `tx-nft-${Date.now()}`, accountId: userId, type: 'NFT_MINT', token: 'ARTC', amount: 0, description: 'Mint NFT', datetime: new Date().toISOString(), status: 'CONFIRMED' };
  db.transactions.push(tx);
  logAudit({ type: 'nft_mint', userId, nftId: nft.id, meta: metadata });
  writeDB(db);
  res.json({ ok: true, nft });
});

// webhook for deposit validation (kept outside NFT route)
router.post('/webhook/deposit', (req, res) => {
  const { txId, status } = req.body;
  if (!txId) return res.status(400).json({ error: 'txId required' });
  const db = readDB();
  const tx = db.transactions.find(t => t.id === txId);
  if (!tx) return res.status(404).json({ error: 'transaction not found' });
  tx.status = status || 'CONFIRMED';
  if (tx.status === 'CONFIRMED') {
    // credit the account
    const acc = ensureAccount(tx.accountId);
    acc.balances[tx.token] = (acc.balances[tx.token] || 0) + tx.amount;
    db.transactions.push({ id: `tx-confirm-${Date.now()}`, accountId: tx.accountId, type: 'DEPOSIT_CONFIRM', token: tx.token, amount: tx.amount, description: 'Deposit confirmed', datetime: new Date().toISOString(), status: 'CONFIRMED' });
    db.notifications = db.notifications || [];
    db.notifications.push({ id: `note-${Date.now()}`, userId: tx.accountId, title: 'Dépôt confirmé', message: `Votre dépôt de ${tx.amount} ${tx.token} a été confirmé`, ts: new Date().toISOString(), read: false });
    logAudit({ type: 'deposit_confirmed', userId: tx.accountId, txId: tx.id, token: tx.token, amount: tx.amount });
  }
  writeDB(db);
  return res.json({ ok: true, tx });
});

export default router;
