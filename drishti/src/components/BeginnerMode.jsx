/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — BEGINNER MODE v4 (REALISTIC PRO)
   38 Candlestick Patterns · Realistic Charts · Risk-Free Trading
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect, useMemo } from 'react';

// ─── REALISTIC TRADING TERMINAL PALETTE ───
const C = {
  gold: '#FFD700', amber: '#F59E0B', cyan: '#22D3EE', purple: '#A78BFA',
  green: '#26a69a', red: '#ef5350', // TradingView candle colors
  bg: '#060911', cardBg: '#0c1117', deep: '#04070f',
  border: '#1e2a3a', text: '#d1d5db', muted: '#6b7b8d', dim: '#3d5272',
  gridLine: '#1a2332',
};

// ─── 3D BACKGROUND PARTICLES (subtle) ───
function Particles3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${Math.random() * 100}%`,
          width: Math.random() * 2 + 1, height: Math.random() * 2 + 1,
          background: Math.random() > 0.5 ? C.gold : C.cyan, borderRadius: '50%', opacity: 0.4,
          animation: `particleUp ${20 + Math.random() * 20}s linear infinite`,
          animationDelay: `-${Math.random() * 25}s`,
        }} />
      ))}
    </div>
  );
}

// ─── CANDLE DATA GENERATOR ───
function generateCandles(count = 50, trend = 'up') {
  const candles = [];
  let price = 22000 + Math.random() * 2000;
  for (let i = 0; i < count; i++) {
    const vol = 40 + Math.random() * 80;
    const bias = trend === 'up' ? 0.56 : trend === 'down' ? 0.42 : 0.5;
    const move = (Math.random() - (1 - bias)) * vol;
    const open = price;
    const close = price + move;
    const high = Math.max(open, close) + Math.random() * vol * 0.4;
    const low = Math.min(open, close) - Math.random() * vol * 0.4;
    candles.push({ open, close, high, low, bullish: close > open, vol: Math.round(vol * 1000 + Math.random() * 50000) });
    price = close;
  }
  return candles;
}

// ─── REALISTIC SVG CANDLESTICK CHART ───
// Modeled after TradingView / Zerodha Kite style
function RealisticChart({ candles, width = 700, height = 320, overlays = [], title, showVolume = true }) {
  const chartTop = 24, chartBot = showVolume ? height - 50 : height - 24;
  const chartH = chartBot - chartTop;
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const range = maxP - minP || 1;
  const cw = (width - 60) / candles.length;
  const toY = (p) => chartTop + ((maxP - p) / range) * chartH;
  const maxVol = Math.max(...candles.map(c => c.vol));

  // Price grid levels (5 levels)
  const gridPrices = Array.from({ length: 5 }, (_, i) => maxP - (range * i) / 4);

  return (
    <div style={{ borderRadius: 8, background: '#0a0e15', border: `1px solid ${C.border}`, overflow: 'hidden', position: 'relative' }}>
      {title && (
        <div style={{ padding: '8px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0c1018' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: 'var(--font-mono)' }}>{title}</span>
            <span style={{ fontSize: 10, color: C.muted }}>1D</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['1m', '5m', '15m', '1H', '1D'].map(tf => (
              <span key={tf} style={{ fontSize: 10, color: tf === '1D' ? C.gold : C.dim, cursor: 'pointer', fontWeight: tf === '1D' ? 700 : 400 }}>{tf}</span>
            ))}
          </div>
        </div>
      )}
      <svg width={width} height={height} style={{ display: 'block' }}>
        {/* Horizontal grid + price labels */}
        {gridPrices.map((p, i) => (
          <g key={i}>
            <line x1={0} y1={toY(p)} x2={width - 50} y2={toY(p)} stroke={C.gridLine} strokeWidth={1} />
            <text x={width - 4} y={toY(p) + 4} textAnchor="end" style={{ fontSize: 9, fill: C.dim, fontFamily: 'var(--font-mono)' }}>{p.toFixed(0)}</text>
          </g>
        ))}

        {/* Candles */}
        {candles.map((c, idx) => {
          const x = 10 + idx * cw + cw / 2;
          const color = c.bullish ? C.green : C.red;
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          const bodyH = Math.max(bodyBot - bodyTop, 1);
          return (
            <g key={idx}>
              <line x1={x} x2={x} y1={toY(c.high)} y2={toY(c.low)} stroke={color} strokeWidth={1} />
              <rect x={x - cw * 0.35} y={bodyTop} width={cw * 0.7} height={bodyH} fill={c.bullish ? color : color} stroke={color} strokeWidth={0.5} />
            </g>
          );
        })}

        {/* Volume bars */}
        {showVolume && candles.map((c, idx) => {
          const x = 10 + idx * cw + cw / 2;
          const volH = (c.vol / maxVol) * 40;
          return <rect key={`v${idx}`} x={x - cw * 0.35} y={height - volH - 4} width={cw * 0.7} height={volH} fill={c.bullish ? C.green : C.red} opacity={0.25} />;
        })}

        {/* Overlays */}
        {overlays.map((o, i) => {
          if (o.type === 'hline') return (
            <g key={i}>
              <line x1={0} y1={toY(o.price)} x2={width - 50} y2={toY(o.price)} stroke={o.color} strokeWidth={1.5} strokeDasharray={o.dash || '6,4'} opacity={0.7} />
              <rect x={width - 52} y={toY(o.price) - 8} width={50} height={16} rx={2} fill={o.color} opacity={0.9} />
              <text x={width - 28} y={toY(o.price) + 3} textAnchor="middle" style={{ fontSize: 8, fill: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{o.price.toFixed(0)}</text>
              <text x={4} y={toY(o.price) - 4} style={{ fontSize: 9, fill: o.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{o.label}</text>
            </g>
          );
          if (o.type === 'zone') return <rect key={i} x={0} y={toY(o.high)} width={width - 50} height={toY(o.low) - toY(o.high)} fill={o.color} opacity={0.12} />;
          return null;
        })}
      </svg>
    </div>
  );
}

// ─── PROGRESS RING (keeps gold luxury look) ───
function ProgressRing({ value, max, size = 70, color = C.gold, children }) {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r, progress = (value / max) * circ;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.border} strokeWidth={4} opacity={0.3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={`${progress} ${circ}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

