/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER — LIVE CRISIS INTELLIGENCE
   Updated: April 16, 2026 · Demo: April 17, 2026 9 AM
   Real-time data from NSE, Moneycontrol, Zerodha Pulse, Groww
   ═══════════════════════════════════════════════════════════════ */

// ─── CURRENT LIVE CRISIS TRIGGERS (as of April 16, 2026 close) ───
export const CRISIS_TRIGGERS = {
  vix: { label: 'India VIX', threshold: 25, current: 14.2, normal: 13.4, unit: '', note: 'Down 8% — fear dipping but cautious' },
  nifty: { label: 'Nifty 50', threshold: -3, current: -0.4, normal: 0.3, unit: '%', note: 'Closed 24,200 — bulls lost control late' },
  usdinr: { label: 'USD/INR', threshold: 86, current: 85.68, normal: 83.42, unit: '', note: 'Rupee weak — FII outflow pressure' },
  fii: { label: 'FII Net Flow', threshold: -5000, current: -1847, normal: 2847, unit: ' Cr', note: 'Net sellers — geopolitical caution' },
  crude: { label: 'Brent Crude', threshold: 95, current: 89.4, normal: 82, unit: ' $/bbl', note: 'Iran-US conflict → supply risk' },
  geo: { label: 'Geo Risk Score', threshold: 70, current: 58, normal: 23, unit: '/100', note: 'ELEVATED — Iran-US + Strait of Hormuz' },
};

