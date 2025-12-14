# 🎯 Marketplace GlobalArtPro — Quickstart

**Bienvenue!** Voici comment commencer avec votre marketplace refactorisée.

---

## 📂 Structure des fichiers créés/modifiés

```
frontend/src/modules/marketplace/
│
├── pages/
│   ├── MarketplaceHome.jsx              ⭐ REWRITTEN — Composant principal (368 lignes)
│   ├── marketplace.css                  ⭐ UPDATED — Styles complets 4-pôles
│   └── productPage.jsx                  [TODO]
│
├── components/
│   ├── AuctionWidget.jsx                ✨ NEW — Widget enchères (200 lignes)
│   └── auction-widget.css               ✨ NEW — Styles enchères
│
├── config/
│   └── api.config.js                    ✨ NEW — Configuration API & helpers
│
├── MARKETPLACE_ARCHITECTURE.md          ✨ NEW — Documentation complète (500+ lignes)
├── ROADMAP.md                           ✨ NEW — Feuille de route (300+ lignes)
├── IMPLEMENTATION_SUMMARY.md            ✨ NEW — Résumé exécutif
├── DEPLOYMENT_GUIDE.md                  ✨ NEW — Guide déploiement
└── QUICKSTART.md                        ← Vous êtes ici
```

---

## 🚀 Lancer localement (1 min)

```bash
cd frontend
npm install    # Si nécessaire
npm run dev
```

Visitez: **http://localhost:5174**

---

## 🎨 Fonctionnalités principales

### ✅ Déjà Implémentées

1. **4 Pôles distincts** → Art Physique | Art Numérique | NFT | Musée 3D
2. **Filtrage avancé** → Recherche, tri, prix, certification
3. **Grille responsive** → Mobile, tablette, desktop
4. **Modal détails produits** → Contextuel par pôle
5. **Système de certification** → Badges, tiers (Bronze/Silver/Gold/Elite)
6. **Mock data riche** → 8 produits exemples
7. **UI/UX professionnelle** → Gradients, animations, dark mode prêt

### 🔄 Partiellement Implémentées

- **Widget Enchères** → UI complète, backend TODO
- **3D Museum** → Modèle de données, viewer TODO
- **Payment** → Configuration, intégration TODO

### 🚧 À Faire

- Backend API REST
- Base de données (PostgreSQL)
- Système d'enchères complet
- 3D Museum viewer
- Payment gateway (Stripe/Pi/ARTC)
- NFT minting on-chain

---

## 📖 Documentation par Use Case

### Je veux...

**Comprendre l'architecture**
→ Lire [`MARKETPLACE_ARCHITECTURE.md`](./MARKETPLACE_ARCHITECTURE.md)

**Voir la feuille de route (Features futures)**
→ Lire [`ROADMAP.md`](./ROADMAP.md)