// ─── PATTERN DATA SVG GENERATOR ───
function PatternSVG({ points, color, w = 400, h = 200 }) {
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {[0.25, 0.5, 0.75].map(p => <line key={p} x1="0" y1={p * h} x2={w} y2={p * h} stroke={C.gridLine} strokeWidth={1} />)}
      <path d={`M ${points.map(([x, y]) => `${(x / 100) * w},${(y / 100) * h}`).join(' L ')}`}
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dasharray" values="0,2000;2000,0" dur="1.5s" fill="freeze" />
      </path>
      {points.map(([x, y], i) => (
        <circle key={i} cx={(x / 100) * w} cy={(y / 100) * h} r={4} fill={color} opacity={0}>
          <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${0.8 + i * 0.15}s`} fill="freeze" />
        </circle>
      ))}
    </svg>
  );
}

// ─── ALL 38 CANDLESTICK PATTERNS FROM GROWW ───
const ALL_PATTERNS = [
  // ═══ BULLISH PATTERNS ═══
  { name: 'Bullish Engulfing', type: 'Bullish Reversal', candles: 2, difficulty: 'Easy', xp: 150, desc: 'A small bearish candle followed by a larger bullish candle. The body of the bullish candle completely engulfs the body of the bearish candle, indicating strong buying strength.', points: [[0,70],[15,80],[25,75],[40,85],[50,65],[60,50],[75,35],[90,30],[100,20]], color: C.green },
  { name: 'Hammer', type: 'Bullish Reversal', candles: 1, difficulty: 'Easy', xp: 100, desc: 'A single candlestick with a small body and long lower shadow/wick. When appearing in a downtrend, indicates buyers have become dominant — the share price might go up.', points: [[0,30],[20,50],[40,65],[50,80],[55,90],[60,85],[65,70],[80,55],[100,30]], color: C.green },
  { name: 'Morning Star', type: 'Bullish Reversal', candles: 3, difficulty: 'Medium', xp: 250, desc: 'A three-candlestick pattern: long bearish candle → small-bodied candle (either direction) → long bullish candle. Signifies sellers losing control and buyers taking over.', points: [[0,25],[15,40],[30,55],[45,70],[55,80],[60,75],[70,60],[80,45],[90,30],[100,15]], color: C.green },
  { name: 'Piercing Line', type: 'Bullish Reversal', candles: 2, difficulty: 'Medium', xp: 200, desc: 'Begins with a strong bearish candle followed by a bullish candle that opens below the previous close but closes above the midpoint (50%) of the previous bearish candle.', points: [[0,30],[20,45],[40,60],[55,75],[60,80],[65,70],[80,50],[100,35]], color: C.green },
  { name: 'Bullish Harami', type: 'Bullish Reversal', candles: 2, difficulty: 'Easy', xp: 150, desc: 'A small bullish candle completely contained within the body of the previous large bearish candle. Suggests decreasing selling pressure and a possible bullish reversal.', points: [[0,30],[20,50],[40,65],[55,75],[60,70],[70,60],[85,45],[100,30]], color: C.green },
  { name: 'Three White Soldiers', type: 'Bullish Reversal', candles: 3, difficulty: 'Medium', xp: 300, desc: 'Three long bullish candles with small wicks appearing consecutively. Each opens inside the previous body and closes higher. Market moving from downtrend to uptrend.', points: [[0,80],[10,75],[20,65],[30,55],[40,48],[50,40],[60,32],[70,25],[80,18],[90,12],[100,8]], color: C.green },
  { name: 'Inverted Hammer', type: 'Bullish Reversal', candles: 1, difficulty: 'Easy', xp: 120, desc: 'Small body with a long upper shadow and little to no lower shadow, at the bottom of a downtrend. Suggests buyers attempted to push prices higher during the session.', points: [[0,30],[20,50],[40,65],[55,80],[60,90],[65,75],[80,55],[100,35]], color: C.green },
  { name: 'Dragonfly Doji', type: 'Bullish Reversal', candles: 1, difficulty: 'Medium', xp: 200, desc: 'A single candlestick pattern with a very small body and a long lower shadow at the bottom of a downtrend. Open, high, and close prices are all near the same level.', points: [[0,40],[20,55],[40,70],[50,85],[55,90],[60,80],[70,65],[85,45],[100,25]], color: C.green },
  { name: 'Bullish Abandoned Baby', type: 'Bullish Reversal', candles: 3, difficulty: 'Hard', xp: 450, desc: 'A long bearish candle → doji candle that gaps down → long bullish candle that gaps up. Signals a strong reversal and significant shift from bearish to bullish sentiment.', points: [[0,25],[15,45],[30,60],[45,80],[55,85],[60,78],[70,55],[85,35],[100,15]], color: C.green },
  { name: 'Three Inside Up', type: 'Bullish Reversal', candles: 3, difficulty: 'Medium', xp: 250, desc: 'Large bearish candle → small bullish candle closing above 50% of first → third bullish candle closing above the first candle\'s open. Indicates potential reversal.', points: [[0,30],[20,45],[40,60],[55,72],[60,68],[70,55],[80,40],[90,25],[100,15]], color: C.green },
  { name: 'Three Outside Up', type: 'Bullish Reversal', candles: 3, difficulty: 'Medium', xp: 250, desc: 'Bearish candle → bullish candle engulfing the first → another bullish candle closing higher. Confirms the strength of the bullish reversal.', points: [[0,30],[15,40],[30,55],[45,70],[55,65],[65,50],[75,38],[85,25],[100,12]], color: C.green },
  { name: 'Bullish Kicker', type: 'Bullish Reversal', candles: 2, difficulty: 'Hard', xp: 400, desc: 'A long bearish candle followed by an even longer bullish candle that opens higher than previous close and rises more. Signals a strong reversal in sentiment.', points: [[0,45],[20,60],[40,75],[50,80],[55,60],[65,40],[80,20],[100,5]], color: C.green },
  { name: 'Tweezer Bottom', type: 'Bullish Reversal', candles: 2, difficulty: 'Easy', xp: 150, desc: 'Two equal-sized bullish and bearish candles with matching lows. Indicates the market has found a strong support level.', points: [[0,40],[20,55],[40,65],[50,75],[55,80],[60,78],[65,72],[80,55],[100,35]], color: C.green },
  { name: 'Rising Three Methods', type: 'Bullish Continuation', candles: 5, difficulty: 'Hard', xp: 400, desc: 'Long bullish → three small bearish candles (within range) → long bullish closing above first candle\'s high. Uptrend likely to continue after a pause.', points: [[0,75],[15,60],[25,50],[35,55],[45,58],[55,52],[65,45],[80,30],[100,15]], color: C.green },
  { name: 'Mat Hold', type: 'Bullish Continuation', candles: 5, difficulty: 'Hard', xp: 400, desc: 'Similar to Rising Three Methods. Long bullish → three small bearish (within range) → long bullish closing above first high. Brief pause in an uptrend.', points: [[0,70],[15,55],[25,50],[35,54],[45,56],[55,50],[65,42],[80,28],[100,12]], color: C.green },
  { name: 'Bullish Belt Hold', type: 'Bullish Reversal', candles: 1, difficulty: 'Easy', xp: 120, desc: 'A single candle at the bottom of a downtrend. Opens at the low of the day and closes near the high, with little to no lower shadow. Strong buying pressure.', points: [[0,40],[20,55],[40,70],[50,80],[55,85],[60,72],[75,50],[90,30],[100,15]], color: C.green },
  { name: 'Three-Line Strike (Bull)', type: 'Bullish Continuation', candles: 4, difficulty: 'Hard', xp: 350, desc: 'Three consecutive bullish candles followed by a long bearish candle that opens higher and closes below the first candle. Price will resume upward after a brief pause.', points: [[0,70],[15,58],[25,48],[35,40],[45,35],[55,50],[60,55],[70,45],[80,32],[100,18]], color: C.green },
  { name: 'Ladder Bottom', type: 'Bullish Reversal', candles: 5, difficulty: 'Hard', xp: 450, desc: 'Three consecutive long bearish candles → small candle → long bullish candle. Bearish trend is ending and buying pressure is taking control.', points: [[0,20],[15,35],[30,50],[45,65],[55,75],[60,80],[65,72],[80,50],[100,25]], color: C.green },
  { name: 'Meeting Lines (Bull)', type: 'Bullish Reversal', candles: 2, difficulty: 'Medium', xp: 200, desc: 'Long bearish candle → long bullish candle that opens lower but closes at the same level as the bearish candle\'s close. Shift from selling to buying pressure.', points: [[0,30],[20,45],[40,60],[55,75],[60,72],[70,58],[85,40],[100,22]], color: C.green },
  // ═══ BEARISH PATTERNS ═══
  { name: 'Bearish Engulfing', type: 'Bearish Reversal', candles: 2, difficulty: 'Easy', xp: 150, desc: 'A small bullish candle followed by a large bearish candle that completely engulfs the previous green candle. Sellers have taken control and price may continue to fall.', points: [[0,70],[15,55],[30,40],[45,30],[55,25],[60,35],[75,50],[90,65],[100,80]], color: C.red },
  { name: 'Hanging Man', type: 'Bearish Reversal', candles: 1, difficulty: 'Easy', xp: 120, desc: 'Appears at the top of an uptrend as a single candle with a small body and a long lower shadow. Selling pressure is increasing and the uptrend might be ending.', points: [[0,70],[15,55],[30,40],[45,30],[50,25],[55,20],[60,30],[80,50],[100,70]], color: C.red },
  { name: 'Evening Star', type: 'Bearish Reversal', candles: 3, difficulty: 'Medium', xp: 250, desc: 'Long bullish candle → small-bodied candle that gaps up → long bearish candle closing well into the first candle\'s body. Uptrend losing momentum, downtrend may start.', points: [[0,70],[15,55],[30,40],[45,25],[55,18],[60,22],[70,40],[85,60],[100,80]], color: C.red },
  { name: 'Shooting Star', type: 'Bearish Reversal', candles: 1, difficulty: 'Easy', xp: 120, desc: 'Small body, long upper shadow, little to no lower shadow at the top of an uptrend. Buyers were in control but sellers took over, indicating potential reversal.', points: [[0,60],[15,45],[30,30],[40,20],[45,12],[50,15],[55,22],[70,40],[85,55],[100,75]], color: C.red },
  { name: 'Bearish Harami', type: 'Bearish Reversal', candles: 2, difficulty: 'Easy', xp: 150, desc: 'A small bearish candle completely engulfed within the body of the previous large bullish candle. Buying pressure is weakening, reversal to downside may come.', points: [[0,65],[15,50],[30,40],[45,30],[55,35],[65,45],[80,60],[100,75]], color: C.red },
  { name: 'Three Black Crows', type: 'Bearish Reversal', candles: 3, difficulty: 'Medium', xp: 300, desc: 'Three consecutive long red candles with small wicks. Continuation of a downtrend, showing strong and steady selling pressure.', points: [[0,15],[10,22],[20,30],[30,40],[40,48],[50,55],[60,62],[70,70],[80,78],[90,85],[100,92]], color: C.red },
  { name: 'Bearish Kicker', type: 'Bearish Reversal', candles: 2, difficulty: 'Hard', xp: 400, desc: 'Long bullish candle → long bearish candle opening below previous open and closing lower. Dramatic shift in sentiment, sudden reversal to the downside.', points: [[0,50],[20,35],[40,20],[50,15],[55,35],[65,55],[80,75],[100,90]], color: C.red },
  { name: 'Dark Cloud Cover', type: 'Bearish Reversal', candles: 2, difficulty: 'Medium', xp: 200, desc: 'Long green candle followed by a red candle that opens above the previous high but closes below the midpoint of the green candle. Uptrend might be over.', points: [[0,60],[15,45],[30,35],[45,22],[55,18],[60,28],[75,48],[90,65],[100,80]], color: C.red },
  { name: 'Bearish Abandoned Baby', type: 'Bearish Reversal', candles: 3, difficulty: 'Hard', xp: 450, desc: 'Long bullish candle → Doji that gaps up → long bearish candle that gaps down from the Doji. Indicates a sharp reversal and beginning of a downtrend.', points: [[0,70],[15,50],[30,35],[45,18],[55,14],[60,20],[70,40],[85,60],[100,82]], color: C.red },
  { name: 'Tweezer Top', type: 'Bearish Reversal', candles: 2, difficulty: 'Easy', xp: 150, desc: 'Two or more candles with matching highs at the top of an uptrend. First is usually bullish, second is bearish. Upward momentum weakening, reversal may come.', points: [[0,55],[15,40],[30,30],[45,20],[55,18],[60,22],[70,35],[85,55],[100,70]], color: C.red },
  { name: 'Three Inside Down', type: 'Bearish Reversal', candles: 3, difficulty: 'Medium', xp: 250, desc: 'Bullish candle → smaller bearish candle within the first → another bearish candle closing lower. Sellers gaining dominance, confirms bearish reversal.', points: [[0,65],[15,50],[30,38],[45,28],[55,32],[65,42],[80,58],[100,78]], color: C.red },
  { name: 'Three Outside Down', type: 'Bearish Reversal', candles: 3, difficulty: 'Medium', xp: 250, desc: 'Bullish candle → bearish candle engulfing the first → another bearish candle closing lower. Confirms the strength of the bearish reversal.', points: [[0,60],[15,48],[30,35],[45,25],[55,30],[65,40],[80,55],[90,68],[100,82]], color: C.red },
  { name: 'Bearish Doji Star', type: 'Bearish Reversal', candles: 2, difficulty: 'Medium', xp: 200, desc: 'Long bullish candle followed by a Doji (very small body). Doji shows indecision; if followed by a bearish candle, confirms reversal and signals potential downtrend.', points: [[0,55],[15,40],[30,25],[42,18],[50,15],[55,20],[65,35],[80,55],[100,75]], color: C.red },
  { name: 'Bearish Belt Hold', type: 'Bearish Reversal', candles: 1, difficulty: 'Easy', xp: 120, desc: 'A single long red candle in an uptrend that opens at the high and closes near the low, with little to no upper shadow. Strong selling pressure.', points: [[0,55],[15,40],[30,25],[40,18],[50,25],[60,38],[75,55],[90,72],[100,85]], color: C.red },
  { name: 'Bearish Three-Line Strike', type: 'Bearish Continuation', candles: 4, difficulty: 'Hard', xp: 350, desc: 'Three consecutive red candles, then a long green candle closing above first candle\'s opening. Despite the fourth bullish candle, downtrend continues after pullback.', points: [[0,25],[15,35],[25,45],[35,55],[45,60],[55,45],[60,40],[70,52],[80,65],[100,80]], color: C.red },
  { name: 'Upside Gap Two Crows', type: 'Bearish Reversal', candles: 3, difficulty: 'Hard', xp: 350, desc: 'Long green candle → two small red candles creating a gap up, where the second red closes below the first red\'s close. Potential reversal or consolidation before a drop.', points: [[0,60],[15,45],[30,30],[45,20],[55,15],[60,22],[70,35],[85,55],[100,72]], color: C.red },
  { name: 'Bearish Mat Hold', type: 'Bearish Continuation', candles: 5, difficulty: 'Hard', xp: 400, desc: 'Long bearish → three smaller bullish candles (within range) → long bearish closing below the first candle. Brief pause before downtrend continues.', points: [[0,25],[15,40],[25,48],[35,44],[45,42],[55,47],[65,55],[80,70],[100,88]], color: C.red },
];

const SNR_LESSONS = [
  { id: 'basics', title: 'What is Support & Resistance?', content: 'Support is where demand overcomes supply — price bounces up. Resistance is where supply overcomes demand — price reverses down. These are the foundational building blocks of all technical analysis.', icon: '🎯' },
  { id: 'identify', title: 'How to Spot Precision Zones', content: 'Look for clustered touchpoints where price has bounced multiple times. Professional institutions trade in zones, not exact lines. Higher timeframe zones carry more weight. Always check volume at those levels.', icon: '🔍' },
  { id: 'flip', title: 'The Polarity Flip Concept', content: 'Once broken, Support becomes Resistance and vice versa. This is the highest probability institutional setup in all of trading. A former support level now acts as a ceiling for price.', icon: '🔄' },
  { id: 'zones', title: 'Zones vs Lines in Practice', content: 'Markets are not precise — use zones, not exact lines. A zone of 50-100 points gives you room for wicks and noise. The more times price tests a zone without breaking, the stronger it becomes.', icon: '📊' },
];

const TREND_LESSONS = [
  { id: 'uptrend', title: 'Uptrend Structure', desc: 'Higher Highs (HH) & Higher Lows (HL). Bulls are in control. Each pullback creates a higher floor. The strategy: buy the dips to support.', trend: 'up', color: C.green },
  { id: 'downtrend', title: 'Downtrend Structure', desc: 'Lower Highs (LH) & Lower Lows (LL). Bears are dominating. Each rally creates a lower ceiling. The strategy: sell the rips to resistance.', trend: 'down', color: C.red },
  { id: 'sideways', title: 'Consolidation / Range', desc: 'Price oscillates between support and resistance. Smart money is accumulating. Wait for a breakout with volume confirmation before taking a position.', trend: 'sideways', color: C.amber },
];

const PAPER_EQUITIES = [
  { ticker: 'RELIANCE', name: 'Reliance Industries', price: 2940, change: 0.8 },
  { ticker: 'INFY', name: 'Infosys Ltd', price: 1612, change: 1.2 },
  { ticker: 'HDFCBANK', name: 'HDFC Bank', price: 1724, change: -0.4 },
  { ticker: 'TCS', name: 'Tata Consultancy', price: 3850, change: -0.6 },
  { ticker: 'HAL', name: 'Hindustan Aeronautics', price: 4580, change: 3.4 },
];

const PAPER_RISK_FREE = [
  { ticker: 'LIQUIDBEES', name: 'Liquid ETF', type: 'Cash Equivalent ETF', price: 1000.12, change: 0.01, risk: 'Zero Risk', icon: '🏛️' },
  { ticker: 'SGB_AUG28', name: 'Sovereign Gold Bond', type: 'Govt of India Bond', price: 7240, change: 0.15, risk: 'Govt Backed', icon: '🥇' },
  { ticker: 'NIFTYBEES', name: 'Nifty 50 ETF', type: 'Index Tracking ETF', price: 245.60, change: 0.3, risk: 'Low Risk', icon: '📈' },
  { ticker: 'ARBITRAGE', name: 'Arbitrage Fund', type: 'Cash-Futures Arb', price: 110.5, change: 0.05, risk: 'Near-Zero Risk', icon: '⚖️' },
];

// ─── MAIN COMPONENT ───
export default function BeginnerMode({ onSwitchToExpert }) {
  const [section, setSection] = useState('home');
  const [profile, setProfile] = useState({ level: 4, xp: 2750, xpToNext: 4000, streak: 7, badges: 4, totalBadges: 12, completedLessons: 12, totalLessons: 30, rank: 'Apprentice Trader' });
  const [quests, setQuests] = useState([
    { id: 1, title: 'Identify an Uptrend', xp: 100, icon: '📈', done: true },
    { id: 2, title: 'Draw Support & Resistance', xp: 150, icon: '🎯', done: true },
    { id: 3, title: 'Recognize a Pattern', xp: 200, icon: '🧠', done: false },
    { id: 4, title: 'Execute a Risk-Free Trade', xp: 300, icon: '🛡️', done: false },
  ]);
  const [showXP, setShowXP] = useState(null);
  const [patternIdx, setPatternIdx] = useState(0);
  const [patternCategory, setPatternCategory] = useState('bullish');
  const [snrIdx, setSnrIdx] = useState(0);
  const [trendIdx, setTrendIdx] = useState(0);
  const [paperTab, setPaperTab] = useState('RISK_FREE');
  const [paperEquities, setPaperEquities] = useState(PAPER_EQUITIES);
  const [paperRiskFree, setPaperRiskFree] = useState(PAPER_RISK_FREE);
  const [paperCash, setPaperCash] = useState(100000);
  const [paperHoldings, setPaperHoldings] = useState([]);
  const [paperPnl, setPaperPnl] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const filteredPatterns = patternCategory === 'bullish' ? ALL_PATTERNS.filter(p => !p.type.startsWith('Bearish')) : ALL_PATTERNS.filter(p => p.type.startsWith('Bearish'));
  const currentPattern = filteredPatterns[patternIdx] || filteredPatterns[0];

  useEffect(() => {
    const iv = setInterval(() => {
      setPaperEquities(prev => prev.map(s => ({ ...s, price: +(s.price * (1 + (Math.random() - 0.48) * 0.002)).toFixed(2), change: +(s.change + (Math.random() - 0.5) * 0.08).toFixed(2) })));
      setPaperRiskFree(prev => prev.map(s => ({ ...s, price: +(s.price * (1 + (Math.random() - 0.45) * 0.0005)).toFixed(2), change: +(s.change + (Math.random() - 0.45) * 0.015).toFixed(2) })));
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const upCandles = useMemo(() => generateCandles(50, 'up'), []);
  const downCandles = useMemo(() => generateCandles(50, 'down'), []);
  const sideCandles = useMemo(() => generateCandles(50, 'side'), []);
  const snrCandles = useMemo(() => generateCandles(50, 'side'), []);

  const snrMax = Math.max(...snrCandles.flatMap(c => [c.high, c.low]));
  const snrMin = Math.min(...snrCandles.flatMap(c => [c.high, c.low]));
  const snrMid = (snrMin + snrMax) / 2;
  const snrOverlays = [
    { type: 'hline', price: snrMax - (snrMax - snrMin) * 0.12, label: 'R2', color: C.red, dash: '8,4' },
    { type: 'hline', price: snrMid + (snrMax - snrMin) * 0.06, label: 'R1', color: '#ef9a9a', dash: '6,4' },
    { type: 'hline', price: snrMid - (snrMax - snrMin) * 0.06, label: 'S1', color: '#80cbc4', dash: '6,4' },
    { type: 'hline', price: snrMin + (snrMax - snrMin) * 0.12, label: 'S2', color: C.green, dash: '8,4' },
    { type: 'zone', high: snrMax - (snrMax - snrMin) * 0.08, low: snrMax - (snrMax - snrMin) * 0.16, color: C.red },
    { type: 'zone', high: snrMin + (snrMax - snrMin) * 0.16, low: snrMin + (snrMax - snrMin) * 0.08, color: C.green },
  ];

  const addXP = (amount) => {
    setShowXP(amount);
    setTimeout(() => setShowXP(null), 1800);
    setProfile(p => {
      const nx = p.xp + amount;
      return nx >= p.xpToNext ? { ...p, xp: nx - p.xpToNext, level: p.level + 1, xpToNext: Math.round(p.xpToNext * 1.4) } : { ...p, xp: nx };
    });
  };

  const doQuest = (id) => { const q = quests.find(x => x.id === id); if (q && !q.done) { setQuests(prev => prev.map(x => x.id === id ? { ...x, done: true } : x)); addXP(q.xp); }};

  const paperBuy = (s) => {
    if (paperCash >= s.price) {
      setPaperCash(c => +(c - s.price).toFixed(2));
      setPaperHoldings(h => [...h, { ticker: s.ticker, buy: s.price, qty: 1 }]);
      addXP(50);
      if (PAPER_RISK_FREE.some(r => r.ticker === s.ticker)) doQuest(4);
    }
  };

  const paperSell = (idx) => {
    const h = paperHoldings[idx];
    const cur = [...paperEquities, ...paperRiskFree].find(s => s.ticker === h.ticker);
    const pnl = cur ? +(cur.price - h.buy).toFixed(2) : 0;
    setPaperCash(c => +(c + (cur?.price || h.buy)).toFixed(2));
    setPaperHoldings(hs => hs.filter((_, i) => i !== idx));
    setPaperPnl(p => +(p + pnl).toFixed(2));
    addXP(pnl >= 0 ? 150 : 20);
  };

  const cardStyle = { background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px', transition: 'border-color 0.3s' };
  const sectionBtnStyle = (active) => ({ flex: 1, padding: '12px 10px', background: active ? '#111820' : '#080c12', border: `1px solid ${active ? C.gold : C.border}`, borderBottom: active ? `2px solid ${C.gold}` : `1px solid ${C.border}`, borderRadius: '8px 8px 0 0', color: active ? C.gold : C.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 });

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Particles3D />

      {/* XP REWARD */}
      {showXP && (
        <div style={{ position: 'fixed', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`, borderRadius: 16, padding: '24px 48px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#000', fontFamily: 'var(--font-mono)' }}>+{showXP} XP</div>
            <div style={{ fontSize: 13, color: '#000', fontWeight: 800, letterSpacing: '0.05em' }}>KNOWLEDGE UPGRADED</div>
          </div>
        </div>
      )}

      {/* ═══ HEADER BAR ═══ */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <ProgressRing value={profile.xp} max={profile.xpToNext} size={64} color={C.gold}>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 20, color: C.gold }}>{profile.level}</div>
          </ProgressRing>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.text, display: 'flex', alignItems: 'center', gap: 8 }}>
              {profile.rank}
              <span style={{ background: C.gold, color: '#000', fontSize: 9, fontWeight: 900, padding: '3px 10px', borderRadius: 6 }}>TIER {profile.level}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
              <div style={{ width: 200, height: 6, background: '#1a2332', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${(profile.xp / profile.xpToNext) * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.gold}, ${C.amber})`, borderRadius: 3, transition: 'width 0.5s ease' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: C.muted }}>{profile.xp}/{profile.xpToNext} XP</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ ...cardStyle, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔥</span>
            <div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 16, color: C.amber }}>{profile.streak}</div><div style={{ fontSize: 8, color: C.muted, fontWeight: 700 }}>STREAK</div></div>
          </div>
          <div style={{ ...cardStyle, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>💎</span>
            <div><div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 16, color: C.cyan }}>{profile.badges}/{profile.totalBadges}</div><div style={{ fontSize: 8, color: C.muted, fontWeight: 700 }}>BADGES</div></div>
          </div>
        </div>
      </div>

      {/* ═══ NAV TABS ═══ */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {[{ id: 'home', i: '📊', l: 'Dashboard' }, { id: 'trends', i: '📈', l: 'Trend Analysis' }, { id: 'patterns', i: '🧠', l: `Patterns (${ALL_PATTERNS.length})` }, { id: 'snr', i: '🎯', l: 'S&R Levels' }, { id: 'paper', i: '💹', l: 'Paper Trade' }].map(n => (
          <button key={n.id} onClick={() => { setSection(n.id); if (n.id === 'patterns') setPatternIdx(0); }} style={sectionBtnStyle(section === n.id)}>
            <span>{n.i}</span>{n.l}
          </button>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* === HOME === */}
        {section === 'home' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { icon: '📚', val: `${profile.completedLessons}/${profile.totalLessons}`, label: 'Lessons', color: C.purple },
                { icon: '🧠', val: `${ALL_PATTERNS.length}`, label: 'Patterns Available', color: C.cyan },
                { icon: '🛡️', val: `₹${paperCash.toLocaleString('en-IN')}`, label: 'Paper Capital', color: C.green },
                { icon: '📈', val: `₹${paperPnl >= 0 ? '+' : ''}${paperPnl.toFixed(2)}`, label: 'Sim P&L', color: paperPnl >= 0 ? C.green : C.red },
              ].map((s, i) => (
                <div key={i} style={{ ...cardStyle, textAlign: 'center', padding: '16px' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 22, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginTop: 4, textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.gold, marginBottom: 14 }}>⚡ Daily Quests</div>
                {quests.map(q => (
                  <div key={q.id} onClick={() => doQuest(q.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: q.done ? 'rgba(38,166,154,0.06)' : '#080c12', borderRadius: 8, border: `1px solid ${q.done ? C.green + '40' : C.border}`, marginBottom: 6, cursor: q.done ? 'default' : 'pointer' }}>
                    <span style={{ fontSize: 20 }}>{q.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: q.done ? C.green : C.text, fontWeight: 700 }}>{q.title}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>+{q.xp} XP</div>
                    </div>
                    <span style={{ color: q.done ? C.green : C.dim, fontWeight: 900 }}>{q.done ? '✓' : '→'}</span>
                  </div>
                ))}
              </div>
              <RealisticChart candles={upCandles} width={700} height={360} title="NIFTY 50 — Simulated" />
            </div>
          </div>
        )}

        {/* === TRENDS === */}
        {section === 'trends' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {TREND_LESSONS.map((t, i) => (
                <button key={t.id} onClick={() => setTrendIdx(i)} style={{ flex: 1, padding: '12px', background: trendIdx === i ? '#111820' : '#080c12', border: `1px solid ${trendIdx === i ? t.color : C.border}`, borderRadius: 10, cursor: 'pointer', fontWeight: 800, fontSize: 13, color: trendIdx === i ? t.color : C.muted }}>
                  {t.title}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
              <RealisticChart candles={trendIdx === 0 ? upCandles : trendIdx === 1 ? downCandles : sideCandles} width={780} height={420} title={`${TREND_LESSONS[trendIdx].title.toUpperCase()} — Study Chart`} />
              <div style={cardStyle}>
                <div style={{ fontWeight: 900, fontSize: 20, color: TREND_LESSONS[trendIdx].color, marginBottom: 12 }}>{TREND_LESSONS[trendIdx].title}</div>
                <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.8, marginBottom: 20 }}>{TREND_LESSONS[trendIdx].desc}</div>
                <div style={{ background: '#0a0e15', padding: '14px', borderRadius: 8, borderLeft: `3px solid ${C.gold}` }}>
                  <div style={{ fontSize: 10, color: C.gold, fontWeight: 800, marginBottom: 6, textTransform: 'uppercase' }}>Pro Tip</div>
                  <div style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.6 }}>Never trade against the dominant trend on a higher timeframe. Use pullbacks to moving averages (20/50 EMA) as entries.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PATTERNS (38 patterns) === */}
        {section === 'patterns' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Category toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button onClick={() => { setPatternCategory('bullish'); setPatternIdx(0); }} style={{ flex: 1, padding: '12px', background: patternCategory === 'bullish' ? 'rgba(38,166,154,0.08)' : '#080c12', border: `1px solid ${patternCategory === 'bullish' ? C.green : C.border}`, borderRadius: 10, color: patternCategory === 'bullish' ? C.green : C.muted, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
                ▲ Bullish Patterns ({ALL_PATTERNS.filter(p => !p.type.startsWith('Bearish')).length})
              </button>
              <button onClick={() => { setPatternCategory('bearish'); setPatternIdx(0); }} style={{ flex: 1, padding: '12px', background: patternCategory === 'bearish' ? 'rgba(239,83,80,0.08)' : '#080c12', border: `1px solid ${patternCategory === 'bearish' ? C.red : C.border}`, borderRadius: 10, color: patternCategory === 'bearish' ? C.red : C.muted, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>
                ▼ Bearish Patterns ({ALL_PATTERNS.filter(p => p.type.startsWith('Bearish')).length})
              </button>
            </div>

            {/* Pattern selector scrollable list */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 8 }}>
              {filteredPatterns.map((p, i) => (
                <button key={p.name} onClick={() => setPatternIdx(i)} style={{
                  flex: '0 0 auto', padding: '8px 14px', background: patternIdx === i ? (patternCategory === 'bullish' ? 'rgba(38,166,154,0.1)' : 'rgba(239,83,80,0.1)') : '#080c12',
                  border: `1px solid ${patternIdx === i ? p.color : C.border}`, borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  <div style={{ fontWeight: 700, fontSize: 11, color: patternIdx === i ? p.color : C.muted }}>{p.name}</div>
                </button>
              ))}
            </div>

            {/* Pattern detail */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16 }}>
              {/* Pattern SVG chart */}
              <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0c1018' }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.text, fontFamily: 'var(--font-mono)' }}>PATTERN: {currentPattern.name.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: currentPattern.color, fontWeight: 700 }}>{currentPattern.type}</span>
                </div>
                <div style={{ padding: '16px', background: '#0a0e15' }}>
                  <PatternSVG points={currentPattern.points} color={currentPattern.color} w={500} h={220} />
                </div>
              </div>

              {/* Pattern info panel */}
              <div style={cardStyle}>
                <div style={{ fontWeight: 900, fontSize: 20, color: currentPattern.color, marginBottom: 8 }}>{currentPattern.name}</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ background: currentPattern.color + '15', color: currentPattern.color, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, border: `1px solid ${currentPattern.color}30` }}>{currentPattern.type}</span>
                  <span style={{ background: '#1a2332', color: C.muted, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{currentPattern.candles} Candle{currentPattern.candles > 1 ? 's' : ''}</span>
                  <span style={{ background: '#1a2332', color: C.amber, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>{currentPattern.difficulty}</span>
                  <span style={{ background: '#1a2332', color: C.gold, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700 }}>+{currentPattern.xp} XP</span>
                </div>
                <div style={{ fontSize: 13, color: '#c9d1d9', lineHeight: 1.8, marginBottom: 20 }}>{currentPattern.desc}</div>
                <div style={{ background: '#0a0e15', padding: '12px', borderRadius: 8, borderLeft: `3px solid ${currentPattern.color}`, marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: currentPattern.color, fontWeight: 800, marginBottom: 4, textTransform: 'uppercase' }}>Trading Tip</div>
                  <div style={{ fontSize: 11, color: '#c9d1d9', lineHeight: 1.5 }}>Always confirm with volume. A pattern without volume support has a significantly lower success rate. Wait for the confirming candle.</div>
                </div>
                <button onClick={() => { setQuizActive(true); setQuizAnswer(null); }} style={{ width: '100%', padding: '14px', background: currentPattern.color, border: 'none', borderRadius: 10, color: currentPattern.color === C.green ? '#fff' : '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer' }}>
                  Take Quiz (+{currentPattern.xp} XP)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === S&R LEVELS === */}
        {section === 'snr' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
              <RealisticChart candles={snrCandles} width={780} height={450} title="NIFTY 50 — Support & Resistance Zones" overlays={snrOverlays} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {SNR_LESSONS.map((l, i) => (
                  <button key={l.id} onClick={() => setSnrIdx(i)} style={{ ...cardStyle, padding: '16px', textAlign: 'left', cursor: 'pointer', display: 'flex', gap: 12, borderColor: snrIdx === i ? C.gold : C.border, background: snrIdx === i ? '#111820' : C.cardBg }}>
                    <div style={{ fontSize: 28 }}>{l.icon}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 14, color: snrIdx === i ? C.gold : C.text, marginBottom: 4 }}>{l.title}</div>
                      {snrIdx === i && <div style={{ fontSize: 12, color: '#c9d1d9', lineHeight: 1.6 }}>{l.content}</div>}
                    </div>
                  </button>
                ))}
                {/* Legend */}
                <div style={{ ...cardStyle, padding: '14px' }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 8 }}>LEGEND</div>
                  {[{ label: 'R2 — Strong Resistance', color: C.red }, { label: 'R1 — Resistance', color: '#ef9a9a' }, { label: 'S1 — Support', color: '#80cbc4' }, { label: 'S2 — Strong Support', color: C.green }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                      <span style={{ fontSize: 11, color: C.text }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === PAPER TRADING === */}
        {section === 'paper' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => setPaperTab('RISK_FREE')} style={{ flex: 1, padding: '12px', background: paperTab === 'RISK_FREE' ? 'rgba(38,166,154,0.08)' : '#080c12', border: `1px solid ${paperTab === 'RISK_FREE' ? C.green : C.border}`, borderRadius: 10, color: paperTab === 'RISK_FREE' ? C.green : C.muted, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>🛡️ Risk-Free Instruments</button>
              <button onClick={() => setPaperTab('EQUITIES')} style={{ flex: 1, padding: '12px', background: paperTab === 'EQUITIES' ? 'rgba(34,211,238,0.08)' : '#080c12', border: `1px solid ${paperTab === 'EQUITIES' ? C.cyan : C.border}`, borderRadius: 10, color: paperTab === 'EQUITIES' ? C.cyan : C.muted, fontWeight: 800, cursor: 'pointer', fontSize: 13 }}>📈 Equities (Higher Risk)</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
              <div style={cardStyle}>
                <div style={{ fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 16 }}>
                  {paperTab === 'RISK_FREE' ? '🛡️ Risk-Free / Low-Risk Instruments' : '📈 NSE Equities — Paper Trading'}
                </div>
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px', gap: 8, padding: '8px 12px', borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 700 }}>INSTRUMENT</span>
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, textAlign: 'right' }}>LTP</span>
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, textAlign: 'right' }}>CHG%</span>
                  <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, textAlign: 'right' }}>ACTION</span>
                </div>
                {(paperTab === 'RISK_FREE' ? paperRiskFree : paperEquities).map(s => (
                  <div key={s.ticker} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px 80px', gap: 8, padding: '12px', borderRadius: 8, marginBottom: 4, alignItems: 'center', background: '#080c12', border: `1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 13, color: C.text }}>{s.ticker}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{s.name || s.type}{s.risk ? ` · ${s.risk}` : ''}</div>
                    </div>
                    <div className="live-tick" style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 14, color: C.text, textAlign: 'right' }}>₹{s.price.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</div>
                    <div className="live-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: s.change >= 0 ? C.green : C.red, fontWeight: 800, textAlign: 'right' }}>{s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%</div>
                    <button onClick={() => paperBuy(s)} style={{ background: C.green, border: 'none', color: '#fff', padding: '8px', borderRadius: 6, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>BUY</button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 6 }}>AVAILABLE CAPITAL</div>
                  <div className="live-tick" style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 26, color: C.text }}>₹{paperCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
                </div>
                <div style={{ ...cardStyle, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 6 }}>REALIZED P&L</div>
                  <div className="live-tick" style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 22, color: paperPnl >= 0 ? C.green : C.red }}>{paperPnl >= 0 ? '+' : ''}₹{paperPnl.toFixed(2)}</div>
                </div>
                {paperHoldings.length > 0 && (
                  <div style={cardStyle}>
                    <div style={{ fontSize: 11, color: C.text, fontWeight: 700, marginBottom: 10 }}>OPEN POSITIONS ({paperHoldings.length})</div>
                    {paperHoldings.map((h, idx) => {
                      const cur = [...paperEquities, ...paperRiskFree].find(s => s.ticker === h.ticker);
                      const pnl = cur ? +(cur.price - h.buy).toFixed(2) : 0;
                      return (
                        <div key={idx} style={{ padding: '10px', background: '#080c12', borderRadius: 8, border: `1px solid ${C.border}`, marginBottom: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontWeight: 800, color: C.text, fontSize: 13, fontFamily: 'var(--font-mono)' }}>{h.ticker}</span>
                            <span className="live-tick" style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: 12, color: pnl >= 0 ? C.green : C.red }}>{pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}</span>
                          </div>
                          <button onClick={() => paperSell(idx)} style={{ width: '100%', padding: '6px', background: C.red + '15', border: `1px solid ${C.red}40`, borderRadius: 6, color: C.red, fontWeight: 800, cursor: 'pointer', fontSize: 11 }}>SELL / EXIT</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ QUIZ MODAL ═══ */}
      {quizActive && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }} onClick={() => setQuizActive(false)}>
          <div onClick={e => e.stopPropagation()} style={{ ...cardStyle, maxWidth: 550, width: '90%', padding: '32px', border: `1px solid ${C.gold}40` }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.gold, marginBottom: 6, textAlign: 'center' }}>Pattern Quiz</div>
            <div style={{ fontSize: 15, color: C.text, fontWeight: 700, marginBottom: 20, lineHeight: 1.5, textAlign: 'center' }}>What type of pattern is <span style={{ color: currentPattern.color }}>{currentPattern.name}</span>?</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {['Bullish Reversal', 'Bearish Reversal', 'Bullish Continuation', 'Bearish Continuation'].map(opt => {
                const correct = currentPattern.type.includes(opt.split(' ')[0]) && currentPattern.type.includes(opt.split(' ')[1]);
                return (
                  <button key={opt} onClick={() => {
                    if (correct) { setQuizAnswer('correct'); addXP(currentPattern.xp); doQuest(3); setTimeout(() => { setQuizActive(false); setQuizAnswer(null); }, 1200); }
                    else { setQuizAnswer('wrong'); setTimeout(() => setQuizAnswer(null), 600); }
                  }} style={{ padding: '16px', background: quizAnswer === 'correct' && correct ? C.green + '15' : '#080c12', border: `1px solid ${quizAnswer === 'correct' && correct ? C.green : C.border}`, borderRadius: 10, color: C.text, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
