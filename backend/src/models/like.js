import db from '../lib/db.js';

export async function addLike(userId, museumItemId) {
  try {
    const [like] = await db('likes').insert({ user_id: userId, museum_item_id: museumItemId }).returning('*');
    return like;
  } catch (e) {
    // Unique constraint => already liked
    return null;
  }
}

export async function removeLike(userId, museumItemId) {
  return db('likes').where({ user_id: userId, museum_item_id: museumItemId }).del();
}

export async function countLikes(museumItemId) {
  const [{ count }] = await db('likes').where({ museum_item_id: museumItemId }).count('id');
  return Number(count || 0);
}

export async function userLiked(userId, museumItemId) {
  const r = await db('likes').where({ user_id: userId, museum_item_id: museumItemId }).first();
  return !!r;
}
