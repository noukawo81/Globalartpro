import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', open = false, onClose = () => {} }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;
  const bg = type === 'error' ? '#fee2e2' : type === 'success' ? '#ecfccb' : '#e6f0ff';
  const color = type === 'error' ? '#991b1b' : '#166534';
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, background: bg, color, padding: '12px 16px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {message}
    </div>
  );
}