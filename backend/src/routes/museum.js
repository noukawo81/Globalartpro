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

// Admin endpoints

// Admin: list all (with optional search/status)
router.get('/admin/list', jwtAuth, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin required' });
    const status = req.query.status || null;
    const q = req.query.q || null;
    const limit = parseInt(req.query.limit || '100', 10);
    const offset = parseInt(req.query.offset || '0', 10);
    let items = museumDB.listItems({ status: null, limit: 100000, offset: 0 });
    if (status) items = items.filter(i => i.status === status);
    if (q) items = items.filter(i => (i.title || '').toLowerCase().includes(String(q).toLowerCase()) || (i.artistName || '').toLowerCase().includes(String(q).toLowerCase()));
    const sliced = items.slice(offset, offset + limit);
    res.json({ items: sliced, total: items.length });
  } catch (e) {
    console.error('admin list error', e);
    res.status(500).json({ error: 'server error', detail: e.message });
  }
});

// Admin: update item (quick edit)
router.put('/admin/:id', jwtAuth, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin required' });
    const id = req.params.id;
    const patch = req.body || {};
    // sanitize patch: ensure tags is array if provided
    if (patch.tags && !Array.isArray(patch.tags)) {
      try { patch.tags = JSON.parse(patch.tags); } catch (_) { patch.tags = String(patch.tags).split(',').map(s=>s.trim()).filter(Boolean); }
    }
    const it = museumDB.updateItem(id, patch);
    if (!it) return res.status(404).json({ error: 'item not found' });
    res.json({ ok: true, item: it });
  } catch (e) {
    console.error('admin update error', e);
    res.status(500).json({ error: 'server error', detail: e.message });
  }
});
// Admin: toggle visibility (public <-> premium/draft) - uses status
router.post('/admin/:id/toggle-visibility', jwtAuth, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin required' });
    const id = req.params.id;
    const it = museumDB.getItem(id);
    if (!it) return res.status(404).json({ error: 'item not found' });
    // map visible statuses
    const visible = it.status === 'public' || it.status === 'premium' || it.status === 'exhibit';
    const newStatus = visible ? 'draft' : 'public';
    const updated = museumDB.updateItem(id, { status: newStatus });
    res.json({ ok: true, item: updated });
  } catch (e) {
    console.error('admin toggle visibility error', e);
    res.status(500).json({ error: 'server error', detail: e.message });
  }
});

// Admin: archive
router.post('/admin/:id/archive', jwtAuth, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin required' });
    const id = req.params.id;
    const it = museumDB.archiveItem(id);
    if (!it) return res.status(404).json({ error: 'item not found' });
    res.json({ ok: true, item: it });
  } catch (e) {
    console.error('admin archive error', e);
    res.status(500).json({ error: 'server error', detail: e.message });
  }
});

// Admin: delete permanently
router.delete('/admin/:id', jwtAuth, (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'admin required' });
    const id = req.params.id;
    const ok = museumDB.deleteItem(id);
    if (!ok) return res.status(404).json({ error: 'item not found' });
    res.json({ ok: true });
  } catch (e) {
    console.error('admin delete error', e);
    res.status(500).json({ error: 'server error', detail: e.message });
  }
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
