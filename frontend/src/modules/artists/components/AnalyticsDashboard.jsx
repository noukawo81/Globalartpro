import React from "react";

/**
 * Composant de tableau de bord analytique avancé
 * Affiche des graphiques, tendances, et insights
 */
export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = React.useState("7d"); // 7d, 30d, 90d, 1y

  const analyticsData = {
    "7d": {
      views: 2847,
      clicks: 432,
      engagement: 15.2,
      topCountry: { code: "SN", name: "Sénégal", percentage: 32 },
      topArtwork: { title: "La Renaissance", views: 345 },
      growth: 12.5,
    },
    "30d": {
      views: 12450,
      clicks: 1856,
      engagement: 14.9,
      topCountry: { code: "CM", name: "Cameroun", percentage: 28 },
      topArtwork: { title: "Mémoire Ancienne", views: 1234 },
      growth: 8.3,
    },
    "90d": {
      views: 45230,
      clicks: 6432,
      engagement: 14.2,
      topCountry: { code: "CI", name: "Côte d'Ivoire", percentage: 25 },
      topArtwork: { title: "Le Silence", views: 3456 },
      growth: 5.7,
    },
    "1y": {
      views: 187650,
      clicks: 28430,
      engagement: 15.1,
      topCountry: { code: "BJ", name: "Bénin", percentage: 22 },
      topArtwork: { title: "Mémoire Ancienne", views: 12340 },
      growth: 3.2,
    },
  };

  const currentData = analyticsData[timeRange];

  // Données géographiques simulées
  const geoData = [
    { country: "Sénégal", views: 8530, percentage: 18.8, flag: "🇸🇳" },
    { country: "Cameroun", views: 7420, percentage: 16.4, flag: "🇨🇲" },
    { country: "Côte d'Ivoire", views: 6890, percentage: 15.2, flag: "🇨🇮" },
    { country: "Congo", views: 5640, percentage: 12.5, flag: "🇨🇬" },
    { country: "Nigéria", views: 4560, percentage: 10.1, flag: "🇳🇬" },
    { country: "Autres", views: 6190, percentage: 13.7, flag: "🌍" },
  ];

  // Classements mondiaux
  const rankings = [
    { rank: 1245, category: "Peintres", change: "↑ 45" },
    { rank: 456, category: "Art numérique", change: "↑ 120" },
    { rank: 892, category: "Sculpteurs", change: "→ 0" },
    { rank: 234, category: "Artistes émergents", change: "↑ 89" },
  ];

  return (
    <div style={styles.container}>
      {/* SÉLECTEUR DE PÉRIODE */}
      <div style={styles.timeRangeSelector}>
        {["7d", "30d", "90d", "1y"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              ...styles.timeRangeButton,
              ...(timeRange === range ? styles.timeRangeButtonActive : {}),
            }}
          >
            {range === "7d"
              ? "7 jours"
              : range === "30d"
              ? "30 jours"
              : range === "90d"
              ? "90 jours"
              : "1 an"}
          </button>
        ))}
      </div>

      {/* CARTES PRINCIPALES */}
      <div style={styles.kpiGrid}>
        <KPICard
          icon="👁️"
          label="Vues totales"
          value={currentData.views.toLocaleString()}
          change={`+${currentData.growth}%`}
          color="#4ECDC4"
        />
        <KPICard
          icon="🖱️"
          label="Clics"
          value={currentData.clicks.toLocaleString()}
          change={"+12%"}
          color="#FFE66D"
        />
        <KPICard
          icon="💬"
          label="Engagement"
          value={`${currentData.engagement}%`}
          change={"-0.3%"}
          color="#FF6B6B"
        />
        <KPICard
          icon="🏆"
          label="Classement"
          value="#1,245"
          change={`${currentData.growth}%`}
          color="#6C5B7B"
        />
      </div>

      {/* SECTION PAYS TOP */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🌍 Géographie des vues</h3>
        <div style={styles.geoGrid}>
          {geoData.map((item, idx) => (
            <div key={idx} style={styles.geoCard}>
              <div style={styles.geoHeader}>
                <span style={styles.flag}>{item.flag}</span>
                <span style={styles.countryName}>{item.country}</span>
              </div>
              <div style={styles.geoBar}>
                <div
                  style={{
                    ...styles.geoBarFill,
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
              <div style={styles.geoStats}>
                <span>{item.views.toLocaleString()} vues</span>
                <span style={styles.percentage}>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION CLASSEMENTS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🏆 Classements mondiaux</h3>
        <div style={styles.rankingsGrid}>
          {rankings.map((item, idx) => (
            <div key={idx} style={styles.rankingCard}>
              <div style={styles.rankingCategory}>{item.category}</div>
              <div style={styles.rankingRank}>#{item.rank}</div>
              <div style={styles.rankingChange}>{item.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION TOP ARTWORK */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>⭐ Meilleure œuvre</h3>
        <div style={styles.topArtworkCard}>
          <div style={styles.topArtworkImage}>
            <img
              src="https://via.placeholder.com/200"
              alt={currentData.topArtwork.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div style={styles.topArtworkInfo}>
            <h4 style={{ margin: "0 0 1em 0", color: "#ffd700" }}>
              {currentData.topArtwork.title}
            </h4>
            <div style={styles.topArtworkStats}>
              <div>
                <p style={styles.statLabel}>Vues</p>
                <p style={styles.statValue}>
                  {currentData.topArtwork.views.toLocaleString()}
                </p>
              </div>
              <div>
                <p style={styles.statLabel}>Engagement</p>
                <p style={styles.statValue}>24.3%</p>
              </div>
              <div>
                <p style={styles.statLabel}>Ventes</p>
                <p style={styles.statValue}>42</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION TIMELINE */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📊 Tendances temporelles</h3>
        <div style={styles.timelineContainer}>
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, idx) => (
            <div key={idx} style={styles.timelineBar}>
              <div
                style={{
                  ...styles.bar,
                  height: `${30 + Math.random() * 70}%`,
                }}
              />
              <p style={styles.dayLabel}>{day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION INSIGHTS */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💡 Insights personnalisés</h3>
        <div style={styles.insightsGrid}>
          <InsightCard
            icon="📈"
            title="Croissance forte"
            description="Vos vues augmentent de 15% par semaine"
            color="#4ECDC4"
          />
          <InsightCard
            icon="🎯"
            title="Audience en croissance"
            description="Vous gagnez 50 nouveaux followers par jour"
            color="#FFE66D"
          />
          <InsightCard
            icon="🌟"
            title="Qualité d'engagement"
            description="Votre taux d'engagement est au-dessus de la moyenne"
            color="#FF6B6B"
          />
          <InsightCard
            icon="🔔"
            title="Moment optimal"
            description="Vos ventes pics entre 18h et 20h"
            color="#C06C84"
          />
        </div>
      </div>
    </div>
  );
}

/* COMPOSANTS HELPERS */
function KPICard({ icon, label, value, change, color }) {
  const isPositive = change.startsWith("+");

  return (
    <div style={{ ...styles.kpiCard, borderTopColor: color }}>
      <div style={styles.kpiIcon}>{icon}</div>
      <p style={styles.kpiLabel}>{label}</p>
      <p style={styles.kpiValue}>{value}</p>
      <p
        style={{
          ...styles.kpiChange,
          color: isPositive ? "#4ECDC4" : "#FF6B6B",
        }}
      >
        {change}
      </p>
    </div>
  );
}

function InsightCard({ icon, title, description, color }) {
  return (
    <div style={{ ...styles.insightCard, borderLeftColor: color }}>
      <span style={styles.insightIcon}>{icon}</span>
      <div>
        <h4 style={styles.insightTitle}>{title}</h4>
        <p style={styles.insightDescription}>{description}</p>
      </div>
    </div>
  );
}

/* ======================== STYLES ======================== */
const styles = {
  container: {
    padding: "2em 0",
  },

  timeRangeSelector: {
    display: "flex",
    gap: "10px",
    marginBottom: "2em",
    justifyContent: "center",
  },

  timeRangeButton: {
    padding: "8px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,215,0,0.2)",
    color: "#eee",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.9em",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },

  timeRangeButtonActive: {
    background: "#ffd700",
    color: "#000",
    borderColor: "#ffd700",
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "2em",
  },

  kpiCard: {
    background: "rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderTopWidth: "4px",
    borderRadius: "12px",
    padding: "1.5em",
    textAlign: "center",
  },

  kpiIcon: {
    fontSize: "2em",
    marginBottom: "8px",
  },

  kpiLabel: {
    fontSize: "0.85em",
    opacity: 0.7,
    margin: "0 0 0.5em 0",
  },

  kpiValue: {
    fontSize: "2em",
    fontWeight: "bold",
    color: "#ffd700",
    margin: "0 0 0.5em 0",
  },

  kpiChange: {
    fontSize: "0.9em",
    fontWeight: "bold",
    margin: 0,
  },

  section: {
    marginBottom: "3em",
    padding: "2em",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  sectionTitle: {
    fontSize: "1.3em",
    marginBottom: "1.5em",
    color: "#ffd700",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  geoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },

  geoCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "1em",
  },

  geoHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "0.8em",
  },

  flag: {
    fontSize: "1.5em",
  },

  countryName: {
    fontSize: "0.95em",
    fontWeight: "bold",
  },

  geoBar: {
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "0.8em",
  },

  geoBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #6a11cb, #ffd700)",
    borderRadius: "3px",
  },

  geoStats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85em",
  },

  percentage: {
    color: "#ffd700",
    fontWeight: "bold",
  },

  rankingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },

  rankingCard: {
    background: "rgba(255,255,255,0.05)",
    border: "2px solid rgba(255,215,0,0.3)",
    borderRadius: "8px",
    padding: "1.5em",
    textAlign: "center",
  },

  rankingCategory: {
    fontSize: "0.9em",
    opacity: 0.7,
    marginBottom: "0.5em",
  },

  rankingRank: {
    fontSize: "2em",
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: "0.5em",
  },

  rankingChange: {
    fontSize: "0.95em",
    color: "#4ECDC4",
    fontWeight: "bold",
  },

  topArtworkCard: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "2em",
    alignItems: "center",
  },

  topArtworkImage: {
    width: "200px",
    height: "200px",
    borderRadius: "8px",
    overflow: "hidden",
    border: "2px solid #ffd700",
  },

  topArtworkInfo: {
    padding: "1em",
  },

  topArtworkStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1em",
  },

  statLabel: {
    fontSize: "0.85em",
    opacity: 0.7,
    margin: 0,
  },

  statValue: {
    fontSize: "1.5em",
    fontWeight: "bold",
    color: "#ffd700",
    margin: "0.5em 0 0 0",
  },

  timelineContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "12px",
    alignItems: "flex-end",
    height: "150px",
  },

  timelineBar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    height: "100%",
  },

  bar: {
    width: "100%",
    background: "linear-gradient(180deg, #6a11cb, #ffd700)",
    borderRadius: "4px 4px 0 0",
    transition: "all 0.3s ease",
  },

  dayLabel: {
    fontSize: "0.85em",
    margin: 0,
  },

  insightsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },

  insightCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderLeftWidth: "4px",
    borderRadius: "8px",
    padding: "1.5em",
    display: "flex",
    gap: "1em",
  },

  insightIcon: {
    fontSize: "2em",
    minWidth: "50px",
  },

  insightTitle: {
    margin: "0 0 0.5em 0",
    fontSize: "1em",
    color: "#ffd700",
  },

  insightDescription: {
    margin: 0,
    fontSize: "0.9em",
    opacity: 0.8,
  },
};
