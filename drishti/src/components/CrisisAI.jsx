/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — BLACK SWAN CRISIS AI
   LIVE: April 16-17, 2026
   Iran-US · Q4 Earnings · Rupee Stress · Gold Loan Warning
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from 'react';
import { CRISIS_PLAYBOOKS, CRISIS_TRIGGERS, CRISIS_HISTORY, GEO_FACTORS, STOCK_ALERTS, LIVE_MARKET, TOMORROW_PREVIEW } from '../data/crisisPlaybooks.js';

const S = { bg: '#060911', card: '#0c1322', border: '#1a2744', muted: '#5e7490', dim: '#3d5272' };

const StatusDot = ({ status }) => {
  const colors = { normal: '#10b981', warning: '#f59e0b', danger: '#ef4444', critical: '#dc2626' };
  const c = colors[status] || colors.normal;
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 8px ${c}`, animation: status === 'critical' || status === 'danger' ? 'live-pulse 0.8s ease infinite' : 'none' }} />;
};

export default function CrisisAI({ onCrisisChange }) {
  const [activeCrisis, setActiveCrisis] = useState(null);
  const [showSelector, setShowSelector] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);

  const liveCrises = CRISIS_PLAYBOOKS.filter(c => c.isLive);
  const standbyCrises = CRISIS_PLAYBOOKS.filter(c => !c.isLive);

  const simulateCrisis = (crisis) => {
    setShowSelector(false);
    setActiveCrisis(crisis);
    onCrisisChange?.(true, crisis);
  };

  const dismissCrisis = () => {
    setActiveCrisis(null);
    onCrisisChange?.(false, null);
  };

  const getTriggerStatus = (key, val) => {
    const t = CRISIS_TRIGGERS[key];
    if (!t) return 'normal';
    if (key === 'fii' || key === 'nifty') return val < t.threshold ? 'critical' : val < 0 ? 'warning' : 'normal';
    return val > t.threshold ? 'critical' : val > t.threshold * 0.7 ? 'warning' : 'normal';
  };

  // ═══ CRISIS MODE OVERLAY ═══
  if (activeCrisis) {
    const c = activeCrisis;
    return (
      <div style={{ animation: 'fadeIn 0.4s ease', position: 'relative' }}>
        {/* CRISIS BANNER */}
        <div style={{ background: c.isLive ? 'linear-gradient(90deg, #7f1d1d, #991b1b, #7f1d1d)' : 'linear-gradient(90deg, #1e3a5f, #1a2744, #1e3a5f)', padding: '14px 24px', borderRadius: 14, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: c.isLive ? 'crisis-pulse 1.5s ease infinite' : 'none', border: `1px solid ${c.isLive ? '#dc262650' : '#38bdf820'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{c.icon}</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: 15, color: c.isLive ? '#fca5a5' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 8 }}>
                {c.name}
                {c.isLive && <span style={{ background: '#dc2626', color: '#fff', padding: '2px 10px', borderRadius: 6, fontSize: 9, fontWeight: 800, animation: 'live-pulse 1s ease infinite' }}>{c.liveTag}</span>}
              </div>
              <div style={{ fontSize: 11, color: c.isLive ? '#fca5a580' : '#64748b' }}>Severity: {c.severity}/100 · Trigger: {c.trigger}</div>
            </div>
          </div>
          <button onClick={dismissCrisis} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #dc262640', color: '#fca5a5', padding: '6px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>✕ DISMISS</button>
        </div>

        {/* 3-COLUMN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* WHAT TRIGGERED IT */}
          <div className="glass-card" style={{ borderColor: '#dc262630', background: 'rgba(127,29,29,0.06)' }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>⚠️ TRIGGER DATA</div>
            {Object.entries(c.triggerValues).map(([key, val]) => {
              const t = CRISIS_TRIGGERS[key];
              const isTriggered = key === 'fii' || key === 'nifty' ? val < t?.threshold : val > t?.threshold;
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: isTriggered ? 'rgba(220,38,38,0.06)' : 'rgba(0,0,0,0.2)', borderRadius: 8, marginBottom: 5, border: `1px solid ${isTriggered ? '#dc262625' : '#1a274420'}` }}>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>{t?.label || key}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: isTriggered ? '#ef4444' : '#10b981' }}>
                    {key === 'fii' ? (val >= 0 ? '+' : '') + '₹' + Math.abs(val).toLocaleString() + 'Cr' : key === 'nifty' ? (val >= 0 ? '+' : '') + val + '%' : key === 'crude' ? '$' + val + '/bbl' : val}
                    {isTriggered && ' ⚠️'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* HISTORICAL / CONTEXT */}
          <div className="glass-card" style={{ borderColor: '#f59e0b20' }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>📜 SITUATION CONTEXT</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>{c.historical.event}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
              <div style={{ background: 'rgba(239,68,68,0.06)', padding: '8px 10px', borderRadius: 8, border: '1px solid #ef444418' }}>
                <div style={{ fontSize: 8, color: '#ef4444', textTransform: 'uppercase', fontWeight: 700 }}>Impact</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: '#ef4444' }}>{c.historical.niftyFall}</div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.06)', padding: '8px 10px', borderRadius: 8, border: '1px solid #10b98118' }}>
                <div style={{ fontSize: 8, color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>Recovery</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: '#10b981' }}>{c.historical.recovery}</div>
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9, color: '#10b981', fontWeight: 700, marginBottom: 4 }}>🛡️ SAFE HAVENS</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {c.historical.safeHavens.map(s => <span key={s} style={{ background: '#10b98112', color: '#10b981', padding: '3px 7px', borderRadius: 6, fontSize: 9, fontWeight: 700, border: '1px solid #10b98118' }}>{s}</span>)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, marginBottom: 4 }}>🚨 EXIT NOW</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {c.historical.exitImmediately.map(s => <span key={s} style={{ background: '#ef444412', color: '#ef4444', padding: '3px 7px', borderRadius: 6, fontSize: 9, fontWeight: 700, border: '1px solid #ef444418' }}>{s}</span>)}
              </div>
            </div>
          </div>

          {/* AI PREDICTION */}
          <div className="glass-card" style={{ borderColor: '#38bdf818' }}>
            <div style={{ fontWeight: 800, fontSize: 12, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🔮 AI PREDICTION</div>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ background: 'rgba(56,189,248,0.05)', padding: '10px', borderRadius: 10, border: '1px solid #38bdf812', textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>Expected Recovery</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 24, color: '#38bdf8' }}>{c.aiPrediction.recoveryDays} <span style={{ fontSize: 12, fontWeight: 600 }}>days</span></div>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.04)', padding: '10px', borderRadius: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase', fontWeight: 700 }}>Confidence</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 20, color: c.aiPrediction.confidence >= 70 ? '#10b981' : '#f59e0b' }}>{c.aiPrediction.confidence}%</div>
              </div>
              <div style={{ padding: '6px', fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>
                <div><span style={{ color: '#10b981', fontWeight: 700 }}>Best:</span> {c.aiPrediction.bestSector}</div>
                <div style={{ marginTop: 4 }}><span style={{ color: '#ef4444', fontWeight: 700 }}>Worst:</span> {c.aiPrediction.worstSector}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div style={{ background: '#ef444408', border: '1px solid #ef444418', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 7, color: '#ef4444', textTransform: 'uppercase', fontWeight: 700 }}>Without NEXUS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 13, color: '#ef4444' }}>-₹{Math.abs(c.portfolioImpact).toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: '#10b98108', border: '1px solid #10b98118', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 7, color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>With NEXUS</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 13, color: c.mitigatedImpact >= 0 ? '#10b981' : '#f59e0b' }}>{c.mitigatedImpact >= 0 ? '+' : '-'}₹{Math.abs(c.mitigatedImpact).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYBOOK */}
        <div className="glass-card" style={{ borderColor: '#f59e0b18', marginBottom: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 13, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            🛡️ CRISIS PLAYBOOK — {c.playbook.length} STEPS
            {c.liveSources && <span style={{ fontSize: 9, color: '#f59e0b60', fontWeight: 500, textTransform: 'none' }}>Sources: {c.liveSources.join(', ')}</span>}
          </div>
          {c.playbook.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: step.startsWith('🚨') ? 'rgba(220,38,38,0.04)' : '#04070f', borderRadius: 10, marginBottom: 6, border: `1px solid ${step.startsWith('🚨') ? '#dc262620' : '#1a274418'}`, alignItems: 'flex-start' }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, #f59e0b18, #f59e0b08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 11, color: '#f59e0b', flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: 11, color: '#e2e8f0', lineHeight: 1.6, fontWeight: 500 }}>{step}</div>
            </div>
          ))}
        </div>

        {/* CRISIS HISTORY */}
        <div className="glass-card">
          <div style={{ fontWeight: 800, fontSize: 12, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>📋 CRISIS HISTORY</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {CRISIS_HISTORY.map((h, i) => (
              <div key={h.year + '-' + i} style={{ flex: '0 0 auto', minWidth: 150, background: '#04070f', border: `1px solid ${h.recovery === 'ONGOING' ? '#dc262625' : S.border}`, borderRadius: 10, padding: '10px 12px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 13, color: h.recovery === 'ONGOING' ? '#ef4444' : '#f8fafc' }}>{h.year} {h.recovery === 'ONGOING' && '🔴'}</div>
                <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 4 }}>{h.event}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#ef4444', fontWeight: 700 }}>Nifty: {h.nifty}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#10b981', fontWeight: 700 }}>{h.recovery}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ═══ NORMAL MODE — LIVE MONITORING ═══
  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#f8fafc', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
            🛡️ CRISIS INTELLIGENCE
            <span style={{ background: '#f59e0b15', color: '#f59e0b', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 8, border: '1px solid #f59e0b25' }}>ELEVATED — {liveCrises.length} ACTIVE</span>
          </div>
          <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Live: April 16, 2026 · {CRISIS_PLAYBOOKS.length} playbooks · Real-time geo pulse</div>
        </div>
      </div>

      {/* ═══ LIVE CRISIS MONITOR GRID ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {Object.entries(CRISIS_TRIGGERS).map(([key, t]) => {
          const status = getTriggerStatus(key, t.current);
          return (
            <div key={key} className="glass-card" style={{ padding: '14px', borderColor: status === 'critical' ? '#dc262625' : status === 'warning' ? '#f59e0b18' : '#1a274430' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <StatusDot status={status} />
                <span style={{ fontSize: 8, color: status === 'normal' ? '#10b981' : status === 'warning' ? '#f59e0b' : '#ef4444', fontWeight: 700, textTransform: 'uppercase' }}>
                  {status === 'normal' ? '● NORMAL' : status === 'warning' ? '● WATCH' : '● ALERT'}
                </span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 18, color: status === 'critical' ? '#ef4444' : status === 'warning' ? '#f59e0b' : '#f8fafc', marginBottom: 4, textAlign: 'center' }}>
                {key === 'fii' ? (t.current >= 0 ? '+₹' : '-₹') + Math.abs(t.current).toLocaleString() + 'Cr' : key === 'nifty' ? (t.current >= 0 ? '+' : '') + t.current + '%' : key === 'crude' ? '$' + t.current + '/bbl' : t.current}{t.unit && key !== 'fii' && key !== 'nifty' && key !== 'crude' ? t.unit : ''}
              </div>
              <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', textAlign: 'center' }}>{t.label}</div>
              <div style={{ fontSize: 8, color: '#94a3b8', marginTop: 4, textAlign: 'center', lineHeight: 1.4 }}>{t.note}</div>
            </div>
          );
        })}
      </div>

      {/* ═══ LIVE CRISES (highlighted) ═══ */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          🔴 ACTIVE CRISES — APRIL 16-17, 2026
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'live-pulse 1s ease infinite' }} />
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {liveCrises.map(crisis => (
            <div key={crisis.id} onClick={() => simulateCrisis(crisis)}
              style={{ background: '#04070f', border: `1px solid ${crisis.severity > 60 ? '#dc262625' : crisis.severity > 40 ? '#f59e0b18' : '#1a274430'}`, borderRadius: 14, padding: '16px 18px', cursor: 'pointer', transition: 'all 0.3s', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc262650'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(220,38,38,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = crisis.severity > 60 ? '#dc262625' : '#f59e0b18'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{crisis.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc' }}>{crisis.name}</span>
                  <span style={{ background: '#dc2626', color: '#fff', padding: '2px 10px', borderRadius: 6, fontSize: 8, fontWeight: 800, animation: 'live-pulse 1s ease infinite' }}>{crisis.liveTag}</span>
                  <span style={{ background: crisis.severity > 60 ? '#dc262615' : '#f59e0b15', color: crisis.severity > 60 ? '#ef4444' : '#f59e0b', padding: '2px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700 }}>SEV: {crisis.severity}</span>
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, marginBottom: 4 }}>{crisis.trigger}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {crisis.historical.safeHavens.slice(0, 3).map(s => <span key={s} style={{ background: '#10b98110', color: '#10b981', padding: '2px 6px', borderRadius: 4, fontSize: 8, fontWeight: 700 }}>{s}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ef4444', fontWeight: 700 }}>Impact: -₹{Math.abs(crisis.portfolioImpact).toLocaleString('en-IN')}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#10b981', fontWeight: 700 }}>NEXUS saves: ₹{(Math.abs(crisis.portfolioImpact) - Math.abs(crisis.mitigatedImpact)).toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 10, color: '#7C5CFC', fontWeight: 600, marginTop: 4 }}>VIEW PLAYBOOK →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ LIVE STOCK ALERTS ═══ */}
      <div className="glass-card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>⚡ LIVE STOCK ALERTS — {STOCK_ALERTS.length} ACTIONABLE</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {STOCK_ALERTS.map((alert, i) => (
            <div key={alert.ticker}>
              <div onClick={() => setExpandedAlert(expandedAlert === i ? null : i)}
                style={{ display: 'grid', gridTemplateColumns: '100px 80px 1fr auto', gap: 10, padding: '10px 12px', background: '#04070f', borderRadius: expandedAlert === i ? '10px 10px 0 0' : 10, border: `1px solid ${alert.severity === 'CRITICAL' ? '#dc262620' : alert.severity === 'HIGH' ? '#ef444418' : '#1a274425'}`, cursor: 'pointer', alignItems: 'center', fontSize: 11, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 12, color: '#f8fafc' }}>{alert.ticker}</span>
                </div>
                <span style={{ background: alert.action === 'SELL' ? '#ef444418' : alert.action === 'BUY' ? '#10b98115' : '#38bdf810', color: alert.action === 'SELL' ? '#ef4444' : alert.action === 'BUY' ? '#10b981' : '#38bdf8', padding: '2px 10px', borderRadius: 6, fontSize: 9, fontWeight: 800, textAlign: 'center' }}>{alert.action}</span>
                <span style={{ color: '#94a3b8', fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.headline}</span>
                <span style={{ background: alert.severity === 'CRITICAL' ? '#dc262615' : alert.severity === 'HIGH' ? '#ef444412' : '#f59e0b10', color: alert.severity === 'CRITICAL' ? '#dc2626' : alert.severity === 'HIGH' ? '#ef4444' : '#f59e0b', padding: '2px 8px', borderRadius: 5, fontSize: 8, fontWeight: 800 }}>{alert.severity}</span>
              </div>
              {expandedAlert === i && (
                <div style={{ padding: '10px 14px', background: '#04070f', borderRadius: '0 0 10px 10px', borderLeft: `3px solid ${alert.action === 'SELL' ? '#ef4444' : '#10b981'}`, marginLeft: 0, fontSize: 10, color: '#94a3b8', animation: 'fadeIn 0.2s ease', border: `1px solid ${S.border}20`, borderTop: 'none' }}>
                  <div style={{ lineHeight: 1.5, marginBottom: 6 }}>{alert.detail}</div>
                  <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 10 }}>
                    <span>Target: <strong style={{ color: '#10b981' }}>₹{alert.target?.toLocaleString()}</strong></span>
                    <span>Stop Loss: <strong style={{ color: '#ef4444' }}>₹{alert.stopLoss?.toLocaleString()}</strong></span>
                    <span>Confidence: <strong style={{ color: '#38bdf8' }}>{alert.confidence}%</strong></span>
                    <span>Type: <strong style={{ color: '#f59e0b' }}>{alert.type}</strong></span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ GEOPOLITICAL RISK FACTORS ═══ */}
      <div className="glass-card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: S.muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>🌍 GEOPOLITICAL RISK PULSE — LIVE</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {GEO_FACTORS.map(f => {
            const fc = f.score > 60 ? '#ef4444' : f.score > 40 ? '#f59e0b' : '#10b981';
            return (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#04070f', borderRadius: 8, border: `1px solid ${f.score > 60 ? '#ef444415' : f.score > 40 ? '#f59e0b12' : S.border + '30'}` }}>
                <span style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 600, minWidth: 160 }}>{f.name}</span>
                <div style={{ flex: 1, height: 5, background: '#1a2744', borderRadius: 3, overflow: 'hidden', margin: '0 12px' }}>
                  <div style={{ width: `${f.score}%`, height: '100%', background: `linear-gradient(90deg, ${fc}80, ${fc})`, borderRadius: 3, transition: 'width 0.8s ease', boxShadow: f.score > 40 ? `0 0 6px ${fc}25` : 'none' }} />
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 900, color: fc, minWidth: 28, textAlign: 'right' }}>{f.score}</span>
                <span style={{ fontSize: 8, color: fc, fontWeight: 700, minWidth: 60, textAlign: 'right' }}>● {f.status}</span>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
          <span style={{ color: S.dim }}>COMPOSITE: </span>
          <span style={{ fontWeight: 900, color: '#f59e0b' }}>58/100 — ELEVATED</span>
        </div>
      </div>

      {/* ═══ TOMORROW PREVIEW ═══ */}
      <div className="glass-card" style={{ marginBottom: 16, borderColor: '#7C5CFC18' }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: '#7C5CFC', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          🔮 TOMORROW PREVIEW — {TOMORROW_PREVIEW.date}
        </div>
        <div style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
          {TOMORROW_PREVIEW.keyEvents.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 10px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}20`, fontSize: 11, color: '#e2e8f0', alignItems: 'center' }}>{e}</div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', background: '#7C5CFC08', borderRadius: 10, border: '1px solid #7C5CFC15', fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
          <div style={{ color: '#7C5CFC', fontWeight: 700, marginBottom: 4 }}>NIFTY OUTLOOK</div>
          {TOMORROW_PREVIEW.niftyOutlook}
        </div>
        <div style={{ marginTop: 10, padding: '10px 14px', background: '#f59e0b08', borderRadius: 10, border: '1px solid #f59e0b15', fontSize: 12, color: '#f59e0b', fontWeight: 700, textAlign: 'center' }}>
          📋 STRATEGY: {TOMORROW_PREVIEW.strategyOfTheDay}
        </div>
      </div>

      {/* STANDBY PLAYBOOKS */}
      <div className="glass-card">
        <div style={{ fontWeight: 800, fontSize: 12, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>📚 STANDBY PLAYBOOKS (NOT ACTIVE)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
          {standbyCrises.map(p => (
            <div key={p.id} onClick={() => simulateCrisis(p)}
              style={{ background: '#04070f', border: `1px solid ${S.border}30`, borderRadius: 10, padding: '12px', cursor: 'pointer', transition: 'all 0.2s', opacity: 0.6 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.borderColor = '#38bdf830'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.6'; e.currentTarget.style.borderColor = S.border + '30'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 11, color: '#94a3b8' }}>{p.name}</span>
              </div>
              <div style={{ fontSize: 9, color: S.dim }}>Severity: {p.severity}/100 · {p.historical.event}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: '#3d527260' }}>⚠️ Real-time intelligence. Sources: Moneycontrol, Zerodha Pulse, Groww, NSE/BSE. Not SEBI-registered investment advice.</div>
    </div>
  );
}
