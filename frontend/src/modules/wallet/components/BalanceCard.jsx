import React from 'react';

export default function BalanceCard({ token = 'ARTC', amount = 0, usd = 0, onClick }) {
  return (
    <div className="wa-balance-card" onClick={onClick} style={{ padding: 12, borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.08)', background: '#fff' }}>
      <div style={{ fontSize: 12, color: '#666' }}>{token}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{amount} {token}</div>
      {usd !== null && <div style={{ fontSize: 12, color: '#999' }}>≈ ${usd.toFixed(2)} USD</div>}
    </div>
  );
}
