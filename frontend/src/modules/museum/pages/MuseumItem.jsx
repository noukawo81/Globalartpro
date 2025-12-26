import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api.js';

export default function MuseumItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getMuseumItem(id).then((r) => { setItem(r.item); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const handleLike = async () => {
    try { await api.likeMuseumItem(id); const r = await api.getMuseumItem(id); setItem(r.item); } catch { alert('Erreur like'); }
  };

  const handleComment = async () => {
    if (!content || content.trim().length === 0) return;
    try { await api.commentMuseumItem(id, content); const r = await api.getMuseumItem(id); setItem(r.item); setContent(''); } catch { alert('Erreur commentaire'); }
  };

  if (loading) return <div style={{padding:20}}>Chargement...</div>;
  if (!item) return <div style={{padding:20}}>Œuvre introuvable</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{item.title}</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: '0 0 480px' }}>
          <img src={item.imageUrl || item.thumbnailUrl || `https://via.placeholder.com/480x320?text=${encodeURIComponent(item.title)}`} alt={item.title} style={{ width: '100%', borderRadius: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#555' }}>{item.artistName || item.artistId}</div>
          <div style={{ marginTop: 12 }}>{item.description}</div>
          <div style={{ marginTop: 12 }}><strong>Année:</strong> {item.year || '—'}</div>
          <div style={{ marginTop: 12 }}><strong>Média:</strong> {item.medium || '—'}</div>

          <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <button onClick={handleLike}>J'aime ({item.likesCount || 0})</button>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <h4>Commentaires</h4>
          <div>
            {(item.comments || []).map((c) => (
              <div key={c.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                <div style={{ fontSize: 12, color: '#666' }}>{c.userId} · {new Date(c.createdAt).toLocaleString()}</div>
                <div>{c.content}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Ton commentaire" style={{ width: '100%', minHeight: 80 }} />
            <div style={{ marginTop: 8 }}>
              <button onClick={handleComment}>Publier</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
