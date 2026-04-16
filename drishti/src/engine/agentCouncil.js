/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — 7-Agent Council Orchestration Engine
   Simulates multi-agent AI analysis with consensus & audit trail
   ═══════════════════════════════════════════════════════════════ */

export const AGENTS = [
  {
    id: 'oracle',
    name: 'ORACLE',
    role: 'Data Intelligence',
    desc: 'Ingests NSE bulk/block deals, SEBI filings, FII/DII flows, and corporate actions in real-time',
    color: '#00E5A0',
    avatar: '🔮',
    expertise: ['bulk deals', 'block deals', 'FII flows', 'DII flows', 'corporate actions'],
    systemPrompt: 'You are ORACLE, a data intelligence agent. Analyze raw market data feeds: NSE bulk deals, block deals, SEBI filings, FII/DII flows. Report anomalies and significant institutional moves.',
  },
  {
    id: 'sherlock',
    name: 'SHERLOCK',
    role: 'Anomaly Detection',
    desc: 'Pattern-breaks in volume, open interest, delivery %, and unusual options activity',
    color: '#38bdf8',
    avatar: '🔍',
    expertise: ['volume anomalies', 'OI changes', 'delivery %', 'options activity'],
    systemPrompt: 'You are SHERLOCK, an anomaly detection agent. Find unusual patterns in volume spikes, open interest changes, delivery percentage shifts, and options unusual activity.',
  },
  {
    id: 'freud',
    name: 'FREUD',
    role: 'Sentiment Analysis',
    desc: 'NLP on earnings calls, management commentary tone shifts, news sentiment, and social signals',
    color: '#7C5CFC',
    avatar: '🧠',
    expertise: ['earnings NLP', 'management tone', 'news sentiment', 'social signals'],
    systemPrompt: 'You are FREUD, a sentiment analysis agent. Analyze earnings call transcripts for tone shifts, news sentiment, social media signals, and management commentary patterns.',
  },
  {
    id: 'tesla',
    name: 'TESLA',
    role: 'Pattern Recognition',
    desc: 'Chart patterns, candlestick formations, support/resistance, and measured move targets',
    color: '#34d399',
    avatar: '⚡',
    expertise: ['chart patterns', 'candlesticks', 'support/resistance', 'breakouts'],
    systemPrompt: 'You are TESLA, a pattern recognition agent. Identify chart patterns, candlestick formations, key support/resistance levels, and calculate measured move targets with historical success rates.',
  },
  {
    id: 'buffett',
    name: 'BUFFETT',
    role: 'Fundamental Analysis',
    desc: 'Valuations, PE/PB ratios, earnings quality, moat analysis, and intrinsic value estimation',
    color: '#10b981',
    avatar: '💰',
    expertise: ['valuations', 'PE ratios', 'earnings quality', 'moat analysis', 'intrinsic value'],
    systemPrompt: 'You are BUFFETT, a fundamental analysis agent. Evaluate company valuations, earnings quality, competitive moats, and estimate intrinsic values using DCF and comparable analysis.',
  },
  {
    id: 'guardian',
    name: 'GUARDIAN',
    role: 'Risk & Compliance',
    desc: 'SEBI regulations, circuit limits, margin requirements, and regulatory risk assessment',
    color: '#ef4444',
    avatar: '🛡️',
    expertise: ['SEBI compliance', 'circuit limits', 'margin', 'regulatory risk'],
    systemPrompt: 'You are GUARDIAN, a risk and compliance agent. Assess SEBI regulatory risks, circuit limit proximity, margin requirements, and flag compliance concerns.',
  },
];

export const NEXUS_CORE = {
  id: 'nexus',
  name: 'NEXUS CORE',
  role: 'Orchestrator',
  desc: 'Claude Sonnet 4 — synthesizes all agent outputs, resolves conflicts, produces final signal with 9-layer audit',
  color: '#00E5A0',
  avatar: '⚛️',
  systemPrompt: 'You are NEXUS CORE, the orchestrator of the DRISHTI 7-agent council. Synthesize all agent analyses, resolve disagreements, and produce a final actionable signal with confidence score.',
};

