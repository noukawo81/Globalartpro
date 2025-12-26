import db from '../lib/db.js';

export async function createAuction({ museumItemId, startAt, endAt, startingBid = null }) {
  const [a] = await db('auctions').insert({ museum_item_id: museumItemId, start_at: startAt, end_at: endAt, starting_bid: startingBid }).returning('*');
  return a;
}

export async function getAuctionById(id) {
  return db('auctions').where({ id }).first();
}

export async function updateAuction(id, patch) {
  const [a] = await db('auctions').where({ id }).update(patch).returning('*');
  return a;
}
