import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const DB_FILE = path.resolve(process.cwd(), 'data', 'portal_posts.json');

function readPosts() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { posts: [] };
  }
}
function writePosts(db) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('portal write error', e);
  }
}

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

// Share an artist media to the portal cultural feed
router.post('/share', jwtAuth, ownerAuth({ body: 'artistId' }), (req, res) => {
  const { artistId, mediaId, title, description = '', link = null } = req.body;
  if (!artistId || !mediaId || !title) return res.status(400).json({ error: 'artistId, mediaId and title required' });
  const post = { id: `post-${Date.now()}`, artistId, mediaId, title, description, link, createdAt: new Date().toISOString() };
  const db = readPosts();
  db.posts = db.posts || [];
  db.posts.unshift(post); // newest first
  writePosts(db);
  logAudit({ type: 'portal_share', artistId, postId: post.id });
  res.status(201).json({ post });
});

// Get portal posts (public)
router.get('/posts', (req, res) => {
  const db = readPosts();
  res.json({ posts: db.posts || [] });
});

export default router;