/* Generate a simulated agent analysis for a given signal */
export function generateAgentAnalysis(signal, agent) {
  const analyses = {
    oracle: {
      verdict: signal.impact === 'BULLISH' ? 'ACCUMULATE' : 'REDUCE',
      confidence: Math.min(98, signal.confidence + Math.floor(Math.random() * 8 - 3)),
      reasoning: `${agent.name} detected ${signal.type.replace('_', ' ').toLowerCase()} activity on ${signal.ticker}. Institutional flow pattern matches ${Math.floor(Math.random() * 5 + 8)} of 14 historical precedents. Data freshness: ${Math.floor(Math.random() * 30 + 10)}s ago.`,
      dataPoints: Math.floor(Math.random() * 50 + 120),
      latency: `${Math.floor(Math.random() * 200 + 50)}ms`,
    },
    sherlock: {
      verdict: signal.confidence > 80 ? 'ANOMALY CONFIRMED' : 'MONITORING',
      confidence: Math.min(98, signal.confidence + Math.floor(Math.random() * 6 - 2)),
      reasoning: `Volume deviation: ${(Math.random() * 2 + 1.5).toFixed(1)}σ above 20-day mean. Delivery % shifted ${signal.impact === 'BULLISH' ? 'up' : 'down'} by ${(Math.random() * 15 + 5).toFixed(1)}pp. OI change: ${signal.impact === 'BULLISH' ? '+' : '-'}${(Math.random() * 8 + 2).toFixed(1)}%.`,
      dataPoints: Math.floor(Math.random() * 30 + 80),
      latency: `${Math.floor(Math.random() * 150 + 80)}ms`,
    },
    freud: {
      verdict: signal.impact === 'BULLISH' ? 'POSITIVE SHIFT' : 'NEGATIVE DRIFT',
      confidence: Math.min(98, signal.confidence + Math.floor(Math.random() * 10 - 5)),
      reasoning: `Sentiment score: ${(Math.random() * 0.3 + (signal.impact === 'BULLISH' ? 0.6 : 0.1)).toFixed(2)}. Management tone shifted ${Math.floor(Math.random() * 3 + 1)} standard deviations from baseline. News velocity: ${Math.floor(Math.random() * 20 + 5)} articles/hr.`,
      dataPoints: Math.floor(Math.random() * 200 + 300),
      latency: `${Math.floor(Math.random() * 300 + 100)}ms`,
    },
    tesla: {
      verdict: signal.impact === 'BULLISH' ? 'BREAKOUT SIGNAL' : 'BREAKDOWN RISK',
      confidence: Math.min(98, signal.confidence + Math.floor(Math.random() * 8 - 4)),
      reasoning: `Pattern detected: ${signal.type === 'TECHNICAL' ? 'Cup-and-handle' : 'Channel breakout'}. Historical success rate: ${Math.floor(Math.random() * 15 + 65)}% across ${Math.floor(Math.random() * 20 + 10)} instances. Volume confirmation: ${Math.random() > 0.3 ? 'YES' : 'PENDING'}.`,
      dataPoints: Math.floor(Math.random() * 40 + 60),
      latency: `${Math.floor(Math.random() * 100 + 40)}ms`,
    },
    buffett: {
      verdict: signal.impact === 'BULLISH' ? 'UNDERVALUED' : 'FAIRLY PRICED',
      confidence: Math.min(98, signal.confidence + Math.floor(Math.random() * 6 - 3)),
      reasoning: `PE ratio: ${(Math.random() * 15 + 12).toFixed(1)}x vs sector avg ${(Math.random() * 5 + 18).toFixed(1)}x. Earnings quality score: ${(Math.random() * 20 + 70).toFixed(0)}/100. Moat rating: ${['Wide', 'Narrow', 'Moderate'][Math.floor(Math.random() * 3)]}.`,
      dataPoints: Math.floor(Math.random() * 20 + 40),
      latency: `${Math.floor(Math.random() * 250 + 150)}ms`,
    },
    guardian: {
      verdict: signal.confidence > 85 ? 'APPROVED' : 'CAUTION',
      confidence: Math.min(98, signal.confidence + Math.floor(Math.random() * 4 - 2)),
      reasoning: `SEBI compliance: ✓ No regulatory flags. Circuit limit proximity: ${(Math.random() * 60 + 20).toFixed(0)}% from upper band. Risk score: ${(Math.random() * 3 + 1).toFixed(1)}/10. Position limit utilization: ${(Math.random() * 40 + 10).toFixed(0)}%.`,
      dataPoints: Math.floor(Math.random() * 15 + 25),
      latency: `${Math.floor(Math.random() * 80 + 30)}ms`,
    },
  };
  return analyses[agent.id] || analyses.oracle;
}

