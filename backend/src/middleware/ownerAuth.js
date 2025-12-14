/**
 * ownerAuth middleware
 * Usage: ownerAuth({ body: 'fromUserId' }) or ownerAuth({ param: 'id' }) or ownerAuth({ query: 'userId' })
 */
export default function ownerAuth(opts = {}) {
  const { param = null, body = null, query = null, allowAdmin = false } = opts;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Authorization required' });
    let target = null;
    if (param && req.params && typeof req.params[param] !== 'undefined') target = req.params[param];
    if (!target && body && req.body && typeof req.body[body] !== 'undefined') target = req.body[body];
    if (!target && query && req.query && typeof req.query[query] !== 'undefined') target = req.query[query];
    if (!target) target = req.user?.id;
    if (!target) return res.status(400).json({ error: 'target id required' });
    if (String(req.user.id) !== String(target) && !(allowAdmin && req.user.role === 'admin')) {
      return res.status(403).json({ error: 'forbidden: user must be owner' });
    }
    return next();
  };
}
