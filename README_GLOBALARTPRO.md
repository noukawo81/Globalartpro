# GlobalArtPro — Plan de transformation & guide de livraison

Résumé
-------
Transformer l'UI statique (zip) en une plateforme web fonctionnelle et déployable :
- Frontend : React (Vite)
- Backend : Node.js + Express (API REST)
- DB : Postgres (production) / mock (dev rapide)
- Stockage médias : MinIO (S3 compatible) ou S3
- Paiements/dons en Pi coin + token interne ARTC (simulation pour MVP)

Objectifs prioritaires
----------------------
1. Auth (register/login JWT)
2. Profils artistes + CRUD œuvres
3. Marketplace (achats, ordres, tx)
4. GAPstudio (génération IA, simulation possible)
5. Certificats (génération PDF + vérification)
6. Donations en Pi (QR/deep-link + validation manuelle/automatique)
7. Panel admin minimal
8. Préparer zip/build frontend pour AppStudio

Arborescence recommandée
------------------------
globalartpro/
├─ backend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ index.js
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  └─ middleware/
├─ frontend/
│  ├─ package.json
│  ├─ public/
│  └─ src/
│     ├─ App.jsx
│     ├─ pages/
│     ├─ components/
│     └─ services/api.js
├─ docker-compose.yml
└─ README_GLOBALARTPRO.md

Schéma de données (résumé)
--------------------------
- users (id uuid, role, name, email, password_hash, avatar, bio, created_at)
- artists (id, user_id FK, country, culture, domains, verified)
- artworks (id, artist_id, title, type, media_url, price, category, nft_metadata, status)
- market_orders (id, buyer_id, artwork_id, amount, currency, status, tx_hash)
- certificates (id, cert_id, holder, hash, issued_by, issued_at)
- donations (id, donor_id, amount, currency, method, tx_ref)
- gap_generations (id, user_id, prompt, result_url, metadata)
- sessions/tokens (refresh tokens)

Endpoints essentiels (exemples)
------------------------------
Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

Artists
- GET /api/artists
- GET /api/artists/:id
- POST /api/artists
- PUT /api/artists/:id

Artworks
- GET /api/artworks
- GET /api/artworks/:id
- POST /api/artworks (multipart upload)
- PUT /api/artworks/:id
- DELETE /api/artworks/:id

Marketplace
- POST /api/marketplace/buy
- GET /api/marketplace/orders

GAPstudio
- POST /api/gapstudio/generate
- GET /api/gapstudio/result/:id

Certificates
- POST /api/certificates/generate
- GET /api/certificates/verify/:cert_id

Donations
- POST /api/donations/create
- GET /api/donations (admin)

Gestion médias
--------------
- Upload via multer -> store to MinIO/S3
- Traitement image via sharp : dérivés + watermark (couleur #6a11cb)
- Stocker URL originales + watermarked dans DB

Développement local — rapide
---------------------------
Prérequis : Node.js, npm (Docker Desktop optionnel)

1) Backend (mode mock DB ou réel)
- Installer dépendances :
  cd c:\Users\hp\globalartpro\backend
  npm install
- Lancer (dev) :
  npm run dev
- Health-check :
  http://localhost:3000/api/health

2) Frontend
- Installer / lancer :
  cd c:\Users\hp\globalartpro\frontend
  npm install
  npm run dev
- Ouvrir : http://localhost:5173

3) Docker Compose (optionnel, Postgres + MinIO)
- Lancer :
  docker-compose up -d
- Si Docker Desktop ne démarre pas : utiliser mock DB (backend déjà supporte)

Variables d'environnement (exemples)
-----------------------------------
Backend (.env)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://gap:gap@localhost:5432/gap
JWT_SECRET=change_me
REFRESH_TOKEN_SECRET=change_me
PI_RECEIVE_ADDRESS=pi_wallet_address
CLIENT_URL=http://localhost:5173
MINIO_...

Frontend (.env)
VITE_API_URL=http://localhost:3000/api

