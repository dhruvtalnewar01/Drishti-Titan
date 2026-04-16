/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — HERO TAB
   LIVE: April 16-17, 2026
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from 'react';
import { SIGNALS } from '../data.js';
import { LIVE_MARKET, STOCK_ALERTS, TOMORROW_PREVIEW } from '../data/crisisPlaybooks.js';
import SectorRadar from './SectorRadar.jsx';
import CrisisAI from './CrisisAI.jsx';

const S = { dim: '#3d5272', muted: '#5e7490', border: '#1a2744' };

const AnimCounter = ({ value, prefix = '', suffix = '', color = '#f8fafc', size = 28 }) => {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    let f = 0;
    const total = 50;
    const step = () => {
      f++;
      const p = Math.min(f / total, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(value * e);
      if (f < total) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  const formatted = Number.isInteger(value) ? Math.round(display) : display.toFixed(1);
  return <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: size, color, fontVariantNumeric: 'tabular-nums' }}>{prefix}{formatted}{suffix}</span>;
};

const MARKET_TICKER_DATA = [
  { label: 'NIFTY 50', value: '24,187', change: '-0.42%', positive: false },
  { label: 'SENSEX', value: '79,802', change: '-0.38%', positive: false },
  { label: 'BANK NIFTY', value: '55,120', change: '-0.68%', positive: false },
  { label: 'INDIA VIX', value: '14.2', change: '-8.1%', positive: true },
  { label: 'USD/INR', value: '₹85.68', change: '+0.12%', positive: false },
  { label: 'BRENT CRUDE', value: '$89.4/bbl', change: '+2.1%', positive: false },
  { label: 'GOLD', value: '₹73,420/10g', change: '+0.8%', positive: true },
  { label: 'FII NET', value: '-₹1,847Cr', change: 'selling', positive: false },
  { label: 'DII NET', value: '+₹2,340Cr', change: 'buying', positive: true },
];

