/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — BOOT SEQUENCE
   Terminal-style initialization screen
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react';

const BOOT_SEQUENCE = [
  { text: 'Loading 49 stock universe + live NSE feed...', result: '49 stocks · prices synced', delay: 300 },
  { text: 'Connecting to 5 data sources...', result: 'Moneycontrol · Zerodha · Groww · NSE · BSE', delay: 500 },
  { text: 'Activating 8 NEXUS agents...', result: '8/8 agents online', delay: 400 },
  { text: 'Computing 90-day alpha ledger...', result: '+23.4% alpha · 87% win rate', delay: 600 },
  { text: '⚠️ CRISIS SCAN: Geopolitical pulse scoring...', result: 'GEO RISK: 58/100 — ELEVATED', delay: 500 },
  { text: '🔴 LIVE CRISES: Iran-US · Q4 Earnings · Rupee...', result: '4 ACTIVE · 2 STANDBY', delay: 500 },
  { text: 'Sector radar: 15 sectors · FII/DII flows...', result: 'DEFENCE surge · AVIATION at risk', delay: 350 },
  { text: 'Oracle engine: Iran scenarios + macro shocks...', result: '6 macro + 5 historical ready', delay: 300 },
  { text: 'NEXUS COMMAND CENTER READY', result: '', delay: 400 },
];

export default function SplashScreen({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const addLine = () => {
      if (i < BOOT_SEQUENCE.length) {
        const current = BOOT_SEQUENCE[i];
        // First add the loading line
        setLines(prev => [...prev, { text: current.text, status: 'loading' }]);
        // Then mark it complete
        setTimeout(() => {
          setLines(prev => prev.map((l, idx) =>
            idx === i ? { ...l, status: 'done', result: current.result } : l
          ));
          i++;
          if (i < BOOT_SEQUENCE.length) {
            setTimeout(addLine, current.delay);
          } else {
            setTimeout(() => setDone(true), 600);
            setTimeout(onComplete, 1400);
          }
        }, current.delay);
      }
    };
    setTimeout(addLine, 500);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#02050a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace",
    }}>
      {/* Scan lines effect */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,160,0.015) 2px, rgba(0,229,160,0.015) 4px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 600, width: '90%', position: 'relative' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#3d5272', marginBottom: 8 }}>{'>'} DRISHTI SYSTEMS · NIRMAN COHORT · {new Date().toLocaleDateString('en-IN')}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', letterSpacing: '0.05em', textShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            NEXUS COMMAND CENTER v3
          </div>
          <div style={{ fontSize: 11, color: '#5e7490', marginTop: 4 }}>— INITIALIZING —</div>
        </div>

        {/* Boot lines */}
        <div style={{ minHeight: 300 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', animation: 'fadeIn 0.3s ease', fontSize: 12 }}>
              {/* Status icon */}
              <span style={{ width: 18, textAlign: 'center' }}>
                {line.status === 'loading' ? (
                  <span style={{ color: '#f59e0b', animation: 'live-pulse 0.5s ease infinite' }}>⏳</span>
                ) : (
                  <span style={{ color: '#10b981' }}>✅</span>
                )}
              </span>

              {/* Text */}
              <span style={{ color: line.status === 'done' ? '#94a3b8' : '#f59e0b', flex: 1 }}>
                {line.text}
              </span>

              {/* Result */}
              {line.status === 'done' && line.result && (
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: 11, animation: 'fadeIn 0.2s ease' }}>
                  {line.result}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Ready state */}
        {done && (
          <div style={{ textAlign: 'center', marginTop: 20, animation: 'fadeIn 0.5s ease' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 0 20px rgba(16,185,129,0.3)', fontSize: 18 }}>✓</div>
            <div style={{ fontSize: 14, color: '#10b981', fontWeight: 800, letterSpacing: '0.08em' }}>SYSTEMS OPERATIONAL</div>
            <div style={{ fontSize: 10, color: '#3d5272', marginTop: 4 }}>8 agents · 49 stocks · 6 crisis playbooks · 23.4% alpha</div>
          </div>
        )}

        {/* Bottom */}
        <div style={{ position: 'absolute', bottom: -60, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#3d5272' }}>
          <span>Dhruv Talnewar + Nishant Patil</span>
          <span>ET Markets GenAI Hackathon 2026</span>
        </div>
      </div>
    </div>
  );
}
