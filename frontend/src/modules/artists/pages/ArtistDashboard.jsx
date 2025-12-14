import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth.js";
import { api } from '@/services/api.js';

export default function ArtistDashboard() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();
  const { user: authUser, artistId: authArtistId } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [artistData, setArtistData] = useState({
    name: "Artiste Pro",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=500",
    bio: "Artiste créatif passionné",
    country: "Cameroun",
    isOnline: true,
    visibility: 87,
  });

  // fetch artist data by route id or authenticated artistId
  useEffect(() => {
    const id = routeId || authArtistId || authUser?.id;
    if (!id) return; // Not logged / no id, leave as default
    api.getArtist(id).then(res => {
      const a = res?.artist || res || null;
      if (a) setArtistData(prev => ({ ...prev, ...a }));
    }).catch(() => {
      // keep default fallback
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId, authArtistId]);

  // Redirect if no artist id available
  useEffect(() => {
    if (!routeId && !authArtistId && !authUser?.id) {
      navigate('/artists');
    }
  }, [routeId, authArtistId, authUser, navigate]);

  // Les 6 rayons du dashboard
  const sections = [
    {
      id: "artworks",
      title: "🎨 Œuvres",
      icon: "🖼️",
      color: "#FF6B6B",
      subsections: [
        { label: "Upload nouvelle œuvre", icon: "📤" },
        { label: "Mes collections", icon: "📚" },
        { label: "Statistiques", icon: "📊" },
        { label: "Prix & formats", icon: "💰" },
      ],
    },
    {
      id: "gapstudio",
      title: "✨ Studio IA",
      icon: "🤖",
      color: "#4ECDC4",
      subsections: [
        { label: "Générer une image", icon: "🖼️" },
        { label: "Refonte créative", icon: "🔄" },
        { label: "Minter un NFT", icon: "💎" },
        { label: "Historique créatif", icon: "⏰" },
      ],
    },
    {
      id: "marketplace",
      title: "🛒 Marché",
      icon: "💳",
      color: "#FFE66D",
      subsections: [
        { label: "Mes ventes", icon: "📈" },
        { label: "Produits en vitrine", icon: "🪟" },
        { label: "Promotions actives", icon: "🎁" },
        { label: "Panier créateur", icon: "🎯" },
      ],
    },
    {
      id: "community",
      title: "👥 Communauté",
      icon: "💬",
      color: "#95E1D3",
      subsections: [
        { label: "Mes messages", icon: "💌" },
        { label: "Live streaming", icon: "🎥" },
        { label: "Collaborations", icon: "🤝" },
        { label: "Culture Map", icon: "🗺️" },
      ],
    },
    {
      id: "finances",
      title: "💰 Finances Pi",
      icon: "💵",
      color: "#C06C84",
      subsections: [
        { label: "Solde Pi Coin", icon: "💎" },
        { label: "Gains des ventes", icon: "📊" },
        { label: "Paiements en attente", icon: "⏳" },
        { label: "Retrait Wallet", icon: "🏦" },
      ],
    },
    {
      id: "analytics",
      title: "📈 Analytics",
      icon: "📊",
      color: "#6C5B7B",
      subsections: [
        { label: "Audience", icon: "👁️" },
        { label: "Classements", icon: "🏆" },
        { label: "Géographie des vues", icon: "🌍" },
        { label: "Tendances", icon: "📉" },
      ],
    },
  ];

  // Récupérer la section active
  const active = sections.find((s) => s.id === activeSection);

  return (
    <div style={styles.container}>
      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        style={styles.backButton}
        title="Retour"
      >
        ← Retour
      </button>

      {/* CONTENU PRINCIPAL */}
      <div style={styles.mainContent}>
        {/* ZONE CENTRALE - SEULEMENT PHOTO (CENTRÉE DANS LE RING) */}
        <div style={styles.centerProfile}>
          <div style={styles.centerPhotoWrap}>
            <img
              src={artistData.avatar}
              alt={artistData.name}
              style={styles.profileImage}
            />
            <div style={styles.verifiedBadge}>✓</div>
          </div>
        </div>

        {/* ZONE DES RAYONS - 6 SECTIONS */}
        <div style={styles.raysContainer}>
          {sections.map((section, index) => {
            const angle = (index / sections.length) * 360;
            const rayStyle = {
              ...styles.ray,
              transform: `rotate(${angle}deg) translateY(-180px) rotate(-${angle}deg)`,
              backgroundColor: section.color,
            };

            return (
              <button
                key={section.id}
                style={rayStyle}
                onClick={() =>
                  setActiveSection(
                    activeSection === section.id ? null : section.id
                  )
                }
                title={section.title}
              >
                <div style={styles.rayIcon}>{section.icon}</div>
                <div style={styles.rayTitle}>{section.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PETITE CARTE D'INFO EN DESSOUS DU RING */}
      <div style={styles.centerInfo}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={artistData.avatar} alt="avatar" style={styles.infoAvatar} />
          <div>
            <div style={{ fontWeight: "bold", color: "#ffd700" }}>{artistData.name}</div>
            <div style={{ opacity: 0.8, fontSize: "0.95em" }}>{artistData.country} • {artistData.visibility}% visibilité</div>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
          <button style={styles.smallButton} onClick={() => {
            const id = routeId || authArtistId || authUser?.id;
            if (!id) return navigate('/artists');
            navigate('/artist/' + id);
          }}>
            Voir mon profil
          </button>
          <button style={styles.smallButton} onClick={() => navigate(`/artist/${routeId || authArtistId || authUser?.id}/dashboard`)}>
            Mon Dashboard
          </button>
        </div>
      </div>

      {/* PANEL DETAIL - CONTENU DE LA SECTION ACTIVE */}
      {active && (
        <div style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            <h2 style={{ margin: 0, color: active.color }}>
              {active.icon} {active.title}
            </h2>
            <button
              onClick={() => setActiveSection(null)}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>

          <div style={styles.subsectionsGrid}>
            {active.subsections.map((sub, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.subsectionItem,
                  borderLeftColor: active.color,
                }}
              >
                <span style={styles.subsectionIcon}>{sub.icon}</span>
                <span style={styles.subsectionLabel}>{sub.label}</span>
              </div>
            ))}
          </div>

          {/* Contenu spécifique par section */}
          <div style={styles.detailContent}>
            <SectionContent sectionId={active.id} color={active.color} />
          </div>
        </div>
      )}

      {/* STATS FOOTER */}
      <div style={styles.footer}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Œuvres</span>
          <span style={styles.statValue}>24</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Ventes</span>
          <span style={styles.statValue}>187</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Followers</span>
          <span style={styles.statValue}>3.2K</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Revenus (π)</span>
          <span style={styles.statValue}>1,234</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Rating</span>
          <span style={styles.statValue}>⭐ 4.9</span>
        </div>
      </div>
    </div>
  );
}

/* COMPOSANT CONTENU DYNAMIQUE PAR SECTION */
function SectionContent({ sectionId, color }) {
  const contentMap = {
    artworks: (
      <div style={styles.contentSection}>
        <h3>Gérer vos œuvres</h3>
        <div style={styles.actionGrid}>
          <ActionCard
            icon="📤"
            label="Télécharger une nouvelle œuvre"
            color={color}
          />
          <ActionCard
            icon="📚"
            label="Organiser vos collections"
            color={color}
          />
          <ActionCard icon="📊" label="Voir les statistiques" color={color} />
          <ActionCard icon="💰" label="Gérer les prix" color={color} />
        </div>
      </div>
    ),
    gapstudio: (
      <div style={styles.contentSection}>
        <h3>Studio IA GAPStudio</h3>
        <div style={styles.actionGrid}>
          <ActionCard
            icon="🖼️"
            label="Générer une image IA"
            color={color}
          />
          <ActionCard
            icon="🔄"
            label="Refonte créative"
            color={color}
          />
          <ActionCard
            icon="💎"
            label="Minter en NFT"
            color={color}
          />
          <ActionCard
            icon="⏰"
            label="Voir l'historique"
            color={color}
          />
        </div>
      </div>
    ),
    marketplace: (
      <div style={styles.contentSection}>
        <h3>Votre marché privé</h3>
        <div style={styles.actionGrid}>
          <ActionCard
            icon="📈"
            label="Suivi des ventes"
            color={color}
          />
          <ActionCard
            icon="🪟"
            label="Produits en vitrine"
            color={color}
          />
          <ActionCard
            icon="🎁"
            label="Lancer une promo"
            color={color}
          />
          <ActionCard
            icon="🎯"
            label="Panier & commandes"
            color={color}
          />
        </div>
      </div>
    ),
    community: (
      <div style={styles.contentSection}>
        <h3>Connecter avec la communauté</h3>
        <div style={styles.actionGrid}>
          <ActionCard
            icon="💌"
            label="Lire les messages"
            color={color}
          />
          <ActionCard
            icon="🎥"
            label="Diffuser en live"
            color={color}
          />
          <ActionCard
            icon="🤝"
            label="Collaborations"
            color={color}
          />
          <ActionCard
            icon="🗺️"
            label="Culture Map"
            color={color}
          />
        </div>
      </div>
    ),
    finances: (
      <div style={styles.contentSection}>
        <h3>Gestion financière Pi</h3>
        <div style={styles.balanceCard}>
          <p style={{ margin: "0 0 10px 0", opacity: 0.8 }}>
            Solde actuel
          </p>
          <p style={{ fontSize: "2.5em", fontWeight: "bold", margin: 0 }}>
            3,456 π
          </p>
          <p style={{ margin: "10px 0 0 0", opacity: 0.7 }}>
            ≈ 1,234 EUR
          </p>
        </div>
        <div style={styles.actionGrid}>
          <ActionCard
            icon="💎"
            label="Solde Pi Coin"
            color={color}
          />
          <ActionCard
            icon="📊"
            label="Gains détaillés"
            color={color}
          />
          <ActionCard
            icon="⏳"
            label="Paiements en attente"
            color={color}
          />
          <ActionCard
            icon="🏦"
            label="Retrait au wallet"
            color={color}
          />
        </div>
      </div>
    ),
    analytics: (
      <div style={styles.contentSection}>
        <h3>Analytics & Performance</h3>
        <div style={styles.analyticsGrid}>
          <div style={{ ...styles.analyticsCard, borderTop: `4px solid ${color}` }}>
            <p style={styles.analyticsLabel}>Vues totales</p>
            <p style={styles.analyticsNumber}>45,230</p>
          </div>
          <div style={{ ...styles.analyticsCard, borderTop: `4px solid ${color}` }}>
            <p style={styles.analyticsLabel}>Engagement</p>
            <p style={styles.analyticsNumber}>8.9%</p>
          </div>
          <div style={{ ...styles.analyticsCard, borderTop: `4px solid ${color}` }}>
            <p style={styles.analyticsLabel}>Pays #1</p>
            <p style={styles.analyticsNumber}>🇸🇳 Sénégal</p>
          </div>
          <div style={{ ...styles.analyticsCard, borderTop: `4px solid ${color}` }}>
            <p style={styles.analyticsLabel}>Rang global</p>
            <p style={styles.analyticsNumber}>#1,245</p>
          </div>
        </div>
      </div>
    ),
  };

  return contentMap[sectionId] || <p>Section non disponible</p>;
}

/* COMPOSANT CARTE D'ACTION */
function ActionCard({ icon, label, color }) {
  return (
    <button
      style={{
        ...styles.actionCard,
        borderLeftColor: color,
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-2px)";
        e.target.style.boxShadow = `0 8px 16px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0)";
        e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      <span style={{ fontSize: "1.8em", marginBottom: "8px" }}>{icon}</span>
      <span style={{ fontSize: "0.95em", fontWeight: "500" }}>{label}</span>
    </button>
  );
}

/* ===================== STYLES ===================== */
const styles = {
  container: {
    background: "linear-gradient(135deg, #141E30 0%, #243B55 50%, #0f0c29 100%)",
    minHeight: "100vh",
    padding: "2em",
    color: "#eee",
    fontFamily: "system-ui, -apple-system, sans-serif",
    overflow: "auto",
  },

  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    padding: "8px 16px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,215,0,0.3)",
    color: "#ffd700",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  },

  mainContent: {
    position: "relative",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto 3em",
    height: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* CENTRE - PROFIL */
  centerProfile: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    zIndex: 20,
    background: "transparent",
    border: "none",
    borderRadius: "50%",
    padding: "0.4em",
    width: "140px",
    height: "140px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "none",
    backdropFilter: "none",
  },

  profileImage: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #ffd700",
  },

  centerPhotoWrap: {
    position: "relative",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg,#00000066,#00000033)",
    padding: "6px",
    boxShadow: "0 8px 30px #0008",
  },

  verifiedBadge: {
    position: "absolute",
    right: -6,
    bottom: -6,
    background: "#4ECDC4",
    color: "#001",
    borderRadius: "50%",
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },

  profileName: {
    fontSize: "1.8em",
    margin: "0.5em 0",
    color: "#ffd700",
  },

  profileBio: {
    fontSize: "0.95em",
    opacity: 0.8,
    margin: "0.5em 0",
  },

  statusRow: {
    display: "flex",
    gap: "10px",
    marginTop: "1em",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  status: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.85em",
    fontWeight: "bold",
    color: "#000",
  },

  visibilityScore: {
    padding: "6px 12px",
    borderRadius: "20px",
    backgroundColor: "#6a11cb",
    fontSize: "0.85em",
    fontWeight: "bold",
  },

  /* RAYONS */
  raysContainer: {
    position: "absolute",
    width: "400px",
    height: "400px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },

  /* CARTE D'INFO SOUS LE RING */
  centerInfo: {
    maxWidth: 900,
    margin: "-20px auto 1.5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    color: "#eee",
  },

  infoAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ffd700",
  },

  smallButton: {
    padding: "8px 12px",
    background: "rgba(255,215,0,0.12)",
    border: "1px solid rgba(255,215,0,0.25)",
    color: "#ffd700",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: "600",
  },

  ray: {
    position: "absolute",
    width: "90px",
    height: "90px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "12px",
    border: "2px solid rgba(255,255,255,0.2)",
    background: "#6a11cb",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontSize: "0.9em",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },

  rayIcon: {
    fontSize: "2em",
    marginBottom: "4px",
  },

  rayTitle: {
    fontSize: "0.75em",
    textAlign: "center",
    lineHeight: "1.2",
  },

  /* PANEL DETAIL */
  detailPanel: {
    background: "rgba(0,0,0,0.6)",
    border: "2px solid rgba(255,215,0,0.2)",
    borderRadius: "16px",
    padding: "2em",
    maxWidth: "1200px",
    margin: "0 auto 2em",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },

  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2em",
    paddingBottom: "1em",
    borderBottom: "2px solid rgba(255,215,0,0.2)",
  },

  closeButton: {
    background: "transparent",
    border: "2px solid #ffd700",
    color: "#ffd700",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    fontSize: "1.2em",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "bold",
  },

  subsectionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "2em",
  },

  subsectionItem: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderLeftWidth: "4px",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  subsectionIcon: {
    fontSize: "1.5em",
  },

  subsectionLabel: {
    fontSize: "0.95em",
    fontWeight: "500",
  },

  detailContent: {
    marginTop: "1em",
  },

  contentSection: {
    paddingTop: "1em",
  },

  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginTop: "1.5em",
  },

  actionCard: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid rgba(255,255,255,0.1)",
    borderLeftWidth: "4px",
    borderRadius: "12px",
    padding: "1.5em",
    color: "#eee",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "all 0.3s ease",
    fontSize: "0.95em",
    fontWeight: "500",
  },

  balanceCard: {
    background: "linear-gradient(135deg, #6a11cb 0%, #ffd700 100%)",
    borderRadius: "12px",
    padding: "2em",
    marginBottom: "1.5em",
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginTop: "1.5em",
  },

  analyticsCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "1.5em",
    textAlign: "center",
  },

  analyticsLabel: {
    fontSize: "0.9em",
    opacity: 0.7,
    margin: "0 0 0.5em 0",
  },

  analyticsNumber: {
    fontSize: "1.8em",
    fontWeight: "bold",
    margin: 0,
    color: "#ffd700",
  },

  /* FOOTER STATS */
  footer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    marginTop: "3em",
  },

  statCard: {
    background: "rgba(0,0,0,0.4)",
    border: "2px solid rgba(255,215,0,0.2)",
    borderRadius: "12px",
    padding: "1.5em",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  statLabel: {
    fontSize: "0.9em",
    opacity: 0.7,
  },

  statValue: {
    fontSize: "1.8em",
    fontWeight: "bold",
    color: "#ffd700",
  },
};
