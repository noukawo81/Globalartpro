import React, { useEffect, useState } from 'react';
import { useAuth } from '@/core/hooks/useAuth.js';
import walletAPI from '@/modules/wallet/services/wallet.api.js';
import TransactionItem from '@/modules/wallet/components/TransactionItem.jsx';

export default function WalletTransactions() {
  const { user, artistId } = useAuth();
  const [txs, setTxs] = useState([]);
  const userId = user?.id || artistId || 'guest-000';

  useEffect(() => {
    async function load() {
      try {
        const res = await walletAPI.transactions(userId);
        setTxs(res || []);
      } catch (err) {
        console.warn('wallet tx load', err);
      }
    }
    load();
  }, [userId]);

  return (
    <div className="wallet-tx-list">
      <h1>Transactions</h1>
      <div style={{ background: '#fff', borderRadius: 8 }}>
        {txs.length === 0 ? <div style={{ padding: 12 }}>Aucune transaction</div> : txs.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
      </div>
    </div>
  );
}
