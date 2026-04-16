/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — MODE SELECTOR
   Hyper-Realistic Luxury Entry Screen
   ═══════════════════════════════════════════════════════════════ */
import { useState } from 'react';

export default function ModeSelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99998,
      background: '#02050a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-sans)',
      overflow: 'hidden',
    }}>
      {/* Background effects */}
      <div style={{ position: 'absolute', top: -200, left: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,92,252,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,160,0.015) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,215,0,0.005) 4px, rgba(255,215,0,0.005) 8px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 820, width: '90%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ background: 'linear-gradient(135deg, #00E5A0, #7C5CFC)', width: 64, height: 64, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 28, color: '#fff', boxShadow: '0 0 50px rgba(0,229,160,0.25), 0 8px 32px rgba(0,0,0,0.5)', marginBottom: 16 }}>D</div>
        </div>
        <div style={{ fontWeight: 900, fontSize: 32, color: '#f8fafc', letterSpacing: '-0.02em', marginBottom: 6 }}>
          Welcome to <span style={{ background: 'linear-gradient(90deg, #FFD700, #F59E0B, #00E5A0, #7C5CFC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 200%' }}>NEXUS</span>
        </div>
        <div style={{ color: '#5e7490', fontSize: 13, marginBottom: 48 }}>India's First AI-Powered Market Intelligence Platform</div>

        {/* Mode Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* BEGINNER */}
          <div
            onClick={() => onSelect('beginner')}
            onMouseEnter={() => setHovered('beginner')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'beginner' ? 'linear-gradient(135deg, rgba(255,215,0,0.04), rgba(245,158,11,0.02))' : 'linear-gradient(135deg, rgba(12,19,34,0.6), rgba(4,7,15,0.8))',
              border: `2px solid ${hovered === 'beginner' ? '#FFD70035' : '#1a274430'}`,
              borderRadius: 24, padding: '40px 28px', cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: hovered === 'beginner' ? 'translateY(-10px) scale(1.02)' : 'none',
              boxShadow: hovered === 'beginner' ? '0 24px 64px rgba(255,215,0,0.12), 0 0 40px rgba(255,215,0,0.04)' : '0 4px 24px rgba(0,0,0,0.4)',
              position: 'relative', overflow: 'hidden',
            }}>
            {hovered === 'beginner' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #FFD700, transparent)' }} />}
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎮</div>
            <div style={{ fontWeight: 900, fontSize: 24, background: 'linear-gradient(135deg, #FFD700, #F59E0B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10, fontFamily: 'var(--font-display)' }}>BEGINNER MODE</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
              Interactive charts, pattern recognition, S&R training, quizzes, and paper trading — all gamified with XP.
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              {['📈 Trends', '🎨 Patterns', '🎯 S&R', '💹 Paper Trade', '⚔️ Quests'].map(t => (
                <span key={t} style={{ background: '#FFD70008', color: '#FFD700', padding: '4px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, border: '1px solid #FFD70015' }}>{t}</span>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #FFD700, #F59E0B)', color: '#000', padding: '12px 28px', borderRadius: 14, fontWeight: 900, fontSize: 14, display: 'inline-block', boxShadow: '0 4px 20px rgba(255,215,0,0.3)' }}>
              Start Learning →
            </div>
          </div>

          {/* EXPERT */}
          <div
            onClick={() => onSelect('expert')}
            onMouseEnter={() => setHovered('expert')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'expert' ? 'linear-gradient(135deg, rgba(124,92,252,0.04), rgba(109,40,217,0.02))' : 'linear-gradient(135deg, rgba(12,19,34,0.6), rgba(4,7,15,0.8))',
              border: `2px solid ${hovered === 'expert' ? '#7C5CFC35' : '#1a274430'}`,
              borderRadius: 24, padding: '40px 28px', cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: hovered === 'expert' ? 'translateY(-10px) scale(1.02)' : 'none',
              boxShadow: hovered === 'expert' ? '0 24px 64px rgba(124,92,252,0.12), 0 0 40px rgba(124,92,252,0.04)' : '0 4px 24px rgba(0,0,0,0.4)',
              position: 'relative', overflow: 'hidden',
            }}>
            {hovered === 'expert' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, transparent, #7C5CFC, transparent)' }} />}
            <div style={{ fontSize: 52, marginBottom: 16 }}>⚡</div>
            <div style={{ fontWeight: 900, fontSize: 24, background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 10, fontFamily: 'var(--font-display)' }}>EXPERT MODE</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 18 }}>
              Full command center with live crisis AI, multi-agent council, oracle simulations, and real-time signals.
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              {['🛡️ Crisis AI', '🔮 Oracle', '📊 Ledger', '🌍 GeoPulse', '🤖 Agents'].map(t => (
                <span key={t} style={{ background: '#7C5CFC08', color: '#7C5CFC', padding: '4px 12px', borderRadius: 8, fontSize: 10, fontWeight: 700, border: '1px solid #7C5CFC15' }}>{t}</span>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #7C5CFC, #6d28d9)', color: '#fff', padding: '12px 28px', borderRadius: 14, fontWeight: 900, fontSize: 14, display: 'inline-block', boxShadow: '0 4px 20px rgba(124,92,252,0.3)' }}>
              Enter Command Center →
            </div>
          </div>
        </div>

        <div style={{ marginTop: 36, fontSize: 10, color: '#3d5272' }}>
          Switch modes anytime · ET Markets GenAI Hackathon 2026 · Amity University Mumbai
        </div>
      </div>
    </div>
  );
}
