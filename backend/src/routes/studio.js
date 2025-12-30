import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { addImage, addNFT, getImage, listUserNFTs, getNFT } from '../lib/studioDB.js';
import { safeWriteJSON } from '../lib/fileUtils.js';
import { readDB, writeDB, ensureAccount, logAudit } from '../lib/walletDB.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/jwtAuth.js';

const router = express.Router();

// Costs
const NFT_COST_ARTC = 2; // cost in ARTC to create an internal NFT


// Helper: ensure uploads dir
function ensureUploads() {
  const uploadDir = path.resolve(process.cwd(), 'data', 'studio', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

// POST /studio/import
// Body: { userId, imageData } where imageData is a data URL (data:image/png;base64,...)
router.post('/import', (req, res) => {
  const { userId, imageData } = req.body || {};
  if (!userId || !imageData) return res.status(400).json({ error: 'userId and imageData required' });
  try {
    const match = imageData.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: 'imageData must be a data URL (base64)' });
    const contentType = match[1];
    const b64 = match[2];
    const buf = Buffer.from(b64, 'base64');
    const hash = crypto.createHash('sha256').update(buf).digest('hex');

    const ext = contentType.split('/')[1] || 'png';
    const uploadDir = ensureUploads();
    const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
    const outPath = path.join(uploadDir, filename);
    fs.writeFileSync(outPath, buf);

    const relPath = path.relative(process.cwd(), outPath);
    const img = addImage({ owner: String(userId), path: relPath, hash, contentType, createdAt: new Date().toISOString() });
    return res.json({ ok: true, image: img });
  } catch (e) {
    console.error('studio import error', e);
    return res.status(500).json({ error: 'import failed', detail: e.message });
  }
});

// POST /studio/generate-nft
// Body: { userId, imageId, title?, description?, status? }
// Supports an optional Authorization token; if present it will be decoded and set in req.user
function optionalJwt(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const token = auth.replace(/^Bearer\s+/, '').trim();
  try {
    const primary = process.env.JWT_SECRET || JWT_SECRET;
    try {
      const payload = jwt.verify(token, primary);
      req.user = { id: payload.id, role: payload.role };
      return next();
    } catch (e) {
      try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.id, role: payload.role };
        return next();
      } catch (e2) {
        console.warn('optionalJwt: token verification failed', e2.message);
        return next();
      }
    }
  } catch (e) {
    console.warn('optionalJwt error', e.message);
    return next();
  }
}

router.post('/generate-nft', optionalJwt, (req, res) => {
  const { imageId, title, description, status } = req.body || {};
  const userId = req.user?.id || req.body?.userId;
  if (!userId || !imageId) return res.status(400).json({ error: 'userId and imageId required' });
  try {
    const img = getImage(imageId);
    if (!img) return res.status(404).json({ error: 'image not found' });
    if (String(img.owner) !== String(userId)) return res.status(403).json({ error: 'image does not belong to user' });

    // Check user passes (free NFT allowance)
    ensureAccount(userId);
    const db = readDB();
    db.transactions = db.transactions || [];
    db.accounts = db.accounts || {};
    const acc = db.accounts[userId];
    let passUsed = null;
    const now = Date.now();
    if (acc && acc.passes && acc.passes.length) {
      for (let i = 0; i < acc.passes.length; i++) {
        const pass = acc.passes[i];
        if (pass.active && pass.start && pass.end && pass.start <= now && pass.end > now) {
          // Genesis gives freeNFT count
          if (pass.type === 'genesis' && pass.limits && typeof pass.limits.freeNFT === 'number' && pass.limits.freeNFT > 0) {
            // consume one
            acc.passes[i].limits.freeNFT = pass.limits.freeNFT - 1;
            passUsed = pass;
            const txPass = { id: `tx-passcons-${Date.now()}`, accountId: userId, type: 'PASS_CONSUME', token: 'USD', amount: 0, description: `Genesis free NFT consumption`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
            db.transactions.push(txPass);
            logAudit({ type: 'pass_consume', userId, pass: pass.type, remaining: acc.passes[i].limits.freeNFT });
            writeDB(db);
            break;
          }
          // Aurum and Eternum permit free NFT creation
          if (pass.type === 'aurum' || pass.type === 'eternum') {
            passUsed = pass;
            const txPass = { id: `tx-passcons-${Date.now()}`, accountId: userId, type: 'PASS_USE', token: 'USD', amount: 0, description: `${pass.type} free NFT creation`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
            db.transactions.push(txPass);
            logAudit({ type: 'pass_use', userId, pass: pass.type });
            writeDB(db);
            break;
          }
        }
      }
    }

    // If no passUsed, charge ARTC cost for NFT creation
    if (!passUsed) {
      const balance = acc?.balances?.ARTC || 0;
      if (balance < NFT_COST_ARTC) return res.status(402).json({ error: 'insufficient funds for NFT creation', required: NFT_COST_ARTC, balance });

      // Debit ARTC and create transaction
      db.accounts[userId].balances.ARTC = (db.accounts[userId].balances.ARTC || 0) - NFT_COST_ARTC;
      const tx = { id: `tx-nft-${Date.now()}`, accountId: userId, type: 'DEBIT', token: 'ARTC', amount: -NFT_COST_ARTC, description: `GAP Studio NFT creation - ${imageId}`, datetime: new Date().toISOString(), status: 'CONFIRMED' };
      db.transactions.push(tx);
      logAudit({ type: 'gap_nft_create', userId, cost: NFT_COST_ARTC });
      writeDB(db);
    }

    const nft = {
      image: img.path,
      author: String(userId),
      date: new Date().toISOString(),
      status: status || 'gallery', // draft | gallery | marketplace
      title: title || `GAP Studio - ${new Date().toISOString()}`,
      description: description || '',
      metadata: {
        generator: 'GAP_STUDIO',
        generator_version: '1.0',
        image_hash: img.hash,
        cost_debited: NFT_COST_ARTC,
      },
    };

    const created = addNFT(nft);
    return res.json({ ok: true, nft: created, charged: { token: 'ARTC', amount: NFT_COST_ARTC } });
  } catch (e) {
    console.error('generate-nft error', e);
    return res.status(500).json({ error: 'generate failed', detail: e.message });
  }
});

// GET /studio/gallery?userId=
router.get('/gallery', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  try {
    const items = listUserNFTs(String(userId));
    return res.json({ ok: true, items });
  } catch (e) {
    console.error('gallery error', e);
    return res.status(500).json({ error: 'gallery failed' });
  }
});

// GET /studio/nft/:id
router.get('/nft/:id', (req, res) => {
  const id = req.params.id;
  const nft = getNFT(id);
  if (!nft) return res.status(404).json({ error: 'nft not found' });
  return res.json({ ok: true, nft });
});

export default router;