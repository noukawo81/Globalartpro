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
  const walletFile = path.resolve(process.cwd(), 'data', 'wallet_db.json');
  let db = { accounts: {}, transactions: [], nfts: [], audit: [] };
  try { db = JSON.parse(fs.readFileSync(walletFile, 'utf8')); } catch (e) {}
  db.accounts = db.accounts || {};
  db.accounts['user-test-1'] = { userId: 'user-test-1', balances: { ARTC: 100, PI: 0, IA: 0 }, createdAt: new Date().toISOString() };
  db.accounts['artist-test-1'] = { userId: 'artist-test-1', balances: { ARTC: 0, PI: 0, IA: 0 }, createdAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(walletFile), { recursive: true });
  fs.writeFileSync(walletFile, JSON.stringify(db, null, 2), 'utf8');

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

describe('Marketplace buy checks', () => {
  test('POST /api/marketplace/buy success when buyer matches token and seller exists', async () => {
    const token = makeToken('user-test-1');
    const res = await request(app)
      .post('/api/marketplace/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'user-test-1', sellerId: 'artist-test-1', productId: 'prod-1', amount: 10, token: 'ARTC' });

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
  });

  test('POST /api/marketplace/buy reject if buyer mismatch with token', async () => {
    const token = makeToken('another-user');
    const res = await request(app)
      .post('/api/marketplace/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'user-test-1', sellerId: 'artist-test-1', productId: 'prod-2', amount: 1, token: 'ARTC' });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/marketplace/buy reject if seller does not exist', async () => {
    const token = makeToken('user-test-1');
    const res = await request(app)
      .post('/api/marketplace/buy')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'user-test-1', sellerId: 'unknown-seller', productId: 'prod-3', amount: 1, token: 'ARTC' });
    expect(res.statusCode).toBe(404);
  });
});
