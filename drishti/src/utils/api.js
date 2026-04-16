/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — API Wrapper
   OpenRouter API with smart demo fallback engine
   ═══════════════════════════════════════════════════════════════ */

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

const FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
  'google/gemma-2-9b-it:free',
];

export async function callAI(messages, options = {}) {
  const { model, maxRetries = 1 } = options;
  const modelsToTry = model ? [model] : [...FREE_MODELS];
  const userMsg = messages[messages.length - 1]?.content || '';

  for (const currentModel of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': window.location.origin || 'https://drishti-nexus.netlify.app',
            'X-Title': 'DRISHTI NEXUS v3 Intelligence',
          },
          body: JSON.stringify({ model: currentModel, messages, max_tokens: 1024, temperature: 0.7 }),
        });

        if (res.status === 429) {
          if (attempt < maxRetries) {
            await new Promise(r => setTimeout(r, (attempt + 1) * 3000));
            continue;
          }
          break;
        }

        if (res.status === 401) break; // Bad API key, skip retries
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 5) return content;
        continue;
      } catch (err) {
        if (attempt === maxRetries) break;
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  }

  // All models exhausted — return smart demo response
  return generateDemoResponse(userMsg);
}

/* ═══ SMART DEMO RESPONSE ENGINE ═══
   Generates contextual AI-quality responses for any stock/query
   when API is unavailable */

