import request from 'supertest';
import app from '../../src/index.js';
import fs from 'fs';

// small base64 1x1 PNG
const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

describe('Studio API', () => {
  test('POST /api/studio/import and /api/studio/generate-nft', async () => {
    const userId = 'test-user-1';
    const imp = await request(app).post('/api/studio/import').send({ userId, imageData: tinyPng });
    expect(imp.status).toBe(200);
    expect(imp.body.ok).toBe(true);
    expect(imp.body.image).toBeDefined();
    const imageId = imp.body.image.id;

    const gen = await request(app).post('/api/studio/generate-nft').send({ userId, imageId, title: 'Test NFT', description: 'desc' });
    expect(gen.status).toBe(200);
    expect(gen.body.ok).toBe(true);
    expect(gen.body.nft).toBeDefined();
    expect(gen.body.nft.author).toBe(userId);
    expect(gen.body.nft.status).toBe('gallery');
  });
});
