import React from 'react';

export default function TokenSwitcher({ value = 'ARTC', onChange }) {
  return (
    <select value={value} onChange={e => onChange && onChange(e.target.value)}>
      <option value="ARTC">ARTC</option>
      <option value="PI">PI</option>
      <option value="IA">IA</option>
    </select>
  );
}
