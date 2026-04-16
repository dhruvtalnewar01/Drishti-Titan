import { useState, useMemo } from 'react';
import { SIGNALS } from '../data.js';
import { AGENTS, NEXUS_CORE, runCouncilAnalysis } from '../engine/agentCouncil.js';
import { sentinel } from '../engine/sentinel.js';
import { dataFabric } from '../engine/dataResilience.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

export default function CouncilTab() {
  const [selectedSignal, setSelectedSignal] = useState(SIGNALS[0]);
  const [showAudit, setShowAudit] = useState(false);

  const analysis = useMemo(() => runCouncilAnalysis(selectedSignal), [selectedSignal]);
  const sentinelStatus = sentinel.getStatus();
  const fabricStatus = dataFabric.getStatus();

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
            7-Agent Council + SENTINEL
            <span className="quantum-badge">⚛️ QUANTUM SIGNED</span>
          </div>
          <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Multi-agent orchestration · adversarial defense · 9-layer audit trail</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {/* Signal selector */}
          <select value={selectedSignal.id} onChange={e => setSelectedSignal(SIGNALS.find(s => s.id === parseInt(e.target.value)))}
            style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, color: '#f8fafc', padding: '6px 12px', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            {SIGNALS.map(s => <option key={s.id} value={s.id}>{s.ticker} — {s.type.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {/* SENTINEL Defense Status */}
      <div className="glass-card" style={{ marginBottom: 12, borderColor: '#ec489920' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #ec489915, #ec489908)', border: '1px solid #ec489930', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🛡️</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#ec4899' }}>SENTINEL AGENT 8</div>
              <div style={{ fontSize: 9, color: S.dim }}>Adversarial Defense · Pre-Scan & Post-Validation</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Threat Level', value: sentinelStatus.threatLevel, color: sentinelStatus.threatLevel === 'GREEN' ? '#10b981' : '#ef4444' },
              { label: 'Total Scans', value: sentinelStatus.totalScans, color: '#38bdf8' },
              { label: 'Blocked', value: sentinelStatus.blockedAttempts, color: '#ef4444' },
              { label: 'Success Rate', value: sentinelStatus.successRate + '%', color: '#10b981' },
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
                <div style={{ fontWeight: 800, fontSize: 13, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Resilience Fabric */}
      <div className="glass-card" style={{ marginBottom: 12, borderColor: '#10b98120' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 14 }}>🔗</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#10b981' }}>Data Resilience Fabric</div>
            <div style={{ fontSize: 9, color: S.dim }}>3-of-5 Source Consensus · Trust Scoring · Fallback Chain</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 10, color: fabricStatus.overallHealth === 'HEALTHY' ? '#10b981' : '#00E5A0', fontWeight: 700 }}>
            {fabricStatus.overallHealth}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {fabricStatus.sources.map(src => (
            <div key={src.id} style={{ flex: '1 1 100px', padding: '6px 10px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <span>{src.icon}</span>
                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: 9 }}>{src.name}</span>
                <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: src.status === 'active' ? '#10b981' : '#00E5A0' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: S.dim }}>
                <span>Trust: {src.trustScore}%</span>
                <span>{src.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Council Grid */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          Agent Council Analysis
          <span style={{ fontSize: 9, color: '#00E5A0', background: 'rgba(0,229,160,0.06)', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>
            {selectedSignal.ticker} · {selectedSignal.type.replace('_', ' ')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {AGENTS.map((agent, i) => {
            const result = analysis.agentResults[agent.id];
            return (
              <div key={agent.id} className="agent-card" style={{ '--agent-color': agent.color, animation: `fadeInUp 0.4s ease ${i * 0.08}s both` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div className="agent-avatar" style={{ background: `linear-gradient(135deg, ${agent.color}15, ${agent.color}08)` }}>
                    {agent.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 12, color: agent.color }}>{agent.name}</span>
                      <span className="agent-status-dot" style={{ background: agent.color, boxShadow: `0 0 6px ${agent.color}` }} />
                    </div>
                    <div style={{ fontSize: 9, color: S.dim }}>{agent.role}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 9, color: S.dim }}>Verdict</div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: result.verdict.includes('CONFIRMED') || result.verdict.includes('ACCUMULATE') || result.verdict.includes('POSITIVE') || result.verdict.includes('BREAKOUT') || result.verdict.includes('UNDERVALUED') || result.verdict.includes('APPROVED') ? '#10b981' : '#fb923c' }}>
                      {result.verdict}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', lineHeight: 1.7, marginBottom: 8 }}>{result.reasoning}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: S.dim }}>
                  <span>Confidence: <span style={{ color: agent.color, fontWeight: 700 }}>{result.confidence}%</span></span>
                  <span>{result.dataPoints} data points</span>
                  <span>Latency: {result.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NEXUS CORE Consensus */}
      <div className="glass-card" style={{ borderColor: 'rgba(0,229,160,0.12)', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, rgba(0,229,160,0.1), rgba(124,92,252,0.1))', border: '1px solid rgba(0,229,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, animation: 'float 3s ease-in-out infinite' }}>
            {NEXUS_CORE.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#00E5A0' }}>NEXUS CORE — Final Signal</div>
            <div style={{ fontSize: 10, color: S.dim }}>{NEXUS_CORE.desc}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: analysis.consensus.consensusColor, fontFamily: 'var(--font-mono)', textShadow: `0 0 20px ${analysis.consensus.consensusColor}40` }}>
              {analysis.consensus.consensusVerdict}
            </div>
            <div style={{ fontSize: 9, color: S.dim }}>{analysis.consensus.agreement}% agreement · {analysis.consensus.bullishVotes}/{analysis.consensus.totalAgents} agents</div>
          </div>
        </div>

        {/* Consensus meter */}
        <div style={{ background: '#04070f', borderRadius: 8, padding: '10px 14px', border: `1px solid ${S.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: S.dim, marginBottom: 6 }}>
            <span>BEARISH</span>
            <span>Council Consensus</span>
            <span>BULLISH</span>
          </div>
          <div style={{ height: 8, background: '#1a2744', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${analysis.consensus.agreement}%`, borderRadius: 4, background: `linear-gradient(90deg, #ef4444, #00E5A0, #10b981)`, transition: 'width 1s ease', boxShadow: '0 0 10px rgba(0,229,160,0.3)' }} />
          </div>
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: analysis.consensus.consensusColor, fontFamily: 'var(--font-mono)' }}>
              {analysis.consensus.averageConfidence}% avg confidence
            </span>
          </div>
        </div>
      </div>

      {/* 9-Layer Audit Trail */}
      <div className="glass-card" style={{ borderColor: 'rgba(124,92,252,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
            9-Layer Audit Trail
            <span className="quantum-badge">🔒 IMMUTABLE</span>
          </div>
          <button onClick={() => setShowAudit(!showAudit)} style={{ background: 'none', border: `1px solid ${S.border}`, color: S.muted, borderRadius: 8, padding: '4px 12px', fontSize: 10 }}>
            {showAudit ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showAudit && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
            {analysis.auditTrail.map((layer, i) => (
              <div key={i} className="audit-layer" style={{ animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>
                <div className={`audit-dot ${layer.status}`} />
                <div style={{ marginLeft: 8, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 9, color: S.dim, fontFamily: 'var(--font-mono)', minWidth: 20 }}>L{layer.layer}</span>
                    <span style={{ fontSize: 11, color: '#f8fafc', fontWeight: 600 }}>{layer.name}</span>
                    <span style={{ fontSize: 9, color: layer.status === 'verified' || layer.status === 'passed' || layer.status === 'complete' || layer.status === 'approved' || layer.status === 'signed' ? '#10b981' : '#fb923c', fontWeight: 600, textTransform: 'uppercase' }}>
                      {layer.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 9, color: S.dim }}>{layer.detail} · {layer.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