export default function CommandCenter({ onAskDrishti, onCrisisChange }) {
  const [activePanel, setActivePanel] = useState('signals');

  // ─── LIVE TICKING DATA ───
  const [liveNifty, setLiveNifty] = useState(LIVE_MARKET.nifty.value);
  const [liveFII, setLiveFII] = useState(-1847);
  const [liveDII, setLiveDII] = useState(2340);
  const [tickerData, setTickerData] = useState(MARKET_TICKER_DATA);

  useEffect(() => {
    const iv = setInterval(() => {
      // Nifty micro-tick
      setLiveNifty(prev => {
        const delta = (Math.random() - 0.48) * 8;
        return Math.round(prev + delta);
      });
      // FII/DII flow tick
      setLiveFII(prev => Math.round(prev + (Math.random() - 0.52) * 12));
      setLiveDII(prev => Math.round(prev + (Math.random() - 0.48) * 10));
      // Ticker micro-tick
      setTickerData(prev => prev.map(t => {
        if (t.label === 'NIFTY 50' || t.label === 'SENSEX' || t.label === 'BANK NIFTY') {
          const base = parseFloat(t.value.replace(/,/g, ''));
          const delta = (Math.random() - 0.48) * base * 0.0001;
          const newVal = Math.round(base + delta);
          return { ...t, value: newVal.toLocaleString('en-IN') };
        }
        return t;
      }));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const topSignals = SIGNALS.slice(0, 5);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* ═══ ROW 1: 5 INTELLIGENCE STAT CARDS ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
        {/* MARKET STATUS */}
        <div className="glass-card" style={{ padding: '16px 14px', borderColor: LIVE_MARKET.nifty.change >= 0 ? '#10b98118' : '#f59e0b18', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${LIVE_MARKET.nifty.change >= 0 ? '#10b981' : '#f59e0b'}, transparent)` }} />
          <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>MARKET REGIME</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: '#f59e0b', marginBottom: 2 }}>CONSOLIDATION</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f8fafc', fontWeight: 700, transition: 'all 0.3s' }}>Nifty {liveNifty.toLocaleString()}</div>
          <div style={{ fontSize: 9, color: '#94a3b8' }}>Range: {LIVE_MARKET.nifty.support.toLocaleString()}-{LIVE_MARKET.nifty.resistance.toLocaleString()}</div>
        </div>

        {/* GEO RISK */}
        <div className="glass-card" style={{ padding: '16px 14px', borderColor: '#f59e0b18', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #f59e0b, transparent)' }} />
          <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>GEO RISK</div>
          <AnimCounter value={58} suffix="/100" color="#f59e0b" size={22} />
          <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 700, marginTop: 2 }}>ELEVATED</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>Iran-US · Crude · Rupee</div>
        </div>

        {/* 90-DAY ALPHA */}
        <div className="glass-card" style={{ padding: '16px 14px', borderColor: '#10b98118', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #10b981, transparent)' }} />
          <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>90-DAY ALPHA</div>
          <AnimCounter value={23.4} prefix="+" suffix="%" color="#10b981" size={22} />
          <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>vs Nifty +8.2%</div>
          <div style={{ fontSize: 8, color: '#10b98180', fontWeight: 700 }}>87/100 signals hit</div>
        </div>

        {/* ACTIVE CRISES */}
        <div className="glass-card" style={{ padding: '16px 14px', borderColor: '#ef444418', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #ef4444, transparent)' }} />
          <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>CRISES</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 22, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
            4 <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'live-pulse 1s ease infinite' }} />
          </div>
          <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 600 }}>4 active · 2 standby</div>
          <div style={{ fontSize: 8, color: '#94a3b8' }}>Iran-US conflict lead</div>
        </div>

        {/* FII/DII FLOW */}
        <div className="glass-card" style={{ padding: '16px 14px', borderColor: '#38bdf815', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #38bdf8, transparent)' }} />
          <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 6 }}>FLOW TODAY</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 13, color: '#ef4444', transition: 'all 0.3s' }}>FII: {liveFII >= 0 ? '+' : '-'}₹{Math.abs(liveFII).toLocaleString()}Cr</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 13, color: '#10b981', transition: 'all 0.3s' }}>DII: +₹{liveDII.toLocaleString()}Cr</div>
          <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 2 }}>FII risk-off on geopolitics</div>
        </div>
      </div>

      {/* ═══ ROW 2: 3 INTELLIGENCE PANELS ═══ */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {[
          { id: 'signals', label: '⚡ LIVE SIGNALS', count: SIGNALS.length },
          { id: 'sectors', label: '📊 SECTOR RADAR', count: 15 },
          { id: 'crisis', label: '🛡️ CRISIS AI', count: '4 LIVE', hot: true },
        ].map(p => (
          <button key={p.id} onClick={() => setActivePanel(p.id)}
            style={{ flex: 1, padding: '10px 14px', background: activePanel === p.id ? '#0c1322' : '#04070f', border: `1px solid ${activePanel === p.id ? (p.hot ? '#ef444425' : '#7C5CFC25') : S.border}`, borderRadius: 10, color: activePanel === p.id ? '#f8fafc' : S.muted, fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {p.label}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: activePanel === p.id ? (p.hot ? '#ef444418' : '#7C5CFC18') : '#1a274430', padding: '2px 8px', borderRadius: 6, color: activePanel === p.id ? (p.hot ? '#ef4444' : '#7C5CFC') : S.dim }}>{p.count}</span>
            {p.hot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'live-pulse 1s ease infinite' }} />}
          </button>
        ))}
      </div>

      {/* PANEL CONTENT */}
      {activePanel === 'signals' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          {/* TOP STOCK ALERTS from live data */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>🔥 URGENT STOCK ALERTS — APRIL 16-17</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {STOCK_ALERTS.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').map(alert => (
                <div key={alert.ticker} className="glass-card" style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center', cursor: 'pointer', borderColor: alert.action === 'SELL' ? '#ef444418' : '#10b98115' }}
                  onClick={() => onAskDrishti?.(`URGENT: Analyze ${alert.ticker} — ${alert.headline}. Give full crisis-adjusted verdict with targets.`)}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: '#f8fafc' }}>{alert.ticker}</span>
                      <span style={{ background: alert.action === 'SELL' ? '#ef444418' : '#10b98115', color: alert.action === 'SELL' ? '#ef4444' : '#10b981', padding: '2px 10px', borderRadius: 6, fontSize: 9, fontWeight: 800 }}>{alert.action}</span>
                      <span style={{ background: alert.severity === 'CRITICAL' ? '#dc262618' : '#ef444412', color: alert.severity === 'CRITICAL' ? '#dc2626' : '#ef4444', padding: '2px 8px', borderRadius: 5, fontSize: 8, fontWeight: 800 }}>{alert.severity}</span>
                      <span style={{ fontSize: 8, color: '#f59e0b', fontWeight: 700 }}>{alert.type}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500, lineHeight: 1.5 }}>{alert.headline}</div>
                    <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4 }}>{alert.detail}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: '#f8fafc' }}>Target: ₹{alert.target?.toLocaleString()}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444', fontWeight: 700 }}>SL: ₹{alert.stopLoss?.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 700, marginTop: 2 }}>Conf: {alert.confidence}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MORE SIGNALS */}
          <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
            {topSignals.map((sig, i) => (
              <div key={sig.ticker + i} className="glass-card" style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center', cursor: 'pointer' }}
                onClick={() => onAskDrishti?.(`Deep analysis of ${sig.ticker}: ${sig.signal}. Include Iran-US crisis impact assessment.`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#7C5CFC25'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(26,39,68,0.4)'}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 13, color: '#f8fafc' }}>{sig.ticker}</span>
                    <span style={{ background: sig.action === 'SELL' ? '#ef444418' : '#10b98115', color: sig.action === 'SELL' ? '#ef4444' : '#10b981', padding: '2px 10px', borderRadius: 6, fontSize: 9, fontWeight: 800 }}>{sig.action}</span>
                    <span style={{ fontSize: 8, color: '#7C5CFC', fontWeight: 700 }}>NEXUS SIGNAL</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>{sig.signal}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14, color: '#f8fafc' }}>₹{sig.ltp?.toLocaleString('en-IN') || '—'}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: sig.change >= 0 ? '#10b981' : '#ef4444', fontWeight: 800 }}>{sig.change >= 0 ? '+' : ''}{sig.change}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* COMPACT REMAINING */}
          <div className="glass-card">
            <div style={{ fontWeight: 800, fontSize: 11, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>ALL SIGNALS ({SIGNALS.length})</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 6 }}>
              {SIGNALS.slice(5).map((sig, i) => (
                <div key={sig.ticker + i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}30`, cursor: 'pointer', fontSize: 11, transition: 'all 0.2s' }}
                  onClick={() => onAskDrishti?.(`Analyze ${sig.ticker}: ${sig.signal}`)}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 11, color: '#f8fafc' }}>{sig.ticker} <span style={{ fontSize: 8, color: sig.action === 'SELL' ? '#ef4444' : '#10b981' }}>{sig.action}</span></span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: sig.change >= 0 ? '#10b981' : '#ef4444', fontWeight: 800 }}>{sig.change >= 0 ? '+' : ''}{sig.change}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activePanel === 'sectors' && <SectorRadar />}
      {activePanel === 'crisis' && <CrisisAI onCrisisChange={onCrisisChange} />}

      {/* ═══ MARKET PULSE TICKER ═══ */}
      <div style={{ marginTop: 16, padding: '8px 0', borderTop: `1px solid ${S.border}`, borderBottom: `1px solid ${S.border}`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 20, animation: 'ticker-scroll 50s linear infinite', whiteSpace: 'nowrap' }}>
          {[...tickerData, ...tickerData].map((t, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
              <span style={{ color: S.dim, fontWeight: 600 }}>{t.label}:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f8fafc', transition: 'all 0.3s' }}>{t.value}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: t.positive ? '#10b981' : '#ef4444', fontWeight: 700 }}>({t.change})</span>
              <span style={{ color: '#1a274450' }}>│</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
