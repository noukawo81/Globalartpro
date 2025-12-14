import express from 'express';
import jwtAuth from '../middleware/jwtAuth.js';
import ownerAuth from '../middleware/ownerAuth.js';
import artistDB from '../lib/artistDB.js';
import minioClient from '../lib/minioClient.js';

console.log('Loading artists route');
const router = express.Router();

// Param handler: attach artist if it exists
router.param('id', (req, res, next, id) => {
	try {
		const art = artistDB.getArtist(id);
		if (art) req.artist = art;
	} catch (e) {}
	next();
});

// Try to load multer; if unavailable (npm install issue), provide a base64 fallback
let upload;
try {
	const multer = await import('multer');
	upload = multer.default({ storage: multer.memoryStorage() });
} catch (e) {
	console.warn('multer not available, using base64 upload fallback');
	// provide a minimal single() compatible middleware
	upload = {
		single: () => (req, res, next) => {
			if (req.body && req.body.fileBase64) {
				req.file = {
					buffer: Buffer.from(req.body.fileBase64, 'base64'),
					originalname: req.body.fileName || 'upload.bin',
					mimetype: req.body.mimetype || 'application/octet-stream',
				};
			}
			next();
		},
	};
}

// Ensure we always support base64 body fallback even when multer is installed.
function singleWithBase64(fieldName) {
	const mw = upload && upload.single ? upload.single(fieldName) : (req, res, next) => next();
	return (req, res, next) => {
		// run multer middleware first (if present)
		mw(req, res, (err) => {
			if (err) return next(err);
			// if multer didn't populate req.file, check for base64 body
			if (!req.file && req.body && req.body.fileBase64) {
				req.file = {
					buffer: Buffer.from(req.body.fileBase64, 'base64'),
					originalname: req.body.fileName || 'upload.bin',
					mimetype: req.body.mimetype || 'application/octet-stream',
				};
			}
			return next();
		});
	};
}

router.get('/', (req, res) => {
	const db = artistDB.readDB();
	res.json({ artists: db.artists || [] });
});

router.get('/:id', (req, res) => {
	const { id } = req.params;
	const artist = artistDB.getArtist(id);
	if (!artist) return res.status(404).json({ error: 'artist not found' });
	res.json({ artist });
});

router.put('/:id', jwtAuth, ownerAuth({ param: 'id' }), (req, res) => {
	const { id } = req.params;
	const updated = { id, ...req.body };
	artistDB.upsertArtist(updated);
	res.json({ artist: updated });
});

// upload media (image/video/audio)
router.post('/:id/media', jwtAuth, ownerAuth({ param: 'id' }), singleWithBase64('file'), async (req, res) => {
	const { id } = req.params;
	if (!req.file) return res.status(400).json({ error: 'file required' });
	const { title = req.body.title || req.file.originalname, kind = req.body.kind || 'image' } = req.body;
	const ext = (req.file.originalname || '').split('.').pop() || 'bin';
	const destPath = `${id}/${Date.now()}.${ext}`;
	try {
		const result = await minioClient.uploadFile(req.file.buffer, destPath, req.file.mimetype);
		const media = { id: `m-${Date.now()}`, title, type: kind, url: result.url, createdAt: new Date().toISOString() };
		artistDB.addMediaToArtist(id, media);
		res.status(201).json({ media });
	} catch (e) {
		console.error('media upload error', e);
		res.status(500).json({ error: 'upload failed' });
	}
});

router.post('/:id/invite', jwtAuth, ownerAuth({ param: 'id' }), (req, res) => {
	const { id } = req.params;
	const token = `invite-${id}-${Date.now()}`;
	const saved = artistDB.saveInvite(id, token);
	res.json({ invite: saved, link: `${req.protocol}://${req.get('host')}/artist/invite/${token}` });
});

router.post('/', (req, res) => {
	const id = req.body.id || `artist-${Date.now()}`;
	const artist = { id, ...req.body };
	artistDB.upsertArtist(artist);
	res.status(201).json({ id });
});

export default router;