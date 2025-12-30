import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '../../src/index.js';
import { JWT_SECRET } from '../../src/middleware/jwtAuth.js';

// Helpers
function makeToken(id, role = 'artist') {
  return jwt.sign({ id, role }, JWT_SECRET);
}

beforeAll(() => {
  // prepare test artist
  const dbFile = path.resolve(process.cwd(), 'data', 'artists.json');
  let db = { artists: [], invites: {} };
  try { db = JSON.parse(fs.readFileSync(dbFile, 'utf8')); } catch (e) {}
  db.artists = db.artists || [];
  if (!db.artists.find(a => String(a.id) === 'artist-test-1')) {
    db.artists.push({ id: 'artist-test-1', name: 'Test Artist' });
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  try { safeWriteJSON(dbFile, db); } catch (e) { try { fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8'); } catch (err) { console.warn('artist test seed write failed', err && err.message); } }
  }
});

describe('Artist ownership and auth checks', () => {
  test('PUT /api/artists/:id should allow owner with valid JWT', async () => {
    const token = makeToken('artist-test-1');
    const res = await request(app)
      .put('/api/artists/artist-test-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Artist' });

    expect(res.statusCode).toBe(200);
    expect(res.body.artist).toBeDefined();
    expect(res.body.artist.id).toBe('artist-test-1');
  });

  test('PUT /api/artists/:id should reject when user is not owner', async () => {
    const token = makeToken('another-user');
    const res = await request(app)
      .put('/api/artists/artist-test-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Hacker' });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/artists/:id/invite should allow owner', async () => {
    const token = makeToken('artist-test-1');
    const res = await request(app)
      .post('/api/artists/artist-test-1/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect([200,201,201]).toContain(res.statusCode);
    expect(res.body.invite || res.body.token).toBeDefined();
  });

  test('POST /api/artists/:id/invite should reject non-owner', async () => {
    const token = makeToken('another-user');
    const res = await request(app)
      .post('/api/artists/artist-test-1/invite')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.statusCode).toBe(403);
  });

  test('POST /api/artists/:id/media should accept base64 body for owner', async () => {
    const token = makeToken('artist-test-1');
    const fileBase64 = Buffer.from('hello world').toString('base64');
    const res = await request(app)
      .post('/api/artists/artist-test-1/media')
      .set('Authorization', `Bearer ${token}`)
      .send({ fileBase64, fileName: 'test.txt', mimetype: 'text/plain' });

    expect([200,201]).toContain(res.statusCode);
    expect(res.body.media || res.body.url).toBeDefined();
  });

  test('POST /api/artists/:id/media should reject non-owner', async () => {
    const token = makeToken('another-user');
    const fileBase64 = Buffer.from('hello world').toString('base64');
    const res = await request(app)
      .post('/api/artists/artist-test-1/media')
      .set('Authorization', `Bearer ${token}`)
      .send({ fileBase64, fileName: 'test.txt', mimetype: 'text/plain' });

    expect(res.statusCode).toBe(403);
  });
});