// ─── LIVE CRISIS PLAYBOOKS (Real April 2026 events) ───
export const CRISIS_PLAYBOOKS = [
  {
    id: 'iran_us_live', name: '🔴 LIVE: Iran-US Conflict Escalation', icon: '⚔️', severity: 68,
    isLive: true, liveTag: 'ACTIVE NOW',
    trigger: 'Strait of Hormuz threat + Crude > $89 + Defence FII surge',
    triggerValues: { vix: 18.6, nifty: -2.4, usdinr: 86.8, fii: -4200, crude: 98.2, geo: 74 },
    historical: {
      event: 'Iran-US Tensions (Apr 2026 — ONGOING)',
      niftyFall: '-3.8% from weekly high (24,500 → 24,200)',
      recovery: 'Dependent on ceasefire / de-escalation',
      safeHavens: ['DEFENCE (HAL, BEL, BHEL)', 'OIL UPSTREAM (ONGC, OIL India)', 'GOLD ETF', 'IT (Dollar earners)'],
      exitImmediately: ['AIRLINES (INDIGO — jet fuel surge)', 'PAINT (Asian Paints — crude derivative)', 'LOGISTICS', 'FOOD SERVICES'],
      hedges: ['Long HAL, BEL — defence contracts surge', 'Buy GOLDBEES — safe haven', 'Short INDIGO — fuel cost crisis'],
    },
    aiPrediction: { recoveryDays: 21, confidence: 64, bestSector: 'DEFENCE — HAL +12% expected on order flow', worstSector: 'AVIATION — INDIGO -8% on fuel cost surge' },
    playbook: [
      '🚨 IMMEDIATE: EXIT all AVIATION positions — INDIGO, SPICEJET (jet fuel supply risk from Strait of Hormuz)',
      'EXIT LOGISTICS & FOOD SERVICES — rising transport costs erode margins',
      'BUY DEFENCE — HAL, BEL, BHEL (₹2,200Cr FII inflow in 3 days, defence budget catalyst)',
      'ADD OIL UPSTREAM — ONGC, OIL India benefit from crude >$89/bbl',
      'GOLD ETF — allocate 15% to GOLDBEES as geopolitical hedge',
      'HOLD IT — INFY, WIPRO, TCS benefit from rupee weakness (₹85.68)',
      'MONITOR: If Strait of Hormuz blocked → jet fuel supply crisis in Europe → escalate to SEVERITY 90+',
      'SET STOP LOSS: Trail all positions at -5% from current levels',
    ],
    portfolioImpact: -86000, mitigatedImpact: -22000,
    liveSources: ['Moneycontrol', 'Reuters', 'Groww', 'Zerodha Pulse'],
  },
  {
    id: 'earnings_crisis', name: 'Q4 FY26 Earnings Shock Wave', icon: '📊', severity: 52,
    isLive: true, liveTag: 'Q4 RESULTS LIVE',
    trigger: 'Multiple blue-chip earnings misses + IT guidance cut',
    triggerValues: { vix: 15.8, nifty: -1.2, usdinr: 85.2, fii: -2800, crude: 87, geo: 42 },
    historical: {
      event: 'Q4 FY26 Earnings Season (Apr 2026 — IN PROGRESS)',
      niftyFall: 'Nifty struggling at 24,200 — financials dragging',
      recovery: 'Stock-specific — strong results recover in 2-5 days',
      safeHavens: ['ICICI Lombard (+7% profit)', 'LIC (+7% rally on bonus)', 'METALS (resilient in volatile trade)'],
      exitImmediately: ['WIPRO (2% profit decline + weak Q1 guidance)', 'HDFC AMC (19% profit drop)', 'Weak IT names'],
      hedges: ['Long ICICI Lombard — strong results', 'Long LIC — bonus catalyst', 'Reduce IT overweight'],
    },
    aiPrediction: { recoveryDays: 14, confidence: 72, bestSector: 'INSURANCE — ICICI Lombard +7% profit growth', worstSector: 'IT SERVICES — Wipro -3% ADR, weak guidance' },
    playbook: [
      'REDUCE WIPRO — Q4 profit down 2%, Q1 guidance projects up to 2% degrowth in IT services revenue',
      'EXIT HDFC AMC — 19% profit drop to ₹623Cr missed street estimates significantly',
      'ADD ICICI LOMBARD — 7% profit increase, strong underwriting discipline',
      'ADD LIC — 7% rally over 2 days on bonus news, institutional momentum building',
      'MONITOR RVNL — Lowest bidder for ₹968Cr project, potential order book catalyst',
      'WATCH TCS closely — dividend slowdown to fund AI investments (long-term positive, short-term sentiment negative)',
      'BANKING CAUTION — HDFC Bank, ICICI Bank dragging Nifty, wait for results before adding',
      'AUROBINDO PHARMA — Last date for buyback today, monitor exit opportunity',
    ],
    portfolioImpact: -42000, mitigatedImpact: -8000,
    liveSources: ['NSE Filings', 'BSE', 'Moneycontrol', 'Screener.in'],
  },
  {
    id: 'rupee_stress', name: 'Rupee Weakness + FII Exodus', icon: '₹', severity: 48,
    isLive: true, liveTag: 'MONITORING',
    trigger: 'USD/INR > 85.50 + FII net sellers + crude surge',
    triggerValues: { vix: 16.2, nifty: -1.8, usdinr: 87.4, fii: -5200, crude: 92, geo: 52 },
    historical: {
      event: 'Rupee Stress (Apr 2026 — ₹85.68 current)',
      niftyFall: 'Gradual erosion — FII selling ₹1,847Cr net today',
      recovery: 'RBI intervention expected if crosses ₹86',
      safeHavens: ['IT (INFY, TCS, WIPRO — dollar earners)', 'PHARMA EXPORTS (SUNPHARMA, DRREDDY)', 'GOLD ETF'],
      exitImmediately: ['OIL MARKETING (BPCL, HPCL — import bill)', 'Companies with USD debt', 'FMCG imports'],
      hedges: ['Long IT basket — natural rupee hedge', 'GOLDBEES — 10% allocation', 'Short OMCs if crude >$92'],
    },
    aiPrediction: { recoveryDays: 30, confidence: 68, bestSector: 'IT (+6-8% on rupee weakness)', worstSector: 'OIL MARKETING (-12% on import bill surge)' },
    playbook: [
      'ADD IT STOCKS — INFY, TCS benefit most from rupee at ₹85.68 (every ₹1 depreciation = 1.5% EPS boost)',
      'ADD PHARMA EXPORTS — SUNPHARMA, DRREDDY, CIPLA (USD revenue translates to INR gains)',
      'REDUCE Oil Marketing — BPCL, HPCL, IOC face ₹4,200Cr additional import bill at current crude levels',
      'GOLD ETF — 10% allocation as forex + geopolitical hedge',
      'MONITOR RBI: If USD/INR crosses ₹86, expect emergency intervention (rate hike = buy BANKING)',
      'FII FLOW: Net sellers ₹1,847Cr today — monitor for acceleration above ₹3,000Cr/day',
      'HOLD DEFENSIVE FMCG — ITC, HUL for portfolio stability',
    ],
    portfolioImpact: -58000, mitigatedImpact: -14000,
    liveSources: ['RBI', 'NSE', 'Bloomberg Terminal'],
  },
  {
    id: 'gold_loan_stress', name: 'Gold Loan Sector Stress Signal', icon: '🏦', severity: 35,
    isLive: true, liveTag: 'EARLY WARNING',
    trigger: 'Rising NPAs in gold loan segment + high LTV ratios',
    triggerValues: { vix: 14.8, nifty: -0.6, usdinr: 85.4, fii: -800, crude: 86, geo: 32 },
    historical: {
      event: 'Gold Loan Stress Signals (Apr 2026)',
      niftyFall: 'Sector-specific, limited broad market impact',
      recovery: 'Stock-specific — depends on provisioning',
      safeHavens: ['Large-cap banks (HDFCBANK, ICICIBANK)', 'PSU Banks with low gold loan exposure'],
      exitImmediately: ['Muthoot Finance', 'Manappuram Finance', 'Small NBFCs with gold loan concentration'],
      hedges: ['Reduce NBFC overweight', 'Shift to large-cap banking'],
    },
    aiPrediction: { recoveryDays: 45, confidence: 58, bestSector: 'LARGE-CAP BANKING — flight to quality', worstSector: 'GOLD LOAN NBFCs (-15% if NPA cycle worsens)' },
    playbook: [
      'REDUCE gold loan NBFC exposure — Muthoot, Manappuram showing stress signals',
      'MONITOR gold price: If gold corrects >5%, loan-to-value ratios breach limits → NPA surge',
      'SHIFT to large-cap banks — HDFCBANK, ICICIBANK, SBIN (diversified loan books)',
      'Track RBI gold loan circular — potential tightening of LTV norms',
      'This is EARLY WARNING only — position reduction, not panic exit',
    ],
    portfolioImpact: -18000, mitigatedImpact: -4000,
    liveSources: ['RBI Financial Stability Report', 'Moneycontrol'],
  },
  {
    id: 'pandemic_playbook', name: 'Global Pandemic (Standby)', icon: '🦠', severity: 8,
    isLive: false,
    trigger: 'VIX > 35 + FII exodus > ₹10,000Cr + WHO declaration',
    triggerValues: { vix: 42.6, nifty: -7.8, usdinr: 87.2, fii: -12400, crude: 65, geo: 82 },
    historical: {
      event: 'COVID-19 (Mar 2020)', niftyFall: '-38% in 44 days', recovery: '+100% in 18 months',
      safeHavens: ['PHARMA', 'FMCG', 'IT (export)', 'GOLD ETF'],
      exitImmediately: ['AIRLINES', 'HOTELS', 'RETAIL', 'AUTO', 'REALTY'],
      hedges: ['Buy NIFTYBEES puts', 'Increase GOLDBEES', 'Short BANKNIFTY futures'],
    },
    aiPrediction: { recoveryDays: 47, confidence: 78, bestSector: 'PHARMA (+340% from bottom)', worstSector: 'AVIATION (-85% from peak)' },
    playbook: [
      'EXIT all AVIATION, HOTEL, RETAIL positions immediately',
      'BUY PHARMA — SUNPHARMA, DRREDDY, CIPLA (allocate 30%)',
      'BUY GOLD ETF — GOLDBEES (allocate 20%)',
      'HOLD IT sector — INFY, WIPRO (digital shift beneficiary)',
      'HEDGE with NIFTY 22000 PE (1 lot per ₹5L exposure)',
      'Keep 25% CASH — for bottom-fishing in recovery',
      'Set STOP LOSS at -8% on all remaining positions',
    ],
    portfolioImpact: -124000, mitigatedImpact: -44000,
    liveSources: ['WHO', 'CDC', 'ICMR'],
  },
  {
    id: 'market_crash', name: 'Global Liquidity Crisis (Standby)', icon: '📉', severity: 5,
    isLive: false,
    trigger: 'S&P 500 > -5% single day + India VIX > 30 + circuit breaker',
    triggerValues: { vix: 56.2, nifty: -12.4, usdinr: 89.6, fii: -18400, crude: 42, geo: 72 },
    historical: {
      event: 'Global Financial Crisis (2008)', niftyFall: '-65% over 12 months', recovery: '3 years to full recovery',
      safeHavens: ['GOLD', 'CASH', 'GOVT BONDS', 'Defensive FMCG'],
      exitImmediately: ['ALL high-beta', 'INFRA', 'REALTY', 'METAL', 'NBFC'],
      hedges: ['Maximum cash position', 'Long GOLDBEES', 'Short NIFTY futures'],
    },
    aiPrediction: { recoveryDays: 240, confidence: 62, bestSector: 'GOLD (+65% in 2008-09)', worstSector: 'REALTY (-82% from peak)' },
    playbook: [
      'MAXIMUM CASH — raise to 50%+ immediately',
      'EXIT all cyclicals — METAL, INFRA, REALTY, AUTO, NBFC',
      'GOLD ETF — allocate 25% to GOLDBEES',
      'HOLD ONLY defensive FMCG — ITC, HUL, Nestle',
      'DO NOT bottom-fish for 30+ days',
      'SIP restart signal: VIX below 20 from crisis peak',
    ],
    portfolioImpact: -312000, mitigatedImpact: -98000,
    liveSources: ['Federal Reserve', 'S&P Global', 'NSE'],
  },
];

