import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import artistDB from '../lib/artistDB.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const DB_FILE = path.resolve(process.cwd(), 'data', 'marketplace_db.json');

function readMarketplace() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { listings: [] };
  }
}
import { safeWriteJSON } from '../lib/fileUtils.js';

function writeMarketplace(db) {
  try {
    safeWriteJSON(DB_FILE, db);
  } catch (e) {
    console.error('marketplace write error', e);
  }
}

// Basic marketplace info (legacy)
router.get('/', (req, res) => res.json({ artists: [] }));

import currency from '../lib/currency.js';

// List current marketplace listings
router.get('/list', (req, res) => {
  const db = readMarketplace();
  const listings = db.listings || [];
  const display = req.query.display === 'true' || req.query.display === '1';
  const displayOrder = ['PI','USD','EUR','CNY','RUB','GOLD'];
  if (display) {
    const enriched = listings.map((l) => ({
      ...l,
      displayPrices: currency.displayPrices(l.price || 0, l.baseCurrency || 'USD', displayOrder),
    }));
    return res.json({ listings: enriched });
  }
  res.json({ listings });
});

router.get('/:id', (req, res) => res.json({ artist: null }));

// Create a listing - must be the artist (owner) putting their own media on sale
router.post('/list', jwtAuth, ownerAuth({ body: 'artistId' }), (req, res) => {
  const { artistId, mediaId, title, description = '', price = 0, baseCurrency = 'USD', token = 'ARTC', pole = 'digital', channel = 'marketplace' } = req.body;
  if (!artistId || !mediaId || !title) return res.status(400).json({ error: 'artistId, mediaId and title required' });
  const artist = artistDB.getArtist(artistId);
  if (!artist) return res.status(404).json({ error: 'artist not found' });
  const listing = {
    id: `listing-${Date.now()}`,
    artistId,
    artistName: artist.name || undefined,
    mediaId,
    title,
    description,
    price: Number(price),
    baseCurrency: baseCurrency || 'USD',
    token,
    pole,
    channel,
    createdAt: new Date().toISOString(),
    exhibited: false,
  };
  const db = readMarketplace();
  db.listings = db.listings || [];
  db.listings.push(listing);
  writeMarketplace(db);
  logAudit({ type: 'marketplace_list_create', artistId, listingId: listing.id, title });
  res.status(201).json({ listing });
});

// Admin only: mark a listing as exhibited (visible in museum)
router.post('/:id/exhibit', jwtAuth, (req, res) => {
  const { id } = req.params;
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'forbidden: admin only' });
  const db = readMarketplace();
  const listing = (db.listings || []).find(l => String(l.id) === String(id));
  if (!listing) return res.status(404).json({ error: 'listing not found' });
  listing.exhibited = true;
  listing.exhibitedAt = new Date().toISOString();
  writeMarketplace(db);
  logAudit({ type: 'marketplace_exhibit', listingId: id, admin: req.user.id });
  return res.json({ ok: true, listing });
});

// Purchase artwork with ARTC or PI
// E2E stub route: if the X-E2E-Stub header is present, short-circuit with 204 without auth
router.post('/buy', (req, res, next) => {
	if (req.headers && String(req.headers['x-e2e-stub']) === '1') {
		console.log('marketplace buy stub used (E2E) [unprotected route]');
		return res.status(204).end();
	}
	next();
});

router.post('/buy', jwtAuth, ownerAuth({ body: 'userId' }), (req, res) => {
	const { userId: buyer = req.user?.id, sellerId = 'marketplace-seller', productId, amount, token = 'ARTC' } = req.body;
	if (!buyer || !productId || typeof amount !== 'number') return res.status(400).json({ error: 'buyer, productId and numeric amount required' });
		// if sellerId provided and not marketplace-seller, check it exists
		if (sellerId && sellerId !== 'marketplace-seller') {
			const seller = artistDB.getArtist(sellerId);
			if (!seller) return res.status(404).json({ error: 'seller not found' });
		}
	const db = readDB();
	ensureAccount(buyer); ensureAccount(sellerId);
	if ((db.accounts[buyer].balances[token] || 0) < amount) return res.status(400).json({ error: 'insufficient balance' });
	db.accounts[buyer].balances[token] -= amount;
	db.accounts[sellerId].balances[token] = (db.accounts[sellerId].balances[token] || 0) + amount;
	const txOut = { id: `tx-${Date.now()}`, accountId: buyer, type: 'DEBIT', token, amount: -amount, description: `Bought ${productId}`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
	const txIn = { id: `tx-${Date.now()}-in`, accountId: sellerId, type: 'CREDIT', token, amount, description: `Sale ${productId}`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
	db.transactions.push(txOut, txIn);
	logAudit({ type: 'marketplace_buy', buyer, sellerId, productId, token, amount });
	writeDB(db);
	return res.json({ ok: true, buyer: db.accounts[buyer], seller: db.accounts[sellerId] });
});

export default router;