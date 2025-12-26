import fs from 'fs';
import path from 'path';
import { safeWriteJSON } from './fileUtils.js';

const DB_FILE = path.resolve(process.cwd(), 'data', 'studio_db.json');

export function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) || { nfts: {}, images: {}, userGalleries: {} };
  } catch (e) {
    return { nfts: {}, images: {}, userGalleries: {} };
  }
}

export function writeDB(db) {
  try {
    safeWriteJSON(DB_FILE, db);
  } catch (e) {
    console.error('studio_db write error', e);
  }
}

export function addImage(image) {
  const db = readDB();
  const id = `img-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  db.images = db.images || {};
  db.images[id] = { id, ...image };
  writeDB(db);
  return db.images[id];
}

export function getImage(id) {
  const db = readDB();
  return db.images && db.images[id];
}

export function addNFT(nft) {
  const db = readDB();
  const id = `nft-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  db.nfts = db.nfts || {};
  db.nfts[id] = { id, ...nft };
  db.userGalleries = db.userGalleries || {};
  const author = String(nft.author);
  db.userGalleries[author] = db.userGalleries[author] || [];
  db.userGalleries[author].push(id);
  writeDB(db);
  return db.nfts[id];
}

export function getNFT(id) {
  const db = readDB();
  return db.nfts && db.nfts[id];
}

export function listUserNFTs(userId) {
  const db = readDB();
  const ids = (db.userGalleries && db.userGalleries[userId]) || [];
  return ids.map((i) => db.nfts[i]);
}

export default { readDB, writeDB, addImage, getImage, addNFT, getNFT, listUserNFTs };
