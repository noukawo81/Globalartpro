import React from 'react';

export default function TransactionItem({ tx }) {
  if (!tx) return null;
  const date = new Date(tx.datetime || tx.createdAt || Date.now()).toLocaleString();
  return (
    <div className="wa-tx-item" style={{ padding: 10, borderBottom: '1px solid #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{tx.description || tx.type}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{date}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: tx.type === 'DEBIT' || tx.amount < 0 ? 'red' : 'green', fontWeight: 700 }}>{tx.amount} {tx.token}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{tx.status || 'CONFIRMED'}</div>
        </div>
      </div>
    </div>
  );
}
