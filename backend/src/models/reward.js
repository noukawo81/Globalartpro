import db from '../lib/db.js';

export async function createReward({ artistId, museumItemId = null, type, amount = null, currency = null, txMeta = {} }) {
  const [r] = await db('rewards').insert({ artist_id: artistId, museum_item_id: museumItemId, type, amount, currency, tx_meta: txMeta }).returning('*');
  return r;
}

export async function getRewardsForArtist(artistId) {
  return db('rewards').where({ artist_id: artistId }).orderBy('created_at', 'desc');
}
