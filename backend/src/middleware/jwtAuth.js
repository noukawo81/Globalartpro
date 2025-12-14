import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
console.log('JWT_SECRET (server):', JWT_SECRET);

export function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  console.log('jwtAuth header:', !!auth);
  if (!auth) return res.status(401).json({ error: 'Authorization header required' });
  const token = auth.replace(/^Bearer\s+/, '').trim();
  console.log('jwtAuth token prefix:', token && token.slice ? `${token.slice(0,12)}...` : typeof token);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (e) {
    console.error('jwtAuth error:', e.message);
    return res.status(401).json({ error: 'Invalid token', message: e.message });
  }
}

export default jwtAuth;
