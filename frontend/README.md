# 🎨 GlobalArtPro — Plateforme Mondiale des Artistes

Plateforme React complète pour artistes, musées et créateurs. Conversion du projet HTML/CSS/JS legacy vers React + Vite.

## 📋 Caractéristiques

- ✅ **Dashboard** — Statistiques et accès rapide
- ✅ **Découverte** — Galerie d'artistes et d'œuvres
- ✅ **Artistes** — Authentification et gestion de profil
- ✅ **GAP Studio IA** — Générateur d'art par IA
- ✅ **Certificats** — Génération de certificats NFT
- ✅ **Communauté** — Forum et discussions
- ✅ **Marketplace** — Vente et achat d'œuvres
- ✅ **Legacy Support** — Intégration des pages HTML anciennes via iframe

## 🚀 Installation & Démarrage

### Prérequis
- Node.js v18+
- npm ou yarn

### Installation
```bash
cd frontend
npm install
```

### Développement
```bash
npm run dev
# Accès : http://localhost:5173
```

### Build Production
```bash
npm run build
# Génère dossier dist/
npm run preview
# Servir la build localement
```

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Accueil
│   │   ├── Discover.jsx           # Galerie artistes/œuvres
│   │   ├── Artist.jsx             # Authentification artiste
│   │   ├── GAPStudio.jsx          # Créateur IA
│   │   ├── Certificate.jsx        # Certificats NFT
│   │   ├── Community.jsx          # Forum communauté
│   │   ├── Marketplace.jsx        # Marché aux enchères
│   │   ├── LegacyIframe.jsx       # Support pages HTML legacy
│   │   ├── GenerateForm.jsx       # Formulaire génération IA
│   │   └── [autres composants]
│   ├── App.jsx                    # Routeur principal
│   ├── index.jsx                  # Point d'entrée
│   └── App.css
├── public/
│   └── legacy/                    # Fichiers HTML/CSS/JS/images legacy
│       ├── assets/
│       ├── data/
│       ├── Index.html
│       ├── dashboard_analytics.html
│       └── ...
├── package.json
├── vite.config.js
└── README.md
```

## 🔗 Routes Principales

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Accueil & statistiques |
| `/discover` | Discover | Galerie d'artistes |
| `/artist` | Artist | Connexion/inscription |
| `/gapstudio` | GAPStudio | Créateur IA |
| `/certificate` | Certificate | Génération certificats |
| `/community` | Community | Forum & discussions |
| `/marketplace` | Marketplace | Marché aux enchères |
| `/legacy/:page` | LegacyIframe | Pages HTML legacy (iframe) |

## 📊 Données JSON (Legacy)

Les fichiers JSON situés dans `public/legacy/data/` :
- `users.json` — Profils utilisateurs
- `gallery.json` — Galerie d'œuvres
- `marketplace.json` — Produits marketplace
- `community_posts.json` — Discussions communauté
- `community_group.json` — Groupes communauté

## 🎨 Personnalisation

### Ajouter une page HTML legacy
1. Place ton fichier HTML dans `public/legacy/`
2. Crée une route dans `App.jsx` :
```javascript
<Route path="/legacy/:page" element={<LegacyIframe />} />
```
3. Accès via `/legacy/ma-page.html`

### Ajouter un nouveau composant React
1. Crée `src/components/NomComposant.jsx`
2. Ajoute la route dans `App.jsx`
3. Importe dans le menu de navigation

## 🔐 Variables d'environnement

Crée un fichier `.env.local` à la racine de frontend/ :
```
VITE_API_URL=http://localhost:3000
VITE_PI_NETWORK_KEY=ta_clé_pi_network
```

## 🧪 Audit Legacy

Pour vérifier que tous les fichiers legacy sont présents :
```powershell
powershell -ExecutionPolicy Bypass -File "../audit_legacy.ps1"
```

Génère un rapport `legacy_audit_report.txt`.

## 📦 Déploiement

### Railway
```bash
git push origin main
# Railway redéploiera automatiquement
```

### Pi Network App Studio
1. Build : `npm run build`
2. Compresse le dossier `dist/`
3. Upload dans Pi App Studio
4. Configure domaine + webhook

## 🐛 Troubleshooting

**Erreur : Impossible de résoudre l'importation de composant**
→ Vérifie que le fichier existe et que la casse correspond (CamelCase)

**Images ne s'affichent pas**
→ Vérifies que les ressources sont dans `public/legacy/` et que les chemins sont corrects

**Données JSON ne chargent pas**
→ Ouvre la console (F12) et vérifie les erreurs CORS/404

## 📚 Ressources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- [Pi Network](https://pi.network)

## 👥 Contribution

Les contributions sont bienvenues ! Crée une branche et soumet une pull request.

## 📄 Licence

MIT © 2025 GlobalArtPro

---

**Dernière mise à jour** : 1 décembre 2025
**Version** : 2.0.0 (React + Vite)
**Statut** : Production-ready