**Déployer en production**
→ Lire [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

**Intégrer des APIs backend**
→ Consulter [`api.config.js`](./config/api.config.js)

**Ajouter un widget enchères à ma page**
→ Importer `AuctionWidget` depuis `./components/AuctionWidget.jsx`

---

## 🧪 Tests Manuels

### Test 1: Navigation 4-pôles
```
1. Ouvrir http://localhost:5174/marketplace
2. Cliquer [🏛️ Art Physique] → 3 produits
3. Cliquer [💻 Art Numérique] → 2 produits
4. Cliquer [🔗 NFT Web3] → 1 produit
5. Cliquer [🏢 Musée 3D] → 1 galerie
```

✅ **Expected:** Contenu change instantanément

### Test 2: Filtrage
```
1. Taper "Masque" dans la barre recherche
2. Vérifier: Seul "Masque traditionnel Baoulé" reste
3. Tri: Sélectionner "Prix décroissant"
4. Vérifier: €890 > €520 > €180
5. Range slider: Glisser à 500
6. Vérifier: Masque (520) reste, Photographie (180) disparaît
7. Checkbox "✓ Certifiés uniquement"
8. Vérifier: Seuls certifiés restent
```

✅ **Expected:** Tous les filtres fonctionnent en temps réel

### Test 3: Modal Détails
```
1. Cliquer sur une carte produit
2. Vérifier: Modal apparaît avec image + détails
3. **Physical Art:** Voir Matériaux, Dimensions, etc.
4. **Digital Art:** Voir Formats (JPG, PNG, etc.)
5. **NFT:** Voir Blockchain, Token ID
6. Cliquer bouton ✕ → Modal ferme
```

✅ **Expected:** Contenu adapté par pôle

### Test 4: Responsive Design
```
Ouvrir DevTools (F12)
1. Mobile (375px): Grille 1 col, tabs empilées
2. Tablet (768px): Grille 2 cols
3. Desktop (1400px): Grille 3-4 cols
```

✅ **Expected:** Tout s'adapte correctement

---

## 📊 Données d'exemple

Produits en mock (voir `MarketplaceHome.jsx`):

| ID | Titre | Artiste | Grade | Prix | Pôle |
|----|-------|---------|-------|------|------|
| p1 | Masque traditionnel Baoulé | Kofi Mensah | Gold | 520 EUR | Physical |
| p2 | Sculpture africaine | Aminata Diop | Elite | 890 EUR | Physical |
| p3 | Photographie — Rituel du matin | Pierre Ndombele | Silver | 180 EUR | Physical |
| d1 | Illustration — Danse du vent | Zainab Ahmed | Silver | 85 EUR | Digital |
| d2 | Art génératif | Okafor Chinedu | Gold | 120 EUR | Digital |
| n1 | NFT — Esprit du Cameroun | Marie Yamaha | Gold | 50 ARTC | NFT |
| m1 | Galerie Prestige Afrique O. | - | - | - | Museum |

---

## 🔌 Prochaines Étapes

### Cette semaine
- [ ] Tester tous les scénarios ci-dessus
- [ ] Vérifier responsive sur mobiles réels
- [ ] Valider performances (Lighthouse)

### Semaine prochaine
- [ ] Commencer backend API (Express)
- [ ] Créer migrations BDD (PostgreSQL)
- [ ] Implémenter routes GET `/api/marketplace/products`

### Mois suivant
- [ ] Ajouter system d'enchères
- [ ] Intégrer paiements (Stripe)
- [ ] Déployer en production

---

## 🛠️ Stack Technique

| Composant | Technology | Version |
|-----------|-----------|---------|
| Frontend | React | 18.x |
| Build | Vite | 5.x |
| Routing | React Router | 6.x |
| Styling | CSS Vanilla + Variables | - |
| HTTP | Fetch API | Native |
| State | React Hooks | useState/useEffect |

---

## 💡 Code Examples

### Ajouter un produit (Frontend)
```javascript
// Depuis n'importe quel composant
import { MARKETPLACE_CONFIG } from './config/api.config';

const product = {
  title: "Mon œuvre",
  artist: "Mon nom",
  price: 150,
  currency: "EUR",
  pole: "digital",
  images: ["/url/image.jpg"],
  // ...
};

// POST /api/marketplace/products
fetch(`${MARKETPLACE_CONFIG.API_BASE}/marketplace/products`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(product)
});
```

### Convertir devise
```javascript
import { convertCurrency } from './config/api.config';

const priceEUR = 150;
const priceARTC = convertCurrency(priceEUR, "EUR", "ARTC");
console.log(priceARTC); // ~15000 ARTC
```

### Utiliser AuctionWidget
```javascript
import AuctionWidget from './components/AuctionWidget';

<AuctionWidget
  auctionId="AUC-2025-02-001"
  startPrice={500}
  currentBid={750}
  endDate="2025-02-28T23:59:59Z"
  paymentMethods={["ARTC", "π", "EUR"]}
  onPlaceBid={(bid) => console.log("Bid placed:", bid)}
/>
```

---

## ❓ FAQ

**Q: Comment ajouter plus de produits?**
A: Modifier `MOCK_DATA` objet dans `MarketplaceHome.jsx`. Ajouter entrée dans tableau `physical`, `digital`, `nft`, ou `museum`.

**Q: Comment personnaliser les couleurs?**
A: Gradient principal est `#667eea` → `#764ba2`. Modifier dans `marketplace.css` (rechercher `linear-gradient`).

**Q: Comment ajouter un nouveau pôle?**
A: Ajouter clé dans `MOCK_DATA`, tab button, et condition `activeTab === "newpole"` dans modal.

**Q: Le site n'affiche rien?**
A: Vérifier `npm run dev` lance sans erreurs. Consulter console (F12) pour erreurs.

**Q: Comment deployer?**
A: Voir `DEPLOYMENT_GUIDE.md`. TL;DR: `vercel --prod` (frontend) + Heroku/Docker (backend).

---

## 📞 Support

- **Doc technique:** [`MARKETPLACE_ARCHITECTURE.md`](./MARKETPLACE_ARCHITECTURE.md)
- **Issues/Bugs:** Créer GitHub issue avec `[marketplace]` tag
- **Features:** Proposer dans [`ROADMAP.md`](./ROADMAP.md)
- **Questions:** Consulter les commentaires inline dans `MarketplaceHome.jsx`

---

**Bonne chance! 🚀**

*Last updated: Janvier 2025 | v1.0*
