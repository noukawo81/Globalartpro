import React, { useEffect, useMemo, useState } from "react";
import DashboardAnalytics from "./DashboardAnalytics";
import "./AdminDashboard.css";

function formatNumber(n) {
  return typeof n === 'number' ? n.toLocaleString() : n;
}

function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [range, setRange] = useState('7d');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Simulated metrics
  const metrics = useMemo(() => ({
    revenue: 12450,
    activeUsers: 3520,
    uploads: 312,
    sales: 84,
    conversions: 3.2,
  }), []);

  const donutData = useMemo(() => ([
    { id: 'Revenue', value: metrics.revenue, color: '#f97316' },
    { id: 'Users', value: metrics.activeUsers, color: '#06b6d4' },
    { id: 'Uploads', value: metrics.uploads, color: '#7c3aed' },
    { id: 'Sales', value: metrics.sales, color: '#10b981' },
  ]), [metrics]);

  useEffect(() => {
    setLoading(true);
    // Simulate fetch of users and activities
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'Awa Diop', role: 'Artist', country: 'SN', lastLogin: '2025-12-12 08:12' },
        { id: 2, name: 'Carlos Mendez', role: 'Collector', country: 'MX', lastLogin: '2025-12-12 09:11' },
        { id: 3, name: 'Lina Ochoa', role: 'Moderator', country: 'CO', lastLogin: '2025-12-11 21:30' },
      ]);
      setActivities([
        { id: 1, message: 'User Awa created a gallery', ts: '10m' },
        { id: 2, message: 'New sale: 1 NFT sold (Carlos)', ts: '30m' },
        { id: 3, message: 'System: Backup completed', ts: '1h' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.role.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="admin-dashboard-wrap">
      <header className="admin-top">
        <div>
          <h1>Administration — Tableau de bord</h1>
          <p className="muted">Vue globale, actions rapides et analytics centralisés</p>
        </div>
        <div className="admin-actions">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="24h">24h</option>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
          </select>
          <input placeholder="Rechercher un utilisateur, rôle..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="btn primary" onClick={() => downloadCSV('users.csv', users)}>Exporter Utilisateurs</button>
          <a href="/admin/exhibitions" className="btn" style={{ marginLeft: 8 }}>Gérer Expositions</a>
        </div>
      </header>

      <main className="admin-grid">
        <section className="admin-left">
          <div className="card stats-grid">
            <div className="stat">
              <p className="label">Revenu (π)</p>
              <h2>{formatNumber(metrics.revenue)} €</h2>
              <small className="muted">+8.5% vs hier</small>
            </div>
            <div className="stat">
              <p className="label">Utilisateurs actifs</p>
              <h2>{formatNumber(metrics.activeUsers)}</h2>
              <small className="muted">Sessions en cours: 128</small>
            </div>
            <div className="stat">
              <p className="label">Uploads</p>
              <h2>{formatNumber(metrics.uploads)}</h2>
              <small className="muted">Nouveaux: 12 aujourd'hui</small>
            </div>
            <div className="stat">
              <p className="label">Ventes</p>
              <h2>{formatNumber(metrics.sales)}</h2>
              <small className="muted">Conversion: {metrics.conversions}%</small>
            </div>
          </div>

          <div className="card activity-card">
            <div className="card-header">
              <h3>Activités récentes</h3>
              <small className="muted">Flux temps réel</small>
            </div>
            <div className="activity-list">
              {loading && <div className="muted">Chargement...</div>}
              {!loading && activities.map(a => (
                <div key={a.id} className="activity">
                  <div className="activity-meta">
                    <span className="dot"></span>
                    <span className="msg">{a.message}</span>
                  </div>
                  <small className="muted">{a.ts}</small>
                </div>
              ))}
            </div>
            <div className="card-actions">
              <button className="ghost">Voir tout</button>
            </div>
          </div>
        </section>

        <section className="admin-center">
          <div className="card center-analytics">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Analytics centralisées</h3>
              <div className="muted">Période : {range}</div>
            </div>
            <div className="analytics-wrap">
              <DashboardAnalytics data={donutData} />
              <div className="analytics-details">
                <div className="detail-row"><strong>{formatNumber(metrics.revenue)} €</strong><span>Revenu total</span></div>
                <div className="detail-row"><strong>{formatNumber(metrics.activeUsers)}</strong><span>Utilisateurs</span></div>
                <div className="detail-row"><strong>{formatNumber(metrics.uploads)}</strong><span>Uploads</span></div>
                <div className="detail-row"><strong>{formatNumber(metrics.sales)}</strong><span>Ventes</span></div>
              </div>
            </div>
          </div>

          <div className="card quick-actions">
            <h3>Actions rapides</h3>
            <div className="actions-grid">
              <button className="btn">Envoyer notification</button>
              <button className="ghost">Désactiver utilisateur</button>
              <button className="ghost">Réparer / Réinitialiser</button>
              <button className="btn danger" onClick={() => alert('Simuler purge cache')}>Purger cache</button>
            </div>
          </div>
        </section>

        <aside className="admin-right">
          <div className="card users-card">
            <div className="card-header">
              <h3>Utilisateurs récents</h3>
              <button className="ghost" onClick={() => downloadCSV('users.csv', users)}>Exporter</button>
            </div>
            <div className="user-list">
              {filteredUsers.map(u => (
                <div key={u.id} className="user-item">
                  <div className="avatar">{u.name.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                  <div className="user-meta">
                    <strong>{u.name}</strong>
                    <small className="muted">{u.role} • {u.country}</small>
                  </div>
                  <div className="user-actions">
                    <button className="ghost">Voir</button>
                    <button className="ghost">Bloquer</button>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && <div className="muted">Aucun utilisateur trouvé.</div>}
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}