/* Calculate council consensus */
export function calculateConsensus(agentResults) {
  const confidences = Object.values(agentResults).map(r => r.confidence);
  const avg = confidences.reduce((a, b) => a + b, 0) / confidences.length;
  const verdicts = Object.values(agentResults).map(r => r.verdict);
  
  const bullishVotes = verdicts.filter(v => 
    ['ACCUMULATE', 'ANOMALY CONFIRMED', 'POSITIVE SHIFT', 'BREAKOUT SIGNAL', 'UNDERVALUED', 'APPROVED'].includes(v)
  ).length;
  
  const agreement = (bullishVotes / verdicts.length) * 100;
  
  return {
    averageConfidence: Math.round(avg),
    agreement: Math.round(agreement),
    bullishVotes,
    bearishVotes: verdicts.length - bullishVotes,
    totalAgents: verdicts.length,
    consensusVerdict: agreement >= 66 ? 'STRONG BUY' : agreement >= 50 ? 'BUY' : agreement >= 33 ? 'HOLD' : 'SELL',
    consensusColor: agreement >= 66 ? '#10b981' : agreement >= 50 ? '#00E5A0' : agreement >= 33 ? '#fb923c' : '#ef4444',
  };
}

/* Generate 9-layer audit trail */
export function generateAuditTrail(signal, consensus) {
  return [
    { layer: 1, name: 'Data Ingestion', status: 'verified', detail: `${Math.floor(Math.random() * 5 + 3)} sources validated`, time: `${Math.floor(Math.random() * 50 + 10)}ms` },
    { layer: 2, name: 'SENTINEL Pre-Scan', status: 'passed', detail: 'No adversarial vectors detected', time: `${Math.floor(Math.random() * 30 + 5)}ms` },
    { layer: 3, name: 'Agent Analysis', status: 'complete', detail: `6/6 agents responded`, time: `${Math.floor(Math.random() * 500 + 200)}ms` },
    { layer: 4, name: 'Consensus Calc', status: 'complete', detail: `${consensus.agreement}% agreement`, time: `${Math.floor(Math.random() * 10 + 2)}ms` },
    { layer: 5, name: 'Conflict Resolution', status: consensus.agreement < 66 ? 'resolved' : 'none', detail: consensus.agreement < 66 ? 'Weighted by expertise' : 'No conflicts', time: `${Math.floor(Math.random() * 20 + 5)}ms` },
    { layer: 6, name: 'Risk Assessment', status: 'approved', detail: `Risk score: ${(Math.random() * 3 + 1).toFixed(1)}/10`, time: `${Math.floor(Math.random() * 15 + 5)}ms` },
    { layer: 7, name: 'SEBI Compliance', status: 'passed', detail: 'Regulation check clear', time: `${Math.floor(Math.random() * 10 + 3)}ms` },
    { layer: 8, name: 'SENTINEL Post-Verify', status: 'verified', detail: 'Output integrity confirmed', time: `${Math.floor(Math.random() * 20 + 5)}ms` },
    { layer: 9, name: 'Quantum Signature', status: 'signed', detail: 'CRYSTALS-Dilithium applied', time: `${Math.floor(Math.random() * 8 + 2)}ms` },
  ];
}

/* Run full council analysis for a signal */
export function runCouncilAnalysis(signal) {
  const agentResults = {};
  AGENTS.forEach(agent => {
    agentResults[agent.id] = generateAgentAnalysis(signal, agent);
  });
  
  const consensus = calculateConsensus(agentResults);
  const auditTrail = generateAuditTrail(signal, consensus);
  
  return { agentResults, consensus, auditTrail, timestamp: new Date().toISOString() };
}
