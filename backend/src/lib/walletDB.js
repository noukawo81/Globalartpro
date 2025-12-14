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
export function writeDB(db) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('wallet write error', e);
  }
}
export function ensureAccount(userId) {
  const db = readDB();
  if (!db.accounts[userId]) {
    db.accounts[userId] = { userId, balances: { ARTC: 10, PI: 0, IA: 100 }, createdAt: new Date().toISOString() };
    writeDB(db);
  }
  return db.accounts[userId];
}
export function logAudit(entry) {
  const db = readDB();
  db.audit = db.audit || [];
  db.audit.push({ ...entry, ts: new Date().toISOString() });
  writeDB(db);
}
