import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '../../src/index.js';
import { JWT_SECRET } from '../../src/middleware/jwtAuth.js';
import { jest } from '@jest/globals';

jest.setTimeout(20000);

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

describe('Portal share', () => {
  test('Artist can share a media to portal and it is visible on posts', async () => {
    const token = makeToken('artist-test-1', 'artist');
    const res = await request(app).post('/api/portal/share').set('Authorization', `Bearer ${token}`).send({ artistId: 'artist-test-1', mediaId: 'm-test-portal-1', title: 'Post Test', description: 'Desc' });
    expect(res.statusCode).toBe(201);
    expect(res.body.post).toBeTruthy();

    const posts = await request(app).get('/api/portal/posts');
    expect(posts.statusCode).toBe(200);
    const found = (posts.body.posts || []).find(p => p.id === res.body.post.id);
    expect(found).toBeTruthy();
  });
});