import React, { useEffect, useState, useRef } from 'react';
import { api } from '@/services/api.js';
import './MuseumGlobe.css';

const CIRCLE_ORDER = ['Racines','Paroles','Corps','Terre','Ciel','Passage','Futur'];

export default function MuseumGlobe() {
  const [items, setItems] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCircle, setActiveCircle] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 520);
    const onResize = () => setIsMobile(window.innerWidth <= 520);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.getMuseumGlobe();
        const data = Array.isArray(res) ? res : (res.items || []);
        setItems(data);
        const g = {};
        data.forEach(d => {
          const c = d.circle || 'Autre';
          g[c] = g[c] || [];
          g[c].push(d);
        });
        setGrouped(g);
      } catch (e) {
        console.error('museum globe load error', e);
        setError(e);
      }
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    if (activeCircle && closeBtnRef.current) closeBtnRef.current.focus();
  }, [activeCircle]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveCircle(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Chargement du Globe…</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Erreur: {String(error.message || error)}</div>;

  const handleOpen = (circle) => setActiveCircle(circle);

  // compute ring sizes
  const rings = CIRCLE_ORDER.map((name, i) => ({ name, count: (grouped[name] || []).length, idx: i }));

  if (isMobile) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Musée — Globe (Vue concentrique)</h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {rings.map(r => (
            <button key={r.name} className="globe-card" onClick={() => handleOpen(r.name)} aria-label={`Ouvrir cercle ${r.name}`}>
              <div style={{ fontWeight: 700 }}>{r.name}</div>
              <div className="muted">Objets: {r.count}</div>
            </button>
          ))}
        </div>

        {activeCircle && (
          <div className="modal-overlay" onClick={() => setActiveCircle(null)}>
            <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{activeCircle}</h3>
                <button ref={closeBtnRef} className="ghost" onClick={() => setActiveCircle(null)}>Fermer</button>
              </div>
              <div style={{ marginTop: 12 }}>
                { (grouped[activeCircle] || []).map(it => (
                  <div key={it.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{it.origin} — {it.year}</div>
                    <div style={{ marginTop: 6 }}>{it.description}</div>
                  </div>
                ))}
                {(grouped[activeCircle] || []).length === 0 && <div className="muted-block">Aucun élément</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const size = 520;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = Math.min(cx, cy) - 20;

  return (
    <div style={{ padding: 20 }}>
      <h2>Musée — Globe (Vue concentrique)</h2>
      <div className="museum-globe">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size`} aria-label="Musée Globe">
          {/* rings */}
          {rings.map(r => {
            const norm = (r.idx + 1) / rings.length;
            const rRadius = 30 + Math.round(norm * maxR);
            const strokeW = 18 - Math.round(norm * 10);
            const has = r.count > 0;
            return (
              <g key={r.name} className="globe-ring-group">
                <circle
                  cx={cx}
                  cy={cy}
                  r={rRadius}
                  stroke={has ? '#f6b93b' : '#ddd'}
                  strokeWidth={strokeW}
                  fill="none"
                  className="globe-ring"
                  tabIndex={0}
                  role="button"
                  aria-pressed={false}
                  aria-label={`${r.name} — ${r.count} objets`}
                  onClick={() => handleOpen(r.name)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(r.name); } }}
                />
                <text x={cx + rRadius + 6} y={cy - rRadius + 6} fontSize={12} fill="#222">{r.name} ({r.count})</text>
              </g>
            );
          })}
        </svg>

        {/* detail modal */}
        {activeCircle && (
          <div className="modal-overlay" onClick={() => setActiveCircle(null)}>
            <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{activeCircle}</h3>
                <button ref={closeBtnRef} className="ghost" onClick={() => setActiveCircle(null)}>Fermer</button>
              </div>
              <div style={{ marginTop: 12 }}>
                { (grouped[activeCircle] || []).map(it => (
                  <div key={it.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div className="muted" style={{ fontSize: 13 }}>{it.origin} — {it.year}</div>
                    <div style={{ marginTop: 6 }}>{it.description}</div>
                  </div>
                ))}
                {(grouped[activeCircle] || []).length === 0 && <div className="muted-block">Aucun élément</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
