import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';
import { balancesToUSD, getRates } from '../lib/exchangeRates.js';
const router = express.Router();

function normalizeDB(db) {
  db = db || {};
  db.accounts = db.accounts || {};
  db.transactions = db.transactions || [];
  db.nfts = db.nfts || [];
  db.notifications = db.notifications || [];
  db.audit = db.audit || [];
  return db;
}

router.post('/register', jwtAuth, (req, res) => {
  const { userId: bodyUser } = req.body;
  // userId should match token id (for security), use token id by default
  const tokenUser = req.user?.id;
  const id = bodyUser || tokenUser;
  if (!id) return res.status(400).json({ error: 'userId required' });
  let db = readDB(); db = normalizeDB(db);
  if (db.accounts[id]) return res.json({ ok: true, account: db.accounts[id] });
  db.accounts[id] = { userId: id, balances: { ARTC: 10, PI: 0, IA: 100 }, createdAt: new Date().toISOString() };
  writeDB(db);
  res.json({ ok: true, account: db.accounts[id] });
});

router.get('/balance', jwtAuth, (req, res) => {
  const userId = req.query.userId || req.user?.id;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  ensureAccount(userId);
  let db = readDB(); db = normalizeDB(db);
  const acc = db.accounts[userId];
  const { per, rates, usdGross, usdNet, networkRate } = balancesToUSD(acc.balances || {}, true);
  res.json({ userId, balances: acc.balances, perCurrency: per, rates, usdGross, usdNet, networkRate });
});

router.post('/send', jwtAuth, ownerAuth({ body: 'fromUserId' }), (req, res) => {
  const { fromUserId, toUserId, token = 'ARTC', amount } = req.body;
  // Enforce fromUserId equals authenticated user unless admin
  const authUser = req.user?.id;
  if (!fromUserId || !toUserId || typeof amount !== 'number') return res.status(400).json({ error: 'fromUserId, toUserId and numeric amount required' });
  if (fromUserId !== authUser) return res.status(403).json({ error: 'Forbidden: fromUserId must be authenticated user' });
  ensureAccount(fromUserId); ensureAccount(toUserId);
  let db = readDB(); db = normalizeDB(db);
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
  let db = readDB(); db = normalizeDB(db);
  const all = db.transactions || [];
  res.json(userId ? all.filter(t => t.accountId === userId) : all);
});

router.post('/deposit', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId = req.user?.id, token = 'PI', amount } = req.body;
  if (!userId || typeof amount !== 'number') return res.status(400).json({ error: 'userId and numeric amount required' });
  if (String(req.user?.id) !== String(userId)) return res.status(403).json({ error: 'forbidden: user must be authenticated' });
  ensureAccount(userId);
  let db = readDB(); db = normalizeDB(db);
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
  let db = readDB(); db = normalizeDB(db);
  const all = db.nfts || [];
  const mine = userId ? all.filter(n => n.owner === userId) : all;
  res.json(mine);
});

router.post('/nft/mint', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId = req.user?.id, metadata } = req.body;
  if (!userId || !metadata) return res.status(400).json({ error: 'userId and metadata required' });
  if (String(req.user?.id) !== String(userId)) return res.status(403).json({ error: 'forbidden: user must be authenticated' });
  ensureAccount(userId);
  let db = readDB(); db = normalizeDB(db);
  const nft = { id: `nft-${Date.now()}`, owner: userId, metadata, createdAt: new Date().toISOString() };
  db.nfts = db.nfts || [];
  db.nfts.push(nft);
  const tx = { id: `tx-nft-${Date.now()}`, accountId: userId, type: 'NFT_MINT', token: 'ARTC', amount: 0, description: 'Mint NFT', datetime: new Date().toISOString(), status: 'CONFIRMED' };
  db.transactions.push(tx);
  logAudit({ type: 'nft_mint', userId, nftId: nft.id, meta: metadata });
  writeDB(db);
  res.json({ ok: true, nft });
});

// POST /wallet/recharge — simulated immediate ARTC recharge (development helper)
router.post('/recharge', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId = req.user?.id, amount } = req.body || {};
  if (!userId || typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'userId and positive numeric amount required' });
  if (String(req.user?.id) !== String(userId)) return res.status(403).json({ error: 'forbidden: user must be authenticated' });

  ensureAccount(userId);
  let db = readDB(); db = normalizeDB(db);
  // set ARTC balance to the provided amount (tests expect recharge to set, not add)
  const before = db.accounts[userId].balances.ARTC || 0;
  db.accounts[userId].balances.ARTC = amount;
  const tx = { id: `tx-rech-${Date.now()}`, accountId: userId, type: 'RECHARGE', token: 'ARTC', amount, description: 'Recharge ARTC (simulated set)', datetime: new Date().toISOString(), status: 'CONFIRMED' };
  db.transactions.push(tx);
  db.notifications = db.notifications || [];
  db.notifications.push({ id: `note-${Date.now()}`, userId, title: 'Recharge ARTC', message: `Votre compte a été crédité de ${amount} ARTC (simulé)`, ts: new Date().toISOString(), read: false });
  logAudit({ type: 'recharge', userId, amount });
  writeDB(db);
  res.json({ ok: true, amount, balance: db.accounts[userId].balances });
});

