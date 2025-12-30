import React, { useEffect, useState } from "react";
import { api } from '@/services/api.js';
import { useAuth } from '@/core/hooks/useAuth.js';

export default function AdminExhibitions() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const items = await api.getMarketplaceListings();
        if (mounted) setListings(items || []);
      } catch (e) {
        console.error('load listings', e);
        if (mounted) setError('Impossible de charger les annonces');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const doExhibit = async (id) => {
    if (!user || user.role !== 'admin') return alert('Accès refusé : privilèges admin requis.');
    try {
      setActionMsg('Demande en cours...');
      const res = await api.exhibitListing(id);
      if (res && res.ok) {
        setActionMsg('Annonce exposée avec succès');
        // refresh
        const items = await api.getMarketplaceListings();
        setListings(items || []);
      } else {
        setActionMsg(res?.error || 'Erreur lors de l’exposition');
      }
    } catch (e) {
      console.error('exhibit error', e);
      setActionMsg(e?.response?.data?.error || e.message || 'Erreur serveur');
    }
    setTimeout(() => setActionMsg(null), 3000);
  };

  if (!user || user.role !== 'admin') return (<div style={{padding:20}}>Accès refusé. Cette page est réservée aux administrateurs.</div>);

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestion des expositions (Admin)</h2>
      {actionMsg && <div style={{ marginBottom: 12, color: '#064e3b' }}>{actionMsg}</div>}
      {loading && <div>Chargement...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <div style={{ display: 'grid', gap: 12 }}>
          {listings.length === 0 && <div>Aucune annonce trouvée.</div>}
          {listings.map((l) => (
            <div key={l.id} style={{ padding: 12, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{l.title || `Listing ${l.id}`}</div>
                <div style={{ fontSize: 12, color: '#666' }}>Prix: {l.price} {l.token || 'ARTC'} • Par: {l.artistId}</div>
                {l.exhibited && <div style={{ marginTop: 6, color: '#065f46' }}>Exposé</div>}
              </div>
              <div>
                {!l.exhibited ? (
                  <button onClick={() => doExhibit(l.id)} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#0f172a', color:'#fff', cursor: 'pointer' }}>Exposer</button>
                ) : (
                  <button disabled style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#6b7280', color:'#fff' }}>Exposé</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