Sécurité — points critiques
---------------------------
- Hachage mot de passe : bcrypt >=12
- JWT secrets en .env (ne pas committer)
- Limiter taille uploads, types permis (images/video/audio)
- Rate-limit endpoints sensibles
- Validation côté serveur pour every input
- HTTPS en production (Let's Encrypt)

Checklist avant zip / AppStudio
-------------------------------
[ ] Backend minimal fonctionnel : auth + artists + artworks (tests Postman)
[ ] Frontend connecté à API (auth/login flows)
[ ] Upload médias + stockage (MinIO or S3) fonctionnel
[ ] Don/QR : génération + copie adresse
[ ] GAPstudio : simulateur opérationnel (mocks visuels)
[ ] Génération certificat (PDF) basique + endpoint verification
[ ] Panel admin minimal pour validations
[ ] Tests end-to-end rapides (inscription, upload, achat sim)
[ ] .env.example fourni + instructions d'install
[ ] Build frontend : npm run build -> vérifier dist/
[ ] Préparer ZIP : inclure uniquement ce qui est demandé par AppStudio (généralement dist/, public/, assets/)

Commande PowerShell pour zipper proprement (exclure node_modules)
----------------------------------------------------------------
Compress-Archive -Path .\frontend\dist\* -DestinationPath .\globalartpro_react_final.zip -Force

Notes de déploiement
--------------------
- Déployer backend sur Railway/Heroku/Render (set env vars)
- Stocker médias sur S3 ou MinIO géré
- Webhook & monitoring pour donations/tx verification
- Si packaging AppStudio : verifier exigences spécifiques (manifest, icons, offline policy)

Tâches prioritaires (itératives)
-------------------------------
1. Stabiliser auth + sessions
2. CRUD artistes + artworks + upload
3. Marketplace (orders simulation)
4. Donations Pi : flow invoice/QR + champ tx submit
5. GAPstudio : intégration provider ou simulateur
6. Certificates PDF + verify endpoint
7. Admin UI & tests
8. Build & zip pour AppStudio

Assistance & suivi
------------------
Je peux :
- générer les fichiers backend stubs/migrations
- créer scripts PowerShell pour initialiser le projet
- générer README détaillé par dossier (frontend/backend)
- produire tests Postman collection

Indique la prochaine action que tu veux que j’effectue (ex : "génère migrations knex et seeds", "crée scripts d'upload Multer+Sharp", "prépare README frontend/backend séparés", "génère ZIP frontend/dist").// filepath: c:\Users\hp\globalartpro\README_GLOBALARTPRO.md

# GlobalArtPro — Plan de transformation & guide de livraison

Résumé
-------
Transformer l'UI statique (zip) en une plateforme web fonctionnelle et déployable :
- Frontend : React (Vite)
- Backend : Node.js + Express (API REST)
- DB : Postgres (production) / mock (dev rapide)
- Stockage médias : MinIO (S3 compatible) ou S3
- Paiements/dons en Pi coin + token interne ARTC (simulation pour MVP)

Objectifs prioritaires
----------------------
1. Auth (register/login JWT)
2. Profils artistes + CRUD œuvres
3. Marketplace (achats, ordres, tx)
4. GAPstudio (génération IA, simulation possible)
5. Certificats (génération PDF + vérification)
6. Donations en Pi (QR/deep-link + validation manuelle/automatique)
7. Panel admin minimal
8. Préparer zip/build frontend pour AppStudio

Arborescence recommandée
------------------------
globalartpro/
├─ backend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ index.js
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  ├─ models/
│  │  └─ middleware/
├─ frontend/
│  ├─ package.json
│  ├─ public/
│  └─ src/
│     ├─ App.jsx
│     ├─ pages/
│     ├─ components/
│     └─ services/api.js
├─ docker-compose.yml
└─ README_GLOBALARTPRO.md

Schéma de données (résumé)
--------------------------
- users (id uuid, role, name, email, password_hash, avatar, bio, created_at)
- artists (id, user_id FK, country, culture, domains, verified)
- artworks (id, artist_id, title, type, media_url, price, category, nft_metadata, status)
- market_orders (id, buyer_id, artwork_id, amount, currency, status, tx_hash)
- certificates (id, cert_id, holder, hash, issued_by, issued_at)
- donations (id, donor_id, amount, currency, method, tx_ref)
- gap_generations (id, user_id, prompt, result_url, metadata)
- sessions/tokens (refresh tokens)

Endpoints essentiels (exemples)
------------------------------
Auth
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

Artists
- GET /api/artists
- GET /api/artists/:id
- POST /api/artists
- PUT /api/artists/:id

Artworks
- GET /api/artworks
- GET /api/artworks/:id
- POST /api/artworks (multipart upload)
- PUT /api/artworks/:id
- DELETE /api/artworks/:id

Marketplace
- POST /api/marketplace/buy
- GET /api/marketplace/orders

GAPstudio
- POST /api/gapstudio/generate
- GET /api/gapstudio/result/:id

Certificates
- POST /api/certificates/generate
- GET /api/certificates/verify/:cert_id

Donations
- POST /api/donations/create
- GET /api/donations (admin)

Gestion médias
--------------
- Upload via multer -> store to MinIO/S3
- Traitement image via sharp : dérivés + watermark (couleur #6a11cb)
- Stocker URL originales + watermarked dans DB

Développement local — rapide
---------------------------
Prérequis : Node.js, npm (Docker Desktop optionnel)

1) Backend (mode mock DB ou réel)
- Installer dépendances :
  cd c:\Users\hp\globalartpro\backend
  npm install
- Lancer (dev) :
  npm run dev
- Health-check :
  http://localhost:3000/api/health

2) Frontend
- Installer / lancer :
  cd c:\Users\hp\globalartpro\frontend
  npm install
  npm run dev