// GET /wallet/passes — list user passes
router.get('/passes', jwtAuth, (req, res) => {
  const userId = req.query.userId || req.user?.id;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  ensureAccount(userId);
  const passes = readDB().accounts[userId].passes || [];
  res.json({ userId, passes });
});

// POST /wallet/buy-pass — buy or activate a pass
router.post('/buy-pass', jwtAuth, ownerAuth({ body: 'userId' }), async (req, res) => {
  const { userId = req.user?.id, passType, period = 'monthly', currency = 'USD' } = req.body || {};
  if (!userId || !passType) return res.status(400).json({ error: 'userId and passType required' });
  if (String(req.user?.id) !== String(userId)) return res.status(403).json({ error: 'forbidden: user must be authenticated' });

  const PASSES = {
    genesis: { name: 'Genesis Pass', desc: 'Le commencement créatif. 3 NFT gratuits / période, génération texte.', priceUSD: 0 },
    aurum: { name: 'Aurum Pass', desc: "L'or artistique — générateur NFT, outils avancés, visibilité.", priceUSD: { monthly: 10, annual: 100 } },
    eternum: { name: 'Eternum Pass', desc: 'Reconnaissance durable — ventes premium, accès avancé, visibilité mondiale.', priceUSD: { monthly: 50, annual: 500 } },
  };

  const key = String(passType).toLowerCase();
  const p = PASSES[key];
  if (!p) return res.status(400).json({ error: 'unknown passType' });

  // Price in USD
  const priceUSD = typeof p.priceUSD === 'number' ? p.priceUSD : (p.priceUSD[period] || p.priceUSD['monthly']);

  // If free pass, just add
  ensureAccount(userId);
  let db = readDB(); db = normalizeDB(db);
  if (priceUSD === 0) {
    const start = Date.now();
    const end = start + 30 * 24 * 60 * 60 * 1000; // 30 days for genesis
    const passObj = { id: `pass-${Date.now()}-${Math.floor(Math.random()*1000)}`, type: key, name: p.name, desc: p.desc, start, end, period, limits: { freeNFT: key === 'genesis' ? 3 : null }, active: true };
    db.accounts[userId].passes = db.accounts[userId].passes || [];
    db.accounts[userId].passes.push(passObj);
    const tx = { id: `tx-pass-${Date.now()}`, accountId: userId, type: 'PASS', token: 'USD', amount: 0, description: `Activate pass ${key}`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
    db.transactions.push(tx);
    logAudit({ type: 'pass_activate', userId, pass: passObj });
    writeDB(db);
    return res.json({ ok: true, pass: passObj });
  }

  // Else attempt to charge user in requested currency (convert if needed)
  const rates = getRates();
  const rate = rates[currency] || rates['USD'];
  // amount in requested currency
  const amountInCurrency = (rate && rate > 0) ? +(priceUSD / rate).toFixed(6) : null;
  if (amountInCurrency === null) return res.status(400).json({ error: 'invalid currency or rates not configured' });

  // attempt to deduct amountInCurrency from user's balances[currency]
  const acc = db.accounts[userId];
  const avail = (acc.balances && (acc.balances[currency] || 0)) || 0;
  if (avail < amountInCurrency) return res.status(402).json({ error: 'insufficient funds', required: amountInCurrency, balance: avail, currency });

  // Deduct
  acc.balances[currency] = avail - amountInCurrency;
  const tx = { id: `tx-pass-${Date.now()}`, accountId: userId, type: 'DEBIT', token: currency, amount: -amountInCurrency, description: `Buy pass ${key} (${period})`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
  db.transactions.push(tx);

  // Add pass
  const start = Date.now();
  const end = start + (period === 'annual' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000);
  const passObj = { id: `pass-${Date.now()}-${Math.floor(Math.random()*1000)}`, type: key, name: p.name, desc: p.desc, start, end, period, priceUSD, currency, paidAmount: amountInCurrency, active: true, limits: { freeNFT: key === 'genesis' ? 3 : null } };
  db.accounts[userId].passes = db.accounts[userId].passes || [];
  db.accounts[userId].passes.push(passObj);

  logAudit({ type: 'pass_purchase', userId, pass: passObj, txId: tx.id });
  writeDB(db);
  res.json({ ok: true, pass: passObj, tx });
});

// webhook for deposit validation (kept outside NFT route)
router.post('/webhook/deposit', (req, res) => {
  const { txId, status } = req.body;
  if (!txId) return res.status(400).json({ error: 'txId required' });
  let db = readDB(); db = normalizeDB(db);
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
