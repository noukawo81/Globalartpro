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
import museumRoutes from './routes/museum.js';
import studioRoutes from './routes/studio.js';
import chatRoutes from './routes/chat.js';

// Route registrations - group by responsibility

const app = express();
// CORS: allow dev localhost ports dynamically and respect CLIENT_URL in prod
const allowedClient = process.env.CLIENT_URL;
app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser requests like curl (no origin)
    if (!origin) return cb(null, true);
    if (allowedClient && origin === allowedClient) return cb(null, true);
    // Accept both http and https on any localhost port during development
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'), false);
  },
}));

// Development: remove overly-strict CSP headers to avoid noisy report-only logs in dev
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    try { res.removeHeader('Content-Security-Policy'); } catch (_) {}
    // Intentionally do NOT set a report-only CSP header in development to keep dev console noise minimal.
    // If you need to enable report-only behavior for debugging, set `DEV_ALLOWED_FRAME_ANCESTORS` and
    // re-add the header manually (see docs). The endpoint /api/debug/csp-report remains available to accept reports.
  }
  next();
});

// Debug: accept CSP report POSTs to /api/debug/csp-report (dev use)
app.post('/api/debug/csp-report', express.json(), (req, res) => {
  try {
    console.log('CSP report:', JSON.stringify(req.body).slice(0, 1000));
  } catch (e) {
    console.warn('CSP report log failed', e?.message);
  }
  res.status(204).end();
});

app.use(express.json({ limit: '50mb' }));
// Core auth & wallet routes first
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);

// Marketplace / artc / gapstudio / artists
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/artc', artcRoutes);
app.use('/api/gapstudio', gapstudioRoutes);
app.use('/api/artists', artistsRoutes);

// Portal & notifications
app.use('/api/portal', portalRoutes);
app.use('/api/notifications', notificationsRoutes);
// Chat (simple 1-to-1 text chat)
app.use('/api/chat', chatRoutes);
// Museum globe (concentric globe collection) - register BEFORE generic /api/museum to avoid route shadowing
import museumGlobeRoutes from './routes/museum_globe.js';
app.use('/api/museum/globe', museumGlobeRoutes);
// Museum (fallback JSON store for local dev)
app.use('/api/museum', museumRoutes);

// GAP Studio routes (image import, generate-nft, gallery)
app.use('/api/studio', studioRoutes);

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

// Test-time route dump for debugging
if (process.env.NODE_ENV === 'test') {
  try {
    const flat = [];
    if (app._router && app._router.stack) {
      app._router.stack.forEach((layer) => {
        if (layer.route && layer.route.path) flat.push(layer.route.path);
        else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach((l) => { if (l.route && l.route.path) flat.push(l.route.path); });
        }
      });
      console.log('TEST REGISTERED ROUTES:', flat);
    } else {
      console.log('TEST REGISTERED ROUTES: none (app._router missing)');
    }
  } catch (e) {
    console.warn('test route dump failed', e.message);
  }
}

const PORT = process.env.PORT || 3000;
// Export app for tests; only start server if not running under tests
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`Express server started on port ${PORT} (PID: ${process.pid})`);
  });
  server.on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });
}

export default app;