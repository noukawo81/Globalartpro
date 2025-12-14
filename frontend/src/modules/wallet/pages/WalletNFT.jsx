import React, { useEffect, useState } from 'react';
import walletAPI from '@/modules/wallet/services/wallet.api.js';

export default function WalletNFT() {
  const [nfts, setNfts] = useState([]);
  const userId = localStorage.getItem('ga_user_id') || 'guest-000';

  useEffect(() => {
    async function load() {
      try {
        const res = await walletAPI.nfts(userId);
        setNfts(res || []);
      } catch (err) {
        console.warn('wallet nfts load', err);
      }
    }
    load();
  }, [userId]);

  async function mint() {
    const title = prompt('Titre du NFT');
    if (!title) return;
    const res = await walletAPI.mintNFT(userId, { title });
    alert('NFT minté: ' + JSON.stringify(res));
    setNfts(prev => [{ id: res?.nftId || `nft-${Date.now()}`, title }, ...prev]);
  }

  return (
    <div style={{ padding: 12 }}>
      <h1>Mes NFT</h1>
      <button onClick={mint}>Mint NFT</button>
      <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
        {nfts.length === 0 ? <div>Aucun NFT</div> : nfts.map(n => (
          <div key={n.id} style={{ background: '#fff', padding: 8, borderRadius: 8 }}>
            <div style={{ fontWeight: 700 }}>{n.title || n.name || n.tokenId}</div>
            <div style={{ fontSize: 12 }}>{n.metadata?.description || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
