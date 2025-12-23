import React, { useState } from 'react';
import QRPayment from '@/modules/wallet/components/QRPayment.jsx';
import walletAPI from '@/modules/wallet/services/wallet.api.js';
import { api } from '@/services/api.js';
import { useAuth } from '@/core/hooks/useAuth.js';

export default function WalletPayment() {
  const [amount, setAmount] = useState(0.00005);
  const [token, setToken] = useState('PI');
  const { user: authUser } = useAuth();
  const storedUser = authUser || JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = storedUser?.id || 'guest-000';

  async function deposit() {
    try {
      const res = await walletAPI.deposit(userId, token, Number(amount));
      alert('Demande de dépôt créée: ' + JSON.stringify(res));
      async function confirmDeposit(txId) {
        try {
          if (!txId) return;
          const res = await walletAPI.confirmDeposit(txId, 'CONFIRMED');
          alert('Webhook confirmé: ' + JSON.stringify(res));
        } catch (e) {
          alert('Erreur webhook: ' + (e?.message || e));
        }
      }
    } catch (err) {
      alert('Erreur dépôt: ' + (err?.message || err));
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h1>Recharger / Payer</h1>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <label>Token</label>
        <select value={token} onChange={e => setToken(e.target.value)}>
          <option value="PI">PI</option>
          <option value="ARTC">ARTC</option>
        </select>

        <label>Montant</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <QRPayment text={`pay:${userId}:${amount} ${token}`} onPay={deposit} />
        <div style={{ marginTop: 8 }}>
          <button onClick={() => confirmDeposit(prompt('Paste txId pour confirmer:'))}>Simuler confirmation (dev)</button>
          <button style={{ marginLeft: 8 }} onClick={() => {
            // Pi Browser SDK placeholder
            if (window?.pi) {
              try { window.pi.requestPay({ amount, currency: token }); } catch(e) { alert('Erreur Pi SDK: ' + e); }
            } else {
              alert('Pi Browser SDK non détecté. Utilisez QR ou dépôt manuel.');
            }
          }}>Payer via Pi Browser</button>
        </div>
      </div>
    </div>
  );
}
