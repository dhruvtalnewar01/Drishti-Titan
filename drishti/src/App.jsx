import { useState, useEffect, useCallback, useRef } from 'react';
import { PORTFOLIO, SIGNALS, TRENDING_HEADLINES, NSE_UNIVERSE } from './data.js';
import { TAB_CONFIG } from './utils/constants.js';
import SplashScreen from './components/SplashScreen.jsx';
import ModeSelector from './components/ModeSelector.jsx';
import BeginnerMode from './components/BeginnerMode.jsx';
import CommandCenter from './components/CommandCenter.jsx';
import CouncilTab from './components/CouncilTab.jsx';
import AutoTradeTab from './components/AutoTradeTab.jsx';
import UniverseTab from './components/UniverseTab.jsx';
import NexusOracle from './components/NexusOracle.jsx';
import AnalystTab from './components/AnalystTab.jsx';
import RiskDNATab from './components/RiskDNATab.jsx';
import AlphaLedger from './components/AlphaLedger.jsx';
import GeoPulse from './components/GeoPulse.jsx';
import QuantumTab from './components/QuantumTab.jsx';

const S = {
  bg: '#060911', card: '#0c1322', border: '#1a2744', muted: '#5e7490', dim: '#3d5272',
};

const GlowDot = ({ color = '#00E5A0' }) => (
  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}, 0 0 12px ${color}60`, animation: 'live-pulse 2s ease-in-out infinite' }} />
);

// NEWS TICKER with LIVE April 16-17, 2026 headlines
const COMMAND_HEADLINES = [
  { ticker: '⚔️ IRAN-US', text: 'Strait of Hormuz threat → crude $89.4 — INDIGO, airlines at risk', type: 'warn' },
  { ticker: '📊 WIPRO', text: 'Q4 profit down 2%, Q1 guidance: up to 2% degrowth — ADRs fell 3%', type: 'warn' },
  { ticker: '🔥 HAL', text: 'Defence stocks surge on Iran tensions — ₹780Cr FII inflow in 3 days', type: 'alert' },
  { ticker: '📉 HDFC AMC', text: '19% profit drop to ₹623Cr — missed street estimates significantly', type: 'warn' },
  { ticker: '🟢 LIC', text: '+7% rally in 2 days on bonus news — institutional momentum building', type: 'alert' },
  { ticker: '₹ RUPEE', text: 'USD/INR at ₹85.68 — FII net sellers ₹1,847Cr, RBI watching ₹86 level', type: 'warn' },
  { ticker: '✅ ALPHA', text: 'NEXUS 90-day track record: 87/100 signals hit target, +23.4% alpha vs Nifty', type: 'alert' },
  { ticker: '🛡️ VIX', text: 'India VIX down 8% to 14.2 — fear dipping but sentiment remains cautious', type: 'info' },
  { ticker: '🏗️ RVNL', text: 'Lowest bidder for ₹968Cr railway project — order book catalyst', type: 'alert' },
  { ticker: '💰 TCS', text: 'Dividend slowdown to fund AI investments — long-term positive signal', type: 'info' },
  { ticker: '🏦 GOLD LOAN', text: 'Early stress signals in gold loan sector — Muthoot, Manappuram watch', type: 'warn' },
  { ticker: '📈 ICICI LOMBARD', text: '+7% profit increase — strong underwriting, consensus beat by 4%', type: 'alert' },
  ...TRENDING_HEADLINES,
];

function TickerHeadlineBar() {
  const doubledHeadlines = [...COMMAND_HEADLINES, ...COMMAND_HEADLINES];
  return (
    <div className="ticker-bar">
      <div className="ticker-scroll">
        {doubledHeadlines.map((h, i) => (
          <span key={i}>
            <span className={`ticker-item ${h.type}`}>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{h.ticker}</strong>
              {h.text}
            </span>
            <span className="ticker-divider">│</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DRISHTI() {
  const [showSplash, setShowSplash] = useState(true);
  const [mode, setMode] = useState(null); // null = show selector, 'beginner', 'expert'
  const [tab, setTab] = useState('command');
  const [analystQuestion, setAnalystQuestion] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [crisisActive, setCrisisActive] = useState(false);
  const [crisisType, setCrisisType] = useState(null);

  // ─── LIVE TICKING DATA ───
  const [livePnl, setLivePnl] = useState(0);
  const [liveGeo, setLiveGeo] = useState(58);
  const [liveAlpha, setLiveAlpha] = useState(23.4);
  const [liveSignals, setLiveSignals] = useState(SIGNALS.length);
  const [liveWinRate, setLiveWinRate] = useState(87);

  // Initialize and tick PnL
  useEffect(() => {
    const basePnl = PORTFOLIO.reduce((a, s) => a + (s.ltp - s.avgPrice) * s.qty, 0);
    setLivePnl(basePnl);
    const iv = setInterval(() => {
      setLivePnl(prev => {
        const delta = (Math.random() - 0.48) * 320;
        return Math.round(prev + delta);
      });
      // Geo risk micro-fluctuation (58 ± 2)
      setLiveGeo(prev => {
        const g = prev + (Math.random() - 0.5) * 0.4;
        return Math.round(Math.max(55, Math.min(62, g)) * 10) / 10;
      });
      // Alpha micro-fluctuation (23.4 ± 0.3)
      setLiveAlpha(prev => {
        const a = prev + (Math.random() - 0.48) * 0.06;
        return Math.round(Math.max(22.8, Math.min(24.0, a)) * 10) / 10;
      });
    }, 1500);
    return () => clearInterval(iv);
  }, []);

  const invested = PORTFOLIO.reduce((a, s) => a + s.avgPrice * s.qty, 0);

  const handleAskDrishti = useCallback((question) => {
    setAnalystQuestion(question);
    setTab('analyst');
  }, []);

  const handleCrisisChange = useCallback((active, crisis) => {
    setCrisisActive(active);
    setCrisisType(crisis);
  }, []);

  useEffect(() => {
    if (tab !== 'analyst') setAnalystQuestion(null);
  }, [tab]);

  const [marketTime, setMarketTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setMarketTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  const searchResults = globalSearch.trim()
    ? NSE_UNIVERSE.filter(s => s.ticker.toLowerCase().includes(globalSearch.toLowerCase()) || s.name.toLowerCase().includes(globalSearch.toLowerCase()))
    : null;

  // ─── SPLASH SCREEN ───
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // ─── MODE SELECTOR ───
  if (!mode) {
    return <ModeSelector onSelect={(m) => setMode(m)} />;
  }

  // ─── BEGINNER MODE ───
  if (mode === 'beginner') {
    return (
      <div style={{ background: S.bg, color: '#f0f4f8', minHeight: '100vh', fontFamily: 'var(--font-sans)', fontSize: 13 }}>
        {/* Ambient glow — gold + purple */}
        <div style={{ position: 'fixed', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* Beginner Header — Gold Luxury */}
        <header style={{ borderBottom: '1px solid rgba(255,215,0,0.08)', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)', background: 'rgba(6,9,17,0.92)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'linear-gradient(135deg, #FFD700, #F59E0B)', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#000', boxShadow: '0 0 20px rgba(255,215,0,0.25)' }}>D</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
                NEXUS <span style={{ fontSize: 9, background: 'linear-gradient(90deg, #FFD700, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>LEARNING ACADEMY</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#FFD700', fontSize: 8, background: 'rgba(255,215,0,0.06)', padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(255,215,0,0.15)', fontWeight: 700 }}>
                  🎮 GAMIFIED
                </span>
              </div>
              <div style={{ color: S.muted, fontSize: 9, letterSpacing: '0.02em' }}>Interactive Trading Education · {marketTime} IST</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button onClick={() => setMode('expert')} style={{ background: 'linear-gradient(135deg, #7C5CFC, #6d28d9)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: 11, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,92,252,0.25)' }}>⚡ Expert Mode</button>
            <a href="/landing/index.html" style={{ background: 'rgba(12,19,34,0.85)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: 10, padding: '8px 16px', color: '#FFD700', fontSize: 11, fontWeight: 600, textDecoration: 'none' }}>← Home</a>
          </div>
        </header>

        <main style={{ padding: '22px 24px', position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
          <BeginnerMode onSwitchToExpert={() => setMode('expert')} />
        </main>

        <footer style={{ borderTop: '1px solid rgba(255,215,0,0.06)', padding: '10px 20px', textAlign: 'center', fontSize: 9, color: S.dim, background: 'rgba(6,9,17,0.6)' }}>
          NEXUS Learning Academy · Trend Analysis · Pattern Recognition · S&R Levels · ET Markets GenAI Hackathon
        </footer>
      </div>
    );
  }

  // ─── EXPERT MODE (existing dashboard) ───
  return (
    <div className={crisisActive ? 'crisis-active' : ''} style={{ background: S.bg, color: '#f0f4f8', minHeight: '100vh', fontFamily: 'var(--font-sans)', fontSize: 13, position: 'relative' }}>
      {/* Ambient glow orbs */}
      <div style={{ position: 'fixed', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: crisisActive ? 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(0,229,160,0.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0, transition: 'background 1s ease' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,252,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* CRISIS BANNER */}
      {crisisActive && (
        <div className="crisis-banner">
          ⚠️ NEXUS CRISIS AI ACTIVATED — {crisisType?.name?.toUpperCase() || 'UNKNOWN'} · Severity: {crisisType?.severity || '?'}/100 · ALL AGENTS IN CRISIS MODE
        </div>
      )}

      {/* ═══ LIVE TICKER ═══ */}
      <TickerHeadlineBar />

      {/* ═══ HEADER ═══ */}
      <header style={{ borderBottom: `1px solid ${crisisActive ? '#dc262640' : S.border}`, padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, backdropFilter: 'blur(12px)', background: crisisActive ? 'rgba(28,10,10,0.92)' : 'rgba(6,9,17,0.88)', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.5s ease' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: crisisActive ? 'linear-gradient(135deg, #dc2626, #991b1b)' : 'linear-gradient(135deg, #00E5A0, #7C5CFC)', width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff', boxShadow: crisisActive ? '0 0 20px rgba(220,38,38,0.3)' : '0 0 20px rgba(0,229,160,0.3)', transition: 'all 0.5s ease' }}>D</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
              NEXUS <span style={{ fontSize: 9, color: '#7C5CFC', fontWeight: 600 }}>COMMAND CENTER v3</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: crisisActive ? '#ef4444' : '#00E5A0', fontSize: 8, background: crisisActive ? 'rgba(239,68,68,0.08)' : 'rgba(0,229,160,0.08)', padding: '2px 8px', borderRadius: 5, border: crisisActive ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(0,229,160,0.2)', fontWeight: 700 }}>
                <GlowDot color={crisisActive ? '#ef4444' : '#00E5A0'} /> LIVE
              </span>
            </div>
            <div style={{ color: S.muted, fontSize: 9, letterSpacing: '0.02em' }}>8 Agents · {NSE_UNIVERSE.length} Stocks · NSE · SEBI · {marketTime} IST</div>
          </div>
        </div>

        {/* Search */}
        <div className="search-container" style={{ flex: '0 1 240px', minWidth: 160 }}>
          <span className="search-icon">🔍</span>
          <input className="search-input" type="text" placeholder="Search stock..."
            value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
          {searchResults && <span className="search-results-badge">{searchResults.length}</span>}
        </div>

        {/* STAT PILLS — LIVE TICKING */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="stat-pill" onClick={() => setTab('command')} style={{ cursor: 'pointer', borderColor: crisisActive ? '#dc262630' : '#f59e0b20' }}>
            <span style={{ color: crisisActive ? '#ef4444' : '#f59e0b', fontWeight: 800 }}>{crisisActive ? '🔴 CRISIS' : '🟡 ELEVATED'}</span>
          </div>
          <div className="stat-pill" onClick={() => setTab('geopulse')} style={{ cursor: 'pointer', borderColor: '#f59e0b20' }}>
            <span style={{ color: '#f59e0b' }}>🌍</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#f59e0b', fontSize: 11, transition: 'all 0.3s' }}>{liveGeo.toFixed(1)}</span>
          </div>
          <div className="stat-pill" onClick={() => setTab('ledger')} style={{ cursor: 'pointer', borderColor: '#10b98118' }}>
            <span style={{ color: '#10b981' }}>📈</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#10b981', fontSize: 11, transition: 'all 0.3s' }}>+{liveAlpha}%</span>
          </div>
          <div className="stat-pill" onClick={() => setTab('command')} style={{ cursor: 'pointer' }}>
            <span style={{ color: '#00E5A0' }}>⚡</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#00E5A0', fontSize: 11 }}>{liveSignals}</span>
          </div>
          <div className="stat-pill" onClick={() => setTab('ledger')} style={{ cursor: 'pointer' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#10b981', fontSize: 11 }}>✅ {liveWinRate}%</span>
          </div>
          <div className="stat-pill" style={{ borderColor: livePnl >= 0 ? '#10b98115' : '#ef444415' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: livePnl >= 0 ? '#10b981' : '#ef4444', fontSize: 11, transition: 'color 0.3s' }}>{livePnl >= 0 ? '+' : ''}₹{Math.round(livePnl).toLocaleString('en-IN')}</span>
          </div>
          {/* MODE SWITCH */}
          <button onClick={() => setMode('beginner')} style={{ background: '#00E5A010', border: '1px solid #00E5A020', color: '#00E5A0', padding: '4px 12px', borderRadius: 8, fontSize: 9, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.target.style.background = '#00E5A020'}
            onMouseLeave={e => e.target.style.background = '#00E5A010'}>
            🎮 Beginner
          </button>
        </div>
      </header>

      {/* ═══ SEARCH RESULTS ═══ */}
      {searchResults && globalSearch.trim() && (
        <div style={{ position: 'sticky', top: 70, zIndex: 99, background: 'rgba(6,9,17,0.97)', borderBottom: `1px solid ${S.border}`, backdropFilter: 'blur(12px)', padding: '10px 20px', animation: 'fadeInUp 0.2s ease' }}>
          <div style={{ fontSize: 10, color: S.dim, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Search results for "{globalSearch}" · {searchResults.length} stocks found
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {searchResults.slice(0, 12).map(stock => {
              const sig = SIGNALS.find(s => s.ticker === stock.ticker);
              return (
                <div key={stock.ticker} onClick={() => {
                  setGlobalSearch('');
                  handleAskDrishti(`Comprehensive analysis of ${stock.ticker} (${stock.name}). Current price: ₹${stock.ltp}, Change: ${stock.change}%. Give me multi-agent council verdict with buy/sell recommendation.`);
                }}
                  style={{ flex: '0 0 auto', background: S.card, border: `1px solid ${sig ? 'rgba(0,229,160,0.3)' : S.border}`, borderRadius: 10, padding: '8px 14px', cursor: 'pointer', transition: 'all 0.2s', minWidth: 140 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#00E5A050'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = sig ? 'rgba(0,229,160,0.3)' : S.border}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontWeight: 800, fontSize: 12, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{stock.ticker}</span>
                    {sig && <span style={{ fontSize: 7, color: '#00E5A0', background: 'rgba(0,229,160,0.1)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>SIGNAL</span>}
                  </div>
                  <div style={{ fontSize: 9, color: S.muted, marginBottom: 2 }}>{stock.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>₹{stock.ltp?.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: stock.change >= 0 ? '#10b981' : '#ef4444', fontFamily: 'var(--font-mono)' }}>{stock.change >= 0 ? '+' : ''}{stock.change}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB BAR ═══ */}
      <nav className="tab-bar">
        {TAB_CONFIG.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}>
            <span style={{ fontSize: 12 }}>{t.icon}</span>
            <span className="tab-label-full">{t.label}</span>
            <span className="tab-label-short">{t.shortLabel}</span>
          </button>
        ))}
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ padding: '22px 24px', position: 'relative', zIndex: 1, maxWidth: 1400, margin: '0 auto' }}>
        {tab === 'command' && <CommandCenter onAskDrishti={handleAskDrishti} onCrisisChange={handleCrisisChange} />}
        {tab === 'council' && <CouncilTab />}
        {tab === 'autotrade' && <AutoTradeTab />}
        {tab === 'universe' && <UniverseTab />}
        {tab === 'oracle' && <NexusOracle onAskDrishti={handleAskDrishti} />}
        {tab === 'analyst' && <AnalystTab initialQuestion={analystQuestion} />}
        {tab === 'riskdna' && <RiskDNATab />}
        {tab === 'ledger' && <AlphaLedger onAskDrishti={handleAskDrishti} />}
        {tab === 'geopulse' && <GeoPulse />}
        {tab === 'quantum' && <QuantumTab />}
      </main>

      {/* ═══ BACK TO HOME (fixed) ═══ */}
      <a href="/landing/index.html" style={{
        position: 'fixed', bottom: 24, left: 24, zIndex: 999,
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(12,19,34,0.85)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(177,66,255,0.2)', borderRadius: 30,
        padding: '10px 22px', color: '#C084FC', fontSize: 12, fontWeight: 600,
        fontFamily: 'var(--font-sans)', textDecoration: 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(177,66,255,0.1)',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        ← Back to Home
      </a>

      {/* ═══ DASHBOARD HOME BUTTON (fixed, right side) ═══ */}
      {tab !== 'command' && (
        <button onClick={() => setTab('command')} style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, rgba(0,229,160,0.15), rgba(124,92,252,0.15))', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,229,160,0.25)', borderRadius: 30,
          padding: '10px 22px', color: '#00E5A0', fontSize: 12, fontWeight: 700,
          fontFamily: 'var(--font-sans)', cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(0,229,160,0.1)',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          animation: 'fadeIn 0.3s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          🏠 Dashboard Home
        </button>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer style={{ borderTop: `1px solid ${S.border}`, padding: '10px 20px', textAlign: 'center', fontSize: 9, color: S.dim, background: 'rgba(6,9,17,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span>NEXUS COMMAND CENTER v3 · Multi-Agent Intelligence</span>
        <span>·</span>
        <span>{NSE_UNIVERSE.length} Stocks · {SIGNALS.length} Active Signals · 8 AI Agents · 6 Crisis Playbooks</span>
        <span>·</span>
        <span>ET Markets GenAI Hackathon · Amity University Mumbai</span>
        <span>·</span>
        <span>Not SEBI-registered investment advice</span>
      </footer>
    </div>
  );
}