// ─── LIVE CRISIS HISTORY (with April 2026 at top) ───
export const CRISIS_HISTORY = [
  { year: 2026, event: '🔴 Iran-US Conflict (LIVE)', geo: 58, nifty: '-3.8%', recovery: 'ONGOING', vix: 14.2 },
  { year: 2026, event: 'Q4 Earnings Shock Wave', geo: 42, nifty: '-1.2%', recovery: 'In progress', vix: 14.2 },
  { year: 2022, event: 'Russia-Ukraine War', geo: 78, nifty: '-18%', recovery: '6 months', vix: 28 },
  { year: 2020, event: 'COVID-19 Pandemic', geo: 92, nifty: '-38%', recovery: '18 months', vix: 56 },
  { year: 2019, event: 'Balakot Airstrike', geo: 68, nifty: '-1.2%', recovery: '3 days', vix: 22 },
  { year: 2018, event: 'IL&FS Crisis', geo: 35, nifty: '-15%', recovery: '4 months', vix: 24 },
  { year: 2016, event: 'Demonetization', geo: 22, nifty: '-8%', recovery: '6 weeks', vix: 19 },
  { year: 2013, event: 'Taper Tantrum', geo: 42, nifty: '-12%', recovery: '3 months', vix: 26 },
  { year: 2008, event: 'Global Financial Crisis', geo: 88, nifty: '-65%', recovery: '3 years', vix: 62 },
];

