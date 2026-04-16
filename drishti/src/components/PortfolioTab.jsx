import { PORTFOLIO, SIGNALS } from '../data.js';
import { SUSTAINABILITY_METRICS, SCALE_PHASES } from '../utils/constants.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

const Badge = ({ children, color }) => (
  <span style={{ background: color + '15', color, fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, letterSpacing: '0.04em', textTransform: 'uppercase', border: `1px solid ${color}25` }}>{children}</span>
);

export default function PortfolioTab({ onAskDrishti }) {
  const pnl = PORTFOLIO.reduce((a, s) => a + (s.ltp - s.avgPrice) * s.qty, 0);
  const invested = PORTFOLIO.reduce((a, s) => a + s.avgPrice * s.qty, 0);
  const currentVal = invested + pnl;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>Portfolio + Sustainability</div>
          <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>DRISHTI maps signals to holdings · Green AI metrics · ESG overlay</div>
        </div>
        <div className="sustain-badge">🌱 GREEN AI · {SUSTAINABILITY_METRICS.greenAIScore}/100</div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Invested', value: `₹${invested.toLocaleString('en-IN')}`, color: '#f8fafc', icon: '💰' },
          { label: 'Current Value', value: `₹${currentVal.toLocaleString('en-IN')}`, color: '#f8fafc', icon: '📊' },
          { label: 'Unrealised P&L', value: `+₹${pnl.toLocaleString('en-IN')}`, sub: `${((pnl / invested) * 100).toFixed(2)}%`, color: '#10b981', icon: '📈' },
          { label: 'Active Signals', value: `${SIGNALS.filter(s => PORTFOLIO.some(p => p.ticker === s.ticker)).length} on holdings`, color: '#00E5A0', icon: '📡' },
        ].map((c, i) => (
          <div key={i} className="glass-card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
            <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}><span>{c.icon}</span>{c.label}</div>
            <div style={{ fontWeight: 800, fontSize: 17, color: c.color, fontFamily: 'var(--font-mono)' }}>{c.value}</div>
            {c.sub && <div style={{ fontSize: 11, color: c.color, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Holdings */}
      <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
        {PORTFOLIO.map((h, i) => {
          const pct = ((h.ltp - h.avgPrice) / h.avgPrice) * 100;
          const sig = SIGNALS.find(s => s.ticker === h.ticker);
          return (
            <div key={i} className="glass-card" style={{ borderColor: sig ? 'rgba(0,229,160,0.12)' : undefined, animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{h.ticker}</span>
                    <Badge color={S.muted}>{h.sector}</Badge>
                    {sig && <Badge color="#00E5A0">⚡ SIGNAL ACTIVE</Badge>}
                  </div>
                  <div style={{ fontSize: 11, color: S.dim }}>{h.qty} shares · Avg ₹{h.avgPrice.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>₹{h.ltp.toLocaleString('en-IN')}</div>
                  <div style={{ color: pct >= 0 ? '#10b981' : '#ef4444', fontWeight: 700, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{pct >= 0 ? '+' : ''}{pct.toFixed(2)}%</div>
                  <div style={{ color: S.dim, fontSize: 10, fontFamily: 'var(--font-mono)' }}>₹{((h.ltp - h.avgPrice) * h.qty).toLocaleString('en-IN')}</div>
                </div>
              </div>
              {sig && (
                <div style={{ marginTop: 12, padding: '10px 12px', background: 'linear-gradient(135deg, #04070f, #060d18)', borderRadius: 8, borderLeft: '3px solid #00E5A0' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7 }}><span style={{ color: '#00E5A0', fontWeight: 700 }}>NEXUS: </span>{sig.signal}</div>
                  <button onClick={() => onAskDrishti(`I hold ${h.ticker}. ${sig.signal}. Multi-agent council analysis please.`)}
                    style={{ marginTop: 8, background: 'none', border: '1px solid rgba(0,229,160,0.15)', color: '#00E5A0', borderRadius: 7, padding: '5px 12px', fontSize: 10, fontWeight: 600 }}>
                    🧠 Ask NEXUS Council →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sustainability Dashboard */}
      <div className="glass-card" style={{ borderColor: '#10b98120', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#10b981', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          🌱 Sustainability & Impact Dashboard
          <span className="sustain-badge">NIRMAN ALIGNED</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          <div style={{ padding: 12, background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', marginBottom: 4 }}>Green AI Score</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{SUSTAINABILITY_METRICS.greenAIScore}/100</div>
            <div style={{ fontSize: 9, color: S.muted }}>Carbon: {SUSTAINABILITY_METRICS.carbonPerQuery}</div>
          </div>
          <div style={{ padding: 12, background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', marginBottom: 4 }}>Social Impact</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc' }}>{SUSTAINABILITY_METRICS.socialImpact.retailTradersProtected}</div>
            <div style={{ fontSize: 9, color: S.muted }}>SEBI: {SUSTAINABILITY_METRICS.socialImpact.sebiCompliance}</div>
          </div>
          <div style={{ padding: 12, background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', marginBottom: 4 }}>Model Efficiency</div>
            <div style={{ fontWeight: 800, fontSize: 24, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{SUSTAINABILITY_METRICS.modelEfficiency}</div>
            <div style={{ fontSize: 9, color: S.muted }}>Resource optimization</div>
          </div>
        </div>
      </div>

      {/* 5-Phase Scale Architecture */}
      <div className="glass-card">
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 12 }}>5-Phase Scale Architecture</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {SCALE_PHASES.map((phase, i) => (
            <div key={i} style={{ flex: '1 1 120px', padding: '10px 12px', background: phase.status === 'active' ? `${phase.color}12` : '#04070f', borderRadius: 8, border: `1px solid ${phase.status === 'active' ? phase.color + '40' : S.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: phase.color, fontWeight: 700 }}>Phase {phase.phase}</div>
              <div style={{ fontSize: 11, color: '#f8fafc', fontWeight: 600, marginTop: 2 }}>{phase.name}</div>
              <div style={{ fontSize: 8, color: S.dim, marginTop: 2 }}>{phase.tech}</div>
              <div style={{ fontSize: 9, color: phase.color, marginTop: 4, fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{phase.users} users</div>
              <div style={{ fontSize: 8, color: phase.status === 'active' ? '#10b981' : S.dim, textTransform: 'uppercase', fontWeight: 600, marginTop: 2 }}>{phase.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