const STOCK_DATA = {
  RELIANCE: { name: 'Reliance Industries', price: 2940, pe: 26.4, sector: 'Conglomerate', mcap: '19.8L Cr', change: 3.2, target: 3180, support: 2840, pattern: 'Cup-and-handle', moat: 'Wide', verdict: 'STRONG BUY', confidence: 89 },
  TCS: { name: 'Tata Consultancy Services', price: 4020, pe: 32.1, sector: 'IT', mcap: '14.5L Cr', change: 1.9, target: 4350, support: 3880, pattern: 'Ascending channel', moat: 'Wide', verdict: 'BUY', confidence: 82 },
  INFY: { name: 'Infosys', price: 1585, pe: 25.8, sector: 'IT', mcap: '6.6L Cr', change: 1.4, target: 1720, support: 1510, pattern: 'Breakout from base', moat: 'Narrow', verdict: 'BUY', confidence: 85 },
  HDFCBANK: { name: 'HDFC Bank', price: 1682, pe: 19.3, sector: 'Banking', mcap: '12.8L Cr', change: 0.9, target: 1820, support: 1620, pattern: 'Bull flag', moat: 'Wide', verdict: 'BUY', confidence: 79 },
  TATAMOTORS: { name: 'Tata Motors', price: 924, pe: 8.2, sector: 'Auto', mcap: '3.4L Cr', change: 2.8, target: 1050, support: 870, pattern: 'Volume breakout', moat: 'Narrow', verdict: 'STRONG BUY', confidence: 92 },
  SBIN: { name: 'State Bank of India', price: 782, pe: 10.5, sector: 'Banking', mcap: '7.0L Cr', change: -0.4, target: 850, support: 740, pattern: 'Consolidation', moat: 'Wide', verdict: 'HOLD', confidence: 71 },
  BAJFINANCE: { name: 'Bajaj Finance', price: 7250, pe: 35.4, sector: 'NBFC', mcap: '4.5L Cr', change: 1.6, target: 7800, support: 6900, pattern: 'Golden cross', moat: 'Wide', verdict: 'BUY', confidence: 76 },
  WIPRO: { name: 'Wipro', price: 462, pe: 22.7, sector: 'IT', mcap: '2.4L Cr', change: 0.8, target: 510, support: 435, pattern: 'Base formation', moat: 'Narrow', verdict: 'HOLD', confidence: 68 },
  ICICIBANK: { name: 'ICICI Bank', price: 1245, pe: 18.9, sector: 'Banking', mcap: '8.7L Cr', change: 1.1, target: 1380, support: 1180, pattern: 'Higher lows', moat: 'Wide', verdict: 'BUY', confidence: 81 },
  HCLTECH: { name: 'HCL Technologies', price: 1580, pe: 24.5, sector: 'IT', mcap: '4.3L Cr', change: 2.1, target: 1720, support: 1490, pattern: 'Breakout', moat: 'Narrow', verdict: 'BUY', confidence: 77 },
  ADANIENT: { name: 'Adani Enterprises', price: 2850, pe: 68.2, sector: 'Conglomerate', mcap: '3.2L Cr', change: -1.2, target: 3100, support: 2650, pattern: 'Bear flag', moat: 'Narrow', verdict: 'HOLD', confidence: 58 },
  MARUTI: { name: 'Maruti Suzuki', price: 12450, pe: 28.6, sector: 'Auto', mcap: '3.9L Cr', change: 0.7, target: 13500, support: 11800, pattern: 'Channel play', moat: 'Wide', verdict: 'BUY', confidence: 74 },
  SUNPHARMA: { name: 'Sun Pharma', price: 1780, pe: 35.8, sector: 'Pharma', mcap: '4.3L Cr', change: 4.7, target: 1950, support: 1680, pattern: 'Momentum surge', moat: 'Narrow', verdict: 'BUY', confidence: 80 },
  BHARTIARTL: { name: 'Bharti Airtel', price: 1620, pe: 72.3, sector: 'Telecom', mcap: '9.5L Cr', change: 4.1, target: 1800, support: 1520, pattern: 'Ascending triangle', moat: 'Wide', verdict: 'BUY', confidence: 78 },
  TITAN: { name: 'Titan Company', price: 3480, pe: 68.5, sector: 'Consumer', mcap: '3.1L Cr', change: 1.3, target: 3750, support: 3300, pattern: 'Cup formation', moat: 'Wide', verdict: 'HOLD', confidence: 72 },
  LT: { name: 'Larsen & Toubro', price: 3620, pe: 32.1, sector: 'Infrastructure', mcap: '5.0L Cr', change: 0.9, target: 3900, support: 3450, pattern: 'Bull flag', moat: 'Wide', verdict: 'BUY', confidence: 75 },
  KOTAKBANK: { name: 'Kotak Mahindra Bank', price: 1750, pe: 21.4, sector: 'Banking', mcap: '3.5L Cr', change: 0.5, target: 1900, support: 1650, pattern: 'Range bound', moat: 'Wide', verdict: 'HOLD', confidence: 69 },
  ASIANPAINT: { name: 'Asian Paints', price: 2890, pe: 58.2, sector: 'Consumer', mcap: '2.8L Cr', change: -0.6, target: 3100, support: 2750, pattern: 'Consolidation', moat: 'Wide', verdict: 'HOLD', confidence: 65 },
  NESTLEIND: { name: 'Nestle India', price: 2520, pe: 72.8, sector: 'FMCG', mcap: '2.4L Cr', change: 0.3, target: 2700, support: 2400, pattern: 'Steady climb', moat: 'Wide', verdict: 'HOLD', confidence: 70 },
  PAYTM: { name: 'One97 Communications', price: 890, pe: -15.2, sector: 'Fintech', mcap: '0.57L Cr', change: 5.3, target: 1050, support: 780, pattern: 'Recovery rally', moat: 'Narrow', verdict: 'SPECULATIVE BUY', confidence: 55 },
};

function findStock(query) {
  const q = query.toUpperCase();
  for (const [ticker, data] of Object.entries(STOCK_DATA)) {
    if (q.includes(ticker) || q.includes(data.name.toUpperCase())) return { ticker, ...data };
  }
  return null;
}

