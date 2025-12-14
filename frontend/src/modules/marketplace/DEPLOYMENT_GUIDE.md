# 🚀 Marketplace GlobalArtPro — Guide de Test & Déploiement

**Version:** 1.0 | **Date:** Janvier 2025

---

## 🧪 Test Local (Frontend)

### Prérequis
```bash
Node.js 16+ installed
npm ou yarn
```

### Installation et Démarrage

```bash
# 1. Naviguer vers le dossier frontend
cd frontend

# 2. Installer dépendances (si pas fait)
npm install

# 3. Démarrer le serveur Vite
npm run dev

# ✅ Server démarre sur http://localhost:5174
```

### Test Checklist

#### Navigation 4-pôles
- [ ] Cliquer sur "🏛️ Art Physique" → Affiche 3 produits
- [ ] Cliquer sur "💻 Art Numérique" → Affiche 2 produits
- [ ] Cliquer sur "🔗 NFT Web3" → Affiche 1 NFT
- [ ] Cliquer sur "🏢 Musée 3D" → Affiche 1 galerie

#### Recherche et Filtres
- [ ] Taper "Masque" → Filtre par titre ✓
- [ ] Taper "Kofi" → Filtre par artiste ✓
- [ ] Tri "Prix croissant" → Réordonne produits
- [ ] Range slider prix → Filtre dynamique
- [ ] Checkbox "✓ Certifiés uniquement" → Cache non-certifiés

#### Cartes Produits
- [ ] Badge "✓ Certifié GlobalArtPro" visible
- [ ] Badge "Gold"/"Elite"/"Silver"/"Bronze" visible (couleurs distinctes)
- [ ] Stats affichées (👁️ Views, ❤️ Favorites)
- [ ] Hover effect (zoom image, drop shadow)

#### Modal Détails
- [ ] Cliquer sur carte → Modal apparaît
- [ ] Bouton "✕" ferme modal
- [ ] **Physical Art:** Affiche Matériaux, Dimensions, Provenance, Historique, Transport, Retours
- [ ] **Digital Art:** Affiche Formats, Licence, Versions
- [ ] **NFT:** Affiche Blockchain, Token ID, Contexte culturel, Revente
- [ ] Boutons "🛒 Ajouter", "❤️ Favoris", "📊 Enchères" visibles

#### Responsive Design
- [ ] Redimensionner fenêtre → Grid s'adapte (3 cols → 1 col)
- [ ] Mobile (375px):** Tabs empilées, filters flexibles
- [ ] Tablet (768px):** 2 cols
- [ ] Desktop (1200px):** 3-4 cols

#### Call-to-action
- [ ] Section "Es-tu un artiste?" visible en bas
- [ ] Bouton "Créer mon profil artiste" cliquable

---

## 🔌 Intégration Backend (Express)

### 1. Créer routes Express

**File:** `backend/routes/marketplace.js`

```javascript
const express = require("express");
const router = express.Router();

// GET /api/marketplace/products
router.get("/products", async (req, res) => {
  const { pole, search, sortBy, minPrice, maxPrice, certifiedOnly } = req.query;

  // Filtre depuis BDD
  // Retourner JSON avec structure:
  // { success: true, data: [...], pagination: {...} }
});

// GET /api/marketplace/products/:id
router.get("/products/:id", async (req, res) => {
  // Retourner détail produit complet
});

// POST /api/marketplace/products (artiste)
router.post("/products", authenticate, authorize("artist"), async (req, res) => {
  // Upload produit, validation, storage
});

// ... autres routes

module.exports = router;
```

**File:** `backend/app.js` (ou `server.js`)

```javascript
const marketplaceRoutes = require("./routes/marketplace");
app.use("/api/marketplace", marketplaceRoutes);
```

### 2. Structure BDD (PostgreSQL)

