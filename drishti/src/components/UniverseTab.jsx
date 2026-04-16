import { useRef, useEffect, useState, useCallback } from 'react';
import { NSE_UNIVERSE, SECTOR_COLORS, SIGNALS } from '../data.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

export default function UniverseTab() {
  const canvasRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rotationRef = useRef(0);
  const animRef = useRef(null);

  const project = useCallback((x, y, z, rotation, cx, cy) => {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const rx = x * cos - z * sin;
    const rz = x * sin + z * cos;
    const scale = 400 / (400 + rz);
    return { px: cx + rx * scale, py: cy + y * scale * 0.8, scale, depth: rz };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = 500 * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = '500px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const signalTickers = new Set(SIGNALS.map(s => s.ticker));

    const draw = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const cx = w / 2;
      const cy = h / 2;
      rotationRef.current += 0.003;
      const rotation = rotationRef.current;

      // Background
      ctx.clearRect(0, 0, w, h);
      
      // Stars
      for (let i = 0; i < 100; i++) {
        const sx = (Math.sin(i * 127.1 + i) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 269.5 + i) * 0.5 + 0.5) * h;
        const brightness = (Math.sin(Date.now() * 0.001 + i) * 0.5 + 0.5) * 0.5;
        ctx.fillStyle = `rgba(255,255,255,${brightness * 0.3})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Connection lines between same-sector stocks
      const projected = NSE_UNIVERSE.map(stock => ({
        ...stock,
        ...project(stock.x, stock.y, stock.z, rotation, cx, cy),
      })).sort((a, b) => a.depth - b.depth);

      // Draw connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          if (projected[i].sector === projected[j].sector) {
            const dist = Math.sqrt((projected[i].px - projected[j].px) ** 2 + (projected[i].py - projected[j].py) ** 2);
            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(projected[i].px, projected[i].py);
              ctx.lineTo(projected[j].px, projected[j].py);
              const color = SECTOR_COLORS[projected[i].sector] || '#5e7490';
              ctx.strokeStyle = color + '15';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw stocks
      projected.forEach(stock => {
        const color = SECTOR_COLORS[stock.sector] || '#5e7490';
        const radius = Math.max(3, Math.min(12, (stock.mcap / 200000) * stock.scale));
        const hasSignal = signalTickers.has(stock.ticker);
        const isHovered = hovered === stock.ticker;
        const alpha = Math.max(0.3, Math.min(1, stock.scale));

        // Glow for signal stocks
        if (hasSignal) {
          const gradient = ctx.createRadialGradient(stock.px, stock.py, 0, stock.px, stock.py, radius * 3);
          gradient.addColorStop(0, color + '40');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(stock.px, stock.py, radius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Stock orb
        const grad = ctx.createRadialGradient(stock.px - radius * 0.3, stock.py - radius * 0.3, 0, stock.px, stock.py, radius);
        grad.addColorStop(0, color + 'ee');
        grad.addColorStop(1, color + '60');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(stock.px, stock.py, isHovered ? radius * 1.5 : radius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        if (stock.scale > 0.7 || isHovered) {
          ctx.fillStyle = `rgba(240,244,248,${alpha * 0.8})`;
          ctx.font = `${isHovered ? 'bold 11px' : '9px'} Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(stock.ticker, stock.px, stock.py + radius + 12);
        }
      });

      // Title overlay
      ctx.fillStyle = 'rgba(240,244,248,0.7)';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('NSE UNIVERSE — REAL-TIME CONSTELLATION', 16, 24);
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = 'rgba(94,116,144,0.7)';
      ctx.fillText(`${NSE_UNIVERSE.length} stocks · ${Object.keys(SECTOR_COLORS).length} sectors · Live signal overlay`, 16, 38);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [hovered, project]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setMousePos({ x: e.clientX, y: e.clientY });

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const cx = w / 2;
    const cy = h / 2;

    let closestStock = null;
    let closestDist = 30;

    NSE_UNIVERSE.forEach(stock => {
      const p = project(stock.x, stock.y, stock.z, rotationRef.current, cx, cy);
      const dist = Math.sqrt((p.px - mx) ** 2 + (p.py - my) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closestStock = stock;
      }
    });

    setHovered(closestStock?.ticker || null);
  };

  const hoveredStock = hovered ? NSE_UNIVERSE.find(s => s.ticker === hovered) : null;
  const hoveredSignal = hovered ? SIGNALS.find(s => s.ticker === hovered) : null;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>Universe 3D Map</div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Interactive stock constellation · sector clustering · signal overlay · auto-rotating</div>
      </div>

      {/* Sector Legend */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        {Object.entries(SECTOR_COLORS).map(([sector, color]) => (
          <div key={sector} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: S.muted }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 4px ${color}60` }} />
            {sector}
          </div>
        ))}
      </div>

      {/* Canvas */}
      <div className="universe-container" style={{ position: 'relative' }}>
        <canvas ref={canvasRef} className="universe-canvas" onMouseMove={handleMouseMove} onMouseLeave={() => setHovered(null)} />
        
        {/* Tooltip */}
        {hoveredStock && (
          <div className="universe-tooltip" style={{ left: Math.min(mousePos.x - canvasRef.current?.parentElement?.getBoundingClientRect().left || 0, 250), top: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: SECTOR_COLORS[hoveredStock.sector] }} />
              <span style={{ fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{hoveredStock.ticker}</span>
              <span style={{ color: S.dim, fontSize: 9 }}>{hoveredStock.sector}</span>
            </div>
            <div style={{ color: S.dim, fontSize: 9 }}>Mcap: ₹{(hoveredStock.mcap / 100).toFixed(0)}K Cr</div>
            {hoveredSignal && (
              <div style={{ marginTop: 4, padding: '4px 6px', background: 'rgba(0,229,160,0.06)', borderRadius: 4, border: '1px solid rgba(0,229,160,0.12)' }}>
                <div style={{ fontSize: 9, color: '#00E5A0', fontWeight: 600 }}>⚡ ACTIVE SIGNAL</div>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>{hoveredSignal.signal}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginTop: 12 }}>
        {[
          { label: 'Total Stocks', value: NSE_UNIVERSE.length, icon: '📊' },
          { label: 'Sectors', value: Object.keys(SECTOR_COLORS).length, icon: '🏷️' },
          { label: 'Active Signals', value: SIGNALS.length, icon: '📡' },
          { label: 'Total Mcap', value: '₹' + (NSE_UNIVERSE.reduce((s, st) => s + st.mcap, 0) / 100000).toFixed(1) + 'L Cr', icon: '💰' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ textAlign: 'center', padding: 10, animation: `fadeInUp 0.3s ease ${i * 0.05}s both` }}>
            <div style={{ fontSize: 14, marginBottom: 2 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 8, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
