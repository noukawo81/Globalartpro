# 🎨 GlobalArtPro - Dashboard Artiste

## 📌 Vue d'ensemble

Le **Dashboard Artiste** est une plateforme innovante et complète pour les artistes GlobalArtPro. Elle utilise un design unique en "Cercle Créatif" avec 6 rayons spécialisés, offrant une expérience utilisateur immersive.

## 🎯 Objectifs

✅ Centraliser tous les outils des artistes en un seul endroit  
✅ Offrir une interface intuitive et moderne  
✅ Maximiser les revenus des artistes  
✅ Créer une communauté forte d'artistes  
✅ Intégrer des technologies de pointe (IA, NFT, blockchain)  

## 🏗️ Architecture

### Fichiers principaux

```
frontend/src/modules/artists/
├── pages/
│   ├── ArtistList.jsx              # Liste des artistes
│   ├── ArtistProfile.jsx            # Profil public + bouton dashboard
│   └── ArtistDashboard.jsx          # 🌟 Dashboard principal (Cercle Créatif)
│
├── components/
│   ├── AnalyticsDashboard.jsx      # 📊 Section Analytics complète
│   └── PiFinancesDashboard.jsx     # 💰 Section Finances complète
│
├── hooks/
│   └── useDashboardActions.js      # Actions + constantes
│
└── docs/
    ├── ARTIST_DASHBOARD_GUIDE.md           # 📖 Guide utilisateur
    ├── TECHNICAL_DOCUMENTATION.md          # 🔧 Documentation technique
    └── INTEGRATION_CHECKLIST.md            # ✅ Check-list d'intégration
```

## 🎨 Les 6 Rayons

| Rayon | Couleur | Fonctionnalités |
|-------|---------|---|
| 🎨 **Œuvres** | 🔴 #FF6B6B | Upload, Collections, Stats, Prix |
| ✨ **Studio IA** | 🔵 #4ECDC4 | Génération IA, Refonte, NFT, Historique |
| 🛒 **Marché** | 🟡 #FFE66D | Ventes, Vitrine, Promotions, Panier |
| 👥 **Communauté** | 💚 #95E1D3 | Messages, Live, Collaborations, Culture Map |
| 💰 **Finances Pi** | 🩷 #C06C84 | Solde, Gains, Paiements, Retrait |
| 📈 **Analytics** | 🟣 #6C5B7B | Audience, Classements, Géographie, Trends |

## 🚀 Quick Start

### Installation
```bash
cd frontend
npm install
npm run dev
```

### Accès au Dashboard
1. Ouvrir `http://localhost:5173`
2. Aller sur `/artists` (liste des artistes)
3. Cliquer sur un profil artiste
4. Cliquer sur **"🎨 Mon Dashboard"** (si connecté)

### Interaction
- **Clic sur un rayon** = Affiche le détail de cette section
- **Clic sur ✕** = Ferme le détail
- **Clic sur une action** = Exécute l'action ou navigue

## 📊 Données & KPIs

Le dashboard affiche 5 KPIs importants en footer :
- 📦 **Œuvres** : Nombre total d'œuvres
- 💳 **Ventes** : Nombre de transactions
- 👥 **Followers** : Nombre d'abonnés
- 💵 **Revenus** : Gains totaux en π
- ⭐ **Rating** : Note moyenne des clients

## 🔒 Sécurité

✅ **Authentification requise** - Seuls les artistes connectés peuvent accéder  
✅ **Token JWT** - Gestion des sessions sécurisée  
✅ **Vérification propriétaire** - Un artiste ne voit que SON dashboard  
✅ **Protection des routes** - Redirects automatiques si non authentifié  

## 📱 Responsive Design

- 💻 **Desktop** (>1200px) : Cercle complet, layout optimal
- 📱 **Tablet** (768-1200px) : Cercle adapté, layout flexible
- 📱 **Mobile** (<768px) : Grille optimisée, full responsive

## 🎯 Fonctionnalités principales

### Section Œuvres 🎨
- Upload de nouvelles œuvres
- Gestion des collections
- Statistiques par artwork
- Gestion des prix et formats
- Galerie personnelle

### Section Studio IA ✨
- Génération d'images IA (via GAPStudio)
- Refonte créative des œuvres
- Minting de NFTs
- Historique des créations
- Réutilisation des modèles

### Section Marché 🛒
- Suivi des ventes en temps réel
- Gestion des produits en vitrine
- Création de promotions
- Gestion du panier créateur
- Historique des commandes

### Section Communauté 👥
- Système de messagerie privée
- Live streaming direct
- Collaborations avec autres artistes
- Culture Map (carte géographique)
- Notifications d'interactions

### Section Finances Pi 💰
- Solde Pi Coin en temps réel
- Gains détaillés par catégorie
- Transactions complètes
- Formulaire de retrait sécurisé
- Taux de change en direct
- Conseils de maximisation

### Section Analytics 📈
- Audience total et croissance
- Géographie des vues
- Classements mondiaux
- Meilleure œuvre affichée
- Timeline d'activité
- Insights personnalisés

## 🔌 Intégration API

Les APIs à intégrer sont documentées dans [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md).

```javascript
// Exemple : Fetch artworks
const fetchArtworks = async () => {
  const res = await api.get(`/api/artist/${artistId}/artworks`);
  return res.data;
};
```

## 💡 Pour les développeurs

### Ajouter une nouvelle section
1. Ajouter objet dans tableau `sections` de `ArtistDashboard.jsx`
2. Ajouter contenu dans fonction `SectionContent()`
3. Ajouter actions dans `useDashboardActions.js`

### Ajouter une nouvelle action
```javascript
const actions = {
  myNewAction: () => {
    console.log("Action exécutée");
    // Votre logique ici
  }
};
```

### Personnaliser les couleurs
```javascript
color: "#YOUR_HEX_COLOR"
```

## 📖 Documentation complète

- **[ARTIST_DASHBOARD_GUIDE.md](./ARTIST_DASHBOARD_GUIDE.md)** - Guide utilisateur détaillé
- **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** - Documentation technique complète
- **[INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md)** - Check-list d'intégration des APIs

## 🚀 Roadmap

### Phase 1 ✅ (COMPLÉTÉE)
- UI/UX du dashboard
- Composants de base
- Documentation

### Phase 2 🔄 (EN COURS)
- Intégration APIs
- Features avancées
- Testing

### Phase 3 ⏳ (À FAIRE)
- Notifications temps réel
- Mobile app native
- Optimisations performance

## 📞 Support & Questions

Pour toute question :
1. Consulter la documentation appropriée
2. Vérifier les logs (F12 > Console)
3. Lire les commentaires du code
4. Contacter l'équipe dev

## 🤝 Contribution

Pour contribuer au dashboard :
1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Ouvrir une Pull Request

## 📄 License

GlobalArtPro © 2025

---

**Status**: 🟢 Production-ready (UI/Components)  
**Dernière mise à jour**: 11 Décembre 2025  
**Version**: 1.0.0  