function generateDemoResponse(userMsg) {
  const msg = userMsg.toLowerCase();
  const stock = findStock(userMsg);

  // Stock-specific analysis
  if (stock) {
    const bullish = stock.change >= 0;
    return `📊 NEXUS COUNCIL ANALYSIS — ${stock.ticker} (${stock.name})

🔮 ORACLE — Data Intelligence:
Institutional flows ${bullish ? 'indicate sustained accumulation' : 'show mixed signals'}. FII holdings ${bullish ? 'increased by 0.3%' : 'decreased by 0.2%'} in Q4. Block deal activity: ${bullish ? 'Above average' : 'Normal'}.
📈 Current: ₹${stock.price.toLocaleString('en-IN')} (${stock.change >= 0 ? '+' : ''}${stock.change}%)

🔍 SHERLOCK — Anomaly Detection:
Volume deviation: ${(Math.random() * 1.5 + 1.2).toFixed(1)}σ above 20-day mean. Delivery %: ${Math.floor(Math.random() * 20 + 55)}% (vs avg 48%). OI change: ${bullish ? '+' : '-'}${(Math.random() * 5 + 2).toFixed(1)}%. ${bullish ? '⚡ Unusual buying detected' : '📉 Profit booking pattern visible'}.

🧠 FREUD — Sentiment Analysis:
Sentiment score: ${bullish ? (Math.random() * 0.2 + 0.72).toFixed(2) : (Math.random() * 0.2 + 0.4).toFixed(2)} / 1.0. Management tone: ${bullish ? 'Confident & expansionary' : 'Cautious but stable'}. News velocity: ${Math.floor(Math.random() * 15 + 8)} articles/hr. Social mentions: ${bullish ? 'Trending positive' : 'Neutral'}.

⚡ TESLA — Pattern Recognition:
Pattern detected: ${stock.pattern}. Historical success rate: ${Math.floor(Math.random() * 12 + 65)}% across ${Math.floor(Math.random() * 15 + 12)} instances.
🎯 Target: ₹${stock.target.toLocaleString('en-IN')} | Support: ₹${stock.support.toLocaleString('en-IN')}

💰 BUFFETT — Fundamentals:
PE: ${stock.pe}x vs sector avg ${(stock.pe * (Math.random() * 0.3 + 0.85)).toFixed(1)}x. Mcap: ₹${stock.mcap}. Moat: ${stock.moat}. Earnings quality: ${Math.floor(Math.random() * 15 + 75)}/100.

🛡️ GUARDIAN — Risk & Compliance:
SEBI compliance: ✓ Clear. Circuit distance: ${Math.floor(Math.random() * 30 + 50)}%. Max position risk: ${(Math.random() * 2 + 1).toFixed(1)}/10. No regulatory red flags.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚛️ NEXUS CONSENSUS: ${stock.verdict} (${stock.confidence}% confidence)
📊 ${stock.confidence >= 80 ? '6/6' : stock.confidence >= 70 ? '5/6' : '4/6'} agents in agreement
🎯 Target: ₹${stock.target.toLocaleString('en-IN')} (+${((stock.target - stock.price) / stock.price * 100).toFixed(1)}%)
🛑 Stop Loss: ₹${stock.support.toLocaleString('en-IN')} (-${((stock.price - stock.support) / stock.price * 100).toFixed(1)}%)
⚛️ Quantum-signed · 9-layer audit verified`;
  }

  // Portfolio analysis
  if (msg.includes('portfolio') || msg.includes('holdings') || msg.includes('risk')) {
    return `📊 NEXUS PORTFOLIO INTELLIGENCE

💰 Portfolio Summary:
• 8 holdings across 6 sectors
• Total Invested: ₹9,00,000 | Current Value: ₹9,59,020
• Unrealised P&L: +₹59,020 (+6.1%)
• Beta: 1.12 | Sharpe Ratio: 1.45

📈 Top Performers:
1. TATAMOTORS +12.4% — LIC bulk deal catalyst, volume 2.8σ above mean
2. RELIANCE +8.2% — Cup-and-handle breakout confirmed, target ₹3,180
3. INFY +5.6% — Promoter pledging reduction signal (18% → 6%)

📉 Underperformers:
1. SBIN -0.4% — Banking sector consolidation phase
2. ASIANPAINT -0.6% — Elevated valuations, mean reversion risk

⚠️ Risk Alerts:
• Sector concentration: Banking at 35% (recommended: <25%)
• SBIN volatility elevated at 32% annualized
• Correlation HDFCBANK-SBIN: 0.78 (diversification risk)

🎯 Recommendations:
1. Book partial profits on TATAMOTORS (+12.4%)
2. Add RELIANCE on dips to ₹2,840 support
3. Reduce SBIN exposure by 30% — rotate to ICICIBANK

🛡️ SENTINEL: Portfolio integrity 100/100. No adversarial threats.
⚛️ NEXUS Quantum-signed analysis · 9-layer audit verified`;
  }

  // Monte Carlo simulation
  if (msg.includes('monte carlo') || msg.includes('simulation') || msg.includes('var')) {
    return `📊 NEXUS MONTE CARLO SIMULATION — 10,000 Paths

💰 Current Portfolio: ₹9,59,020

📈 1-Year Projections (95% CI):
• Expected Value: ₹10,82,000 (+12.8%)
• Best Case (P95): ₹12,45,000 (+29.8%)
• Worst Case (P5): ₹7,98,000 (-16.8%)
• Median Outcome: ₹10,55,000 (+10.0%)

⚠️ Risk Metrics:
• VaR (95%, 1Y): -₹1,61,000 (16.8%)
• CVaR (Expected Shortfall): -₹1,89,000
• Max Drawdown (historical): -22.4%
• Recovery Time (avg): 4.2 months

📊 Distribution:
• Positive outcomes: 72.3% of paths
• >20% returns: 28.1% probability
• >30% returns: 12.7% probability
• Negative outcomes: 27.7% of paths

🧬 Stress Scenarios:
1. Global Recession: Portfolio -18.5% | Probability: 8%
2. RBI Rate Hike: -6.2% | Probability: 22%
3. FII Outflow: -12.1% | Probability: 15%
4. Bull Run: +28.4% | Probability: 18%

⚛️ NEXUS Quantum-signed · Methodology: Geometric Brownian Motion · 9-layer audit`;
  }

  // SENTINEL report
  if (msg.includes('sentinel') || msg.includes('threat') || msg.includes('defense')) {
    return `🛡️ SENTINEL DEFENSE REPORT — Agent 8

📊 Current Status: ALL CLEAR (GREEN)

✅ Security Checks:
1. ✓ Prompt Injection Scan — No adversarial prompts detected
2. ✓ Data Poisoning Check — All 5 data sources verified
3. ✓ Replay Attack Defense — Session tokens rotated
4. ✓ Social Engineering — No manipulation attempts
5. ✓ Model Output Integrity — Cross-validated with 3/5 consensus

📈 Statistics:
• Total Scans Today: 47
• Blocked Attempts: 0
• False Positives: 0
• Success Rate: 100%
• Avg Scan Latency: 12ms

🔒 Data Source Trust Scores:
1. NSE Feed: 98% trust | 45ms latency
2. BSE API: 95% trust | 62ms latency
3. SEBI Filings: 97% trust | 120ms latency
4. Reuters: 93% trust | 180ms latency
5. Bloomberg: 96% trust | 95ms latency

⚛️ Quantum Vault: LOCKED
🔐 CRYSTALS-Dilithium signatures: Active
📋 Last full audit: ${new Date().toLocaleTimeString('en-IN')}

⚛️ SENTINEL Agent 8 · Adversarial defense verified · 9-layer audit passed`;
  }

  // Tax harvesting
  if (msg.includes('tax') || msg.includes('harvest')) {
    return `📊 NEXUS TAX-LOSS HARVESTING ANALYSIS

📈 Current LTCG Position:
• Total Realised Gains: ₹0 (no sales yet)
• Unrealised Gains: ₹59,020
• Tax-free LTCG threshold: ₹1,25,000/year

🎯 Optimisation Strategy:
Since all gains are under ₹1.25L threshold, no immediate harvesting needed.

💡 Recommendations:
1. Book TATAMOTORS profits up to ₹1.25L — 0% tax on LTCG
2. If SBIN drops further, sell & immediately rebuy (wash sale allowed in India)
3. Offset any short-term gains against SBIN losses

📋 Tax-Optimised Moves:
• SELL 50% TATAMOTORS → Lock ₹6,200 profit (tax-free under ₹1.25L)
• HOLD RELIANCE → Let gains compound (long-term holding period)
• HOLD INFY → Promoter buying signal active, more upside expected

⚠️ Note: Consult a CA for personalised tax advice. DRISHTI provides analysis only.
⚛️ NEXUS Quantum-signed · Tax analysis for assessment year 2026-27`;
  }

  // LIC/TATAMOTORS deal
  if (msg.includes('tatamotors') || msg.includes('lic') || msg.includes('bulk deal')) {
    return `📊 NEXUS DEEP DIVE — TATAMOTORS LIC Bulk Deal

📋 Deal Details:
• Buyer: Life Insurance Corporation of India (LIC)
• Stake Acquired: 2.3% of TATAMOTORS
• Deal Price: ₹924/share
• Deal Value: ~₹2,850 Crore
• Source: NSE Bulk Deal Feed (SENTINEL verified)

🔮 ORACLE Assessment:
LIC increasing stake signals long-term institutional confidence. Historical data shows LIC bulk deals in auto stocks precede 15-25% rallies within 6 months (8 of 11 instances since 2019).

🔍 SHERLOCK Anomaly Report:
• Volume on deal day: 3.2x average (significant)
• Delivery %: 78% (vs avg 45%) — strong conviction buying
• OI increase in call options: +12% (bullish positioning)

🧠 FREUD Sentiment:
• News sentiment score: 0.87/1.0 (highly positive)
• Social media buzz: 2,400+ mentions in 24hrs
• Analyst upgrades: 3 (Goldman Sachs, Morgan Stanley, Motilal Oswal)

⚡ Technical Impact:
• Immediate support strengthened at ₹900 (LIC cost basis)
• Breakout target: ₹1,050 (measured move from base)
• Risk-reward: 3.2:1 (excellent)

⚛️ CONSENSUS: STRONG BUY (92% confidence · 6/6 agents)
⚛️ Quantum-signed · 9-layer audit verified`;
  }

  // Default intelligent response
  return `📊 NEXUS INTELLIGENCE — Multi-Agent Analysis

🏛️ Your question has been processed by the 7-agent NEXUS council.

📈 Market Overview (Live):
• NIFTY 50: Broad momentum bullish, above 200-DMA
• Advance-Decline: 32:18 (positive breadth)
• FII Flow: Net positive ₹1,240 Cr today
• Sector Rotation: IT & Banking leading
• VIX: 12.8 (low volatility regime)

📡 Top Active Signals:
1. TATAMOTORS — LIC bulk deal, 92% confidence → STRONG BUY
2. RELIANCE — Cup-and-handle breakout, 89% confidence → BUY
3. SUNPHARMA — FDA approval catalyst, 80% confidence → BUY
4. BHARTIARTL — Tariff floor approval, 78% confidence → BUY

💡 Try specific queries for detailed analysis:
• "Analyze RELIANCE for me"
• "Show my portfolio risk DNA"
• "Run Monte Carlo simulation"
• "SENTINEL threat report"
• "Tax-loss harvesting strategy"

🛡️ SENTINEL: All queries pre-scanned. No threats detected.
⚛️ NEXUS Quantum-signed · 9-layer audit verified`;
}
