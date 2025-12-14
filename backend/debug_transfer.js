import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from './src/index.js';

(function(){ try{ const t = jwt.sign({ id: 'user-test-1', role: 'artist' }, process.env.JWT_SECRET || 'secret'); global.__DEBUG_TOKEN__ = t; console.log('DEBUG_TOKEN', t); } catch (e) { console.error('JWT sign error', e); }})();
const token = global.__DEBUG_TOKEN__;
(function(){ try { const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret'); console.log('local verify ok', payload); } catch (e) { console.error('local verify failed', e.message); }})();
(async () => {
  const res = await request(app).post('/api/artc/transfer').set('Authorization', `Bearer ${token}`).send({ fromUserId: 'user-test-1', toUserId: 'user-test-2', amount: 1 });
  console.log('STATUS', res.statusCode);
  console.log('BODY', res.body);
})();
