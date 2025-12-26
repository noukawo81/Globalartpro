/**
 * Hook personnalisé pour gérer les actions du Dashboard Artiste
 * Centralise la navigation et les appels API
 */
import React from "react";
import { useNavigate } from "react-router-dom";

export const useDashboardActions = () => {
  const navigate = useNavigate();

  const actions = {
    // ====== ŒUVRES ======
    uploadArtwork: () => {
      console.log("📤 Upload une nouvelle œuvre");
      // navigate("/artworks/upload");
      alert("Redirection vers upload...");
    },
    viewCollections: () => {
      console.log("📚 Voir les collections");
      // navigate("/artworks/collections");
      alert("Voir les collections...");
    },
    viewArtworkStats: () => {
      console.log("📊 Statistiques des œuvres");
      // navigate("/artworks/stats");
      alert("Statistiques détaillées...");
    },
    managePricing: () => {
      console.log("💰 Gérer les prix");
      alert("Gestion des prix...");
    },

    // ====== STUDIO IA ======
    generateImage: () => {
      console.log("🖼️ Générer une image IA");
      navigate("/gapstudio");
    },
    refineCreation: () => {
      console.log("🔄 Refonte créative");
      navigate("/gapstudio");
    },
    mintNFT: () => {
      console.log("💎 Minter un NFT");
      alert("Minting NFT...");
    },
    viewCreativeHistory: () => {
      console.log("⏰ Historique créatif");
      alert("Historique des créations...");
    },

    // ====== MARCHÉ ======
    viewSales: () => {
      console.log("📈 Voir les ventes");
      alert("Suivi des ventes...");
    },
    manageShowcase: () => {
      console.log("🪟 Produits en vitrine");
      alert("Gérer la vitrine...");
    },
    launchPromo: () => {
      console.log("🎁 Lancer une promo");
      alert("Créer une promotion...");
    },
    manageOrders: () => {
      console.log("🎯 Panier & commandes");
      alert("Gestion des commandes...");
    },

    // ====== COMMUNAUTÉ ======
    readMessages: () => {
      console.log("💌 Lire les messages");
      alert("Inbox des messages...");
    },
    startLiveStream: () => {
      console.log("🎥 Diffuser en live");
      alert("Démarrer un live stream...");
    },
    browseCollaborations: () => {
      console.log("🤝 Collaborations");
      alert("Trouver des collaborateurs...");
    },
    viewCultureMap: () => {
      console.log("🗺️ Culture Map");
      alert("Voir la carte des artistes...");
    },

    // ====== FINANCES ======
    checkPiBalance: () => {
      console.log("💎 Solde Pi");
      alert("Solde Pi Coin actuel...");
    },
    viewEarnings: () => {
      console.log("📊 Gains des ventes");
      alert("Détail des gains...");
    },
    checkPendingPayments: () => {
      console.log("⏳ Paiements en attente");
      alert("Paiements en attente...");
    },
    withdrawToWallet: () => {
      console.log("🏦 Retrait Wallet");
      alert("Formulaire de retrait...");
    },

    // ====== ANALYTICS ======
    viewAudience: () => {
      console.log("👁️ Audience");
      alert("Statistiques d'audience...");
    },
    viewRankings: () => {
      console.log("🏆 Classements");
      alert("Classements mondiaux...");
    },
    viewGeography: () => {
      console.log("🌍 Géographie");
      alert("Analyse géographique...");
    },
    viewTrends: () => {
      console.log("📉 Tendances");
      alert("Tendances temporelles...");
    },
  };

  return actions;
};

/**
 * Hook pour récupérer les données du profil artiste
 */
export const useArtistData = (artistId) => {
  // À remplacer par un vrai appel API
  const mockArtist = {
    id: artistId,
    name: "Artiste Pro",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=500",
    bio: "Artiste créatif passionné",
    country: "Cameroun",
    isOnline: true,
    visibility: 87,
    stats: {
      artworks: 24,
      sales: 187,
      followers: 3200,
      revenues: 1234, // π
      rating: 4.9,
    },
  };

  return mockArtist;
};

/**
 * Hook pour gérer les sections ouvertes
 */
export const useDashboardSections = () => {
  const [activeSection, setActiveSection] = React.useState(null);

  const toggleSection = (sectionId) => {
    setActiveSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const closeSection = () => {
    setActiveSection(null);
  };

  return { activeSection, setActiveSection, toggleSection, closeSection };
};

/**
 * Constantes pour les sections
 */
export const DASHBOARD_SECTIONS = {
  ARTWORKS: "artworks",
  GAPSTUDIO: "gapstudio",
  MARKETPLACE: "marketplace",
  COMMUNITY: "community",
  FINANCES: "finances",
  ANALYTICS: "analytics",
};

/**
 * Palette de couleurs des rayons
 */
export const SECTION_COLORS = {
  artworks: "#FF6B6B",
  gapstudio: "#4ECDC4",
  marketplace: "#FFE66D",
  community: "#95E1D3",
  finances: "#C06C84",
  analytics: "#6C5B7B",
};

/**
 * Emojis et icônes
 */
export const SECTION_ICONS = {
  artworks: "🎨",
  gapstudio: "✨",
  marketplace: "🛒",
  community: "👥",
  finances: "💰",
  analytics: "📈",
};
