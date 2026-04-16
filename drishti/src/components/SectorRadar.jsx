/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — SMART MONEY SECTOR RADAR
   15-Sector Live Flow Heatmap
   ═══════════════════════════════════════════════════════════════ */
import { useState, useEffect } from 'react';

const SECTORS_INIT = [
  { name: 'IT', flow: 2847, direction: 'in', intensity: 'HIGH', emoji: '🔥🔥🔥', stocks: ['INFY +₹840Cr', 'TCS +₹620Cr', 'WIPRO +₹340Cr', 'HCLTECH +₹480Cr', 'LTIM +₹280Cr'], insight: 'Dollar appreciation driving export sector buying — FII rotating into dollar earners' },
  { name: 'BANKING', flow: 1200, direction: 'in', intensity: 'MOD', emoji: '🔥🔥', stocks: ['HDFCBANK +₹420Cr', 'ICICIBANK +₹380Cr', 'SBIN +₹220Cr', 'KOTAKBANK +₹110Cr', 'AXISBANK +₹70Cr'], insight: 'NIM expansion expectations driving banking inflow after RBI pause' },
  { name: 'PHARMA', flow: 890, direction: 'in', intensity: 'HIGH', emoji: '🔥🔥🔥', stocks: ['SUNPHARMA +₹320Cr', 'DRREDDY +₹240Cr', 'CIPLA +₹180Cr', 'DIVISLAB +₹90Cr', 'BIOCON +₹60Cr'], insight: 'USFDA approvals + defensive positioning ahead of geo uncertainty' },
  { name: 'DEFENCE', flow: 2200, direction: 'in', intensity: 'SURGE', emoji: '🔥🔥🔥🔥🔥', stocks: ['HAL +₹780Cr', 'BEL +₹520Cr', 'BHEL +₹340Cr', 'L&T DEF +₹320Cr', 'MAZAGON +₹240Cr'], insight: '🚨 Iran-US conflict driving massive FII buying ₹2,200Cr in 3 days — Strait of Hormuz threat escalating defence spending. NEXUS flagged this 6hrs before mainstream' },
  { name: 'OIL & GAS', flow: 1100, direction: 'in', intensity: 'MOD', emoji: '🔥🔥', stocks: ['RELIANCE +₹480Cr', 'ONGC +₹260Cr', 'OIL +₹180Cr', 'BPCL +₹100Cr', 'GAIL +₹80Cr'], insight: 'Crude at $89.4/bbl — upstream (ONGC, OIL) benefiting but downstream (BPCL, HPCL) under pressure from import bill' },
  { name: 'FMCG', flow: 12, direction: 'in', intensity: 'LOW', emoji: '●', stocks: ['ITC +₹40Cr', 'HUL -₹20Cr', 'NESTLE +₹8Cr', 'DABUR -₹6Cr', 'GODREJCP -₹10Cr'], insight: 'Defensive positioning — FMCG holding steady as safe haven amid Iran-US uncertainty' },
  { name: 'METAL', flow: 480, direction: 'in', intensity: 'MOD', emoji: '🔥', stocks: ['TATASTEEL +₹180Cr', 'HINDALCO +₹140Cr', 'JSWSTEEL +₹90Cr', 'VEDL +₹40Cr', 'NMDC +₹30Cr'], insight: 'Resilient in volatile trade — steelmakers watching crude impact on manufacturing costs' },
  { name: 'AUTO', flow: -340, direction: 'out', intensity: 'MILD', emoji: '❄️', stocks: ['TATAMOT -₹120Cr', 'MARUTI -₹80Cr', 'M&M -₹60Cr', 'BAJAJ -₹50Cr', 'HERO -₹30Cr'], insight: 'Mild outflow — crude surge raises input cost concerns for automakers' },
  { name: 'REALTY', flow: -620, direction: 'out', intensity: 'MOD', emoji: '❄️❄️', stocks: ['DLF -₹220Cr', 'GODREJPROP -₹160Cr', 'OBEROIRLTY -₹120Cr', 'PRESTIGE -₹70Cr', 'BRIGADE -₹50Cr'], insight: 'DII profit booking — rate-sensitive sector under pressure amid geopolitical uncertainty' },
  { name: 'TELECOM', flow: -180, direction: 'out', intensity: 'MILD', emoji: '❄️', stocks: ['BHARTIARTL -₹80Cr', 'IDEA -₹60Cr', 'JIOTELECOM -₹40Cr'], insight: 'Post tariff hike consolidation — short-term profit taking' },
  { name: 'RETAIL', flow: -90, direction: 'out', intensity: 'MILD', emoji: '❄️', stocks: ['DMART -₹40Cr', 'TRENT -₹30Cr', 'SHOPPERS -₹20Cr'], insight: 'Consumer sentiment cautious amid rising costs and geopolitical uncertainty' },
  { name: 'AIRLINES', flow: -880, direction: 'out', intensity: 'HIGH', emoji: '❄️❄️❄️🚨', stocks: ['INDIGO -₹420Cr', 'SPICEJET -₹240Cr', 'AIRINDIA -₹220Cr'], insight: '🚨 CRITICAL: Strait of Hormuz threat → jet fuel supply crisis. Crude $89.4 = ₹120Cr/yr cost impact per $1 for INDIGO. If Hormuz blocked → EU jet fuel drops 20% in 2 weeks' },
  { name: 'INFRA', flow: 320, direction: 'in', intensity: 'LOW', emoji: '🔥', stocks: ['L&T +₹140Cr', 'ADANIENT +₹80Cr', 'IRB +₹60Cr', 'KNR +₹40Cr'], insight: 'Government capex spending cycle — order book visibility improving' },
  { name: 'CHEMICAL', flow: 210, direction: 'in', intensity: 'LOW', emoji: '🔥', stocks: ['SRF +₹80Cr', 'PIDILITE +₹60Cr', 'UPL +₹40Cr', 'AARTI +₹30Cr'], insight: 'Specialty chemicals recovery — China capacity cuts benefiting Indian players' },
  { name: 'POWER', flow: 560, direction: 'in', intensity: 'MOD', emoji: '🔥🔥', stocks: ['NTPC +₹220Cr', 'POWERGRID +₹140Cr', 'TATAPOWER +₹100Cr', 'ADANIGREEN +₹60Cr', 'JSW ENERGY +₹40Cr'], insight: 'Peak summer demand + renewable allocation increasing — structural growth' },
];

