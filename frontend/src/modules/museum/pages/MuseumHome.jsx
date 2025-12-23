import React, { useEffect, useState } from 'react';
import { api } from '@/services/api.js';
import MuseumCard from '../components/MuseumCard.jsx';

export default function MuseumHome() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getMuseum({ status: 'exhibit' }).then((r) => {
      setItems(r.items || []);
      setLoading(false);
    }).catch((e) => { setError(e); setLoading(false); });
  }, []);

  const handleLike = async (id) => {
    try {
      await api.likeMuseumItem(id);
      // refresh single item state
      const res = await api.getMuseum({ status: 'exhibit' });
      setItems(res.items || []);
    } catch (e) {
      alert('Erreur lors du like');
    }
  };

  if (loading) return <div style={{padding:20}}>Chargement de la galerie...</div>;
  if (error) return <div style={{padding:20,color:'red'}}>Erreur: {String(error.message || error)}</div>;
  if (!items || items.length === 0) return <div style={{padding:20}}>Aucune œuvre exposée pour le moment.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Galerie — Œuvres exposées</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginTop: 12 }}>
        {items.map((it) => (
          <MuseumCard key={it.id} item={it} onLike={handleLike} />
        ))}
      </div>
    </div>
  );
}
