import React, { useEffect, useState } from 'react';
import { api } from '@/services/api.js';

export default function AdminMuseum() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [patch, setPatch] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetMuseum();
      setItems(res.items || []);
    } catch (e) {
      alert('Erreur chargement');
    } finally { setLoading(false); }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.adminGetMuseum({ q: query });
      setItems(res.items || []);
    } catch (e) { alert('Erreur'); } finally { setLoading(false); }
  };

  const startEdit = (it) => { setEditing(it); setPatch({ title: it.title, category: it.category, price: it.price, access: it.access }); };
  const saveEdit = async () => {
    try {
      await api.adminUpdateMuseumItem(editing.id, patch);
      setEditing(null);
      fetchItems();
    } catch (e) { alert('Erreur sauvegarde'); }
  };

  const toggleVisibility = async (id) => {
    try { await api.adminToggleVisibility(id); fetchItems(); } catch (e) { alert('Erreur'); }
  };

  const archiveItem = async (id) => {
    if (!confirm('Archiver cette œuvre ?')) return;
    try { await api.adminArchiveItem(id); fetchItems(); } catch (e) { alert('Erreur'); }
  };

  const deleteItem = async (id) => {
    if (!confirm('Supprimer définitivement ?')) return;
    try { await api.adminDeleteItem(id); fetchItems(); } catch (e) { alert('Erreur'); }
  };

  if (loading) return <div style={{ padding: 20 }}>Chargement...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Gestion des œuvres</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Recherche titre / artiste" value={query} onChange={(e)=>setQuery(e.target.value)} />
        <button onClick={handleSearch}>Rechercher</button>
        <button onClick={fetchItems}>Réinitialiser</button>
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

      {editing && (
        <div style={{ position: 'fixed', right: 20, top: 80, padding: 12, border: '1px solid #ddd', background: '#fff' }}>
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

    </div>
  );
}
