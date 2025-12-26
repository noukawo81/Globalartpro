import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(process.cwd(), 'data', 'museum_db.json');

export function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { items: [], likes: [], comments: [], audit: [] };
  }
}

export function writeDB(db) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('museum write error', e);
  }
}

export function ensureItem(item) {
  const db = readDB();
  db.items = db.items || [];
  let existing = db.items.find((i) => String(i.id) === String(item.id));
  if (!existing) {
    existing = { ...item, createdAt: new Date().toISOString(), status: item.status || 'candidate' };
    db.items.push(existing);
    writeDB(db);
  }
  return existing;
}

export function listItems({ status = null, limit = 100, offset = 0 } = {}) {
  const db = readDB();
  let items = db.items || [];
  if (status) items = items.filter((i) => i.status === status);
  return items.slice(offset, offset + limit);
}

export function getItem(id) {
  const db = readDB();
  const item = (db.items || []).find((i) => String(i.id) === String(id));
  if (!item) return null;
  const likes = (db.likes || []).filter((l) => String(l.itemId) === String(id));
  const comments = (db.comments || []).filter((c) => String(c.itemId) === String(id));
  return { ...item, likesCount: likes.length, comments: comments.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)) };
}

export function updateItem(id, patch = {}) {
  const db = readDB();
  db.items = db.items || [];
  const it = db.items.find((i) => String(i.id) === String(id));
  if (!it) return null;
  // allow only specific fields to be updated
  const allowed = ['title','description','tags','year','medium','imageUrl','thumbnailUrl','status','price','category','access'];
  allowed.forEach((k) => {
    if (typeof patch[k] !== 'undefined') it[k] = patch[k];
  });
  it.updatedAt = new Date().toISOString();
  writeDB(db);
  return it;
}

export function archiveItem(id) {
  const db = readDB();
  db.items = db.items || [];
  const it = db.items.find((i) => String(i.id) === String(id));
  if (!it) return null;
  it.status = 'archived';
  it.updatedAt = new Date().toISOString();
  writeDB(db);
  return it;
}

export function deleteItem(id) {
  const db = readDB();
  db.items = db.items || [];
  const idx = db.items.findIndex((i) => String(i.id) === String(id));
  if (idx === -1) return false;
  db.items.splice(idx, 1);
  // also remove likes and comments for item
  db.likes = (db.likes || []).filter((l) => String(l.itemId) !== String(id));
  db.comments = (db.comments || []).filter((c) => String(c.itemId) !== String(id));
  writeDB(db);
  return true;
}

export function toggleLike(userId, itemId) {
  const db = readDB();
  db.likes = db.likes || [];
  const idx = db.likes.findIndex((l) => String(l.itemId) === String(itemId) && String(l.userId) === String(userId));
  let liked = false;
  if (idx === -1) {
    db.likes.push({ id: `like-${Date.now()}`, userId, itemId, createdAt: new Date().toISOString() });
    liked = true;
  } else {
    db.likes.splice(idx, 1);
    liked = false;
  }
  writeDB(db);
  const likesCount = (db.likes || []).filter((l) => String(l.itemId) === String(itemId)).length;
  return { liked, likesCount };
}

export function addComment(userId, itemId, content, parentId = null) {
  const db = readDB();
  db.comments = db.comments || [];
  const c = { id: `c-${Date.now()}`, userId, itemId, content, parentId: parentId || null, createdAt: new Date().toISOString() };
  db.comments.push(c);
  writeDB(db);
  return c;
}

export default { readDB, writeDB, ensureItem, listItems, getItem, toggleLike, addComment, updateItem, archiveItem, deleteItem };