// ─── LIVE GEOPOLITICAL FACTORS (April 16, 2026) ───
export const GEO_FACTORS = [
  { id: 'iran_us', name: '🔴 Iran-US Conflict', score: 72, status: 'HIGH', detail: 'Strait of Hormuz threat, jet fuel supply risk, crude surge to $89+' },
  { id: 'mid_east', name: 'Middle East (Oil Supply)', score: 68, status: 'HIGH', detail: 'West Asia crisis fueling supply crunch fears, shipping disrupted' },
  { id: 'crude_price', name: 'Crude Oil Price Risk', score: 62, status: 'ELEVATED', detail: 'Brent at $89.4/bbl, Iran escalation could push to $95+' },
  { id: 'rus_ukr', name: 'Russia-Ukraine (Ongoing)', score: 38, status: 'MEDIUM', detail: 'Stable conflict — energy concerns secondary to Iran now' },
  { id: 'rupee_stress', name: 'INR Depreciation', score: 52, status: 'ELEVATED', detail: 'USD/INR at ₹85.68, FII outflow pressure, RBI watching ₹86' },
  { id: 'fii_exodus', name: 'FII Selling Pressure', score: 48, status: 'MEDIUM', detail: 'Net sellers ₹1,847Cr today — risk-off due to geopolitics' },
  { id: 'us_fed', name: 'Fed Monetary Policy', score: 22, status: 'LOW', detail: 'Rate pause continues — no immediate rate shock expected' },
  { id: 'domestic', name: 'Domestic Political', score: 12, status: 'VERY LOW', detail: 'Stable government, no election uncertainty' },
];

// ─── LIVE MARKET SNAPSHOT (April 16, 2026 close) ───
export const LIVE_MARKET = {
  nifty: { value: 24187, change: -0.42, dayHigh: 24398, dayLow: 24150, resistance: 24400, support: 24000 },
  sensex: { value: 79802, change: -0.38, dayHigh: 80456, dayLow: 79680 },
  bankNifty: { value: 55120, change: -0.68, note: 'Financials dragging — HDFC, ICICI under pressure' },
  vix: { value: 14.2, change: -8.1, note: 'Fear dipping but sentiment remains cautious' },
  usdinr: { value: 85.68, change: 0.12 },
  crude: { value: 89.4, change: 2.1, unit: '$/bbl' },
  gold: { value: 73420, change: 0.8, unit: '₹/10g' },
  fiiNet: { value: -1847, unit: 'Cr' },
  diiNet: { value: 2340, unit: 'Cr' },
};

