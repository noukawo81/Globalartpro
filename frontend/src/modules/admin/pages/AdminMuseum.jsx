import React, { useEffect, useState } from 'react';
import { api } from '@/services/api.js';

export default function AdminMuseum() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);
  const [patch, setPatch] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

   
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchItems();
  }, [page, pageSize, statusFilter, categoryFilter, tagFilter]);

  const fetchItems = async (opts = {}) => {
    setLoading(true);
    try {
      const params = {
        q: opts.q ?? query,
        status: opts.status !== undefined ? opts.status : (statusFilter || undefined),
        category: opts.category !== undefined ? opts.category : (categoryFilter || undefined),
        tags: opts.tags !== undefined ? opts.tags : (tagFilter || undefined),
        limit: opts.limit ?? pageSize,
        offset: ((opts.page ?? page) - 1) * (opts.limit ?? pageSize),
      };
      const res = await api.adminGetMuseum(params);
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error(err);
      alert('Erreur chargement');
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setPage(1);
    setLoading(true);
    try {
      const params = { q: query, status: statusFilter, category: categoryFilter, tags: tagFilter, limit: pageSize, offset: 0 };
      const res = await api.adminGetMuseum(params);
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) { console.error(err); setToast({ open: true, message: 'Erreur', type: 'error' }); } finally { setLoading(false); }
  };

  const startEdit = (it) => { setEditing(it); setPatch({ title: it.title, category: it.category, price: it.price, access: it.access, tags: (it.tags||[]).join(',') }); };
  const saveEdit = async () => {
    try {
      await api.adminUpdateMuseumItem(editing.id, { ...patch, tags: patch.tags });
      setEditing(null);
      fetchItems();
      setToast({ open: true, message: 'Sauvegardé', type: 'success' });
    } catch (err) { console.error(err); setToast({ open: true, message: 'Erreur sauvegarde', type: 'error' }); }
  };

  const toggleVisibility = async (id) => {
    try { await api.adminToggleVisibility(id); fetchItems(); setToast({ open: true, message: 'Visibilité modifiée', type: 'success' }); } catch (err) { console.error(err); setToast({ open: true, message: 'Erreur', type: 'error' }); }
  };

  const archiveItem = async (id) => {
    if (!confirm('Archiver cette œuvre ?')) return;
    try { await api.adminArchiveItem(id); fetchItems(); setToast({ open: true, message: 'Œuvre archivée', type: 'success' }); } catch (err) { console.error(err); setToast({ open: true, message: 'Erreur', type: 'error' }); }
  };

  const deleteItem = async (id) => {
    if (!confirm('Supprimer définitivement ?')) return;
    try { await api.adminDeleteItem(id); fetchItems(); setToast({ open: true, message: 'Œuvre supprimée', type: 'success' }); } catch (err) { console.error(err); setToast({ open: true, message: 'Erreur', type: 'error' }); }
  };

  if (loading) return <div style={{ padding: 20 }}>Chargement...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Gestion des œuvres</h2>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Recherche titre / artiste" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <input placeholder="Catégorie" value={categoryFilter} onChange={(e)=>{ setCategoryFilter(e.target.value); setPage(1); }} />
        <input placeholder="Tags (comma separated)" value={tagFilter} onChange={(e)=>{ setTagFilter(e.target.value); setPage(1); }} />
        <select value={statusFilter} onChange={(e)=>{ setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">Tous statuts</option>
          <option value="draft">draft</option>
          <option value="candidate">candidate</option>
          <option value="public">public</option>
          <option value="premium">premium</option>
          <option value="exhibit">exhibit</option>
          <option value="archived">archived</option>
        </select>
        <label>Par page</label>
        <select value={pageSize} onChange={(e)=>{ setPageSize(Number(e.target.value)); setPage(1); }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>
        <button onClick={handleSearch}>Rechercher</button>
        <button onClick={()=>{ setQuery(''); setStatusFilter(''); setCategoryFilter(''); setTagFilter(''); setPage(1); setPageSize(10); fetchItems({ page:1, limit:10 }); }}>Réinitialiser</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left' }}>
            <th>Id</th>
            <th>Titre</th>
            <th>Artiste</th>
            <th>Status</th>
            <th>Prix</th>
            <th>Accès</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(it => (
            <tr key={it.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{it.id}</td>
              <td style={{ padding: 8 }}>{it.title}</td>
              <td style={{ padding: 8 }}>{it.artistName || it.artistId}</td>
              <td style={{ padding: 8 }}>{it.status}</td>
              <td style={{ padding: 8 }}>{it.price || '—'}</td>
              <td style={{ padding: 8 }}>{it.access || 'public'}</td>
              <td style={{ padding: 8 }}>
                <button onClick={()=>startEdit(it)}>Edit</button>
                <button onClick={()=>toggleVisibility(it.id)}>Toggle visibility</button>
                <button onClick={()=>archiveItem(it.id)}>Archive</button>
                <button onClick={()=>deleteItem(it.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <div>Total: {total}</div>
        <div>
          <button disabled={page <= 1} onClick={()=>{ setPage(p => Math.max(1, p-1)); fetchItems({ page: page-1, limit: pageSize }); }}>Prev</button>
          <span style={{ margin: '0 8px' }}>Page {page} / {Math.max(1, Math.ceil((total || 0) / pageSize))}</span>
          <button disabled={page >= Math.max(1, Math.ceil((total || 0) / pageSize))} onClick={()=>{ setPage(p => p+1); fetchItems({ page: page+1, limit: pageSize }); }}>Next</button>
        </div>
      </div>

      {editing && (
        <div style={{ position: 'fixed', right: 20, top: 80, padding: 12, border: '1px solid #ddd', background: '#fff', width: 320 }}>
          <h4>Edition rapide</h4>
          <div>
            <label>Titre</label>
            <input value={patch.title} onChange={(e)=>setPatch({...patch, title: e.target.value})} />
          </div>
          <div>
            <label>Catégorie</label>
            <input value={patch.category} onChange={(e)=>setPatch({...patch, category: e.target.value})} />
          </div>
          <div>
            <label>Tags (comma)</label>
            <input value={patch.tags} onChange={(e)=>setPatch({...patch, tags: e.target.value})} />
          </div>
          <div>
            <label>Prix</label>
            <input type="number" value={patch.price || ''} onChange={(e)=>setPatch({...patch, price: Number(e.target.value)})} />
          </div>
          <div>
            <label>Accès</label>
            <select value={patch.access || 'public'} onChange={(e)=>setPatch({...patch, access: e.target.value})}>
              <option value="public">public</option>
              <option value="premium">premium</option>
              <option value="private">private</option>
            </select>
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={saveEdit}>Sauvegarder</button>
            <button onClick={()=>setEditing(null)}>Annuler</button>
          </div>
        </div>
      )}

      <Toast open={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, open: false })} />

    </div>
  );
}
