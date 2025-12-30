import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(process.cwd(), 'data', 'wallet_db.json');

export function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { accounts: {}, transactions: [], nfts: [], audit: [] };
  }
}
import { safeWriteJSON } from './fileUtils.js';

export function writeDB(db) {
  try {
    safeWriteJSON(DB_FILE, db);
  } catch (e) {
    console.error('wallet write error', e);
  }
}
export function ensureAccount(userId) {
  const db = readDB();
  if (!db.accounts[userId]) {
    db.accounts[userId] = {
      userId,
      balances: { USD: 0, PI: 0, EUR: 0, CNY: 0, RUB: 0, GOLD: 0, ARTC: 0, IA: 100 },
      passes: [],
      createdAt: new Date().toISOString(),
    };
    writeDB(db);
  }
  return db.accounts[userId];
}

export function getPasses(userId) {
  const db = readDB();
  ensureAccount(userId);
  return db.accounts[userId].passes || [];
}

export function addPass(userId, pass) {
  const db = readDB();
  ensureAccount(userId);
  db.accounts[userId].passes = db.accounts[userId].passes || [];
  db.accounts[userId].passes.push(pass);
  writeDB(db);
  return pass;
}

export function updatePass(userId, passIndex, patch) {
  const db = readDB();
  ensureAccount(userId);
  db.accounts[userId].passes = db.accounts[userId].passes || [];
  const existing = db.accounts[userId].passes[passIndex];
  if (!existing) return null;
  db.accounts[userId].passes[passIndex] = { ...existing, ...patch };
  writeDB(db);
  return db.accounts[userId].passes[passIndex];
}

export function logAudit(entry) {
  const db = readDB();
  db.audit = db.audit || [];
  db.audit.push({ ...entry, ts: new Date().toISOString() });
  writeDB(db);
}
