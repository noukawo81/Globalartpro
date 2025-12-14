import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import artistDB from '../lib/artistDB.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';
const router = express.Router();

router.get('/', (req, res) => res.json({ artists: [] }));
router.get('/:id', (req, res) => res.json({ artist: null }));
router.post('/', (req, res) => res.status(201).json({ id: 'new-artist' }));

// Purchase artwork with ARTC or PI
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