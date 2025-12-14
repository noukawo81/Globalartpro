import React from 'react';

export default function QRPayment({ text = 'pi:address:0.0001', onPay }) {
  return (
    <div style={{ padding: 10, borderRadius: 8, background: '#fff', display: 'grid', gap: 8 }}>
      <div style={{ fontSize: 12, color: '#666' }}>Scanner pour payer (Pi)</div>
      <div style={{ height: 140, width: 140, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>{text}</div>
      <button onClick={() => onPay && onPay()}>J'ai payé</button>
    </div>
  );
}
