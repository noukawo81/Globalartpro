import request from 'supertest';
import app from '../../src/index.js';

describe('Marketplace pricing and display', () => {
  test('POST /api/marketplace/list stores baseCurrency and GET /api/marketplace/list?display=true returns displayPrices', async () => {
    // create a fake token via auth route test user generation
    const r = await request(app).post('/api/auth/register').send({ name: 'Price Tester', email: `price${Date.now()}@test`, password: 'password', role: 'artist' });
    const token = (r.body && (r.body.token || r.body?.user?.token)) || r.body?.token;
    const artistId = r.body.user?.id || r.body?.user?.userId || 'artist-test-1';
    const create = await request(app).post('/api/marketplace/list').set('Authorization', `Bearer ${token}`).send({ artistId, mediaId: 'm-price-1', title: 'Price Test', price: 12.5, baseCurrency: 'USD' });
    // suppressed verbose logs in CI to avoid slow console output
    expect(create.status).toBe(201);
    const list = await request(app).get('/api/marketplace/list?display=true');
    // suppressed verbose logs in CI to avoid slow console output
    expect(list.status).toBe(200);
    const items = list.body.listings;
    expect(Array.isArray(items)).toBe(true);
    const created = items.find(i => i.title === 'Price Test');
    expect(created).toBeTruthy();
    expect(created.displayPrices).toBeTruthy();
    expect(created.displayPrices.USD).toBeGreaterThan(0);
    expect(created.displayPrices.PI).toBeDefined();
  });
});