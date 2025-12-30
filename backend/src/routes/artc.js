import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const DB_FILE = path.resolve(process.cwd(), 'data', 'artc_db.json');

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { accounts: {}, transactions: [], miningEvents: [], lastMine: {}, miningSessions: {} };
  }
}
import { safeWriteJSON } from '../lib/fileUtils.js';

function writeDB(db) {
  try {
    safeWriteJSON(DB_FILE, db);
  } catch (e) {
    console.error('artc write error', e);
  }
}

function ensureAccount(userId) {
  const db = readDB();
  if (!db.accounts[userId]) {
    db.accounts[userId] = { userId, balance: 0, createdAt: new Date().toISOString() };
    writeDB(db);
  }
  return db.accounts[userId];
}

router.get('/balance', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  const acc = db.accounts[userId] || { balance: 0 };
  res.json({ userId, balance: acc.balance });
});

router.post('/mine', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });

  const db = readDB();
  const now = Date.now();
  const cooldown = 60 * 1000; // 60s
  const last = db.lastMine[userId] || 0;
  if (now - last < cooldown) {
    return res.status(429).json({ error: 'Cooldown active', wait: Math.ceil((cooldown - (now - last)) / 1000) });
  }

  const reward = Math.floor(Math.random() * 5) + 1;
  db.lastMine[userId] = now;
  ensureAccount(userId);
  db.accounts[userId].balance = (db.accounts[userId].balance || 0) + reward;

  const tx = { id: `tx-${Date.now()}`, accountId: userId, type: 'reward', amount: reward, meta: { source: 'mine' }, createdAt: new Date().toISOString() };
  db.transactions.push(tx);
  db.miningEvents.push({ id: `mine-${Date.now()}`, userId, simPower: 1, reward, status: 'completed', createdAt: new Date().toISOString() });

  writeDB(db);
  res.json({ ok: true, reward, balance: db.accounts[userId].balance });
});

router.post('/transfer', jwtAuth, ownerAuth({ body: 'fromUserId' }), (req, res) => {
  try {
    // artc transfer request received
    const { fromUserId, toUserId, amount } = req.body;
    if (!fromUserId || !toUserId || typeof amount !== 'number') return res.status(400).json({ error: 'fromUserId, toUserId and numeric amount required' });
    // validate ownership: fromUserId must be the authenticated user
    if (String(req.user?.id) !== String(fromUserId)) return res.status(403).json({ error: 'forbidden: fromUserId must be authenticated user' });
    ensureAccount(fromUserId);
    ensureAccount(toUserId);
    const db = readDB();
    if ((db.accounts[fromUserId].balance || 0) < amount) return res.status(400).json({ error: 'insufficient balance' });

    db.accounts[fromUserId].balance -= amount;
    db.accounts[toUserId].balance = (db.accounts[toUserId].balance || 0) + amount;

    const txOut = { id: `tx-${Date.now()}-out`, accountId: fromUserId, type: 'transfer_out', amount: -amount, meta: { to: toUserId }, createdAt: new Date().toISOString() };
    const txIn = { id: `tx-${Date.now()}-in`, accountId: toUserId, type: 'transfer_in', amount, meta: { from: fromUserId }, createdAt: new Date().toISOString() };
    db.transactions.push(txOut, txIn);
    writeDB(db);
    res.json({ ok: true, fromBalance: db.accounts[fromUserId].balance, toBalance: db.accounts[toUserId].balance });
  } catch (e) {
    console.error('artc transfer error', e);
    res.status(500).json({ error: 'transfer failed', detail: e?.message });
  }
});

router.get('/transactions', (req, res) => {
  const userId = req.query.userId;
  const db = readDB();
  const all = db.transactions || [];
  res.json(userId ? all.filter(t => t.accountId === userId) : all);
});

// Start a mining session (sets an end timestamp)
router.post('/start', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId, durationMs } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  db.miningSessions = db.miningSessions || {};
  const now = Date.now();
  const existing = db.miningSessions[userId];
  if (existing && existing.end && existing.end > now) {
    return res.status(400).json({ error: 'session already active', end: existing.end });
  }
  const dur = typeof durationMs === 'number' && durationMs > 0 ? durationMs : 24 * 60 * 60 * 1000;
  const end = now + dur;
  db.miningSessions[userId] = { userId, start: now, end, status: 'active', claimed: false };
  writeDB(db);
  return res.json({ ok: true, start: now, end });
});

// Get mining status for a user
router.get('/status', jwtAuth, ownerAuth({ query: 'userId' }), (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  db.miningSessions = db.miningSessions || {};
  const session = db.miningSessions[userId];
  if (!session) return res.json({ active: false });
  const now = Date.now();
  const remaining = Math.max(0, session.end - now);
  const active = session.end > now && session.status === 'active';
  res.json({ active, start: session.start, end: session.end, remaining, claimed: !!session.claimed });
});

// Claim reward after session ended (credits 1 ARTC if not already claimed)
router.post('/claim', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const db = readDB();
  db.miningSessions = db.miningSessions || {};
  const session = db.miningSessions[userId];
  if (!session) return res.status(400).json({ error: 'no session found' });
  const now = Date.now();
  if (session.end > now) return res.status(400).json({ error: 'session still active' });
  if (session.claimed) return res.status(400).json({ error: 'reward already claimed' });
  // credit reward (1 ARTC)
  ensureAccount(userId);
  const acc = readDB().accounts[userId];
  const db2 = readDB();
  db2.accounts[userId].balance = (db2.accounts[userId].balance || 0) + 1;
  db2.miningEvents = db2.miningEvents || [];
  db2.miningEvents.push({ id: `mine-${Date.now()}`, userId, reward: 1, status: 'claimed', createdAt: new Date().toISOString() });
  db2.miningSessions = db2.miningSessions || {};
  db2.miningSessions[userId].claimed = true;
  writeDB(db2);
  return res.json({ ok: true, reward: 1, balance: db2.accounts[userId].balance });
});

export default router;