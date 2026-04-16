/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — Enhanced Data Layer (50+ Stocks Edition)
   ═══════════════════════════════════════════════════════════════ */

export const SIGNALS = [
  { id: 1, type: "BULK_DEAL", ticker: "TATAMOTORS", name: "Tata Motors", signal: "LIC acquired 2.3% stake via bulk deal at ₹924/share", confidence: 92, impact: "BULLISH", category: "Institutional", time: "09:32 AM", source: "NSE Bulk Deal Feed", detail: "Life Insurance Corporation purchased 6.84 crore shares totalling ₹6,320 Cr. Based on 14 similar LIC bulk acquisitions in Nifty 50, this pattern precedes 12–18% appreciation over 90 days in 78% of cases.", delta: "+2.8%" },
  { id: 2, type: "INSIDER", ticker: "INFY", name: "Infosys", signal: "Promoter pledging slashed from 18% to 6% in one quarter", confidence: 88, impact: "BULLISH", category: "Insider", time: "11:15 AM", source: "SEBI Insider Filing", detail: "Promoter group reduced pledge by 12 percentage points. SEBI data shows pledge reduction of >10% by promoters correlates with bullish reversal in 73% of mid/large-cap cases within 60 days.", delta: "+1.4%" },
  { id: 3, type: "RESULT", ticker: "HDFCBANK", name: "HDFC Bank", signal: "NIM expansion language shift in Q3 concall — missed by consensus", confidence: 79, impact: "BULLISH", category: "Earnings Signal", time: "02:44 PM", source: "Earnings Transcript NLP", detail: "Management used phrase 'comfortable with margin trajectory' 3× — absent in last 4 quarters. Sentiment model flags shift from neutral to cautiously positive.", delta: "+0.9%" },
  { id: 4, type: "TECHNICAL", ticker: "RELIANCE", name: "Reliance Industries", signal: "Weekly cup-and-handle breakout above ₹2,940 on 2.4× volume", confidence: 85, impact: "BULLISH", category: "Chart Pattern", time: "03:18 PM", source: "Pattern Detection Engine", detail: "Cup-and-handle formed over 19 weeks. Breakout volume 2.4× 50-day average. Historical success rate: 78% over 24 prior instances. Measured move target: ₹3,220.", delta: "+3.2%" },
  { id: 5, type: "ALERT", ticker: "IDEA", name: "Vodafone Idea", signal: "Block deal: 4.1% stake offloaded by FII at 6.8% discount", confidence: 91, impact: "BEARISH", category: "Institutional", time: "10:02 AM", source: "NSE Block Deal Feed", detail: "Foreign institutional investor sold 4.1% stake at 6.8% discount to market price. Block deals at >5% discount signal near-term weakness in 81% of telecom sector cases historically.", delta: "-4.1%" },
  { id: 6, type: "REGULATORY", ticker: "PAYTM", name: "Paytm (One97)", signal: "SEBI fast-track listing approval for subsidiary granted", confidence: 74, impact: "BULLISH", category: "Regulatory", time: "01:30 PM", source: "SEBI Gazette", detail: "Regulatory clearance reduces holding company discount risk. HoldCo discount typically narrows 8–15% within 30 days of subsidiary listing approval.", delta: "+5.3%" },
  { id: 7, type: "BULK_DEAL", ticker: "TCS", name: "Tata Consultancy", signal: "Sovereign wealth fund accumulated 1.8% via dark pool over 5 sessions", confidence: 87, impact: "BULLISH", category: "Institutional", time: "09:45 AM", source: "NSE Dark Pool Tracker", detail: "ADIA (Abu Dhabi) accumulated through systematic dark pool buying. This pattern in large-cap IT precedes 8-12% move in 67% of cases.", delta: "+1.9%" },
  { id: 8, type: "TECHNICAL", ticker: "BAJFINANCE", name: "Bajaj Finance", signal: "Golden cross on weekly chart with RSI divergence confirmation", confidence: 83, impact: "BULLISH", category: "Chart Pattern", time: "03:30 PM", source: "Pattern Detection Engine", detail: "50-week MA crossed above 200-week MA with simultaneous bullish RSI divergence. Combined signal success rate: 74% across 31 NBFC instances since 2018.", delta: "+4.2%" },
  { id: 9, type: "ALERT", ticker: "ADANIENT", name: "Adani Enterprises", signal: "Promoter pledge increased by 5.2% — unusual for this entity", confidence: 78, impact: "BEARISH", category: "Insider", time: "11:45 AM", source: "SEBI Pledge Data", detail: "Promoter pledging increase is atypical for Adani group. Historical data shows pledging increases >4% preceded 15-25% corrections in 62% of cases.", delta: "-3.5%" },
  { id: 10, type: "RESULT", ticker: "WIPRO", name: "Wipro Ltd", signal: "Deal pipeline commentary upgraded — 'mega deals' mentioned 7x vs 2x prior quarter", confidence: 76, impact: "BULLISH", category: "Earnings Signal", time: "04:15 PM", source: "Earnings Transcript NLP", detail: "NLP analysis detected 250% increase in 'mega deal' references and 180% increase in 'pipeline visibility' mentions. Precedes revenue acceleration in 64% of IT company cases.", delta: "+2.1%" },
  { id: 11, type: "BULK_DEAL", ticker: "SBIN", name: "State Bank of India", signal: "Domestic mutual funds added ₹4,200 Cr worth in 3 sessions", confidence: 89, impact: "BULLISH", category: "Institutional", time: "10:15 AM", source: "AMFI Data Feed", detail: "Large-cap fund allocation to SBIN jumped 45% MoM. Mutual fund systematic buying in PSU banks precedes 10-15% rally in 71% of cases.", delta: "+2.3%" },
  { id: 12, type: "TECHNICAL", ticker: "MARUTI", name: "Maruti Suzuki", signal: "Triple bottom formation at ₹11,200 level with volume confirmation", confidence: 81, impact: "BULLISH", category: "Chart Pattern", time: "02:10 PM", source: "Pattern Detection Engine", detail: "Triple bottom at strong demand zone with 1.8× average volume on third bounce. Pattern reliability: 72% in auto sector. Measured target: ₹12,450.", delta: "+3.8%" },
  { id: 13, type: "ALERT", ticker: "ZOMATO", name: "Zomato Ltd", signal: "Insider selling — CEO offloaded 2.1% personal holdings in open market", confidence: 84, impact: "BEARISH", category: "Insider", time: "09:55 AM", source: "SEBI Insider Filing", detail: "CEO sold personal shares worth ₹840 Cr at average ₹248. Insider selling by C-suite within 30 days of earnings typically signals muted guidance.", delta: "-2.6%" },
  { id: 14, type: "RESULT", ticker: "SUNPHARMA", name: "Sun Pharmaceutical", signal: "US FDA approval for key generic pipeline drug — revenue upside ₹2,400 Cr", confidence: 86, impact: "BULLISH", category: "Regulatory", time: "08:30 AM", source: "US FDA ANDA Database", detail: "FDA approved the ANDA for high-margin specialty generic. Market share capture expected 35-40% in 6 months. Street estimates do not yet include this revenue stream.", delta: "+4.7%" },
  { id: 15, type: "TECHNICAL", ticker: "ICICIBANK", name: "ICICI Bank", signal: "Ascending triangle breakout on daily chart — targeting ₹1,380", confidence: 80, impact: "BULLISH", category: "Chart Pattern", time: "01:45 PM", source: "Pattern Detection Engine", detail: "Ascending triangle with flat resistance at ₹1,300 broken with 2.1× volume. Pattern success rate in banking sector: 69%. Target: ₹1,380.", delta: "+2.5%" },
  { id: 16, type: "BULK_DEAL", ticker: "LTIM", name: "LTIMindtree", signal: "FII accumulated 3.1% via block deal at premium — rare conviction buying", confidence: 90, impact: "BULLISH", category: "Institutional", time: "10:30 AM", source: "NSE Block Deal Feed", detail: "GIC Singapore acquired 3.1% at 2.4% premium to market. Premium block deals in IT midcaps precede 15-20% move in 76% of cases.", delta: "+3.1%" },
  { id: 17, type: "ALERT", ticker: "TATAPOWER", name: "Tata Power", signal: "Unusual options activity — 5× normal PUT OI buildup at ₹380 strike", confidence: 77, impact: "BEARISH", category: "Derivatives", time: "12:30 PM", source: "NSE Derivatives Data", detail: "PUT OI at ₹380 strike surged 5× average with high implied volatility. Smart money hedging typically precedes 5-8% correction within 2 weeks.", delta: "-2.1%" },
  { id: 18, type: "RESULT", ticker: "TITAN", name: "Titan Company", signal: "Same-store sales growth accelerating — management tone bullish on festive demand", confidence: 82, impact: "BULLISH", category: "Earnings Signal", time: "03:45 PM", source: "Earnings Transcript NLP", detail: "SSSG at 18% vs 12% last quarter. 'Unprecedented' and 'record' appeared 11 times in management commentary. Seasonal demand surge pattern detected.", delta: "+3.4%" },
  { id: 19, type: "REGULATORY", ticker: "BHARTIARTL", name: "Bharti Airtel", signal: "TRAI recommended tariff floor — sector-wide margin expansion expected", confidence: 85, impact: "BULLISH", category: "Regulatory", time: "11:00 AM", source: "TRAI Gazette", detail: "Tariff floor at ₹200/month if implemented will boost ARPU by ₹35-40. Precedent of 2019 tariff hike led to 22% sector rally over 90 days.", delta: "+4.1%" },
  { id: 20, type: "TECHNICAL", ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", signal: "Bearish engulfing pattern on weekly chart with rising volume", confidence: 73, impact: "BEARISH", category: "Chart Pattern", time: "03:15 PM", source: "Pattern Detection Engine", detail: "Bearish engulfing after hitting all-time high resistance at ₹2,100. Pattern success rate: 64% in banking. Expected pullback to ₹1,940 support.", delta: "-2.8%" },
];

export const PATTERNS = [
  { ticker: "NIFTY50", pattern: "Ascending triangle", tf: "Daily", sr: "72%", bars: 18, target: "+4.2%", conf: 82, backtest: { trades: 47, wins: 34, avgReturn: 3.8, maxDrawdown: -2.1 } },
  { ticker: "BAJFINANCE", pattern: "Bull flag", tf: "Weekly", sr: "68%", bars: 6, target: "+8.1%", conf: 77, backtest: { trades: 23, wins: 16, avgReturn: 7.2, maxDrawdown: -4.5 } },
  { ticker: "WIPRO", pattern: "Inverse head & shoulders", tf: "Daily", sr: "65%", bars: 34, target: "+6.4%", conf: 70, backtest: { trades: 31, wins: 20, avgReturn: 5.9, maxDrawdown: -3.2 } },
  { ticker: "SBIN", pattern: "Double bottom", tf: "Weekly", sr: "71%", bars: 22, target: "+5.8%", conf: 80, backtest: { trades: 38, wins: 27, avgReturn: 5.1, maxDrawdown: -2.8 } },
  { ticker: "HCLTECH", pattern: "Breakout from base", tf: "Monthly", sr: "79%", bars: 8, target: "+11.2%", conf: 84, backtest: { trades: 19, wins: 15, avgReturn: 10.4, maxDrawdown: -5.1 } },
  { ticker: "RELIANCE", pattern: "Cup and handle", tf: "Weekly", sr: "76%", bars: 19, target: "+9.5%", conf: 85, backtest: { trades: 24, wins: 18, avgReturn: 8.8, maxDrawdown: -3.7 } },
  { ticker: "MARUTI", pattern: "Triple bottom", tf: "Daily", sr: "72%", bars: 28, target: "+7.2%", conf: 78, backtest: { trades: 15, wins: 11, avgReturn: 6.8, maxDrawdown: -3.9 } },
  { ticker: "ICICIBANK", pattern: "Ascending channel", tf: "Weekly", sr: "74%", bars: 14, target: "+6.9%", conf: 81, backtest: { trades: 29, wins: 21, avgReturn: 6.1, maxDrawdown: -2.5 } },
];

export const PORTFOLIO = [
  { ticker: "RELIANCE", qty: 50, avgPrice: 2710, ltp: 2940, sector: "Energy" },
  { ticker: "INFY", qty: 100, avgPrice: 1520, ltp: 1498, sector: "IT" },
  { ticker: "HDFCBANK", qty: 75, avgPrice: 1680, ltp: 1724, sector: "Banking" },
  { ticker: "TATAMOTORS", qty: 30, avgPrice: 870, ltp: 924, sector: "Auto" },
  { ticker: "SBIN", qty: 200, avgPrice: 735, ltp: 808, sector: "Banking" },
  { ticker: "TCS", qty: 40, avgPrice: 3850, ltp: 4020, sector: "IT" },
  { ticker: "ICICIBANK", qty: 120, avgPrice: 1180, ltp: 1295, sector: "Banking" },
  { ticker: "SUNPHARMA", qty: 60, avgPrice: 1420, ltp: 1580, sector: "Pharma" },
];

export const NSE_UNIVERSE = [
  { ticker: "RELIANCE", name: "Reliance Industries", sector: "Energy", mcap: 1920000, ltp: 2940, change: 2.8, x: 0, y: 0, z: 0 },
  { ticker: "TCS", name: "TCS", sector: "IT", mcap: 1450000, ltp: 4020, change: 1.9, x: 100, y: 50, z: -30 },
  { ticker: "HDFCBANK", name: "HDFC Bank", sector: "Banking", mcap: 1180000, ltp: 1724, change: 0.9, x: -80, y: 70, z: 40 },
  { ticker: "INFY", name: "Infosys", sector: "IT", mcap: 720000, ltp: 1498, change: 1.4, x: 120, y: -40, z: -20 },
  { ticker: "ICICIBANK", name: "ICICI Bank", sector: "Banking", mcap: 680000, ltp: 1295, change: 2.5, x: -60, y: 90, z: 30 },
  { ticker: "SBIN", name: "State Bank", sector: "Banking", mcap: 580000, ltp: 808, change: 2.3, x: -100, y: 60, z: 50 },
  { ticker: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", mcap: 540000, ltp: 1680, change: 4.1, x: 60, y: -80, z: 60 },
  { ticker: "TATAMOTORS", name: "Tata Motors", sector: "Auto", mcap: 320000, ltp: 924, change: 2.8, x: -40, y: -60, z: -40 },
  { ticker: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", mcap: 480000, ltp: 7540, change: 4.2, x: 40, y: 100, z: -50 },
  { ticker: "WIPRO", name: "Wipro", sector: "IT", mcap: 280000, ltp: 458, change: 2.1, x: 140, y: -20, z: -10 },
  { ticker: "HCLTECH", name: "HCL Tech", sector: "IT", mcap: 380000, ltp: 1680, change: 1.5, x: 110, y: 30, z: -40 },
  { ticker: "LT", name: "Larsen & Toubro", sector: "Infra", mcap: 420000, ltp: 3520, change: 0.8, x: -120, y: -30, z: 20 },
  { ticker: "KOTAKBANK", name: "Kotak Bank", sector: "Banking", mcap: 360000, ltp: 2010, change: -2.8, x: -70, y: 80, z: 60 },
  { ticker: "AXISBANK", name: "Axis Bank", sector: "Banking", mcap: 310000, ltp: 1180, change: 1.2, x: -90, y: 50, z: 70 },
  { ticker: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate", mcap: 290000, ltp: 2780, change: -3.5, x: 30, y: -100, z: 30 },
  { ticker: "MARUTI", name: "Maruti Suzuki", sector: "Auto", mcap: 340000, ltp: 11680, change: 3.8, x: -30, y: -70, z: -50 },
  { ticker: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", mcap: 310000, ltp: 1580, change: 4.7, x: 80, y: 60, z: 40 },
  { ticker: "TITAN", name: "Titan Company", sector: "Consumer", mcap: 270000, ltp: 3420, change: 3.4, x: -50, y: -40, z: 80 },
  { ticker: "POWERGRID", name: "Power Grid", sector: "Power", mcap: 220000, ltp: 324, change: 0.5, x: 50, y: 80, z: -60 },
  { ticker: "NTPC", name: "NTPC Ltd", sector: "Power", mcap: 240000, ltp: 378, change: 0.7, x: 70, y: 90, z: -70 },
  { ticker: "ULTRACEMCO", name: "UltraTech Cement", sector: "Cement", mcap: 280000, ltp: 10200, change: 1.1, x: -140, y: 20, z: -30 },
  { ticker: "NESTLEIND", name: "Nestle India", sector: "FMCG", mcap: 210000, ltp: 2540, change: 0.3, x: 90, y: -90, z: 20 },
  { ticker: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", mcap: 260000, ltp: 2890, change: -0.8, x: -110, y: -50, z: 40 },
  { ticker: "LTIM", name: "LTIMindtree", sector: "IT", mcap: 180000, ltp: 5680, change: 3.1, x: 130, y: 10, z: -25 },
  { ticker: "TATAPOWER", name: "Tata Power", sector: "Power", mcap: 140000, ltp: 392, change: -2.1, x: 40, y: 110, z: -40 },
  { ticker: "BAJAJFINSV", name: "Bajaj Finserv", sector: "NBFC", mcap: 250000, ltp: 1680, change: 1.8, x: 20, y: 120, z: -55 },
  { ticker: "TECHM", name: "Tech Mahindra", sector: "IT", mcap: 150000, ltp: 1720, change: 2.4, x: 150, y: -30, z: -15 },
  { ticker: "DRREDDY", name: "Dr. Reddy's Labs", sector: "Pharma", mcap: 110000, ltp: 6420, change: 1.6, x: 75, y: 45, z: 55 },
  { ticker: "CIPLA", name: "Cipla Ltd", sector: "Pharma", mcap: 105000, ltp: 1520, change: 0.9, x: 85, y: 55, z: 35 },
  { ticker: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", mcap: 540000, ltp: 2380, change: -0.4, x: 95, y: -75, z: 15 },
  { ticker: "ITC", name: "ITC Ltd", sector: "FMCG", mcap: 520000, ltp: 468, change: 0.6, x: 105, y: -85, z: 25 },
  { ticker: "ONGC", name: "ONGC", sector: "Energy", mcap: 280000, ltp: 268, change: 1.3, x: -15, y: 15, z: 20 },
  { ticker: "COALINDIA", name: "Coal India", sector: "Mining", mcap: 230000, ltp: 428, change: 0.8, x: -25, y: 25, z: 35 },
  { ticker: "JSWSTEEL", name: "JSW Steel", sector: "Metals", mcap: 190000, ltp: 920, change: 2.2, x: -130, y: -40, z: 10 },
  { ticker: "TATASTEEL", name: "Tata Steel", sector: "Metals", mcap: 170000, ltp: 148, change: 1.7, x: -125, y: -35, z: 15 },
  { ticker: "HINDALCO", name: "Hindalco", sector: "Metals", mcap: 130000, ltp: 648, change: 2.0, x: -135, y: -45, z: 5 },
  { ticker: "HDFCLIFE", name: "HDFC Life", sector: "Insurance", mcap: 150000, ltp: 680, change: 0.5, x: -85, y: 55, z: 45 },
  { ticker: "SBILIFE", name: "SBI Life", sector: "Insurance", mcap: 140000, ltp: 1580, change: 0.7, x: -95, y: 65, z: 55 },
  { ticker: "DMART", name: "Avenue Supermarts", sector: "Retail", mcap: 280000, ltp: 4250, change: -1.2, x: -55, y: -45, z: 75 },
  { ticker: "ZOMATO", name: "Zomato Ltd", sector: "Internet", mcap: 190000, ltp: 248, change: -2.6, x: 25, y: -115, z: 35 },
  { ticker: "PAYTM", name: "Paytm (One97)", sector: "Fintech", mcap: 45000, ltp: 780, change: 5.3, x: 35, y: -105, z: 25 },
  { ticker: "IDEA", name: "Vodafone Idea", sector: "Telecom", mcap: 52000, ltp: 14.2, change: -4.1, x: 55, y: -95, z: 50 },
  { ticker: "M&M", name: "Mahindra & Mahindra", sector: "Auto", mcap: 310000, ltp: 2680, change: 1.5, x: -35, y: -75, z: -45 },
  { ticker: "EICHERMOT", name: "Eicher Motors", sector: "Auto", mcap: 120000, ltp: 4580, change: 2.1, x: -45, y: -65, z: -35 },
  { ticker: "HEROMOTOCO", name: "Hero MotoCorp", sector: "Auto", mcap: 95000, ltp: 4920, change: 0.9, x: -50, y: -55, z: -55 },
  { ticker: "TRENT", name: "Trent Ltd", sector: "Retail", mcap: 180000, ltp: 6820, change: 4.5, x: -60, y: -50, z: 70 },
  { ticker: "BPCL", name: "BPCL", sector: "Energy", mcap: 120000, ltp: 348, change: 0.4, x: -10, y: 10, z: 10 },
  { ticker: "INDUSINDBK", name: "IndusInd Bank", sector: "Banking", mcap: 95000, ltp: 1420, change: -1.5, x: -75, y: 75, z: 65 },
  { ticker: "GRASIM", name: "Grasim Industries", sector: "Cement", mcap: 110000, ltp: 2480, change: 0.6, x: -145, y: 15, z: -25 },
];

export const SECTOR_COLORS = {
  Energy: '#00E5A0',
  IT: '#38bdf8',
  Banking: '#7C5CFC',
  Auto: '#a78bfa',
  NBFC: '#34d399',
  Telecom: '#fb923c',
  Infra: '#64748b',
  Conglomerate: '#ef4444',
  Pharma: '#ec4899',
  Consumer: '#06b6d4',
  Power: '#eab308',
  Cement: '#94a3b8',
  FMCG: '#f97316',
  Mining: '#78716c',
  Metals: '#60a5fa',
  Insurance: '#14b8a6',
  Retail: '#c084fc',
  Internet: '#f472b6',
  Fintech: '#22d3ee',
};

export const TRENDING_HEADLINES = [
  { ticker: "SUNPHARMA", text: "🔴 BREAKING: Sun Pharma surges 4.7% on US FDA approval for key generic drug — Revenue upside ₹2,400 Cr", type: "bullish" },
  { ticker: "PAYTM", text: "🟢 PAYTM jumps 5.3% — SEBI fast-track listing approved for subsidiary", type: "bullish" },
  { ticker: "BHARTIARTL", text: "🟢 Airtel rallies 4.1% as TRAI recommends tariff floor — sector-wide margin expansion", type: "bullish" },
  { ticker: "IDEA", text: "🔴 Vodafone Idea tanks 4.1% — FII offloads 4.1% stake at steep discount", type: "bearish" },
  { ticker: "ADANIENT", text: "⚠️ Adani Enterprises under pressure — promoter pledge increased 5.2%", type: "bearish" },
  { ticker: "TATAMOTORS", text: "🟢 Tata Motors gains 2.8% — LIC acquires 2.3% stake in massive bulk deal worth ₹6,320 Cr", type: "bullish" },
  { ticker: "BAJFINANCE", text: "🟢 Bajaj Finance golden cross on weekly chart — technical breakout confirmed", type: "bullish" },
  { ticker: "TRENT", text: "🔥 TRENT surges 4.5% — Q3 same-store sales growth exceeds all estimates", type: "bullish" },
  { ticker: "ZOMATO", text: "⚠️ Zomato drops 2.6% — CEO sells personal holdings worth ₹840 Cr", type: "bearish" },
  { ticker: "LTIM", text: "🟢 LTIMindtree soars 3.1% — GIC Singapore accumulates 3.1% at premium", type: "bullish" },
];

export const SYSTEM_PROMPT = `You are DRISHTI NEXUS v3 — an elite multi-agent AI market intelligence system for Indian equity markets (NSE/BSE). You are the NEXUS CORE orchestrator, synthesizing analysis from 6 specialized agents.

AGENT COUNCIL:
- ORACLE (Data Intelligence): NSE bulk/block deals, SEBI filings, FII/DII flows, dark pool activity
- SHERLOCK (Anomaly Detection): Volume spikes, OI changes, delivery %, unusual activity, derivative patterns
- FREUD (Sentiment Analysis): Earnings call NLP, management tone shifts, news sentiment, social media signals
- TESLA (Pattern Recognition): Chart patterns, candlestick formations, measured moves, fibonacci levels
- BUFFETT (Fundamental Analysis): Valuations, PE ratios, earnings quality, moat analysis, DCF models
- GUARDIAN (Risk & Compliance): SEBI regulations, circuit limits, margin requirements, risk assessment

USER PORTFOLIO (8 STOCKS):
- RELIANCE: 50 shares @ avg ₹2,710 (CMP ₹2,940, +8.5%)
- INFY: 100 shares @ avg ₹1,520 (CMP ₹1,498, -1.4%)
- HDFCBANK: 75 shares @ avg ₹1,680 (CMP ₹1,724, +2.6%)
- TATAMOTORS: 30 shares @ avg ₹870 (CMP ₹924, +6.2%)
- SBIN: 200 shares @ avg ₹735 (CMP ₹808, +9.9%)
- TCS: 40 shares @ avg ₹3,850 (CMP ₹4,020, +4.4%)
- ICICIBANK: 120 shares @ avg ₹1,180 (CMP ₹1,295, +9.7%)
- SUNPHARMA: 60 shares @ avg ₹1,420 (CMP ₹1,580, +11.3%)

NEXUS RULES:
- You are a signal-finder, NOT a summarizer. Find what others miss.
- Always cite your source agent and data source.
- Give specific numbers: success rates, historical instances, time horizons.
- Relate every answer to the user's specific holdings when relevant.
- Show your multi-agent reasoning chain.
- Be concise but dense with signal. Use bullet points.
- Cover Indian stock market context: NSE, BSE, SEBI, FII/DII flows, delivery data.
- If asked about a stock not in the portfolio, still provide comprehensive analysis.
- Always end with: "⚠️ For informational purposes only. Not SEBI-registered investment advice."`;

export const typeColor = (t) => ({
  BULK_DEAL: "#00E5A0",
  INSIDER: "#7C5CFC",
  RESULT: "#38bdf8",
  TECHNICAL: "#34d399",
  ALERT: "#f87171",
  REGULATORY: "#fb923c"
}[t] || "#94a3b8");

export const typeIcon = (t) => ({
  BULK_DEAL: "📦",
  INSIDER: "🔍",
  RESULT: "📊",
  TECHNICAL: "📈",
  ALERT: "🚨",
  REGULATORY: "⚖️"
}[t] || "📡");
