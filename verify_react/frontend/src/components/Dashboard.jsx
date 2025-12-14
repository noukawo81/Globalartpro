import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, artworks: 0, sales: 0 });

  useEffect(() => {
    // Charger données depuis data/users.json, gallery.json, marketplace.json
    fetch("/legacy/data/users.json")
      .then(r => r.json())
      .then(data => setStats(prev => ({ ...prev, users: data.length })))
      .catch(e => console.log("users.json not found", e));
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>🎨 GlobalArtPro — Accueil</h1>
      <p>La plateforme mondiale des artistes — Art, Culture & Innovation</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
        <StatCard title="Utilisateurs" value={stats.users} icon="👥" />
        <StatCard title="Œuvres" value={stats.artworks} icon="🖼️" />
        <StatCard title="Ventes" value={`${stats.sales}€`} icon="💰" />
        <StatCard title="Musées" value="15+" icon="🏛️" />
      </div>

      <section style={{ marginTop: "3rem" }}>
        <h2>🚀 Accès rapide</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <a href="/discover" style={buttonStyle}>Découvrir les artistes</a>
          <a href="/gapstudio" style={buttonStyle}>Ouvrir GAP Studio IA</a>
          <a href="/marketplace" style={buttonStyle}>Marché aux enchères</a>
          <a href="/community" style={buttonStyle}>Rejoindre la communauté</a>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div style={{ background: "#f5f5f5", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
      <span style={{ fontSize: "2rem" }}>{icon}</span>
      <h3>{title}</h3>
      <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}

const buttonStyle = {
  display: "inline-block",
  padding: "0.8rem 1.5rem",
  background: "#16c784",
  color: "#fff",
  borderRadius: "6px",
  textDecoration: "none",
  cursor: "pointer",
};