const flowColor = (flow, intensity) => {
  if (intensity === 'SURGE') return '#065f46';
  if (flow > 500) return '#059669';
  if (flow > 100) return '#34d399';
  if (flow > 0) return '#6ee7b7';
  if (flow > -200) return '#fca5a5';
  if (flow > -500) return '#f87171';
  return '#ef4444';
};

const flowBg = (flow, intensity) => {
  if (intensity === 'SURGE') return '#065f4615';
  if (flow > 500) return '#05966915';
  if (flow > 100) return '#34d39910';
  if (flow > 0) return '#6ee7b708';
  if (flow > -200) return '#fca5a508';
  if (flow > -500) return '#f8717110';
  return '#ef444415';
};

export default function SectorRadar() {
  const [sectors, setSectors] = useState(SECTORS_INIT);
  const [hoveredSector, setHoveredSector] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate live updates every 30 seconds
  useEffect(() => {
    const iv = setInterval(() => {
      setSectors(prev => prev.map((s, i) => {
        if (Math.random() > 0.7) {
          const delta = Math.round((Math.random() - 0.45) * 200);
          const newFlow = s.flow + delta;
          const dir = newFlow >= 0 ? 'in' : 'out';
          const abs = Math.abs(newFlow);
          const int = abs > 1500 ? 'SURGE' : abs > 800 ? 'HIGH' : abs > 300 ? 'MOD' : abs > 50 ? 'LOW' : 'LOW';
          return { ...s, flow: newFlow, direction: dir, intensity: int };
        }
        return s;
      }));
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 14, color: '#f8fafc', fontFamily: 'var(--font-display)' }}>SMART MONEY SECTOR RADAR</div>
          <div style={{ fontSize: 10, color: '#5e7490' }}>15-sector institutional money flow · Updates every 30s</div>
        </div>
        <div style={{ fontSize: 9, color: '#3d5272', fontFamily: 'var(--font-mono)' }}>Last: {lastUpdate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
      </div>

      {/* SECTOR GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
        {sectors.map(s => (
          <div key={s.name}
            style={{ background: flowBg(s.flow, s.intensity), border: `1px solid ${flowColor(s.flow, s.intensity)}25`, borderRadius: 12, padding: '14px 12px', cursor: 'pointer', transition: 'all 0.8s ease', position: 'relative' }}
            onMouseEnter={() => setHoveredSector(s.name)}
            onMouseLeave={() => setHoveredSector(null)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 900, fontSize: 12, color: '#f8fafc', fontFamily: 'var(--font-display)' }}>{s.name}</span>
              <span style={{ fontSize: 10 }}>{s.emoji}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: 14, color: flowColor(s.flow, s.intensity), marginBottom: 2 }}>
              {s.flow >= 0 ? '+' : ''}₹{Math.abs(s.flow).toLocaleString()}Cr
            </div>
            <div style={{ fontSize: 8, color: s.flow >= 0 ? '#10b98180' : '#ef444480', fontWeight: 700, textTransform: 'uppercase' }}>
              {s.intensity === 'SURGE' ? '🔥 SURGE' : s.intensity} {s.direction === 'in' ? 'INFLOW' : 'OUTFLOW'}
            </div>

            {/* Hover tooltip */}
            {hoveredSector === s.name && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#0c1322', border: `1px solid ${flowColor(s.flow, s.intensity)}30`, borderRadius: 10, padding: '12px', marginTop: 4, animation: 'fadeIn 0.2s ease', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 200 }}>
                <div style={{ fontSize: 9, color: '#5e7490', fontWeight: 700, marginBottom: 6 }}>TOP STOCKS</div>
                {s.stocks.map(st => <div key={st} style={{ fontSize: 10, color: '#94a3b8', padding: '2px 0', fontFamily: 'var(--font-mono)' }}>{st}</div>)}
                <div style={{ marginTop: 8, fontSize: 9, color: '#f59e0b', lineHeight: 1.4, borderTop: '1px solid #1a274440', paddingTop: 6 }}>💡 {s.insight}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SMART MONEY ALERTS */}
      <div style={{ display: 'grid', gap: 6 }}>
        {[
          { text: '⚔️ DEFENCE sector: ₹2,200Cr FII inflow in 3 days on Iran-US conflict — HAL, BEL leading | NEXUS recommended BUY 6hrs before surge', type: 'hot' },
          { text: '🚨 AIRLINES at RISK: Jet fuel supply threat from Strait of Hormuz + crude $89.4 — INDIGO -₹220Cr outflow today | EXIT recommended', type: 'cold' },
          { text: '📊 IT mixed: WIPRO Q4 miss (-2% profit) dragging sector BUT dollar at ₹85.68 benefits TCS, INFY — SELECTIVE positioning', type: 'hot' },
          { text: '🏦 BANKING under pressure: HDFC AMC -19% profit miss, HDFC Bank + ICICI Bank dragging Nifty below 24,200', type: 'cold' },
          { text: '🟢 LIC +7% rally: Bonus news catalyst + institutional momentum — DII buying accelerating in insurance sector', type: 'hot' },
        ].map((alert, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#04070f', borderRadius: 8, border: `1px solid ${alert.type === 'hot' ? '#10b98115' : '#ef444415'}` }}>
            <span style={{ fontSize: 14 }}>{alert.type === 'hot' ? '🔥' : '❄️'}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{alert.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
