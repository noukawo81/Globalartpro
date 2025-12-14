**Project summary**
- Monorepo with: `backend/` (Express REST API), `frontend/` (React + Vite), and a small Django site `globalartpro/` for policy pages.

**Architecture**
- `backend/src` exposes `/api/*` routes (look at `src/index.js`). Key route files live in `backend/src/routes` (e.g., `auth.js`, `gapstudio.js`, `artc.js`).
- Frontend (React + Vite) calls the backend via `frontend/src/services/api.js`; set `VITE_API_URL` to control base URL.
- Simple persistence: `backend/src/lib/walletDB.js` uses a JSON file (`data/wallet_db.json`) for demo state; heavier workflows use Postgres via `knexfile.js` and `backend/migrations`.

**Service boundaries & fallbacks**
- The main backend entry for local development is `backend/src/index.js` (exported routes). There is also `backend/server.js` used for demos/older servers that can serve a built frontend `build/|dist/` when present.
- `backend` hosts API routes and optionally static assets if a client build is present. Prefer editing `src/index.js` for new API routes.

**Quick Dev Commands**
- Backend: `cd backend && npm install && npm run dev` (nodemon on `src/index.js`).
- Frontend: `cd frontend && npm install && npm run dev` (http://localhost:5173).
- Docker services: `docker-compose up -d` (Postgres + MinIO). Run `cd backend && npm run migrate` if needed.

**Useful server scripts**
- `cd backend && npm run migrate` — run knex migrations (when using Postgres/Docker db)
- `cd backend && npm run start` — production node `src/index.js` (non-nodemon)
- `cd frontend && npm run build` — create a static build that the backend's `server.js` may serve

**Env variables**
- Backend: `JWT_SECRET`, `PORT`, `DATABASE_URL`, `CLIENT_URL`, `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`.
- Frontend: `VITE_API_URL`, `VITE_PI_NETWORK_KEY` (optional). Use `.env.local`.

**Additional env vars and 3rd-party keys**
- `REPLICATE_API_TOKEN` or `REPLICATE_API` — used by gapstudio (Replicate image models).
- `MURF_API_KEY` — used for text-to-speech in `backend/server.js` (murf integration).
- `MONGO_URI` (or MONGOURL) — optional MongoDB connection, read in `backend/server.js`.
- `PI_APP_WALLET` — the simulated Pi wallet destination used by `pi-payment` route.
- MinIO: `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_USE_SSL`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET` — for media storage; backend falls back to local `data/uploads` where not configured.

**Project-specific patterns**
- Auth: JWT tokens created in `backend/src/routes/auth.js` are stored in `localStorage` under `ga_token`; use `api.setToken` in `frontend` to persist authentication.
- API helpers: Add any API call to `frontend/src/services/api.js` to keep network logic centralized (e.g., `generateArt`, `mineARTC`, `transferARTC`).
- Mocked wallets: `walletDB.js` manages account creation and virtual balances; careful when converting to real DB-backed accounts.

**Conventions & common patterns**
- Token: `AuthContext` loads from `ga_token` or `token` key; `api.setToken` writes `ga_token` and sets Axios `Authorization` header.
- Local JSON DBs: backend uses simple JSON files in `backend/data/` for quick development: `wallet_db.json`, `artc_db.json` and others. Use `readDB/writeDB` helper functions in `backend/src/lib/*` files.
- Query/body param style: many endpoints expect `userId` as a query or body field (artc, wallet, profile operations).
- Mining/ARTC behavior: see `backend/src/routes/artc.js` which implements mining cooldown, sessions, transfers, and `ensureAccount` defaults (ARTC: 0 initially, walletDB default has ARTC: 10).
- Media uploads: `backend/src/lib/minioClient.js` will upload to MinIO when configured, else write files to `data/uploads`.

**Integration points**
- GapStudio: `backend/src/routes/gapstudio.js` debits IA/ARTC credits before returning a placeholder generation.
- Payments/ARTC token: routes under `backend/src/routes/artc.js` and `wallet.js` handle transactions; see `walletDB.js` for examples.

**External integrations & fallbacks**
- Replicate (`replicate` lib) is used for AI image generation (stable-diffusion) if `REPLICATE_API_TOKEN` is set; otherwise code falls back to placeholder images.
- Murf TTS is used when `MURF_API_KEY` is provided; fallback to stub URLs otherwise.
- MinIO/S3 is optional and used for media; the project contains a `minioClient` abstraction to simplify fallbacks.

**When adding features**
- Backend: Add a route file under `backend/src/routes`, export an Express Router, and register it in `backend/src/index.js`.
- Frontend: Add API helpers to `frontend/src/services/api.js` and call them from `frontend/src/components` or pages.

**Step-by-step recipe**
- Adding a new API route: create `backend/src/routes/myRoute.js` -> export `router` -> import and `app.use('/api/my', myRouter)` in `backend/src/index.js` -> write minimal tests with curl/Postman -> add `frontend` helper in `frontend/src/services/api.js` to call it.
- Creating new persisted data: prefer `knex` migrations + Postgres for production; for quick local dev, add to `backend/src/lib/*DB.js` or `data/*.json` using existing helper patterns.

**Debugging / testing notes**
- No integrated test runner; use local dev servers and tools (Postman, curl). Check `/api/health` for a quick status.
- Many endpoints are demo/mock — verify behavior in `backend/src/routes/*` and the JSON DB for state.

**Debugging tips**
- Use `GET /api/debug/routes` (in `backend/src/index.js`) to list registered routes and diagnose missing registration.
- `GET /api/health` returns `db: memory-based` when running with mock JSON DBs.
- Search `backend/data` for JSON files (`wallet_db.json`, `artc_db.json`, etc.) to inspect current state for debug or manual edits.
- Check `backend/src/lib/minioClient.js` for upload fallbacks — set `MINIO_*` env vars to test uploads to MinIO.

**Examples**
- `api.setToken(token)` — saves a JWT and sets `Authorization` headers for axios.
- `api.generateArt('my prompt')` — calls `/api/gapstudio/generate` and returns a placeholder image.

**Helpful file references (examples)**
- Register routes: [backend/src/index.js](../backend/src/index.js)
- Wallet helper: [backend/src/lib/walletDB.js](../backend/src/lib/walletDB.js)
- ArtC logic: [backend/src/routes/artc.js](../backend/src/routes/artc.js)
- MinIO client & fallback: [backend/src/lib/minioClient.js](../backend/src/lib/minioClient.js)
- API helpers for frontend: [frontend/src/services/api.js](../frontend/src/services/api.js)
- Auth context: [frontend/src/core/context/AuthContext.jsx](../frontend/src/core/context/AuthContext.jsx)

If anything is missing or you want a PR with tests/CI, say which area to expand.
