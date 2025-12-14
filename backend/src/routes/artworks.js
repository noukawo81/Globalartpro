import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ artists: [] }));
router.get('/:id', (req, res) => res.json({ artist: null }));
router.post('/', (req, res) => res.status(201).json({ id: 'new-artist' }));

export default router;