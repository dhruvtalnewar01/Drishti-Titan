/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — GEOPOLITICAL RISK PULSE
   Real-time geopolitical crisis scoring
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react';
import { GEO_FACTORS, CRISIS_HISTORY } from '../data/crisisPlaybooks.js';

const S = { dim: '#3d5272', muted: '#5e7490', border: '#1a2744' };

const gaugeColor = (score) => {
  if (score <= 30) return '#10b981';
  if (score <= 60) return '#f59e0b';
  if (score <= 80) return '#fb923c';
  return '#ef4444';
};

const gaugeLabel = (score) => {
  if (score <= 30) return 'CALM';
  if (score <= 60) return 'CAUTION';
  if (score <= 80) return 'ELEVATED';
  return 'CRISIS';
};

const recommendations = (score) => {
  if (score <= 30) return [
    'Normal allocation — follow NEXUS signals as usual',
    'No additional hedging needed at current risk levels',
    'Continue systematic deployment strategy',
  ];
  if (score <= 60) return [
    'Add DEFENCE sector allocation (+5% — HAL, BEL)',
    'Add GOLD ETF allocation (+5% — GOLDBEES)',
    'Reduce AIRLINES exposure — fuel cost risk',
    'Monitor VIX — if crosses 20, escalate to elevated',
  ];
  if (score <= 80) return [
    'Reduce overall equity exposure by 20%',
    'Maximum GOLD ETF allocation — 15%',
    'EXIT all high-beta positions immediately',
    'HOLD only defensive: FMCG + IT + PHARMA',
    'Prepare Crisis Playbook activation',
  ];
  return [
    '🚨 CRISIS PLAYBOOK — ACTIVATE IMMEDIATELY',
    'CASH position: raise to 40%+',
    'EXIT all cyclicals, high-beta, small caps',
    'GOLD + DEFENCE only safe havens',
    '→ GO TO CRISIS AI TAB FOR FULL PLAYBOOK',
  ];
};

