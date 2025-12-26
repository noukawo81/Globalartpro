import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { addImage, addNFT, getImage, listUserNFTs, getNFT } from '../lib/studioDB.js';
import { safeWriteJSON } from '../lib/fileUtils.js';

const router = express.Router();

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
router.post('/generate-nft', (req, res) => {
  const { userId, imageId, title, description, status } = req.body || {};
  if (!userId || !imageId) return res.status(400).json({ error: 'userId and imageId required' });
  try {
    const img = getImage(imageId);
    if (!img) return res.status(404).json({ error: 'image not found' });
    if (String(img.owner) !== String(userId)) return res.status(403).json({ error: 'image does not belong to user' });

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
      },
    };

    const created = addNFT(nft);
    return res.json({ ok: true, nft: created });
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