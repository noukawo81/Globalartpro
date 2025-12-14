import React, { useEffect, useState } from 'react';
import walletAPI from '@/modules/wallet/services/wallet.api.js';
import { useAuth } from '@/core/hooks/useAuth.js';

export default function WalletNotifications() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await walletAPI.notifications(user?.id);
        setNotes(res || []);
      } catch (e) { console.warn(e); }
    }
    load();
  }, [user]);

  return (
    <div style={{ padding: 12 }}>
      <h1>Notifications</h1>
      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        {notes.length === 0 ? <div>Aucune notification</div> : notes.map(n => (
          <div key={n.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 700 }}>{n.title}</div>
            <div style={{ fontSize: 12 }}>{n.message}</div>
            <div style={{ fontSize: 10, color: '#999' }}>{n.ts}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
