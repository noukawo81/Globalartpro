import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
// JWT_SECRET loaded

export function jwtAuth(req, res, next) {
  const auth = req.headers.authorization;
  // jwtAuth header presence: logged in tests when needed
  if (!auth) return res.status(401).json({ error: 'Authorization header required' });
  const token = auth.replace(/^Bearer\s+/, '').trim();
  // token prefix omitted for production logs
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
