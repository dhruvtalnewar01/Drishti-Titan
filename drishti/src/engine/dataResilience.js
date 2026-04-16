/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — Data Resilience Fabric
   3-of-5 source consensus, trust scoring, fallback chain
   ═══════════════════════════════════════════════════════════════ */

export const DATA_SOURCES = [
  { id: 'nse', name: 'NSE Live Feed', type: 'primary', trustScore: 98, latency: 45, status: 'active', icon: '🏛️', lastUpdate: null },
  { id: 'bse', name: 'BSE Data API', type: 'primary', trustScore: 96, latency: 62, status: 'active', icon: '📊', lastUpdate: null },
  { id: 'sebi', name: 'SEBI Filings', type: 'regulatory', trustScore: 99, latency: 120, status: 'active', icon: '⚖️', lastUpdate: null },
  { id: 'yahoo', name: 'Yahoo Finance', type: 'secondary', trustScore: 85, latency: 200, status: 'active', icon: '📈', lastUpdate: null },
  { id: 'et', name: 'ET Markets', type: 'media', trustScore: 88, latency: 150, status: 'active', icon: '📰', lastUpdate: null },
];

export class DataResilienceFabric {
  constructor() {
    this.sources = DATA_SOURCES.map(s => ({ ...s, lastUpdate: Date.now() - Math.random() * 60000 }));
    this.consensusHistory = [];
    this.stalenessThreshold = 300000; // 5 minutes
    this.deadManSwitchActive = false;
    this.fallbackChain = ['nse', 'bse', 'yahoo', 'et', 'sebi'];
  }

  /* 3-of-5 source consensus check */
  checkConsensus(ticker, dataPoints) {
    const availableSources = this.sources.filter(s => s.status === 'active');
    const requiredConsensus = Math.ceil(availableSources.length * 0.6); // 3 of 5
    
    // Simulate source agreement
    const agreements = availableSources.map(source => ({
      sourceId: source.id,
      sourceName: source.name,
      trustScore: source.trustScore,
      agrees: Math.random() > 0.15, // 85% chance of agreement
      value: dataPoints?.price || (Math.random() * 100 + 900),
      latency: source.latency + Math.floor(Math.random() * 50),
      timestamp: Date.now(),
    }));

    const agreeCount = agreements.filter(a => a.agrees).length;
    const consensusReached = agreeCount >= requiredConsensus;
    
    const weightedConfidence = agreements.reduce((sum, a) => {
      const source = this.sources.find(s => s.id === a.sourceId);
      return sum + (a.agrees ? source.trustScore : 0);
    }, 0) / agreements.length;

    const result = {
      ticker,
      consensusReached,
      agreeCount,
      totalSources: availableSources.length,
      requiredConsensus,
      weightedConfidence: Math.round(weightedConfidence),
      agreements,
      timestamp: new Date().toISOString(),
    };

    this.consensusHistory.push(result);
    return result;
  }

  /* Trust scoring for each source */
  getTrustScores() {
    return this.sources.map(s => ({
      ...s,
      freshness: this._calculateFreshness(s),
      reliability: this._calculateReliability(s),
      overallScore: Math.round((s.trustScore * 0.6 + this._calculateFreshness(s) * 0.2 + this._calculateReliability(s) * 0.2)),
    }));
  }

  /* Fallback chain — if primary fails, cascade to secondary */
  executeFallback(failedSourceId) {
    const currentIdx = this.fallbackChain.indexOf(failedSourceId);
    const fallbackSources = this.fallbackChain.slice(currentIdx + 1);
    
    // Mark failed source
    const source = this.sources.find(s => s.id === failedSourceId);
    if (source) source.status = 'degraded';
    
    return {
      failedSource: failedSourceId,
      fallbackOrder: fallbackSources,
      activeFallback: fallbackSources[0] || 'none',
      message: fallbackSources.length > 0 
        ? `Falling back from ${failedSourceId} to ${fallbackSources[0]}` 
        : 'All fallback sources exhausted — dead man\'s switch activated',
      deadManSwitch: fallbackSources.length === 0,
    };
  }

  /* Dead man's switch — detect data staleness */
  checkDeadManSwitch() {
    const now = Date.now();
    const staleSourceList = this.sources.filter(s => (now - (s.lastUpdate || 0)) > this.stalenessThreshold);
    
    this.deadManSwitchActive = staleSourceList.length >= 3;
    
    return {
      active: this.deadManSwitchActive,
      staleSources: staleSourceList.map(s => s.name),
      freshSources: this.sources.filter(s => !staleSourceList.includes(s)).map(s => s.name),
      message: this.deadManSwitchActive 
        ? '⚠️ DEAD MAN\'S SWITCH: Multiple data sources stale. Signals may be unreliable.' 
        : '✅ All critical data sources within freshness threshold.',
    };
  }

  /* Get fabric status */
  getStatus() {
    return {
      sources: this.sources,
      trustScores: this.getTrustScores(),
      deadManSwitch: this.checkDeadManSwitch(),
      consensusHistory: this.consensusHistory.slice(-5),
      totalConsensusChecks: this.consensusHistory.length,
      overallHealth: this.sources.filter(s => s.status === 'active').length >= 3 ? 'HEALTHY' : 'DEGRADED',
    };
  }

  /* Private helpers */
  _calculateFreshness(source) {
    const age = Date.now() - (source.lastUpdate || 0);
    if (age < 30000) return 100;
    if (age < 60000) return 85;
    if (age < 180000) return 60;
    if (age < 300000) return 30;
    return 10;
  }

  _calculateReliability(source) {
    // Based on historical uptime (simulated)
    const baseReliability = { primary: 99, regulatory: 97, secondary: 92, media: 88 };
    return baseReliability[source.type] || 85;
  }
}

export const dataFabric = new DataResilienceFabric();
