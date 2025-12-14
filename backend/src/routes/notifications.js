import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import { readDB, writeDB } from '../lib/walletDB.js';

const router = express.Router();

// Basic notification storage for demo (requires auth)
router.post('/', jwtAuth, (req, res) => {
  const { userId = req.user?.id, title, message, type = 'info' } = req.body;
  if (!userId || !title) return res.status(400).json({ error: 'userId and title required' });
  const db = readDB();
  db.notifications = db.notifications || [];
  const note = { id: `note-${Date.now()}`, userId, title, message, type, ts: new Date().toISOString(), read: false };
  db.notifications.push(note);
  writeDB(db);
  res.json({ ok: true, note });
});

// GET notifications for current user
router.get('/', jwtAuth, (req, res) => {
  const userId = req.query.userId || req.user?.id;
  const db = readDB();
  const notes = (db.notifications || []).filter(n => n.userId === userId);
  res.json(notes);
});

export default router;
