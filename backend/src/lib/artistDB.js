import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(process.cwd(), 'data', 'artists.json');

export function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (e) {
    return { artists: [], invites: {} };
  }
}

import { safeWriteJSON } from './fileUtils.js';

export function writeDB(db) {
  try {
    safeWriteJSON(DB_FILE, db);
  } catch (e) {
    console.error('artistDB write error', e);
  }
}

export function getArtist(id) {
  const db = readDB();
  return db.artists.find((a) => String(a.id) === String(id)) || null;
}

export function upsertArtist(artist) {
  const db = readDB();
  const idx = db.artists.findIndex((a) => String(a.id) === String(artist.id));
  if (idx >= 0) db.artists[idx] = { ...db.artists[idx], ...artist };
  else db.artists.push(artist);
  writeDB(db);
  return artist;
}

export function addMediaToArtist(artistId, media) {
  const db = readDB();
  const idx = db.artists.findIndex((a) => String(a.id) === String(artistId));
  if (idx >= 0) {
    db.artists[idx].artworks = db.artists[idx].artworks || [];
    db.artists[idx].artworks.push(media);
  } else {
    db.artists.push({ id: artistId, artworks: [media] });
  }
  writeDB(db);
  return media;
}

export function saveInvite(artistId, token) {
  const db = readDB();
  db.invites = db.invites || {};
  db.invites[artistId] = { token, createdAt: new Date().toISOString() };
  writeDB(db);
  return db.invites[artistId];
}

export default { readDB, writeDB, getArtist, upsertArtist, addMediaToArtist, saveInvite };
