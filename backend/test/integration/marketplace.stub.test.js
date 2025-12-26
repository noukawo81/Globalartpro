import request from 'supertest';
import app from '../../src/index.js';

describe('Marketplace stub', () => {
  test('returns 204 when X-E2E-Stub header present in test env', async () => {
    const res = await request(app).post('/api/marketplace/buy').set('X-E2E-Stub', '1').send({ any: true });
    expect(res.status).toBe(204);
  });

  test('does not return 204 when header absent', async () => {
    const res = await request(app).post('/api/marketplace/buy').send({ any: true });
    // In test env, route is protected; since no auth is provided, expect 401 or similar
    expect([401, 403, 400, 404, 422]).toContain(res.status);
  });
});