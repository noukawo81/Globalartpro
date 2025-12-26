import request from 'supertest';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import app from '../../src/index.js';
import { JWT_SECRET } from '../../src/middleware/jwtAuth.js';
import { jest } from '@jest/globals';

jest.setTimeout(60000);

function makeToken(id, role = 'visitor') {
  return jwt.sign({ id, role }, JWT_SECRET);
}

beforeAll(() => {
  // ensure admin user exists in tests by token only
  // ensure there is an item to manage
  const mfile = path.resolve(process.cwd(), 'data', 'museum_db.json');
  let mdb = { items: [], likes: [], comments: [], audit: [] };
  try { mdb = JSON.parse(fs.readFileSync(mfile, 'utf8')); } catch (e) {}
  mdb.items = mdb.items || [];
  if (!mdb.items.find(i => i.id === 'm-admin-1')) {
    mdb.items.push({ id: 'm-admin-1', title: 'Admin Test Item', artistId: 'artist-test-1', status: 'draft', createdAt: new Date().toISOString() });
  }
  // add a set of items to test pagination and status filtering
  for (let i=0;i<12;i++) {
    const id = `m-pub-${i}`;
    if (!mdb.items.find(it=>it.id === id)) {
      mdb.items.push({ id, title: `Public ${i}`, artistId: `artist-${i%3}`, status: 'public', category: 'photographie', tags: ['archive','urban'], createdAt: new Date().toISOString() });
    }
  }
  for (let i=0;i<4;i++) {
    const id = `m-draft-${i}`;
    if (!mdb.items.find(it=>it.id === id)) {
      mdb.items.push({ id, title: `Draft ${i}`, artistId: `artist-${i%2}`, status: 'draft', category: 'peinture', tags: ['rituel'], createdAt: new Date().toISOString() });
    }
  }
  // extra items with specific tag/category for tests
  if (!mdb.items.find(it=>it.id === 'm-cat-1')) mdb.items.push({ id: 'm-cat-1', title: 'Cat Spec', artistId: 'artist-x', status: 'public', category: 'photographie', tags: ['special','archive'], createdAt: new Date().toISOString() });
  if (!mdb.items.find(it=>it.id === 'm-tag-1')) mdb.items.push({ id: 'm-tag-1', title: 'Tag Spec', artistId: 'artist-x', status: 'public', category: 'mixed', tags: ['rituel','identity'], createdAt: new Date().toISOString() });
  fs.writeFileSync(mfile, JSON.stringify(mdb, null, 2), 'utf8');
});

describe('Museum Admin endpoints', () => {
  test('Admin can list all items', async () => {
    const token = makeToken('admin-1', 'admin');
    const res = await request(app).get('/api/museum/admin/list').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  test('Non-admin cannot list', async () => {
    const token = makeToken('user-1', 'visitor');
    const res = await request(app).get('/api/museum/admin/list').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  test('Admin can update item fields', async () => {
    const token = makeToken('admin-1', 'admin');
    const res = await request(app).put('/api/museum/admin/m-admin-1').set('Authorization', `Bearer ${token}`).send({ title: 'Updated Title', price: 100, category: 'exposition', access: 'public' });
    expect(res.statusCode).toBe(200);
    expect(res.body.item.title).toBe('Updated Title');
    expect(res.body.item.price).toBe(100);
  });

  test('Admin can toggle visibility', async () => {
    const token = makeToken('admin-1', 'admin');
    const res = await request(app).post('/api/museum/admin/m-admin-1/toggle-visibility').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.item).toBeTruthy();
  });

  test('Admin can archive and delete item', async () => {
    const token = makeToken('admin-1', 'admin');
    const r1 = await request(app).post('/api/museum/admin/m-admin-1/archive').set('Authorization', `Bearer ${token}`);
    expect(r1.statusCode).toBe(200);
    expect(r1.body.item.status).toBe('archived');

    const r2 = await request(app).delete('/api/museum/admin/m-admin-1').set('Authorization', `Bearer ${token}`);
    expect(r2.statusCode).toBe(200);
    // verify deleted
    const r3 = await request(app).get('/api/museum/m-admin-1');
    expect(r3.statusCode).toBe(404);
  });
});