export default function GeoPulse() {
  const [simScore, setSimScore] = useState(58);
  const [isSimulating, setIsSimulating] = useState(false);

  const activeScore = isSimulating ? simScore : 58;
  const color = gaugeColor(activeScore);
  const label = gaugeLabel(activeScore);
  const recs = recommendations(activeScore);

  // Arc gauge
  const radius = 80;
  const circumference = Math.PI * radius; // half circle
  const progress = (activeScore / 100) * circumference;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: '#f8fafc', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
          🌍 GEOPOLITICAL RISK PULSE
          <span style={{ background: `${color}15`, color, fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 8, border: `1px solid ${color}25` }}>{label}</span>
        </div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 4 }}>8 real-time macro factors · India-specific geopolitical intelligence</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* GAUGE */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px' }}>
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Background arc */}
            <path d="M 10 110 A 90 90 0 0 1 190 110" fill="none" stroke="#1a2744" strokeWidth="12" strokeLinecap="round" />
            {/* Progress arc */}
            <path d="M 10 110 A 90 90 0 0 1 190 110" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference}`}
              style={{ transition: 'stroke-dasharray 0.8s ease, stroke 0.5s ease', filter: `drop-shadow(0 0 8px ${color}60)` }} />
            {/* Center text */}
            <text x="100" y="90" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 36, fill: color }}>{activeScore}</text>
            <text x="100" y="108" textAnchor="middle" style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 10, fill: S.dim, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</text>
            {/* Zone labels */}
            <text x="18" y="118" style={{ fontSize: 7, fill: '#10b981' }}>CALM</text>
            <text x="60" y="25" style={{ fontSize: 7, fill: '#f59e0b' }}>CAUTION</text>
            <text x="130" y="25" style={{ fontSize: 7, fill: '#fb923c' }}>ELEVATED</text>
            <text x="165" y="118" style={{ fontSize: 7, fill: '#ef4444' }}>CRISIS</text>
          </svg>

          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[
              { r: '0-30', c: '#10b981' },
              { r: '30-60', c: '#f59e0b' },
              { r: '60-80', c: '#fb923c' },
              { r: '80-100', c: '#ef4444' },
            ].map(z => (
              <span key={z.r} style={{ fontSize: 8, color: z.c, padding: '2px 8px', borderRadius: 4, background: `${z.c}10`, border: `1px solid ${z.c}20`, fontWeight: 700 }}>{z.r}</span>
            ))}
          </div>

          {/* Simulate slider */}
          <div style={{ marginTop: 16, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: S.dim, fontWeight: 700 }}>SIMULATE GEO RISK</span>
              <button onClick={() => setIsSimulating(!isSimulating)} style={{ background: isSimulating ? '#ef444420' : '#7C5CFC15', border: `1px solid ${isSimulating ? '#ef444430' : '#7C5CFC25'}`, color: isSimulating ? '#ef4444' : '#7C5CFC', padding: '3px 12px', borderRadius: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer' }}>
                {isSimulating ? '✕ RESET' : '⚡ SIMULATE'}
              </button>
            </div>
            {isSimulating && (
              <input type="range" min="0" max="100" value={simScore} onChange={e => setSimScore(+e.target.value)} style={{ width: '100%', accentColor: color }} />
            )}
          </div>
        </div>

        {/* RECOMMENDATIONS */}
        <div className="glass-card" style={{ borderColor: `${color}15` }}>
          <div style={{ fontWeight: 800, fontSize: 12, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>PORTFOLIO RECOMMENDATIONS AT SCORE {activeScore}</div>
          {recs.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 10px', background: '#04070f', borderRadius: 8, marginBottom: 6, border: `1px solid ${S.border}20`, fontSize: 11, color: '#e2e8f0', alignItems: 'flex-start' }}>
              <span style={{ color, fontWeight: 900, fontFamily: 'var(--font-mono)', fontSize: 11 }}>{i + 1}.</span>
              <span style={{ lineHeight: 1.5 }}>{r}</span>
            </div>
          ))}
          {activeScore >= 80 && (
            <div style={{ marginTop: 10, padding: '10px 14px', background: '#ef444410', border: '1px solid #ef444425', borderRadius: 10, textAlign: 'center', animation: 'crisis-pulse 1.5s ease infinite' }}>
              <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 800 }}>⚠️ ACTIVATE CRISIS AI IMMEDIATELY</span>
            </div>
          )}
        </div>
      </div>

      {/* 8 GEO FACTORS */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>8 GEOPOLITICAL RISK FACTORS — INDIA-SPECIFIC</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {GEO_FACTORS.map(f => {
            const fc = f.score > 60 ? '#ef4444' : f.score > 40 ? '#f59e0b' : '#10b981';
            return (
              <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 50px 80px', gap: 12, alignItems: 'center', padding: '10px 14px', background: '#04070f', borderRadius: 10, border: `1px solid ${f.score > 40 ? '#f59e0b15' : S.border}30` }}>
                <span style={{ fontSize: 12, color: '#e2e8f0', fontWeight: 600 }}>{f.name}</span>
                <div style={{ height: 6, background: '#1a2744', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${f.score}%`, height: '100%', background: `linear-gradient(90deg, ${fc}80, ${fc})`, borderRadius: 3, transition: 'width 0.8s ease', boxShadow: f.score > 40 ? `0 0 8px ${fc}30` : 'none' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 900, color: fc, textAlign: 'right' }}>{f.score}</span>
                <span style={{ fontSize: 9, color: fc, fontWeight: 700, textAlign: 'right', textTransform: 'uppercase' }}>● {f.status}</span>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: 14 }}>
          <span style={{ color: S.dim }}>COMPOSITE: </span>
          <span style={{ fontWeight: 900, color }}>{activeScore}/100 — {label}</span>
        </div>
      </div>

      {/* CRISIS HISTORY TIMELINE */}
      <div className="glass-card">
        <div style={{ fontWeight: 800, fontSize: 12, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>90-DAY GEO PULSE HISTORY + ANNOTATED EVENTS</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {CRISIS_HISTORY.map((h, idx) => {
            const hc = h.geo > 70 ? '#ef4444' : h.geo > 40 ? '#f59e0b' : '#10b981';
            return (
              <div key={h.year + '-' + idx} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 70px 100px 120px', gap: 12, alignItems: 'center', padding: '10px 14px', background: h.recovery === 'ONGOING' ? '#ef444408' : '#04070f', borderRadius: 10, border: `1px solid ${h.recovery === 'ONGOING' ? '#ef444418' : S.border + '30'}` }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: '#f8fafc' }}>{h.year}</span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{h.event}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: hc }}>Geo: {h.geo}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#ef4444' }}>Nifty: {h.nifty}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#10b981' }}>Rcv: {h.recovery}</span>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#3d527280' }}>{'When geo score > 60, Nifty historically underperforms by 8.4% over next 30 days'}</div>
      </div>
    </div>
  );
}
