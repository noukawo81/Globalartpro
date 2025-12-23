import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '../../src/index.js';
import { JWT_SECRET } from '../../src/middleware/jwtAuth.js';

function makeToken(id, role = 'artist') {
  return jwt.sign({ id, role }, JWT_SECRET);
}

beforeAll(() => {
  const artistFile = path.resolve(process.cwd(), 'data', 'artists.json');
  let adb = { artists: [], invites: {} };
  try { adb = JSON.parse(fs.readFileSync(artistFile, 'utf8')); } catch (e) {}
  adb.artists = adb.artists || [];
  if (!adb.artists.find(a => String(a.id) === 'artist-test-1')) {
    adb.artists.push({ id: 'artist-test-1', name: 'Test Seller' });
    fs.mkdirSync(path.dirname(artistFile), { recursive: true });
    fs.writeFileSync(artistFile, JSON.stringify(adb, null, 2), 'utf8');
  }
});

describe('Marketplace listing and exhibit', () => {
  test('Artist can create a listing', async () => {
    const token = makeToken('artist-test-1', 'artist');
    const res = await request(app)
      .post('/api/marketplace/list')
      .set('Authorization', `Bearer ${token}`)
      .send({ artistId: 'artist-test-1', mediaId: 'm-test-1', title: 'Œuvre Test', price: 5, token: 'ARTC' });

    expect(res.statusCode).toBe(201);
    expect(res.body.listing).toBeTruthy();
    expect(res.body.listing.artistId).toBe('artist-test-1');
  });

  test('Non-admin cannot exhibit a listing', async () => {
    const token = makeToken('artist-test-1', 'artist');
    // create a listing
    const r1 = await request(app).post('/api/marketplace/list').set('Authorization', `Bearer ${token}`).send({ artistId: 'artist-test-1', mediaId: 'm-test-2', title: 'Test 2', price: 2 });
    const id = r1.body.listing.id;
    const res = await request(app).post(`/api/marketplace/${id}/exhibit`).set('Authorization', `Bearer ${token}`).send();
    expect(res.statusCode).toBe(403);
  });

  test('Admin can exhibit a listing', async () => {
    const artistToken = makeToken('artist-test-1', 'artist');
    const r1 = await request(app).post('/api/marketplace/list').set('Authorization', `Bearer ${artistToken}`).send({ artistId: 'artist-test-1', mediaId: 'm-test-3', title: 'Test 3', price: 3 });
    const id = r1.body.listing.id;
    const adminToken = makeToken('globalart-admin', 'admin');
    const res = await request(app).post(`/api/marketplace/${id}/exhibit`).set('Authorization', `Bearer ${adminToken}`).send();
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
    expect(res.body.listing.exhibited).toBeTruthy();
  });
});