- Ouvrir : http://localhost:5173

3) Docker Compose (optionnel, Postgres + MinIO)
- Lancer :
  docker-compose up -d
- Si Docker Desktop ne démarre pas : utiliser mock DB (backend déjà supporte)

Variables d'environnement (exemples)
-----------------------------------
Backend (.env)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://gap:gap@localhost:5432/gap
JWT_SECRET=change_me
REFRESH_TOKEN_SECRET=change_me
PI_RECEIVE_ADDRESS=pi_wallet_address
CLIENT_URL=http://localhost:5173
MINIO_...

Frontend (.env)
VITE_API_URL=http://localhost:3000/api

Sécurité — points critiques
---------------------------
- Hachage mot de passe : bcrypt >=12
- JWT secrets en .env (ne pas committer)
- Limiter taille uploads, types permis (images/video/audio)
- Rate-limit endpoints sensibles
- Validation côté serveur pour every input
- HTTPS en production (Let's Encrypt)

Checklist avant zip / AppStudio
-------------------------------
[ ] Backend minimal fonctionnel : auth + artists + artworks (tests Postman)
[ ] Frontend connecté à API (auth/login flows)
[ ] Upload médias + stockage (MinIO or S3) fonctionnel
[ ] Don/QR : génération + copie adresse
[ ] GAPstudio : simulateur opérationnel (mocks visuels)
[ ] Génération certificat (PDF) basique + endpoint verification
[ ] Panel admin minimal pour validations
[ ] Tests end-to-end rapides (inscription, upload, achat sim)
[ ] .env.example fourni + instructions d'install
[ ] Build frontend : npm run build -> vérifier dist/
[ ] Préparer ZIP : inclure uniquement ce qui est demandé par AppStudio (généralement dist/, public/, assets/)

Commande PowerShell pour zipper proprement (exclure node_modules)
----------------------------------------------------------------
Compress-Archive -Path .\frontend\dist\* -DestinationPath .\globalartpro_react_final.zip -Force

Notes de déploiement
--------------------
- Déployer backend sur Railway/Heroku/Render (set env vars)
- Stocker médias sur S3 ou MinIO géré
- Webhook & monitoring pour donations/tx verification
- Si packaging AppStudio : verifier exigences spécifiques (manifest, icons, offline policy)

Tâches prioritaires (itératives)
-------------------------------
1. Stabiliser auth + sessions
2. CRUD artistes + artworks + upload
3. Marketplace (orders simulation)
4. Donations Pi : flow invoice/QR + champ tx submit
5. GAPstudio : intégration provider ou simulateur
6. Certificates PDF + verify endpoint
7. Admin UI & tests
8. Build & zip pour AppStudio

Assistance & suivi
------------------
Je peux :
- générer les fichiers backend stubs/migrations
- créer scripts PowerShell pour initialiser le projet
- générer README détaillé par dossier (frontend/backend)
- produire tests Postman collection

Indique la prochaine action que tu veux que j’effectue (ex : "génère migrations knex et seeds", "crée scripts d'upload Multer+Sharp", "prépare README frontend/backend séparés", "génère ZIP frontend/dist").