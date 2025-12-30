import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '../../src/index.js';
import { JWT_SECRET } from '../../src/middleware/jwtAuth.js';
import { jest } from '@jest/globals';
import { safeWriteJSON } from '../../src/lib/fileUtils.js';

// Increase timeout for potentially slow filesystem-based tests
jest.setTimeout(60000);

function makeToken(id, role = 'visitor') {
  return jwt.sign({ id, role }, JWT_SECRET);
}

beforeAll(() => {
  // Ensure artist exists
  const artistFile = path.resolve(process.cwd(), 'data', 'artists.json');
  let adb = { artists: [], invites: {} };
  try { adb = JSON.parse(fs.readFileSync(artistFile, 'utf8')); } catch (e) {}
  adb.artists = adb.artists || [];
  if (!adb.artists.find(a => String(a.id) === 'artist-test-1')) {
    adb.artists.push({ id: 'artist-test-1', name: 'Test Seller' });
    fs.mkdirSync(path.dirname(artistFile), { recursive: true });
    try { safeWriteJSON(artistFile, adb); } catch (e) { try { fs.writeFileSync(artistFile, JSON.stringify(adb, null, 2), 'utf8'); } catch (err) { console.warn('artist seed write failed', err && err.message); } }
  }

  // Seed museum item
  const mfile = path.resolve(process.cwd(), 'data', 'museum_db.json');
  let mdb = { items: [], likes: [], comments: [], audit: [] };
  try { mdb = JSON.parse(fs.readFileSync(mfile, 'utf8')); } catch (e) {}
  mdb.items = mdb.items || [];
  if (!mdb.items.find(i => String(i.id) === 'm-item-1')) {
    mdb.items.push({ id: 'm-item-1', title: 'Seeded Art', artistId: 'artist-test-1', createdAt: new Date().toISOString(), status: 'candidate' });
    fs.mkdirSync(path.dirname(mfile), { recursive: true });
    try { safeWriteJSON(mfile, mdb); } catch (e) { try { fs.writeFileSync(mfile, JSON.stringify(mdb, null, 2), 'utf8'); } catch (err) { console.warn('museum seed write failed', err && err.message); } }
  }
});

describe('Museum JSON fallback', () => {
  test('GET /api/museum returns seeded items', async () => {
    const res = await request(app).get('/api/museum');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    const found = res.body.items.find(i => i.id === 'm-item-1');
    expect(found).toBeTruthy();
  });

  test('GET /api/museum/:id returns details', async () => {
    const res = await request(app).get('/api/museum/m-item-1');
    expect(res.statusCode).toBe(200);
    expect(res.body.item).toBeTruthy();
    expect(res.body.item.id).toBe('m-item-1');
  });

  test('Authenticated user can like and toggle like', async () => {
    const token = makeToken('user-test-1', 'visitor');
    const r1 = await request(app).post('/api/museum/m-item-1/like').set('Authorization', `Bearer ${token}`).send();
    expect(r1.statusCode).toBe(200);
    expect(r1.body.liked).toBe(true);
    expect(r1.body.likesCount).toBe(1);

    const r2 = await request(app).post('/api/museum/m-item-1/like').set('Authorization', `Bearer ${token}`).send();
    expect(r2.statusCode).toBe(200);
    expect(r2.body.liked).toBe(false);
    expect(r2.body.likesCount).toBe(0);
  });

  test('Authenticated user can comment', async () => {
    const token = makeToken('user-test-2', 'visitor');
    const r = await request(app).post('/api/museum/m-item-1/comment').set('Authorization', `Bearer ${token}`).send({ content: 'Nice work!' });
    expect(r.statusCode).toBe(201);
    expect(r.body.comment).toBeTruthy();
    expect(r.body.comment.content).toBe('Nice work!');

    const details = await request(app).get('/api/museum/m-item-1');
    expect(details.statusCode).toBe(200);
    const comments = details.body.item.comments || [];
    expect(comments.find(c => c.content === 'Nice work!')).toBeTruthy();
  });
});
