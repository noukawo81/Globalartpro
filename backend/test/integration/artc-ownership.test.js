import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '../../src/index.js';
import { JWT_SECRET } from '../../src/middleware/jwtAuth.js';

function makeToken(id, role = 'artist') { return jwt.sign({ id, role }, JWT_SECRET); }

beforeAll(() => {
  const dbFile = path.resolve(process.cwd(), 'data', 'artc_db.json');
  const db = { accounts: {}, transactions: [], miningEvents: [], lastMine: {}, miningSessions: {} };
  db.accounts['user-test-1'] = { userId: 'user-test-1', balance: 10, createdAt: new Date().toISOString() };
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
});

describe('ARTC routes ownership', () => {
  test('POST /api/artc/transfer requires JWT and matching fromUserId', async () => {
    const token = makeToken('user-test-1');
    const res = await request(app)
      .post('/api/artc/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromUserId: 'user-test-1', toUserId: 'user-test-2', amount: 1 });
    if (res.statusCode !== 200) console.log('artc transfer response', res.statusCode, res.body);
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/artc/transfer rejects when fromUser mismatch', async () => {
    const token = makeToken('another-user');
    const res = await request(app)
      .post('/api/artc/transfer')
      .set('Authorization', `Bearer ${token}`)
      .send({ fromUserId: 'user-test-1', toUserId: 'user-test-2', amount: 1 });
    expect(res.statusCode).toBe(403);
  });

  test('POST /api/artc/start requires ownership', async () => {
    const token = makeToken('user-test-1');
    const res = await request(app)
      .post('/api/artc/start')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'user-test-1', durationMs: 1000 });
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/artc/claim requires ownership', async () => {
    const token = makeToken('user-test-1');
    // mark session ended
    const file = path.resolve(process.cwd(), 'data', 'artc_db.json');
    const db = JSON.parse(fs.readFileSync(file, 'utf8'));
    db.miningSessions = db.miningSessions || {};
    db.miningSessions['user-test-1'] = { userId: 'user-test-1', start: Date.now() - 2000, end: Date.now() - 1000, status: 'active', claimed: false };
    fs.writeFileSync(file, JSON.stringify(db, null, 2), 'utf8');

    const res = await request(app)
      .post('/api/artc/claim')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: 'user-test-1' });
    expect(res.statusCode).toBe(200);
  });
});
