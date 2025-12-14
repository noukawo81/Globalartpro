/**
 * TEMPLATE - Nouveau composant de section Dashboard Artiste
 * 
 * Instructions :
 * 1. Copier ce fichier
 * 2. Renommer selon votre section (ex: NewSectionDashboard.jsx)
 * 3. Remplacer [SECTION_NAME] partout dans le fichier
 * 4. Remplir vos fonctionnalités
 * 5. Importer dans ArtistDashboard.jsx
 * 6. Ajouter dans SectionContent()
 */

import React, { useState } from "react";

export default function MyComponentDashboard() {
  // ==================== STATE ====================
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== FUNCTIONS ====================
  const fetchData = async () => {
    setLoading(true);
    try {
      // Remplacer par votre appel API
      // const res = await api.get(`/api/artist/${artistId}/[section]`);
      // setData(res.data);
      
      // Mock data pour développement
      const mockData = {
        // Votre structure de données
      };
      setData(mockData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  if (loading) return <p style={styles.loading}>Chargement...</p>;
  if (error) return <p style={styles.error}>Erreur: {error}</p>;

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>🆕 [SECTION_NAME]</h2>
        <p style={styles.description}>Description de votre section</p>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div style={styles.content}>
        {/* À remplir avec votre contenu */}
        <p>Votre contenu ici...</p>
      </div>

      {/* FOOTER (Optionnel) */}
      <div style={styles.footer}>
        <button style={styles.primaryButton}>
          ✅ Action principale
        </button>
      </div>
    </div>
  );
}

// ==================== STYLES ====================
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "2em",
  },

  header: {
    paddingBottom: "1em",
    borderBottom: "2px solid rgba(255,215,0,0.2)",
  },

  title: {
    fontSize: "1.5em",
    color: "#ffd700",
    margin: "0 0 0.5em 0",
  },

  description: {
    fontSize: "1em",
    opacity: 0.7,
    margin: 0,
  },

  content: {
    display: "grid",
    gap: "1.5em",
  },

  footer: {
    display: "flex",
    gap: "1em",
    justifyContent: "flex-end",
    paddingTop: "1em",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },

  primaryButton: {
    padding: "0.9em 1.8em",
    background: "linear-gradient(90deg, #6a11cb, #ffd700)",
    border: "none",
    borderRadius: "8px",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1em",
    transition: "all 0.3s ease",
  },

  loading: {
    textAlign: "center",
    fontSize: "1.1em",
    opacity: 0.7,
  },

  error: {
    padding: "1em",
    background: "rgba(255, 107, 107, 0.2)",
    border: "1px solid #FF6B6B",
    borderRadius: "8px",
    color: "#FF6B6B",
  },
};

/**
 * ==================== INSTRUCTIONS D'INTÉGRATION ====================
 * 
 * 1. DANS ArtistDashboard.jsx, ajouter l'import :
 *    import [SECTION_NAME]Dashboard from "./components/[SECTION_NAME]Dashboard.jsx";
 * 
 * 2. DANS la fonction SectionContent(), ajouter :
 *    [section_name]: (
 *      <[SECTION_NAME]Dashboard />
 *    ),
 * 
 * 3. DANS le tableau sections de ArtistDashboard(), ajouter :
 *    {
 *      id: "[section_name]",
 *      title: "🆕 [Section Name]",
 *      icon: "🎯",
 *      color: "#YOUR_COLOR",
 *      subsections: [
 *        { label: "Action 1", icon: "🔹" },
 *        { label: "Action 2", icon: "🔹" },
 *      ]
 *    }
 * 
 * ==================== EXEMPLE D'IMPLÉMENTATION ====================
 * 
 * import React, { useState } from "react";
 * 
 * export default function CommunityDashboard() {
 *   const [messages, setMessages] = useState([]);
 *   const [selectedChat, setSelectedChat] = useState(null);
 * 
 *   const fetchMessages = async () => {
 *     const res = await api.get(`/api/messages`);
 *     setMessages(res.data);
 *   };
 * 
 *   return (
 *     <div>
 *       <h2>Mes messages</h2>
 *       <div style={styles.messagesList}>
 *         {messages.map(msg => (
 *           <div key={msg.id} style={styles.messageItem}>
 *             <p>{msg.subject}</p>
 *             <small>{msg.from}</small>
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * 
 * ==================== VARIABLES DISPONIBLES ====================
 * 
 * - useAuth() : Récupérer user connecté + token
 * - useNavigate() : Navigation React Router
 * - api : Instance axios avec intercepteur JWT
 * - localStorage : Stockage client
 * 
 * ==================== IMPORTS UTILES ====================
 * 
 * import React, { useState, useEffect } from "react";
 * import { useNavigate } from "react-router-dom";
 * import { useAuth } from "@/core/hooks/useAuth";
 * import api from "@/services/apiInterceptor";
 * 
 * ==================== COULEURS DE PALETTE ====================
 * 
 * Or:          #ffd700
 * Violet:      #6a11cb
 * Teal:        #4ECDC4
 * Rouge:       #FF6B6B
 * Rose:        #C06C84
 * Cyan:        #95E1D3
 * Fond:        #141E30, #243B55
 * Texte:       #eee
 * Secondaire:  #333, #1b1b1b
 * 
 * ==================== HELPERS ====================
 * 
 * Icônes emojis recommandés :
 * - 📤 Upload
 * - 📈 Stats
 * - 💰 Finances
 * - 🎯 Actions
 * - 📊 Analytics
 * - 🔔 Notifications
 * - ⏳ En attente
 * - ✅ Complété
 * - ❌ Erreur
 * - 🔒 Sécurité
 * 
 * ==================== TEST ====================
 * 
 * Pour tester votre composant :
 * 1. npm run dev
 * 2. Aller sur /artist/:id/dashboard
 * 3. Cliquer sur votre nouvelle section
 * 4. Vérifier les données dans DevTools (F12)
 * 
 */

/**
 * ==================== COMPOSANTS RÉUTILISABLES ====================
 * 
 * Card
 */
export function Card({ children, style = {} }) {
  return (
    <div style={{ ...styles.card, ...style }}>
      {children}
    </div>
  );
}

/**
 * Button
 */
export function Button({ children, onClick, style = {}, ...props }) {
  return (
    <button
      style={{ ...styles.primaryButton, ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * StatBox
 */
export function StatBox({ label, value, icon = "📊", color = "#ffd700" }) {
  return (
    <div style={{ ...styles.statBox, borderLeftColor: color }}>
      <p style={styles.statIcon}>{icon}</p>
      <p style={styles.statLabel}>{label}</p>
      <p style={{ ...styles.statValue, color }}>
        {value}
      </p>
    </div>
  );
}

// Styles pour composants réutilisables
styles.card = {
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  padding: "1.5em",
};

styles.statBox = {
  background: "rgba(0,0,0,0.2)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderLeftWidth: "4px",
  borderRadius: "8px",
  padding: "1em",
  textAlign: "center",
};

styles.statIcon = {
  fontSize: "2em",
  margin: "0 0 0.5em 0",
};

styles.statLabel = {
  fontSize: "0.9em",
  opacity: 0.7,
  margin: 0,
};

styles.statValue = {
  fontSize: "1.5em",
  fontWeight: "bold",
  margin: "0.5em 0 0 0",
};
