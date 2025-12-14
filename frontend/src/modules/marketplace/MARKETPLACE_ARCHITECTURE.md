# 🎨 Marketplace GlobalArtPro — Architecture 4-Pôles

## Vue d'ensemble

Le **Marketplace GlobalArtPro** est une plateforme de commerce d'art multidimensionnelle structurée autour de **4 pôles distincts** (4 catégories principales), chacune avec son propre contexte, mécaniques et écosystème.

---

## 📊 Structure des 4 Pôles

### 1. 🏛️ **Art Physique** (`physical`)

**Description:** Œuvres traditionnelles, sculptures, photographies, objets d'art physique.

**Modèle de données:**
```javascript
{
  id: "p1",
  title: string,
  artist: string,
  price: number,
  currency: "EUR" | "USD" | "XOF",
  images: string[],          // Array de URLs
  video360: string,          // URL optionnelle pour visite 360°
  description: string,
  history: string,           // Provenance et historique
  materials: string,         // Matériaux utilisés
  dimensions: string,        // Dimensions (ex: "45cm x 30cm")
  provenance: string,        // Pays/région d'origine
  certified: boolean,
  certNumber: string,        // Format: GAP-YYYY-PHY-###
  certDate: string,          // Date de certification
  shipping: string,          // Options de transport
  returns: string,           // Politique de retour
  artisanGrade: "Bronze" | "Silver" | "Gold" | "Elite",
  views: number,
  favorites: number,
}
```

**Features:**
- **Galerie HD** : Photos haute résolution avec zoom
- **Visite 360°** : Support optionnel pour modèles 3D/panoramiques
- **Certificat d'authenticité** : QR code / téléchargement PDF
- **Transport assuré** : Options d'emballage et assurance intégrées
- **Métadonnées riches** : Matériaux, dimensions, historique complet

---

### 2. 💻 **Art Numérique** (`digital`)

**Description:** Illustrations, art génératif, designs, fichiers haute résolution pour impression ou usage commercial.

**Modèle de données:**
```javascript
{
  id: "d1",
  title: string,
  artist: string,
  price: number,
  currency: "EUR" | "USD" | "ARTC",
  images: string[],          // Aperçu
  description: string,
  formats: string[],         // ["JPG", "PNG", "TIFF", "PSD", "SVG"]
  license: "personnel" | "commercial",
  licensed: boolean,         // Droit d'usage accordé
  versions: string[],        // ["v1.0", "v2.0", ...]
  watermark: boolean,        // Marque d'eau de protection
  certified: boolean,
  certNumber: string,        // Format: GAP-YYYY-DIG-###
  certDate: string,
  artisanGrade: "Bronze" | "Silver" | "Gold" | "Elite",
  views: number,
  favorites: number,
}
```

**Features:**
- **Téléchargement multi-format** : JPG, PNG, TIFF, PSD, SVG
- **Licence flexible** : Personnel (personnel) ou Commercial (revente autorisée)
- **Historique des versions** : Accès aux versions antérieures
- **Watermark intégré** : Protection contre le vol
- **Marketplace pour VFX, design, impression**

---

### 3. 🔗 **NFT Web3** (`nft`)

**Description:** Jetons numériques authentifiés par blockchain (ARTCoin, Pi Network, Ethereum).

**Modèle de données:**
```javascript
{
  id: "n1",
  title: string,
  artist: string,
  price: number,
  currency: "ARTC" | "π" | "ETH",
  images: string[],
  description: string,
  blockchain: "ARTCoin" | "Pi Network" | "Ethereum",
  tokenId: string,           // Identifiant unique on-chain
  smartContract: string,     // Adresse du contrat
  culturalContext: string,   // Contexte culturel/historique
  bilingualDescription: string, // Français + langue locale
  certified: boolean,
  certNumber: string,        // Format: GAP-YYYY-NFT-###
  certDate: string,
  artisanGrade: "Bronze" | "Silver" | "Gold" | "Elite",
  resellable: boolean,       // Possibilité de revente
  views: number,
  favorites: number,
  auctionActive: boolean,    // Enchère en cours?
  auctionEndDate: string,    // Ex: "2025-02-15"
}
```

