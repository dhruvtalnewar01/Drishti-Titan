import { useState } from 'react';
import { SIGNALS, typeColor, typeIcon } from '../data.js';
import { sentinel } from '../engine/sentinel.js';
import MarketChart from './MarketChart.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const S = {
  border: '#1a2744', muted: '#5e7490', dim: '#3d5272', card: '#0c1322',
  cardHover: '#111d33', borderHover: '#2a3f66', text: '#f0f4f8',
};

const Badge = ({ children, color, glow }) => (
  <span style={{ background: color + '15', color, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, letterSpacing: '0.04em', textTransform: 'uppercase', border: `1px solid ${color}25`, boxShadow: glow ? `0 0 8px ${color}20` : 'none' }}>{children}</span>
);

const ConfBar = ({ value, color = '#00E5A0', width = 72 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ background: '#0a101e', borderRadius: 6, height: 5, width, overflow: 'hidden', border: '1px solid #1a274420' }}>
      <div style={{ background: `linear-gradient(90deg, ${color}90, ${color})`, height: '100%', borderRadius: 6, width: `${value}%`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: `0 0 6px ${color}40` }} />
    </div>
    <span style={{ color, fontWeight: 700, fontSize: 11, fontFamily: 'var(--font-mono)' }}>{value}%</span>
  </div>
);

export default function RadarTab({ onAskDrishti }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  let filtered = filter === 'ALL' ? SIGNALS : SIGNALS.filter(s => s.impact === filter);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(s => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.signal.toLowerCase().includes(q));
  }

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
            Signal Finder — Not a Summarizer
            <span style={{ fontSize: 9, color: '#00E5A0', background: 'rgba(0,229,160,0.08)', padding: '2px 8px', borderRadius: 10, fontWeight: 600, border: '1px solid rgba(0,229,160,0.15)' }}>SENTINEL VERIFIED</span>
          </div>
          <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>NSE filings · block deals · insider trades · concall NLP · pattern detection · 3-of-5 consensus · {SIGNALS.length} active signals</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div className="search-container" style={{ width: 180 }}>
            <span className="search-icon" style={{ fontSize: 11 }}>🔍</span>
            <input className="search-input" type="text" placeholder="Filter signals..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '7px 12px 7px 30px', fontSize: 11 }} />
          </div>
          {['ALL', 'BULLISH', 'BEARISH'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 14px', borderRadius: 20, border: `1px solid ${filter === f ? '#00E5A0' : S.border}`, background: filter === f ? 'rgba(0,229,160,0.06)' : 'none', color: filter === f ? '#00E5A0' : S.muted, fontSize: 11, fontWeight: filter === f ? 700 : 400, boxShadow: filter === f ? '0 0 12px rgba(0,229,160,0.1)' : 'none' }}>
              {f === 'BULLISH' ? '🟢 ' : f === 'BEARISH' ? '🔴 ' : ''}{f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: S.dim, fontSize: 12 }}>
          No signals match your search. Try a different query.
        </div>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map((sig, idx) => {
          const sentinelResult = sentinel.signalManipulationCheck(sig);
          return (
              <div key={sig.id} className={selected?.id === sig.id ? 'glassmorphism' : 'hologram-card'} onClick={() => setSelected(selected?.id === sig.id ? null : sig)}
              onMouseEnter={() => setHoveredCard(sig.id)} onMouseLeave={() => setHoveredCard(null)}
              style={{ background: hoveredCard === sig.id ? S.cardHover : S.card, border: `1px solid ${selected?.id === sig.id ? 'rgba(0,229,160,0.3)' : hoveredCard === sig.id ? S.borderHover : S.border}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.25s ease', animation: `fadeInUp 0.4s ease ${idx * 0.04}s both`, boxShadow: selected?.id === sig.id ? '0 0 20px rgba(0,229,160,0.08)' : hoveredCard === sig.id ? '0 4px 20px rgba(0,0,0,0.3)' : 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, animation: 'float 3s ease-in-out infinite' }}>{typeIcon(sig.type)}</span>
                    <Badge color={typeColor(sig.type)} glow>{sig.type.replace('_', ' ')}</Badge>
                    <span className="shimmer-text" style={{ fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-mono)' }}>{sig.ticker}</span>
                    <span style={{ color: S.muted, fontSize: 11 }}>{sig.name}</span>
                    {sentinelResult.passed && <span style={{ fontSize: 8, color: '#00E5A0', background: 'rgba(0,229,160,0.08)', padding: '1px 6px', borderRadius: 8, border: '1px solid rgba(0,229,160,0.15)' }}>🛡️ VERIFIED</span>}
                    <span style={{ color: S.dim, fontSize: 10, marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{sig.time}</span>
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: 12.5, lineHeight: 1.6, marginBottom: 6 }}>{sig.signal}</div>
                  <div style={{ fontSize: 10, color: S.dim, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ opacity: 0.5 }}>📡</span> Source: {sig.source}
                    <span style={{ marginLeft: 8, opacity: 0.5 }}>🔗</span> <span style={{ color: '#38bdf8', fontSize: 9 }}>3/5 consensus</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: 80, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <Badge color={sig.impact === 'BULLISH' ? '#10b981' : '#ef4444'} glow>{sig.impact}</Badge>
                  <div style={{ color: sig.impact === 'BULLISH' ? '#10b981' : '#ef4444', fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono)', textShadow: sig.impact === 'BULLISH' ? '0 0 12px rgba(16,185,129,0.3)' : '0 0 12px rgba(239,68,68,0.3)' }}>{sig.delta}</div>
                  <ConfBar value={sig.confidence} color={sig.confidence > 85 ? '#00E5A0' : '#7C5CFC'} />
                </div>
              </div>
              {selected?.id === sig.id && (
                <div style={{ marginTop: 14, padding: 14, background: 'linear-gradient(135deg, #04070f, #060d18)', borderRadius: 10, borderLeft: '3px solid ' + typeColor(sig.type), animation: 'fadeInUp 0.3s ease', boxShadow: `inset 0 0 20px ${typeColor(sig.type)}08` }}>
                  <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.8, marginBottom: 14 }}>{sig.detail}</div>
                  
                  {/* Cinematic Candlestick Chart Injection */}
                  <div style={{ marginBottom: 16 }}>
                    <ErrorBoundary>
                      <MarketChart ticker={sig.ticker} height={280} />
                    </ErrorBoundary>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={e => { e.stopPropagation(); onAskDrishti(`${sig.ticker} signal: ${sig.signal}. Provide multi-agent council analysis. How does this affect my portfolio?`); }}
                      style={{ background: 'rgba(0,229,160,0.06)', border: '1px solid rgba(0,229,160,0.2)', color: '#00E5A0', borderRadius: 8, padding: '7px 16px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 0 12px rgba(0,229,160,0.08)' }}>
                      🧠 Ask NEXUS Council →
                    </button>
                    <button onClick={e => e.stopPropagation()}
                      style={{ background: 'none', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', borderRadius: 8, padding: '7px 12px', fontSize: 10, fontWeight: 500 }}>
                      📊 View 9-Layer Audit
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
