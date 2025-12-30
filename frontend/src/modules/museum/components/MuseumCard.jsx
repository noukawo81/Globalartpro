import React from 'react';
import { Link } from 'react-router-dom';

export default function MuseumCard({ item, onLike }) {
  return (
    <div style={cardStyle}>
      <div style={{ height: 160, overflow: 'hidden' }}>
        <img src={item.thumbnailUrl || item.imageUrl || `https://via.placeholder.com/320x160?text=${encodeURIComponent(item.title)}`} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ padding: '8px' }}>
        <h3 style={{ margin: '0 0 8px 0' }}>{item.title}</h3>
        <div style={{ fontSize: 12, color: '#666' }}>{item.artistName || item.artistId || 'Artiste inconnu'}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <div style={{ fontSize: 13 }}>{item.likesCount || 0} ❤️ · { (item.comments || []).length } 💬</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onLike && onLike(item.id)} style={btnStyle}>J'aime</button>
            <Link to={`/museum/${item.id}`} style={{ ...btnStyle, textDecoration: 'none' }}>Voir</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: '1px solid #e6e6e6',
  borderRadius: 8,
  overflow: 'hidden',
  background: '#fff'
};

const btnStyle = {
  padding: '6px 8px',
  borderRadius: 6,
  border: '1px solid #ddd',
  background: '#f7f7f7',
  cursor: 'pointer'
};
