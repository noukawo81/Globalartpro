import db from '../lib/db.js';

export async function createComment({ museumItemId, userId, parentId = null, content }) {
  const [c] = await db('comments').insert({ museum_item_id: museumItemId, user_id: userId, parent_id: parentId, content }).returning('*');
  return c;
}

export async function getCommentsForItem(museumItemId) {
  return db('comments').where({ museum_item_id: museumItemId }).orderBy('created_at', 'asc');
}
