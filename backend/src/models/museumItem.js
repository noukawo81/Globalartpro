import db from '../lib/db.js';

export async function createMuseumItem(payload) {
  const [item] = await db('museum_items').insert(payload).returning('*');
  return item;
}

export async function getMuseumItemById(id) {
  return db('museum_items').where({ id }).first();
}

export async function listMuseumItems({ status, limit = 20, offset = 0 } = {}) {
  const q = db('museum_items').select('*').orderBy('entered_at', 'desc').limit(limit).offset(offset);
  if (status) q.where({ status });
  return q;
}

export async function updateMuseumItem(id, patch) {
  const [item] = await db('museum_items').where({ id }).update(patch).returning('*');
  return item;
}
