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
  const dbFile = path.resolve(process.cwd(), 'data', 'wallet_db.json');
  let db = { accounts: {}, transactions: [], nfts: [], audit: [] };
  try { db = JSON.parse(fs.readFileSync(dbFile, 'utf8')); } catch (e) {}
  db.accounts = db.accounts || {};
  db.accounts['user-test-1'] = { userId: 'user-test-1', balances: { ARTC: 100, PI: 0, IA: 0 }, createdAt: new Date().toISOString() };
  db.accounts['user-test-2'] = { userId: 'user-test-2', balances: { ARTC: 0, PI: 0, IA: 0 }, createdAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
});

describe('Wallet transfer ownership', () => {
  test('POST /api/wallet/send success when fromUser matches token', async () => {
    const token = makeToken('user-test-1');
    try { console.log('local verify:', jwt.verify(token, process.env.JWT_SECRET || 'secret').id); } catch (e) { console.error('local verify error', e.message); }
    const res = await request(app)
      .post('/api/wallet/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromUserId: 'user-test-1', toUserId: 'user-test-2', amount: 10, token: 'ARTC' });
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBeTruthy();
  });

  test('POST /api/wallet/send reject when fromUser mismatch', async () => {
    const token = makeToken('user-test-2');
    const res = await request(app)
      .post('/api/wallet/send')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromUserId: 'user-test-1', toUserId: 'user-test-2', amount: 1, token: 'ARTC' });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/wallet/send reject without token (401)', async () => {
    const res = await request(app)
      .post('/api/wallet/send')
      .send({ fromUserId: 'user-test-1', toUserId: 'user-test-2', amount: 1, token: 'ARTC' });
    expect(res.statusCode).toBe(401);
  });
});
