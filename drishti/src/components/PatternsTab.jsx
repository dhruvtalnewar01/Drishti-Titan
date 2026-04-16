import { PATTERNS } from '../data.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

const ConfBar = ({ value, color = '#00E5A0', width = 72 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ background: '#0a101e', borderRadius: 6, height: 5, width, overflow: 'hidden', border: '1px solid #1a274420' }}>
      <div style={{ background: `linear-gradient(90deg, ${color}90, ${color})`, height: '100%', borderRadius: 6, width: `${value}%`, transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)', boxShadow: `0 0 6px ${color}40` }} />
    </div>
    <span style={{ color, fontWeight: 700, fontSize: 11, fontFamily: 'var(--font-mono)' }}>{value}%</span>
  </div>
);

export default function PatternsTab({ onAskDrishti }) {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>Pattern Intelligence + Backtest</div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Back-tested success rates · measured move targets · historical performance data</div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {PATTERNS.map((p, i) => (
          <div key={i} className="glass-card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{p.ticker}</span>
                  <span style={{ background: '#38bdf815', color: '#38bdf8', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, border: '1px solid #38bdf825' }}>{p.tf}</span>
                  <span style={{ background: '#7C5CFC15', color: '#7C5CFC', fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, border: '1px solid #7C5CFC25' }}>{p.pattern}</span>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 11 }}><span style={{ color: S.dim }}>Formation: </span><span style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{p.bars} bars</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: S.dim }}>Target: </span><span style={{ color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.target}</span></div>
                  <div style={{ fontSize: 11 }}><span style={{ color: S.dim }}>Historical: </span><span style={{ color: '#00E5A0', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{p.sr}</span></div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: S.dim, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Confidence</div>
                <ConfBar value={p.conf} color="#7C5CFC" />
              </div>
            </div>

            {/* Schematic */}
            <div style={{ marginTop: 12, background: 'linear-gradient(135deg, #04070f, #060d18)', borderRadius: 8, padding: '10px 12px', height: 56, position: 'relative', overflow: 'hidden', border: '1px solid #1a274420' }}>
              <svg width="100%" height="44" viewBox="0 0 380 44">
                {p.pattern === "Bull flag" && <><polyline points="8,38 30,26 55,12 75,20 95,15 115,21 135,17 155,23 175,19 195,24 210,8" fill="none" stroke="#10b981" strokeWidth="1.5" /><line x1="210" y1="8" x2="270" y2="8" stroke="#00E5A0" strokeWidth="1" strokeDasharray="3 2" /><text x="275" y="12" fill="#00E5A0" fontSize="8">Target</text></>}
                {p.pattern === "Ascending triangle" && <><line x1="8" y1="10" x2="240" y2="10" stroke="#10b981" strokeWidth="1" /><polyline points="8,38 30,26 58,16 78,28 108,18 128,26 158,14 178,24 208,13" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="208" y1="13" x2="270" y2="5" stroke="#00E5A0" strokeWidth="1" strokeDasharray="3 2" /></>}
                {p.pattern === "Inverse head & shoulders" && <><polyline points="8,14 35,32 58,20 88,42 118,20 145,30 170,14" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="14" x2="240" y2="14" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" /><line x1="170" y1="14" x2="240" y2="5" stroke="#00E5A0" strokeWidth="1" strokeDasharray="3 2" /></>}
                {p.pattern === "Double bottom" && <><polyline points="8,10 35,28 65,40 90,26 115,40 140,26 165,10" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="10" x2="240" y2="10" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" /><line x1="165" y1="10" x2="240" y2="3" stroke="#00E5A0" strokeWidth="1" strokeDasharray="3 2" /></>}
                {p.pattern === "Breakout from base" && <><polyline points="8,33 35,30 65,32 90,31 120,33 145,29 165,32 185,30 205,18 225,10" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="30" x2="200" y2="30" stroke="#64748b" strokeWidth="0.5" strokeDasharray="2 2" /><line x1="225" y1="10" x2="270" y2="3" stroke="#00E5A0" strokeWidth="1" strokeDasharray="3 2" /></>}
                {p.pattern === "Cup and handle" && <><polyline points="8,10 30,18 55,30 80,38 110,38 140,30 165,18 180,12 190,16 200,14 210,8" fill="none" stroke="#38bdf8" strokeWidth="1.5" /><line x1="8" y1="10" x2="250" y2="10" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" /><line x1="210" y1="8" x2="270" y2="3" stroke="#00E5A0" strokeWidth="1" strokeDasharray="3 2" /></>}
              </svg>
              <div style={{ position: 'absolute', top: 6, right: 10, fontSize: 8, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Schematic</div>
            </div>

            {/* Backtest Data */}
            {p.backtest && (
              <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8 }}>
                {[
                  { label: 'Backtest Trades', value: p.backtest.trades, color: '#38bdf8' },
                  { label: 'Wins', value: p.backtest.wins, color: '#10b981' },
                  { label: 'Avg Return', value: `+${p.backtest.avgReturn}%`, color: '#10b981' },
                  { label: 'Max Drawdown', value: `${p.backtest.maxDrawdown}%`, color: '#ef4444' },
                ].map((s, j) => (
                  <div key={j} style={{ padding: '6px 10px', background: '#04070f', borderRadius: 6, border: `1px solid ${S.border}`, textAlign: 'center' }}>
                    <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => onAskDrishti(`Explain the ${p.pattern} on ${p.ticker}. Show backtest data. What confirms breakout?`)}
              style={{ marginTop: 10, background: 'none', border: `1px solid ${S.border}`, color: S.muted, borderRadius: 8, padding: '6px 14px', fontSize: 10, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
              🧠 Ask NEXUS to explain →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