**Features:**
- **On-chain verification** : Authentification par blockchain
- **Smart contracts** : Droits d'auteur et royalties automatiques
- **Multilingue** : Français + langue culturelle locale
- **Système d'enchères** : Enchères mensuelles (voir section Enchères)
- **Resale ecosystem** : Revente autorisée avec traceback

---

### 4. 🏢 **Musée 3D Interactif** (`museum`)

**Description:** Galeries virtuelles immersives, visite de musées, exhibitions collaboratives.

**Modèle de données:**
```javascript
{
  id: "m1",
  title: string,
  type: "3d-gallery",
  description: string,
  continent: string,         // "Afrique", "Asie", etc.
  country: string,
  certified: boolean,
  virtualGuide: boolean,     // Guide avatar activé?
  artCount: number,          // Nombre d'œuvres exposées
  // À étendre:
  layouts: [
    { roomName: string, artworks: string[], soundscape: string }
  ],
  visitors: number,          // Compteur de visite
  messageBoard: string[],    // Empreinte culturelle (messages)
}
```

**Features:**
- **Visite 360° immersive** : Navigation dans des salles 3D
- **Galeries par continent/pays** : Organisation hiérarchique
- **Guide avatar multilingue** : Assistant interactif
- **Soundscapes culturels** : Musiques et ambiances traditionnelles
- **Message board** : Visiteurs laissent empreinte (texte/voix)
- **VR optional** : Support pour casques VR (future)

---

## 🎖️ Système de Certification & Gamification

### Automatisation

**Déclenchement automatique après 10 œuvres uploadées:**
```javascript
{
  artisanGrade: "Silver", // Default pour premier palier
  trigger: 10,            // Nombre de fichiers/uploads requis
  scoringAlgorithm: {
    quality: 0.3,         // 30% — Évaluation peer + experts
    originality: 0.25,    // 25% — Détection plagiat
    engagement: 0.25,     // 25% — Views + favorites + partages
    culturalValue: 0.2,   // 20% — Contexte culturel/historique
  }
}
```

### Tiers de Certification

| Grade | Conditions | Avantages |
|-------|-----------|----------|
| **Bronze** | 10+ œuvres | Badge visible, tarifs réduits marketplace |
| **Silver** | 50+ vues/œuvre, score 60%+ | Mise en avant, stats détaillées |
| **Gold** | 500+ vues/œuvre, score 80%+ | Accès enchères, royalties 10% |
| **Elite** | 2000+ vues/œuvre, score 95%+ | Galerie prestige, royalties 15%, mentor  |

**Affichage UI:** Badge coloré sur chaque carte produit (`grade-gold`, `grade-elite`, etc.)

---

## 🏪 Fiches Produits Détaillées (Modal)

### Contenu générique

