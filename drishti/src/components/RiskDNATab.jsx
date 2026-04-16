import { useState, useMemo } from 'react';
import { PORTFOLIO } from '../data.js';
import { runMonteCarloSimulation, STRESS_SCENARIOS, runStressTest } from '../engine/monteCarlo.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

export default function RiskDNATab() {
  const [selectedScenario, setSelectedScenario] = useState(0);

  const mcResult = useMemo(() => runMonteCarloSimulation(PORTFOLIO, { paths: 10000, horizon: 252 }), []);
  const stressResult = useMemo(() => runStressTest(PORTFOLIO, STRESS_SCENARIOS[selectedScenario]), [selectedScenario]);

  const maxHistCount = Math.max(...mcResult.histogram.map(h => h.count));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>Risk DNA — Monte Carlo Engine</div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>10,000-path simulation · VaR · stress testing · portfolio risk fingerprint</div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Current Value', value: `₹${mcResult.currentValue.toLocaleString('en-IN')}`, color: '#f8fafc', icon: '💰' },
          { label: 'Expected (1Y)', value: `₹${mcResult.expectedValue.toLocaleString('en-IN')}`, sub: `${mcResult.expectedReturn}%`, color: '#10b981', icon: '📈' },
          { label: 'VaR (95%)', value: `₹${mcResult.var95.toLocaleString('en-IN')}`, color: '#ef4444', icon: '⚠️' },
          { label: 'CVaR', value: `₹${mcResult.cvar.toLocaleString('en-IN')}`, color: '#00E5A0', icon: '🔥' },
          { label: 'Max Loss', value: `₹${mcResult.maxLoss.toLocaleString('en-IN')}`, color: '#ef4444', icon: '📉' },
          { label: 'Max Gain', value: `₹${mcResult.maxGain.toLocaleString('en-IN')}`, color: '#10b981', icon: '🚀' },
        ].map((c, i) => (
          <div key={i} className="glass-card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{c.icon}</span>{c.label}
            </div>
            <div style={{ fontWeight: 800, fontSize: 15, color: c.color, fontFamily: 'var(--font-mono)' }}>{c.value}</div>
            {c.sub && <div style={{ fontSize: 10, color: c.color, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>{c.sub}</div>}
          </div>
        ))}
      </div>

      {/* Distribution Histogram */}
      <div className="glass-card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 4 }}>Probability Distribution (1-Year Horizon)</div>
        <div style={{ fontSize: 9, color: S.dim, marginBottom: 12 }}>{mcResult.paths.toLocaleString()} simulated paths · {mcResult.computeTime} compute time</div>
        
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 120, padding: '0 4px' }}>
          {mcResult.histogram.map((bar, i) => {
            const height = (bar.count / maxHistCount) * 100;
            const isVaR = bar.rangeStart <= (mcResult.currentValue - mcResult.var95);
            const isMean = bar.rangeStart <= mcResult.expectedValue && bar.rangeEnd >= mcResult.expectedValue;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative' }}>
                <div className="mc-histogram-bar"
                  style={{ width: '100%', height: `${height}%`, background: isVaR ? 'linear-gradient(180deg, #ef4444, #ef444460)' : isMean ? 'linear-gradient(180deg, #00E5A0, #00E5A060)' : 'linear-gradient(180deg, #38bdf880, #38bdf830)', cursor: 'pointer' }}
                  title={`₹${bar.rangeStart.toLocaleString('en-IN')} - ₹${bar.rangeEnd.toLocaleString('en-IN')}: ${bar.count} paths (${bar.percentage}%)`} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, color: S.dim, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
          <span>₹{mcResult.histogram[0]?.rangeStart.toLocaleString('en-IN')}</span>
          <span style={{ color: '#ef4444' }}>← VaR Zone</span>
          <span style={{ color: '#00E5A0' }}>Mean →</span>
          <span>₹{mcResult.histogram[mcResult.histogram.length - 1]?.rangeEnd.toLocaleString('en-IN')}</span>
        </div>

        {/* Percentiles */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          {Object.entries(mcResult.percentiles).map(([k, v]) => (
            <div key={k} style={{ flex: '1 1 80px', textAlign: 'center', padding: '6px 8px', background: '#04070f', borderRadius: 6, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase' }}>{k.replace('p', '')}th %ile</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>₹{v.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Risk Parameters */}
      <div className="glass-card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10 }}>Portfolio Risk DNA</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {mcResult.stockParams.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}` }}>
              <span style={{ fontWeight: 800, fontSize: 12, color: '#f8fafc', fontFamily: 'var(--font-mono)', minWidth: 90 }}>{s.ticker}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: S.dim, marginBottom: 3 }}>
                  <span>Weight: {s.weight}%</span>
                  <span>Annual Vol: {s.annualizedVol}%</span>
                </div>
                <div style={{ height: 4, background: S.border, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(parseFloat(s.annualizedVol), 50) * 2}%`, background: parseFloat(s.annualizedVol) > 30 ? 'linear-gradient(90deg, #ef4444, #fb923c)' : 'linear-gradient(90deg, #10b981, #38bdf8)', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stress Testing */}
      <div className="glass-card">
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          Stress Test Scenarios
          <span style={{ fontSize: 9, color: '#ef4444', background: '#ef444412', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>SIMULATED</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {STRESS_SCENARIOS.map((sc, i) => (
            <button key={i} onClick={() => setSelectedScenario(i)}
              style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${selectedScenario === i ? '#00E5A0' : S.border}`, background: selectedScenario === i ? 'rgba(0,229,160,0.06)' : 'none', color: selectedScenario === i ? '#00E5A0' : S.muted, fontSize: 10, fontWeight: selectedScenario === i ? 700 : 400 }}>
              {sc.name}
            </button>
          ))}
        </div>

        <div style={{ padding: 12, background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}` }}>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{stressResult.description}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase' }}>Total Impact</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: stressResult.totalImpact >= 0 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                {stressResult.totalImpact >= 0 ? '+' : ''}₹{stressResult.totalImpact.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase' }}>Portfolio After</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>₹{stressResult.newPortfolioValue.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase' }}>Probability</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#00E5A0', fontFamily: 'var(--font-mono)' }}>{stressResult.probability}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {stressResult.impactedStocks.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, padding: '4px 8px', background: '#060911', borderRadius: 4 }}>
                <span style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.ticker}</span>
                <span style={{ color: S.dim }}>{s.sector}</span>
                <span style={{ color: parseFloat(s.shock) >= 0 ? '#10b981' : '#ef4444', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{parseFloat(s.shock) >= 0 ? '+' : ''}{s.shock}%</span>
                <span style={{ color: s.impactValue >= 0 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}>{s.impactValue >= 0 ? '+' : ''}₹{s.impactValue.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