```sql
-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist_id INT NOT NULL,
  pole VARCHAR(50) NOT NULL, -- physical|digital|nft|museum
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  description TEXT,
  images TEXT[], -- JSON array de URLs
  certified BOOLEAN DEFAULT FALSE,
  cert_number VARCHAR(50) UNIQUE,
  artisan_grade VARCHAR(50),
  views INT DEFAULT 0,
  favorites INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (artist_id) REFERENCES artists(id)
);

-- Pole-specific tables
CREATE TABLE physical_arts (
  id SERIAL PRIMARY KEY,
  product_id INT UNIQUE,
  materials VARCHAR(255),
  dimensions VARCHAR(100),
  provenance VARCHAR(100),
  history TEXT,
  shipping TEXT,
  returns TEXT,
  video_360_url VARCHAR(500),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ... digital_arts, nfts, auctions tables
```

---

## 📦 Déploiement Production

### Option 1: Vercel (Recommandé pour Frontend)

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Depuis folder frontend/
cd frontend

# 3. Deploy
vercel --prod

# ✅ Frontend live sur vercel.com domain
```

**Configurer ENV vars dans Vercel:**
```
REACT_APP_API_BASE=https://api.globalartpro.com/api
```

### Option 2: Heroku (Backend)

```bash
# 1. Installer Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Créer app
heroku create globalartpro-api

# 4. Ajouter PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Deploy
git push heroku main

# ✅ API live sur globalartpro-api.herokuapp.com
```

### Option 3: Docker (Recommandé)

**Dockerfile (Frontend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: "3.8"

services:
  frontend:
    build:
      context: ./frontend
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_BASE: http://api:3000/api

  api:
    build:
      context: ./backend
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/globalartpro
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: globalartpro
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Démarrer avec Docker:**
```bash
docker-compose up -d
# ✅ Système complet sur localhost:3000
```

---

## ✅ Checklist Déploiement

- [ ] Frontend build réussi (`npm run build`)
- [ ] Backend tests passent (`npm test`)
- [ ] ENV vars configurées (API URL, DB URL, etc.)
- [ ] CORS autorisé (frontend domain)
- [ ] Database migrations exécutées
- [ ] Assets optimisés (images CDN)
- [ ] Certificats SSL valides (HTTPS)
- [ ] Monitoring setup (Sentry, Datadog)
- [ ] Backup automatique BDD
- [ ] Rate limiting API configuré

---

## 🐛 Troubleshooting

### Problème: "Module not found"
```bash
# Solution:
npm install
npm run dev
```

### Problème: "Cannot POST /api/marketplace/products"
```
Vérifier:
- Backend route existe (backend/routes/marketplace.js)
- Route importée dans app.js/server.js
- CORS headers OK
- API URL correcte dans config
```

### Problème: "Images ne chargent pas"
```
Vérifier:
- Images URLs valides dans MOCK_DATA
- CDN accessible
- CORS headers on image origin
- Chemin relatif correct
```

### Problème: "Modal ne ferme pas"
```
Vérifier:
- closeModal() passé en prop
- onClick overlay déclenche closeModal
- z-index modal assez élevé
```

---

## 📊 Monitoring Production

### Logs
```bash
# Frontend (Vercel)
vercel logs

# Backend (Heroku)
heroku logs --tail

# Docker
docker-compose logs -f api
```

### Metrics
- Response times (< 500ms target)
- Error rate (< 1% target)
- Uptime (99.9% target)
- Database queries/sec

---

## 🔒 Security Checklist

- [ ] API authentication (JWT tokens)
- [ ] Input validation (XSS prevention)
- [ ] SQL injection protection (parameterized queries)
- [ ] HTTPS enforced
- [ ] CORS whitelist strict
- [ ] Rate limiting enabled
- [ ] Secrets in ENV vars (never in code)
- [ ] Database password encrypted
- [ ] Regular security audits

---

## 📝 Logs & Monitoring URLs

**Development:**
- Frontend: http://localhost:5174
- Backend: http://localhost:3000
- Database: PostgreSQL local

**Production (Example):**
- Frontend: https://globalartpro.vercel.app
- API: https://api.globalartpro.com
- Admin: https://admin.globalartpro.com

---

**Questions?** Consulte l'équipe devops ou la documentation complète en MARKETPLACE_ARCHITECTURE.md

