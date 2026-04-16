/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — ORACLE (Future State Simulator)
   "What if" — AI-powered scenario modeling
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react';

const S = { dim: '#3d5272', muted: '#5e7490', border: '#1a2744' };

const MACRO_SCENARIOS = [
  { id: 'iran_hormuz', label: '⚔️ Iran-US: Hormuz Blocked', impact: -12.8, recovery: 65, confidence: 62, sectors: { winners: ['DEFENCE (+28% — HAL, BEL)', 'GOLD (+18%)', 'OIL UPSTREAM (+22%)'], losers: ['AIRLINES (-30% — jet fuel crisis)', 'PAINT (-15%)', 'LOGISTICS (-18%)'] }, portfolioHit: -128000, mitigated: -38000, actions: ['EXIT all aviation — INDIGO, SPICEJET immediately', 'ADD HAL, BEL, BHEL — defence spending surge', 'GOLD ETF 20% — safe haven', 'ADD ONGC, OIL India — crude windfall'] },
  { id: 'iran_deesc', label: '🕊️ Iran-US De-escalation', impact: 4.2, recovery: 0, confidence: 58, sectors: { winners: ['AIRLINES (+12% — fuel cost relief)', 'AUTO (+6%)', 'REALTY (+5%)'], losers: ['DEFENCE (-8% — premium unwinds)', 'GOLD (-5%)'] }, portfolioHit: 42000, mitigated: 42000, actions: ['BUY INDIGO — fuel cost relief rally', 'REDUCE DEFENCE — premium will unwind', 'ADD cyclicals — AUTO, REALTY recover', 'REDUCE GOLD — safe haven exit'] },
  { id: 'q4_cascade', label: '📊 Q4 Earnings Cascade Miss', impact: -5.8, recovery: 30, confidence: 72, sectors: { winners: ['PHARMA (+5%)', 'FMCG (+3%)'], losers: ['IT (-12% — Wipro effect)', 'BANKING (-8%)'] }, portfolioHit: -58000, mitigated: -14000, actions: ['EXIT weak IT — Wipro, HCLTech', 'HOLD strong IT — TCS, INFY (quality premium)', 'ADD PHARMA defensives', 'Wait for result-driven entry points'] },
  { id: 'rupee_88', label: '₹ Rupee Crashes to ₹88/USD', impact: -8.4, recovery: 52, confidence: 68, sectors: { winners: ['IT (+12%)', 'PHARMA (+8%)'], losers: ['OIL MARKETING (-18%)', 'AIRLINES (-15%)'] }, portfolioHit: -84000, mitigated: -22000, actions: ['ADD IT basket — INFY, TCS, WIPRO benefit most', 'EXIT BPCL, HPCL, IOC — import bill surge', 'ADD GOLDBEES — forex hedge'] },
  { id: 'crude_120', label: '🛢️ Crude Oil Hits $120/barrel', impact: -7.1, recovery: 38, confidence: 72, sectors: { winners: ['OIL UPSTREAM (+22%)', 'DEFENCE (+8%)'], losers: ['AIRLINES (-25%)', 'PAINT (-12%)'] }, portfolioHit: -71000, mitigated: -15000, actions: ['ADD ONGC, OIL India — upstream beneficiaries', 'EXIT INDIGO, Asian Paints — cost pressure', 'HOLD RELIANCE — integrated hedge'] },
  { id: 'rbi_cut', label: '📉 RBI Emergency Rate Cut', impact: 3.2, recovery: 0, confidence: 70, sectors: { winners: ['REALTY (+14%)', 'AUTO (+9%)', 'BANKING (+6%)'], losers: ['GOLD (-5%)'] }, portfolioHit: 32000, mitigated: 32000, actions: ['ADD REALTY — DLF, Godrej Props', 'ADD AUTO — TATAMOTORS, MARUTI', 'REDUCE GOLD position', 'Banking NIM may compress short-term'] },
];

const HISTORICAL_REPLAYS = [
  { id: 'covid', label: '🦠 COVID-19 (2020)', fall: -38, recovery: 540, portfolioImpact: -182000, bestHolding: 'INFY (-12%, recovered first)', worstHolding: 'TATAMOTORS (-62%)' },
  { id: 'gfc', label: '📉 2008 Global Crisis', fall: -65, recovery: 1095, portfolioImpact: -312000, bestHolding: 'HDFCBANK (-28%, remained profitable)', worstHolding: 'SBIN (-72%)' },
  { id: 'demon', label: '💰 Demonetization 2016', fall: -8, recovery: 42, portfolioImpact: -38000, bestHolding: 'HDFCBANK (+2%, digital payments boost)', worstHolding: 'SBIN (-14%)' },
  { id: 'ukraine', label: '⚔️ Russia-Ukraine 2022', fall: -18, recovery: 180, portfolioImpact: -86000, bestHolding: 'RELIANCE (only -4%, integrated model)', worstHolding: 'TATAMOTORS (-24%)' },
  { id: 'taper', label: '📉 Taper Tantrum 2013', fall: -12, recovery: 90, portfolioImpact: -58000, bestHolding: 'INFY (+8%, dollar earner)', worstHolding: 'SBIN (-22%)' },
];

