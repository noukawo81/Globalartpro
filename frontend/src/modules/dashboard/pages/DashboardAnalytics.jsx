import React, { useMemo, useState } from 'react';
import './DashboardAnalytics.css';

export default function DashboardAnalytics({ data = [] }) {
  const total = useMemo(() => data.reduce((s, d) => s + (d.value || 0), 0), [data]);
  const [hover, setHover] = useState(null);

  const size = 220;
  const r = 80;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d) => {
    const val = d.value || 0;
    const pct = total === 0 ? 0 : val / total;
    const dash = pct * c;
    const seg = { ...d, pct, dash, offset };
    offset -= dash;
    return seg;
  });

  return (
    <div className="dashboard-analytics">
      <div className="donut-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id="glow" x='-50%' y='-50%' width='200%' height='200%'>
              <feGaussianBlur stdDeviation='4' result='coloredBlur' />
            </filter>
          </defs>

          {/* Background ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#eef2ff" strokeWidth={28} />

          {segments.map((s) => (
            <circle
              key={s.id}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={28}
              strokeDasharray={`${s.dash} ${c - s.dash}`}
              strokeDashoffset={s.offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 300ms, transform 200ms' }}
              transform={`rotate(-90 ${cx} ${cy})`}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(null)}
            />
          ))}

        </svg>

        <div className="donut-center">
          <img src="image/logo globalartpro.jpeg" alt="GlobalArtpro" />
          <div className="donut-total">{total}</div>
          <div className="donut-label">KPI total</div>
        </div>
      </div>

      <div className="legend">
        {data.map(d => (
          <div key={d.id} className="legend-item" onMouseEnter={() => setHover(d)} onMouseLeave={() => setHover(null)}>
            <span className="legend-color" style={{ background: d.color }}></span>
            <div className="legend-meta">
              <strong>{d.id}</strong>
              <div className="muted">{d.value.toLocaleString()}</div>
            </div>
            <div className="muted">{Math.round((d.value / (total||1)) * 100)}%</div>
          </div>
        ))}
      </div>

      {hover && (
        <div className="tooltip">{hover.id}: {hover.value.toLocaleString()} ({Math.round(hover.pct*100)}%)</div>
      )}
    </div>
  );
}