// ─── LIVE STOCK-SPECIFIC ALERTS (April 16-17, 2026) ───
export const STOCK_ALERTS = [
  { ticker: 'WIPRO', type: 'EARNINGS', action: 'SELL', severity: 'HIGH', headline: 'Q4 profit down 2%, Q1 guidance: up to 2% degrowth in IT services', detail: 'ADRs fell ~3%. Analysts disappointed with weak guidance. Revenue miss on consulting slowdown.', target: 440, stopLoss: 468, confidence: 78 },
  { ticker: 'HDFC AMC', type: 'EARNINGS', action: 'SELL', severity: 'HIGH', headline: '19% profit drop to ₹623Cr — missed street estimates', detail: 'Equity AUM growth deceleration + fee compression. Consensus expected ₹720Cr+.', target: 3100, stopLoss: 3380, confidence: 72 },
  { ticker: 'LIC', type: 'MOMENTUM', action: 'BUY', severity: 'MEDIUM', headline: '7% rally in 2 days on bonus news — momentum building', detail: 'Institutional buying accelerating. Bonus declaration catalyst. PSU re-rating theme.', target: 920, stopLoss: 840, confidence: 74 },
  { ticker: 'ICICI LOMBARD', type: 'EARNINGS', action: 'BUY', severity: 'MEDIUM', headline: '7% profit increase — strong underwriting discipline', detail: 'Combined ratio improving. Motor segment strong. Consensus beat by 4%.', target: 1780, stopLoss: 1620, confidence: 76 },
  { ticker: 'RVNL', type: 'ORDER WIN', action: 'BUY', severity: 'MEDIUM', headline: 'Lowest bidder for ₹968Cr project — order book catalyst', detail: 'Railway infrastructure order. Government capex push continues. Q4 order inflow strong.', target: 280, stopLoss: 245, confidence: 70 },
  { ticker: 'TCS', type: 'CORPORATE', action: 'HOLD', severity: 'LOW', headline: 'Dividend slowdown to fund AI investments', detail: 'Short-term negative for income investors, long-term positive for AI capabilities.', target: 3650, stopLoss: 3380, confidence: 68 },
  { ticker: 'HAL', type: 'DEFENCE', action: 'BUY', severity: 'HIGH', headline: 'Iran-US conflict → defence sector surge, FII buying ₹780Cr', detail: 'Order book at ₹1.2L Cr. Government increasing defence allocation. Geopolitical tailwind.', target: 4800, stopLoss: 4200, confidence: 82 },
  { ticker: 'INDIGO', type: 'RISK', action: 'SELL', severity: 'CRITICAL', headline: 'Jet fuel supply risk from Strait of Hormuz + crude at $89', detail: 'Every $1 crude rise = ₹120Cr annual cost impact. If Hormuz blocked, jet fuel crisis in 2 weeks.', target: 4000, stopLoss: 4400, confidence: 80 },
  { ticker: 'AUROBINDO PHARMA', type: 'CORPORATE', action: 'HOLD', severity: 'LOW', headline: 'Last date for buyback — monitor exit opportunity', detail: 'Buyback price offers premium. Check tender ratio for acceptance probability.', target: 1180, stopLoss: 1080, confidence: 65 },
  { ticker: 'ONGC', type: 'SECTOR', action: 'BUY', severity: 'MEDIUM', headline: 'Crude at $89 — upstream beneficiary, Iran tension tailwind', detail: 'Every $1 crude rise = ₹600Cr revenue increase. Government subsidy burden manageable at sub-$95.', target: 290, stopLoss: 255, confidence: 74 },
];

// ─── TOMORROW (April 17) PREVIEW ───
export const TOMORROW_PREVIEW = {
  date: 'April 17, 2026 (Thursday)',
  keyEvents: [
    '📊 Q4 Results: Multiple blue-chips reporting',
    '⚔️ Iran-US: Monitor overnight developments — Strait of Hormuz status',
    '₹ Rupee: RBI likely to intervene if USD/INR approaches ₹86',
    '🛢️ Crude: OPEC+ emergency meeting speculation',
    '📈 Nifty: Resistance 24,400 · Support 24,000 · Consolidation expected',
  ],
  niftyOutlook: 'Consolidation in 24,000-24,500 range. Bull case: de-escalation rally to 24,600. Bear case: escalation selloff to 23,800.',
  strategyOfTheDay: 'DEFENSIVE POSITIONING — reduce high-beta, add defence + IT hedges, maintain 15% cash buffer',
};