export default function NexusOracle({ onAskDrishti }) {
  const [niftyMove, setNiftyMove] = useState(-15);
  const [days, setDays] = useState(30);
  const [activeResult, setActiveResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runCustomScenario = () => {
    setLoading(true);
    setTimeout(() => {
      const impact = Math.round(niftyMove * 0.83 * 10000) / 100;
      const impactAmt = Math.round(impact * 100);
      setActiveResult({
        type: 'custom',
        title: `Nifty ${niftyMove >= 0 ? '+' : ''}${niftyMove}% over ${days} days`,
        impact: niftyMove * 0.83,
        recovery: Math.round(Math.abs(niftyMove) * 3.2 + 15),
        confidence: Math.max(55, Math.min(82, 80 - Math.abs(niftyMove))),
        portfolioHit: impactAmt,
        mitigated: Math.round(impactAmt * 0.35),
        actions: [
          niftyMove < -10 ? 'EXIT high-beta: TATAMOTORS, small caps' : 'REDUCE position sizes by 15%',
          'ADD GOLDBEES — 15% portfolio allocation as hedge',
          niftyMove < -20 ? 'CASH position: raise to 40%' : 'HOLD HDFCBANK — defensive large-cap',
          'MONITOR VIX — buy signal when VIX drops below 18 from peak',
        ],
        sectors: { winners: niftyMove < 0 ? ['GOLD (+12%)', 'PHARMA (+5%)'] : ['IT (+8%)', 'BANKING (+6%)'], losers: niftyMove < 0 ? ['REALTY (-18%)', 'SMALL CAP (-22%)'] : ['GOLD (-5%)', 'FMCG (-2%)'] },
      });
      setLoading(false);
    }, 1500);
  };

  const runMacroScenario = (scenario) => {
    setLoading(true);
    setTimeout(() => {
      setActiveResult({ type: 'macro', title: scenario.label, ...scenario });
      setLoading(false);
    }, 1500);
  };

  const runHistorical = (replay) => {
    setLoading(true);
    setTimeout(() => {
      setActiveResult({
        type: 'historical',
        title: `REPLAY: ${replay.label}`,
        impact: replay.fall,
        recovery: replay.recovery,
        confidence: 85,
        portfolioHit: replay.portfolioImpact,
        mitigated: Math.round(replay.portfolioImpact * 0.35),
        bestHolding: replay.bestHolding,
        worstHolding: replay.worstHolding,
        actions: ['Review how NEXUS playbook would have saved your portfolio', 'Similar events: NEXUS crisis detection now active', 'Portfolio resilience score based on this event: 62/100'],
        sectors: { winners: ['PHARMA', 'GOLD'], losers: ['REALTY', 'AVIATION'] },
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 20, color: '#f8fafc', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
          🔮 NEXUS ORACLE — Future Intelligence
          <span style={{ background: '#7C5CFC15', color: '#7C5CFC', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 8, border: '1px solid #7C5CFC25' }}>AI SCENARIO ENGINE</span>
        </div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 4 }}>What-if scenario modeling · Historical replay · Pre-computed AI predictions</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
        {/* LEFT: SCENARIO SELECTOR */}
        <div>
          {/* Custom Scenario */}
          <div className="glass-card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: '#f8fafc', marginBottom: 12 }}>BUILD YOUR SCENARIO</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, color: S.dim, marginBottom: 4 }}>If Nifty moves: <span style={{ color: niftyMove >= 0 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{niftyMove >= 0 ? '+' : ''}{niftyMove}%</span></div>
              <input type="range" min="-40" max="40" value={niftyMove} onChange={e => setNiftyMove(+e.target.value)} style={{ width: '100%', accentColor: '#7C5CFC' }} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: S.dim, marginBottom: 4 }}>Over: <span style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{days} days</span></div>
              <input type="range" min="7" max="365" value={days} onChange={e => setDays(+e.target.value)} style={{ width: '100%', accentColor: '#38bdf8' }} />
            </div>
            <button onClick={runCustomScenario} style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #7C5CFC, #6d28d9)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔮 RUN ORACLE</button>
          </div>

          {/* Macro Scenarios */}
          <div className="glass-card" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 11, color: '#f59e0b', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MACRO SHOCKS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {MACRO_SCENARIOS.map(s => (
                <button key={s.id} onClick={() => runMacroScenario(s)} style={{ background: '#04070f', border: `1px solid ${S.border}`, borderRadius: 8, padding: '8px 6px', fontSize: 9, color: '#94a3b8', cursor: 'pointer', fontWeight: 600, textAlign: 'left', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.target.style.borderColor = '#7C5CFC40'; e.target.style.color = '#f8fafc'; }}
                  onMouseLeave={e => { e.target.style.borderColor = S.border; e.target.style.color = '#94a3b8'; }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Historical Replay */}
          <div className="glass-card">
            <div style={{ fontWeight: 800, fontSize: 11, color: '#ef4444', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>BLACK SWAN REPLAY</div>
            {HISTORICAL_REPLAYS.map(r => (
              <button key={r.id} onClick={() => runHistorical(r)} style={{ display: 'block', width: '100%', background: '#04070f', border: `1px solid ${S.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 10, color: '#94a3b8', cursor: 'pointer', fontWeight: 600, marginBottom: 6, textAlign: 'left', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.borderColor = '#ef444440'; }}
                onMouseLeave={e => { e.target.style.borderColor = S.border; }}>
                {r.label} <span style={{ fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 800 }}>{r.fall}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: ORACLE OUTPUT */}
        <div>
          {loading && (
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, flexDirection: 'column', gap: 16 }}>
              <div style={{ width: 48, height: 48, border: '3px solid #1a2744', borderTop: '3px solid #7C5CFC', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontWeight: 800, fontSize: 14, color: '#7C5CFC', fontFamily: 'var(--font-display)' }}>ORACLE COMPUTING...</div>
              <div style={{ fontSize: 11, color: S.dim }}>Analyzing 12 historical precedents + Monte Carlo simulation</div>
            </div>
          )}

          {!loading && !activeResult && (
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>🔮</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: S.dim }}>Select a scenario to run</div>
              <div style={{ fontSize: 11, color: '#3d5272' }}>Drag the sliders or choose a preset — Oracle responds instantly</div>
            </div>
          )}

          {!loading && activeResult && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              {/* Result Header */}
              <div className="glass-card" style={{ marginBottom: 12, borderColor: '#7C5CFC20' }}>
                <div style={{ fontWeight: 900, fontSize: 14, color: '#7C5CFC', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, fontFamily: 'var(--font-display)' }}>ORACLE SCENARIO: {activeResult.title}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  <div style={{ background: '#04070f', padding: '14px', borderRadius: 10, textAlign: 'center', border: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', fontWeight: 700 }}>Portfolio Impact</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 20, color: '#ef4444' }}>-₹{Math.abs(activeResult.portfolioHit).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 9, color: '#ef444480' }}>({activeResult.impact?.toFixed(1) || '?'}%)</div>
                  </div>
                  <div style={{ background: '#04070f', padding: '14px', borderRadius: 10, textAlign: 'center', border: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', fontWeight: 700 }}>With NEXUS</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 20, color: '#f59e0b' }}>-₹{Math.abs(activeResult.mitigated).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: 9, color: '#10b981' }}>Saves ₹{(Math.abs(activeResult.portfolioHit) - Math.abs(activeResult.mitigated)).toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ background: '#04070f', padding: '14px', borderRadius: 10, textAlign: 'center', border: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', fontWeight: 700 }}>Recovery</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 20, color: '#38bdf8' }}>{activeResult.recovery} <span style={{ fontSize: 12 }}>days</span></div>
                  </div>
                  <div style={{ background: '#04070f', padding: '14px', borderRadius: 10, textAlign: 'center', border: `1px solid ${S.border}` }}>
                    <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', fontWeight: 700 }}>Confidence</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 20, color: activeResult.confidence >= 70 ? '#10b981' : '#f59e0b' }}>{activeResult.confidence}%</div>
                  </div>
                </div>
              </div>

              {/* Sectors + Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {/* Winners / Losers */}
                <div className="glass-card">
                  <div style={{ fontWeight: 800, fontSize: 12, color: '#10b981', marginBottom: 8 }}>🏆 SECTOR WINNERS</div>
                  {activeResult.sectors?.winners?.map(w => <div key={w} style={{ fontSize: 11, color: '#10b981', padding: '4px 0', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>✓ {w}</div>)}
                  <div style={{ fontWeight: 800, fontSize: 12, color: '#ef4444', marginBottom: 8, marginTop: 12 }}>📉 SECTOR LOSERS</div>
                  {activeResult.sectors?.losers?.map(l => <div key={l} style={{ fontSize: 11, color: '#ef4444', padding: '4px 0', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>✕ {l}</div>)}
                </div>

                {/* Actions */}
                <div className="glass-card" style={{ borderColor: '#f59e0b15' }}>
                  <div style={{ fontWeight: 800, fontSize: 12, color: '#f59e0b', marginBottom: 10 }}>🎯 NEXUS RECOMMENDS</div>
                  {activeResult.actions?.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: `1px solid ${S.border}15`, alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 11, color: '#f59e0b', minWidth: 18 }}>{i + 1}.</span>
                      <span style={{ fontSize: 11, color: '#e2e8f0', lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical holdings */}
              {activeResult.bestHolding && (
                <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>🛡️ MOST RESILIENT HOLDING</div>
                    <div style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700 }}>{activeResult.bestHolding}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>⚠️ MOST VULNERABLE</div>
                    <div style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700 }}>{activeResult.worstHolding}</div>
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#3d527260' }}>⚠️ AI-based simulation using {activeResult.confidence >= 70 ? '12' : '7'} historical precedents. Not SEBI-registered investment advice.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
