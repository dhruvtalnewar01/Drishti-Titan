/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — ALPHA LEDGER
   "We don't guarantee. We PROVE."
   ═══════════════════════════════════════════════════════════════ */
import { useState, useMemo } from 'react';
import { ALPHA_LEDGER, ALPHA_SUMMARY, generateAlphaChartData, USER_DNA } from '../data/alphaLedger.js';
import { PORTFOLIO } from '../data.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };
const TYPE_COLORS = { BULK_DEAL: '#f59e0b', INSIDER: '#a78bfa', TECHNICAL: '#38bdf8', RESULT: '#10b981', REGULATORY: '#ec4899', ALERT: '#ef4444' };

export default function AlphaLedger({ onAskDrishti }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [showDNA, setShowDNA] = useState(false);
  const chartData = useMemo(() => generateAlphaChartData(), []);
  const maxVal = Math.max(...chartData.map(d => Math.max(d.nexus, d.nifty)));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* HEADER */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: '#f8fafc', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '-0.02em' }}>
          💼 ALPHA LEDGER — 90-Day Performance
          <span style={{ background: '#f59e0b15', color: '#f59e0b', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 8, border: '1px solid #f59e0b25' }}>LIVE TRACK RECORD</span>
        </div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 4 }}>Every signal documented. Every outcome tracked. Auditable. Transparent.</div>
      </div>

      {/* 4 STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'ALPHA VS NIFTY', value: '+23.4%', sub: `Nifty: +${ALPHA_SUMMARY.niftyReturn}% same period`, color: '#f59e0b', icon: '📈' },
          { label: 'WIN RATE', value: '87%', sub: `${ALPHA_SUMMARY.hitRate}/${ALPHA_SUMMARY.totalSignals} signals hit target`, color: '#10b981', icon: '✅' },
          { label: 'TOTAL P&L', value: '₹14.7L', sub: 'On ₹10L deployed capital', color: '#38bdf8', icon: '💰' },
          { label: 'AVG HOLD', value: `${ALPHA_SUMMARY.avgHoldDays} days`, sub: `Avg return: +${ALPHA_SUMMARY.avgReturn}%`, color: '#a78bfa', icon: '⏱️' },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '18px', borderColor: stat.color + '20', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${stat.color}, transparent)` }} />
            <div style={{ fontSize: 10, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>{stat.icon} {stat.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 28, color: stat.color, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ALPHA vs NIFTY CHART (pure CSS/SVG) */}
      <div className="glass-card" style={{ marginBottom: 20, padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc' }}>NEXUS Alpha vs Nifty Benchmark</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 11, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 3, background: '#f59e0b', borderRadius: 2 }} /><strong>NEXUS +23.4%</strong></span>
            <span style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 16, height: 3, background: '#64748b', borderRadius: 2 }} />Nifty +8.2%</span>
          </div>
        </div>
        <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${chartData.length} ${maxVal + 5}`} preserveAspectRatio="none" style={{ transform: 'scaleY(-1)' }}>
            {/* Alpha fill */}
            <polygon points={`0,0 ${chartData.map((d, i) => `${i},${Math.max(0, d.nexus)}`).join(' ')} ${chartData.length - 1},0`} fill="url(#alphaGrad)" opacity="0.15" />
            {/* Nexus line */}
            <polyline points={chartData.map((d, i) => `${i},${Math.max(0, d.nexus)}`).join(' ')} fill="none" stroke="#f59e0b" strokeWidth="0.8" />
            {/* Nifty line */}
            <polyline points={chartData.map((d, i) => `${i},${Math.max(0, d.nifty)}`).join(' ')} fill="none" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2,2" />
            <defs>
              <linearGradient id="alphaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          {/* End labels */}
          <div style={{ position: 'absolute', right: 8, top: 10, fontFamily: 'var(--font-mono)', fontWeight: 900 }}>
            <div style={{ fontSize: 14, color: '#f59e0b' }}>+23.4%</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>+8.2%</div>
          </div>
          <div style={{ position: 'absolute', bottom: 4, left: '40%', fontSize: 12, color: '#f59e0b50', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>Alpha gap: +15.2pp</div>
        </div>
      </div>

      {/* BY SIGNAL TYPE */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc' }}>Win Rate by Signal Type</div>
          <button onClick={() => setShowDNA(!showDNA)} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa', padding: '5px 14px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
            {showDNA ? '✕ Hide' : '🧬'} YOUR ALPHA DNA
          </button>
        </div>
        {Object.entries(ALPHA_SUMMARY.byType).map(([key, data]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#94a3b8', minWidth: 100, fontWeight: 600 }}>{data.label}</span>
            <div style={{ flex: 1, height: 8, background: '#1a2744', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${data.winRate}%`, height: '100%', background: `linear-gradient(90deg, ${data.color}80, ${data.color})`, borderRadius: 4, transition: 'width 1s ease', boxShadow: `0 0 8px ${data.color}30` }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: data.color, minWidth: 40 }}>{data.winRate}%</span>
            <span style={{ fontSize: 9, color: S.dim }}>{data.signals} signals</span>
            {showDNA && USER_DNA.topSignalType === key && <span style={{ background: '#f59e0b15', color: '#f59e0b', fontSize: 8, padding: '2px 8px', borderRadius: 6, fontWeight: 800, border: '1px solid #f59e0b25' }}>YOUR EDGE</span>}
          </div>
        ))}
        {/* DNA Panel */}
        {showDNA && (
          <div style={{ marginTop: 16, padding: '16px', background: 'rgba(167,139,250,0.04)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: 12, animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#a78bfa', marginBottom: 10 }}>🧬 YOUR ALPHA DNA</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: 11 }}>
              <div><span style={{ color: S.dim }}>Style:</span> <span style={{ color: '#f8fafc', fontWeight: 700 }}>{USER_DNA.tradingStyle}</span></div>
              <div><span style={{ color: S.dim }}>Risk:</span> <span style={{ color: '#f59e0b', fontWeight: 700 }}>{USER_DNA.riskTolerance}</span></div>
              <div><span style={{ color: S.dim }}>Avg Hold:</span> <span style={{ color: '#f8fafc', fontWeight: 700 }}>{USER_DNA.avgHoldDays} days</span></div>
              <div><span style={{ color: S.dim }}>Best Edge:</span> <span style={{ color: '#10b981', fontWeight: 700 }}>Bulk Deals (92%)</span></div>
              <div><span style={{ color: S.dim }}>Weakest:</span> <span style={{ color: '#ef4444', fontWeight: 700 }}>Regulatory (71%)</span></div>
              <div><span style={{ color: S.dim }}>Capital:</span> <span style={{ color: '#38bdf8', fontWeight: 700 }}>₹{(USER_DNA.capitalDeployed / 100000).toFixed(1)}L / ₹{(USER_DNA.totalCapital / 100000).toFixed(0)}L</span></div>
            </div>
          </div>
        )}
      </div>

      {/* SIGNAL LEDGER TABLE */}
      <div className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc', marginBottom: 14 }}>SIGNAL LEDGER — Last 20 Documented Signals</div>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 80px 70px 70px 70px 50px 80px 1fr', gap: 8, padding: '8px 12px', background: '#04070f', borderRadius: 8, marginBottom: 6, fontSize: 9, color: S.dim, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span>Signal</span><span>Type</span><span>Entry</span><span>Exit</span><span>Return</span><span>Days</span><span>Status</span><span>Source</span>
        </div>
        {/* Table rows */}
        {ALPHA_LEDGER.map((s, i) => (
          <div key={s.id}>
            <div onClick={() => setExpandedRow(expandedRow === i ? null : i)}
              style={{ display: 'grid', gridTemplateColumns: '120px 80px 70px 70px 70px 50px 80px 1fr', gap: 8, padding: '10px 12px', background: expandedRow === i ? (s.hit ? 'rgba(16,185,129,0.04)' : 'rgba(239,68,68,0.04)') : 'transparent', borderRadius: 8, cursor: 'pointer', fontSize: 11, alignItems: 'center', borderBottom: `1px solid ${S.border}15`, transition: 'background 0.2s' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f8fafc' }}>
                {s.action === 'SELL' ? '🔴' : '🟢'} {s.ticker}
              </span>
              <span style={{ background: (TYPE_COLORS[s.type] || '#666') + '15', color: TYPE_COLORS[s.type] || '#666', padding: '2px 8px', borderRadius: 6, fontSize: 8, fontWeight: 700, textAlign: 'center' }}>{s.type.replace('_', ' ')}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>₹{s.entry.toLocaleString()}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>₹{s.exit.toLocaleString()}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: s.returnPct >= 0 ? '#10b981' : '#ef4444' }}>{s.returnPct >= 0 ? '+' : ''}{s.returnPct}%</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{s.days}d</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: s.hit ? '#10b981' : '#ef4444' }}>{s.hit ? '✅ TARGET HIT' : '⛔ STOPPED'}</span>
              <span style={{ fontSize: 9, color: S.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.source}</span>
            </div>
            {expandedRow === i && (
              <div style={{ padding: '12px 16px', background: '#04070f', borderRadius: '0 0 8px 8px', marginBottom: 4, fontSize: 11, color: '#94a3b8', animation: 'fadeIn 0.2s ease', borderLeft: `3px solid ${s.hit ? '#10b981' : '#ef4444'}`, marginLeft: 12, marginRight: 12 }}>
                <div><strong style={{ color: '#f8fafc' }}>Signal:</strong> {s.signal}</div>
                <div style={{ marginTop: 4 }}><strong style={{ color: '#f8fafc' }}>Period:</strong> {s.entryDate} → {s.exitDate} · Confidence: {s.confidence}%</div>
                {s.note && <div style={{ marginTop: 4, color: '#f59e0b' }}>⚠️ {s.note}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PORTFOLIO HOLDINGS (compact) */}
      <div className="glass-card">
        <div style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          YOUR LIVE HOLDINGS
          <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>6 ACTIVE NEXUS SIGNALS ON YOUR HOLDINGS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {PORTFOLIO.map(h => {
            const pnl = (h.ltp - h.avgPrice) * h.qty;
            const pct = ((h.ltp - h.avgPrice) / h.avgPrice * 100).toFixed(1);
            return (
              <div key={h.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}40` }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: '#f8fafc' }}>{h.ticker}</div>
                  <div style={{ fontSize: 9, color: S.dim }}>{h.qty} shares @ ₹{h.avgPrice.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: pnl >= 0 ? '#10b981' : '#ef4444' }}>{pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 9, color: pnl >= 0 ? '#10b98180' : '#ef444480' }}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 14, fontSize: 10, color: '#3d527260' }}>⚠️ Past performance is not indicative of future returns. NEXUS provides research, not SEBI-registered investment advice.</div>
    </div>
  );
}
