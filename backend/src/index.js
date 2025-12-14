import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import walletRoutes from './routes/wallet.js';
import portalRoutes from './routes/portal.js';
import notificationsRoutes from './routes/notifications.js';
import artcRoutes from './routes/artc.js';
import gapstudioRoutes from './routes/gapstudio.js';
import artistsRoutes from './routes/artists.js';
import marketplaceRoutes from './routes/marketplace.js';
// artistsRoutes loaded

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '50mb' }));
app.use('/api/artc', artcRoutes);
app.use('/api/gapstudio', gapstudioRoutes);
app.use('/api/artists', artistsRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: 'memory-based' }));

// Debug endpoint: list registered routes
app.get('/api/debug/routes', (req, res) => {
  try {
    const routes = [];
    app._router.stack.forEach((layer) => {
      if (layer.route && layer.route.path) {
        routes.push({ path: layer.route.path, methods: layer.route.methods });
      } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
        layer.handle.stack.forEach((l) => {
          if (l.route && l.route.path) {
            routes.push({ path: l.route.path, methods: l.route.methods });
          }
        });
      }
    });
    res.json({ routes });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
// Export app for tests; only start server if not running under tests
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    // server started
  });
}

export default app;