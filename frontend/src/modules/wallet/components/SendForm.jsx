import React, { useState } from 'react';
import { useAuth } from '@/core/hooks/useAuth.js';
import walletAPI from '@/modules/wallet/services/wallet.api.js';

export default function SendForm({ defaultFrom }) {
  const { user } = useAuth();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [token, setToken] = useState('ARTC');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const from = defaultFrom || user?.id;
      const res = await walletAPI.send(from, to, token, Number(amount));
      setResult(res);
    } catch (err) {
      setResult({ error: err?.message || 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSend} style={{ display: 'grid', gap: 8 }}>
      <label>À (userId / adresse)</label>
      <input value={to} onChange={e => setTo(e.target.value)} placeholder="userId" />
      <label>Montant</label>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <label>Token</label>
      <select value={token} onChange={e => setToken(e.target.value)}>
        <option value="ARTC">ARTC</option>
        <option value="PI">PI</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</button>
      {result && <pre style={{ fontSize: 12 }}>{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
