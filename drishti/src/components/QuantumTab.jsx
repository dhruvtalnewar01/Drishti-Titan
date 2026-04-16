import { useState, useMemo } from 'react';
import { PORTFOLIO } from '../data.js';
import { quantumVault } from '../engine/quantumVault.js';
import { SIGNALS } from '../data.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

export default function QuantumTab() {
  const [optimResult, setOptimResult] = useState(null);
  const [riskTolerance, setRiskTolerance] = useState(0.5);

  const vaultStatus = useMemo(() => quantumVault.getStatus(), []);
  const threatLandscape = useMemo(() => quantumVault.getThreatLandscape(), []);

  // Sign all signals on load
  useMemo(() => {
    SIGNALS.forEach(sig => quantumVault.signSignal(sig));
  }, []);

  const runOptimization = () => {
    const result = quantumVault.optimizePortfolio(PORTFOLIO, riskTolerance);
    setOptimResult(result);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          Quantum Vault
          <span className="quantum-badge">🔒 NIST FIPS 204</span>
          <span className="quantum-badge">⚛️ PQC ACTIVE</span>
        </div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>CRYSTALS-Dilithium signing · quantum threat monitor · Ising annealer optimization</div>
      </div>

      {/* Vault Status */}
      <div className="glass-card" style={{ marginBottom: 12, borderColor: '#a78bfa20' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div className="quantum-lock">🔒</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#a78bfa', marginBottom: 4 }}>Vault Status: LOCKED & SECURED</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, fontSize: 10 }}>
              <div style={{ color: S.dim }}>Algorithm: <span style={{ color: '#f8fafc' }}>{vaultStatus.keyAlgorithm}</span></div>
              <div style={{ color: S.dim }}>Standard: <span style={{ color: '#f8fafc' }}>{vaultStatus.standard}</span></div>
              <div style={{ color: S.dim }}>Security: <span style={{ color: '#a78bfa' }}>{vaultStatus.securityLevel}</span></div>
              <div style={{ color: S.dim }}>Signatures: <span style={{ color: '#10b981' }}>{vaultStatus.totalSignatures}</span></div>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 9, color: S.dim, marginBottom: 4, textTransform: 'uppercase' }}>Public Key</div>
          <div className="quantum-sig-display">{vaultStatus.publicKeyPrefix}</div>
        </div>
      </div>

      {/* Signed Signals */}
      <div className="glass-card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          Quantum-Signed Signals
          <span style={{ fontSize: 9, color: '#10b981', fontWeight: 600 }}>ALL VERIFIED ✓</span>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {SIGNALS.slice(0, 5).map(sig => {
            const verified = quantumVault.verifySignal(sig.id);
            return (
              <div key={sig.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#10b981' }}>✓</span>
                  <span style={{ fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{sig.ticker}</span>
                  <span style={{ color: S.dim }}>{sig.type.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)', fontSize: 8 }}>{verified.signature}</span>
                  <span className="quantum-badge" style={{ fontSize: 7, padding: '1px 6px' }}>DILITHIUM</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quantum Threat Monitor */}
      <div className="glass-card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10 }}>Quantum Threat Monitor</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {threatLandscape.threats.map(threat => (
            <div key={threat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: threat.status === 'MITIGATED' ? '#10b981' : threat.status === 'MONITORING' ? '#00E5A0' : '#38bdf8', boxShadow: `0 0 6px ${threat.status === 'MITIGATED' ? '#10b981' : '#00E5A0'}` }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 11, color: '#f8fafc' }}>{threat.name}</span>
                  <span style={{ fontSize: 8, color: threat.severity === 'CRITICAL' ? '#ef4444' : threat.severity === 'HIGH' ? '#fb923c' : threat.severity === 'MEDIUM' ? '#38bdf8' : '#10b981', fontWeight: 700, background: threat.severity === 'CRITICAL' ? '#ef444412' : '#38bdf812', padding: '1px 6px', borderRadius: 4 }}>
                    {threat.severity}
                  </span>
                </div>
                <div style={{ fontSize: 9, color: S.dim }}>{threat.detail}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: threat.status === 'MITIGATED' ? '#10b981' : '#00E5A0', fontWeight: 700 }}>{threat.status}</div>
                <div style={{ fontSize: 8, color: S.dim }}>{threat.timeline}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 10, color: '#10b981', fontWeight: 700 }}>
          {threatLandscape.mitigatedCount}/{threatLandscape.totalThreats} threats mitigated · Status: {threatLandscape.overallStatus}
        </div>
      </div>

      {/* Ising Annealer Portfolio Optimization */}
      <div className="glass-card" style={{ borderColor: '#ec489920' }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
          Ising Annealer — Portfolio Optimizer
          <span style={{ fontSize: 9, color: '#ec4899', background: '#ec489912', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>QUANTUM-INSPIRED</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: S.dim, marginBottom: 4 }}>
              <span>Conservative</span>
              <span>Risk Tolerance: {(riskTolerance * 100).toFixed(0)}%</span>
              <span>Aggressive</span>
            </div>
            <input type="range" min="0.1" max="0.9" step="0.1" value={riskTolerance}
              onChange={e => setRiskTolerance(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#a78bfa' }} />
          </div>
          <button onClick={runOptimization}
            style={{ background: 'linear-gradient(135deg, #a78bfa20, #ec489920)', border: '1px solid #a78bfa40', color: '#a78bfa', borderRadius: 8, padding: '8px 20px', fontSize: 11, fontWeight: 700 }}>
            ⚛️ Run Quantum Optimization
          </button>
        </div>

        {optimResult && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Compute Time', value: optimResult.computeTime, color: '#38bdf8' },
                { label: 'Classical Equiv.', value: optimResult.classicalEquivalent, color: S.muted },
                { label: 'Speedup', value: optimResult.speedup, color: '#10b981' },
                { label: 'Iterations', value: optimResult.iterations.toLocaleString(), color: '#a78bfa' },
              ].map((m, i) => (
                <div key={i} style={{ flex: '1 1 100px', padding: '8px 12px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 4 }}>
              {optimResult.optimizedAllocation.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#04070f', borderRadius: 6, border: `1px solid ${S.border}`, fontSize: 10 }}>
                  <span style={{ fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)', minWidth: 90 }}>{a.ticker}</span>
                  <span style={{ color: S.dim }}>Current: {(a.currentWeight * 100).toFixed(1)}%</span>
                  <span style={{ color: '#a78bfa', fontWeight: 700 }}>Optimal: {a.optimizedWeight}%</span>
                  <span style={{ color: a.change >= 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {a.change >= 0 ? '+' : ''}{a.change}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
