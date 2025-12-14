import React, { useMemo, useState } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";

const FEATURES = [
  { id: 'gapstudio', title: 'GAP Studio', desc: 'Studio IA — Text → Image', to: '/gapstudio', icon: '🎨' },
  { id: 'artists', title: 'Artistes', desc: 'Liste & profils artistes', to: '/artists', icon: '🧑‍🎨' },
  { id: 'marketplace', title: 'Marketplace', desc: 'Acheter & vendre œuvres', to: '/marketplace', icon: '🛒' },
  { id: 'culture', title: 'Culture & Portail', desc: 'Articles, salons VIP', to: '/portal-culture', icon: '🌍' },
  { id: 'museum', title: 'Musées 3D', desc: 'Galeries 3D immersives', to: '/marketplace?tab=museum', icon: '🏛️' },
  { id: 'mine', title: 'Mine (ARTC)', desc: 'Miner et gérer ARTC', to: '/mine-artc', icon: '⛏️' },
  { id: 'challenge', title: 'Challenge créatif', desc: 'Concours & défis', to: '/challenge', icon: '🏆' },
  { id: 'donate', title: 'Don', desc: 'Soutenir la fondation', to: '/donations', icon: '💝' },
  { id: 'admin', title: 'Admin', desc: 'Administration & outils', to: '/admin', icon: '⚙️' },
  { id: 'docs', title: 'Documentation', desc: 'Guides & API', to: '/docs', icon: '📚' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return FEATURES;
    return FEATURES.filter(f => f.title.toLowerCase().includes(s) || f.desc.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="dash-root">
      <header className="dash-header">
        <h1>GlobalArtPro — Tableau de bord</h1>
        <p className="muted">Accès rapide aux sections principales de la plateforme</p>
      </header>

      <main className="dash-main">
        <div className="dash-actions">
          <div className="search">
            <input placeholder="Rechercher une fonctionnalité..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          <div className="features-grid">
            {filtered.map(f => (
              <Link key={f.id} to={f.to} className="feature-card" aria-label={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-body">
                  <h3>{f.title}</h3>
                  <p className="muted small">{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="dash-side">
          <div className="card quick-card">
            <h3>Raccourcis</h3>
            <div className="quick-list">
              <button onClick={() => navigate('/gapstudio')} className="ghost">Ouvrir GAP Studio</button>
              <button onClick={() => navigate('/mine-artc')} className="ghost">Lancer minage</button>
              <button onClick={() => navigate('/donations')} className="ghost">Faire un don</button>
            </div>
          </div>

          <div className="card meta-card">
            <h3>Stats rapides</h3>
            <div className="meta-row"><strong>Visitors</strong><span className="muted">1,234</span></div>
            <div className="meta-row"><strong>Active Users</strong><span className="muted">128</span></div>
            <div className="meta-row"><strong>Orders</strong><span className="muted">24</span></div>
          </div>
        </aside>
      </main>

      <footer className="dash-footer">© {new Date().getFullYear()} GlobalArtPro — Tous droits réservés</footer>
    </div>
  );
}
         