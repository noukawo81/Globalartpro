import React, { useEffect, useState } from 'react';
import { api } from '@/services/api.js';
import MuseumCard from '../components/MuseumCard.jsx';

export default function MuseumHome() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, _setPageSize] = useState(9);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

  const load = async (p = page, limit = pageSize) => {
    setLoading(true);
    try {
      const res = await api.getMuseum({ status: 'exhibit', limit, offset: (p-1)*limit });
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (e) { setError(e); }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [page, pageSize]);

  const handleLike = async (id) => {
    try {
      await api.likeMuseumItem(id);
      setToast({ open: true, message: "J'aime enregistré", type: 'success' });
      load();
    } catch (e) {
      setToast({ open: true, message: 'Erreur lors du like: ' + (e?.message || String(e)), type: 'error' });
      console.error('like error', e);
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

      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div>Total: {total}</div>
        <div>
          <button disabled={page <= 1} onClick={()=> setPage(p => Math.max(1, p-1))}>Prev</button>
          <span style={{ margin: '0 8px' }}>Page {page} / {Math.max(1, Math.ceil((total || 0) / pageSize))}</span>
          <button disabled={page >= Math.max(1, Math.ceil((total || 0) / pageSize))} onClick={()=> setPage(p => p+1)}>Next</button>
        </div>
      </div>

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />
    </div>
  );
}
