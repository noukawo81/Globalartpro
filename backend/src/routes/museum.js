import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import museumDB from '../lib/museumDB.js';

const router = express.Router();

// List items: optional ?status=candidate|exhibit
router.get('/', (req, res) => {
  const status = req.query.status || null;
  const limit = parseInt(req.query.limit || '100', 10);
  const offset = parseInt(req.query.offset || '0', 10);
  const items = museumDB.listItems({ status, limit, offset });
  res.json({ items });
});

// Get details for an item
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const item = museumDB.getItem(id);
  if (!item) return res.status(404).json({ error: 'not found' });
  res.json({ item });
});

// Toggle like (requires auth)
router.post('/:id/like', jwtAuth, (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const item = museumDB.getItem(id);
  if (!item) return res.status(404).json({ error: 'item not found' });
  const result = museumDB.toggleLike(userId, id);
  res.json({ ok: true, liked: result.liked, likesCount: result.likesCount });
});

// Add comment (requires auth)
router.post('/:id/comment', jwtAuth, (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const { content, parentId } = req.body;
  if (!content || String(content).trim().length === 0) return res.status(400).json({ error: 'content required' });
  const item = museumDB.getItem(id);
  if (!item) return res.status(404).json({ error: 'item not found' });
  const comment = museumDB.addComment(userId, id, content, parentId);
  res.status(201).json({ ok: true, comment });
});

// Admin endpoint: mark an item as exhibited (requires admin role)
router.post('/:id/exhibit', jwtAuth, (req, res) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin required' });
  const id = req.params.id;
  const db = museumDB.readDB();
  db.items = db.items || [];
  const it = db.items.find((i) => String(i.id) === String(id));
  if (!it) return res.status(404).json({ error: 'item not found' });
  it.status = 'exhibit';
  museumDB.writeDB(db);
  res.json({ ok: true, item: it });
});

export default router;
