import React, { useState } from 'react';

export default function WalletSettings() {
  const [pin, setPin] = useState('');
  const [protectedMode, setProtectedMode] = useState(true);

  function save() {
    alert('Paramètres sauvegardés (simulation)');
  }

  return (
    <div style={{ padding: 12 }}>
      <h1>Paramètres du Wallet</h1>
      <div style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <label>PIN (optionnel)</label>
        <input value={pin} onChange={e => setPin(e.target.value)} />
        <div>
          <label>
            <input type="checkbox" checked={protectedMode} onChange={e => setProtectedMode(e.target.checked)} />
            Mode sécurisé (PIN + double confirmation)
          </label>
        </div>
        <button onClick={save}>Enregistrer</button>
      </div>
    </div>
  );
}