Tous les produits affichent:
- **Titre & Artiste** (avec tier)
- **Certification badge** + numéro (GAP-YYYY-{TYPE}-###)
- **Prix** (devise adaptée)
- **Statistiques** (👁️ Views, ❤️ Favorites)
- **Description** longue
- **Actions** (Ajouter au panier, Favoris, Voir enchères)

### Contenu spécifique par pôle

**Physical Art:**
- Matériaux & techniques
- Dimensions exactes
- Historique & provenance
- Options de transport & assurance
- Politique de retour

**Digital Art:**
- Formats disponibles (dropdown)
- Licence (personnel/commercial)
- Historique des versions
- Possibilité de watermark

**NFT:**
- Blockchain & token ID
- Smart contract address
- Contexte culturel (bilingue)
- Possibilité de revente
- État enchère active

---

## 🔨 Système d'Enchères (Auctions)

### Architecture

**Cycle:** Mensuel (1er → dernier jour du mois)

**Éligibilité:**
- Artistes **Gold** ou **Elite** uniquement
- NFTs + Art Physique premium (prix > 500 EUR/ARTC)
- Max 5 enchères simultanées par artiste

**Mécanique:**
```javascript
{
  auctionId: "AUC-2025-02-001",
  startDate: "2025-02-01T00:00:00Z",
  endDate: "2025-02-28T23:59:59Z",
  startPrice: 500,
  currentBid: 750,
  bids: [
    { bidder: artistId, amount: 750, currency: "ARTC", timestamp: "..." }
  ],
  paymentMethods: ["ARTC", "π", "EUR"],
  winner: artistId,
  commissionRate: 0.08, // 8% pour GlobalArtPro
}
```

### UI Enchères

**Modal spécial "Voir les enchères":**
- Timeline visuelle
- Historique des enchères (bids)
- Prix courant + enchère minimale suivante
- Bouton "Enchérir" (si connecté, Gold+)
- Countdown (jours/heures restants)

---

## 📱 Navigation UX

### 1. Tab Navigation (4 pôles)

```
[🏛️ Art Physique] [💻 Art Numérique] [🔗 NFT Web3] [🏢 Musée 3D]
```
Changement instantané du contenu (`activeTab` state).

### 2. Filters Sidebar

- **Recherche** : Titre + artiste
- **Tri** : Popularité | Prix ↑/↓ | Tendance
- **Filtre de prix** : Range slider
- **Certification** : "✓ Certifiés uniquement" (checkbox)

### 3. Grille produits

- Cards responsive (280px min-width)
- Badges superposés (✓ Certified, grade)
- Stats visibles (👁️ vues, ❤️ favoris)

### 4. Modal détail

- Image principale (zoom, 360° si dispo)
- Détails contextuels (matériel, formats, blockchain)
- Certificat téléchargeable
- Actions (panier, favoris, enchères)

---

## 🎬 Onboarding Artiste

### 3 étapes

1. **Création profil** (ArtistList.jsx)
   - Upload photo de profil
   - Bio + liens réseaux
   - Choix de spécialité (physique/numérique/NFT)

2. **Première upload** (ArtistProfile.jsx - Edit Modal)
   - Drag & drop fichier/image
   - Base64 → storage localStorage
   - Métadonnées (titre, matériau, prix)

3. **Certification auto** (après 10 uploads)
   - Score calculé (algorithme ci-dessus)
   - Tier attribué (Bronze → Silver → Gold → Elite)
   - Notification + badge visible

### Gamification

- **Progression visuelle** : Barre de complétude vers Silver/Gold/Elite
- **Emojis par étape** : 🥉 Bronze → 🥈 Silver → 🥇 Gold → 👑 Elite
- **Récompenses** : Accès enchères, royalties augmentées, mentor

---

## 💾 Données Mock

Actuellement stockées dans `MOCK_DATA` object (MarketplaceHome.jsx):

- **3 œuvres physiques** (p1, p2, p3)
- **2 œuvres numériques** (d1, d2)
- **1 NFT** (n1) avec enchère active
- **1 Galerie 3D** (m1)

**À étendre:** Intégration backend REST API + persistance BDD.

---

## 🔗 Intégrations futures

1. **Payment Gateway**
   - Stripe (EUR/USD)
   - Pi Network (π)
   - ARTCoin (ARTC)

2. **Blockchain**
   - Smart contracts (Ethereum/Solana)
   - Pi Network NFT minting
   - Verified credentials

3. **3D Museum Engine**
   - Three.js / Babylon.js
   - WebGL immersive galleries
   - VR support (optional)

4. **Analytics**
   - Heatmaps (produits populaires)
   - Trending artists
   - Cultural insights

---

## 📋 Fichiers clés

| Fichier | Rôle |
|---------|------|
| `MarketplaceHome.jsx` | Composant principal 4-pôles |
| `marketplace.css` | Styles modernes (gradient, badges, responsive) |
| `productPage.jsx` | Détail produit (à enrichir avec onglets pôles) |
| Backend: `/api/marketplace/*` | Endpoints REST (TODO) |

---

## ✅ Checklist implémentation

- [x] Tab navigation (4 pôles)
- [x] Modèles de données complets
- [x] Filtres (recherche, prix, certification)
- [x] Grid responsive
- [x] Modal détails (contenu pôle-spécifique)
- [x] Badges certification & grades
- [x] Call-to-action artiste
- [ ] Backend API
- [ ] Système d'enchères (UI + logique)
- [ ] Musée 3D viewer
- [ ] Payment integration
- [ ] NFT minting
- [ ] Analytics dashboard

---

**Version:** 1.0 | **Last updated:** Janvier 2025
