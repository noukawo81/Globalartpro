import React from 'react';

export default function ReceiveAddress({ userId }) {
  const address = userId || 'guest-000';
  return (
    <div className="wa-receive" style={{ padding: 10, background: '#fff', borderRadius: 8 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Adresse de réception</div>
      <div style={{ fontWeight: 700 }}>{address}</div>
    </div>
  );
}
