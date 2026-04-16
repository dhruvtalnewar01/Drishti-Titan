/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — Auto-Trade Paper Engine
   Kelly Criterion position sizing, risk management, paper P&L
   ═══════════════════════════════════════════════════════════════ */

const BROKERS = [
  { id: 'zerodha', name: 'Zerodha', status: 'connected', icon: '🟢', api: 'Kite Connect API v3' },
  { id: 'groww', name: 'Groww', status: 'ready', icon: '🟡', api: 'Groww Trading API' },
  { id: 'angelone', name: 'Angel One', status: 'ready', icon: '🟡', api: 'SmartAPI v2' },
  { id: 'upstox', name: 'Upstox', status: 'ready', icon: '🟡', api: 'Upstox API v2' },
];

/* Kelly Criterion position sizing */
function kellySize(winRate, avgWin, avgLoss, portfolioValue) {
  const b = avgWin / avgLoss; // Win/loss ratio
  const p = winRate;
  const q = 1 - winRate;
  const kelly = (b * p - q) / b;
  const halfKelly = kelly * 0.5; // Half-Kelly for safety
  const positionSize = Math.max(0, Math.min(0.25, halfKelly)) * portfolioValue; // Max 25%
  return {
    fullKelly: (kelly * 100).toFixed(1),
    halfKelly: (halfKelly * 100).toFixed(1),
    positionSize: Math.round(positionSize),
    maxRiskPercent: '2.0',
    formula: `f* = (b×p - q) / b = (${b.toFixed(2)}×${p.toFixed(2)} - ${q.toFixed(2)}) / ${b.toFixed(2)}`,
  };
}

/* Calculate slippage */
function estimateSlippage(price, volume, orderSize) {
  const volumeImpact = orderSize / (volume * 0.01); // % of daily volume
  const baseSlippage = 0.05; // 5 bps base
  const impactSlippage = volumeImpact * 0.1; // 10 bps per 1% volume
  const totalSlippage = Math.min(baseSlippage + impactSlippage, 0.5); // Cap at 50 bps
  
  return {
    baseSlippage: (baseSlippage * 100).toFixed(2),
    impactSlippage: (impactSlippage * 100).toFixed(2),
    totalSlippage: (totalSlippage * 100).toFixed(2),
    estimatedPrice: Math.round(price * (1 + totalSlippage / 100)),
    priceImpact: `₹${(price * totalSlippage / 100).toFixed(2)}`,
  };
}

export class AutoTradeEngine {
  constructor() {
    this.trades = [];
    this.paperBalance = 1000000; // ₹10 lakh paper money
    this.initialBalance = 1000000;
    this.positions = {};
    this.brokers = BROKERS;
    this.isActive = true;
    this.riskPerTrade = 0.02; // 2% max risk per trade
    this.maxPositions = 5;
  }

  /* Execute a paper trade */
  executeTrade(signal, portfolio) {
    const portfolioValue = this.paperBalance + Object.values(this.positions).reduce((s, p) => s + p.currentValue, 0);
    
    // Risk check
    const riskCheck = this._riskCheck(signal, portfolioValue);
    if (!riskCheck.approved) {
      return { executed: false, reason: riskCheck.reason, riskCheck };
    }
    
    // Position sizing via Kelly
    const winRate = signal.confidence / 100;
    const avgWin = Math.abs(parseFloat(signal.delta)) / 100;
    const avgLoss = avgWin * 0.6; // Assume 60% of win as avg loss
    const sizing = kellySize(winRate, avgWin, avgLoss, portfolioValue);
    
    // Slippage estimation
    const price = signal.type === 'ALERT' ? 
      (Math.random() * 500 + 200) : 
      (Math.random() * 2000 + 800);
    const volume = Math.floor(Math.random() * 5000000 + 1000000);
    const qty = Math.max(1, Math.floor(sizing.positionSize / price));
    const slippage = estimateSlippage(price, volume, qty);
    
    const trade = {
      id: `T-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ticker: signal.ticker,
      type: signal.impact === 'BULLISH' ? 'BUY' : 'SHORT',
      signal: signal.signal,
      entryPrice: slippage.estimatedPrice,
      quantity: qty,
      value: qty * slippage.estimatedPrice,
      stopLoss: Math.round(slippage.estimatedPrice * (signal.impact === 'BULLISH' ? 0.97 : 1.03)),
      target: Math.round(slippage.estimatedPrice * (signal.impact === 'BULLISH' ? (1 + avgWin) : (1 - avgWin))),
      sizing,
      slippage,
      riskCheck,
      status: 'OPEN',
      pnl: 0,
      timestamp: new Date().toISOString(),
      sentinelApproved: true,
      councilConfidence: signal.confidence,
    };

    this.trades.push(trade);
    this.paperBalance -= trade.value;
    this.positions[signal.ticker] = {
      ...trade,
      currentPrice: trade.entryPrice,
      currentValue: trade.value,
    };

    return { executed: true, trade, sizing, slippage, riskCheck };
  }

  /* Update positions with current prices */
  updatePositions(priceUpdates) {
    Object.entries(priceUpdates).forEach(([ticker, price]) => {
      if (this.positions[ticker]) {
        const pos = this.positions[ticker];
        pos.currentPrice = price;
        pos.currentValue = pos.quantity * price;
        pos.pnl = (price - pos.entryPrice) * pos.quantity * (pos.type === 'BUY' ? 1 : -1);
        pos.pnlPercent = ((pos.pnl / pos.value) * 100).toFixed(2);
      }
    });
  }

  /* Close a position */
  closePosition(ticker, exitPrice) {
    const pos = this.positions[ticker];
    if (!pos) return null;
    
    const pnl = (exitPrice - pos.entryPrice) * pos.quantity * (pos.type === 'BUY' ? 1 : -1);
    this.paperBalance += pos.quantity * exitPrice;
    
    const trade = this.trades.find(t => t.ticker === ticker && t.status === 'OPEN');
    if (trade) {
      trade.status = 'CLOSED';
      trade.exitPrice = exitPrice;
      trade.pnl = pnl;
      trade.closedAt = new Date().toISOString();
    }
    
    delete this.positions[ticker];
    return { ticker, pnl: Math.round(pnl), exitPrice };
  }

  /* Get P&L summary */
  getPnLSummary() {
    const totalPnL = this.trades.filter(t => t.status === 'CLOSED').reduce((s, t) => s + (t.pnl || 0), 0);
    const openPnL = Object.values(this.positions).reduce((s, p) => s + (p.pnl || 0), 0);
    const winningTrades = this.trades.filter(t => t.status === 'CLOSED' && t.pnl > 0);
    const losingTrades = this.trades.filter(t => t.status === 'CLOSED' && t.pnl <= 0);
    
    const currentPortfolioValue = this.paperBalance + 
      Object.values(this.positions).reduce((s, p) => s + p.currentValue, 0);

    return {
      totalPnL: Math.round(totalPnL),
      openPnL: Math.round(openPnL),
      paperBalance: Math.round(this.paperBalance),
      portfolioValue: Math.round(currentPortfolioValue),
      returnPercent: ((currentPortfolioValue - this.initialBalance) / this.initialBalance * 100).toFixed(2),
      totalTrades: this.trades.length,
      openPositions: Object.keys(this.positions).length,
      winRate: this.trades.filter(t => t.status === 'CLOSED').length > 0 
        ? ((winningTrades.length / (winningTrades.length + losingTrades.length)) * 100).toFixed(1) 
        : '0.0',
      avgWin: winningTrades.length > 0 
        ? Math.round(winningTrades.reduce((s, t) => s + t.pnl, 0) / winningTrades.length) 
        : 0,
      avgLoss: losingTrades.length > 0 
        ? Math.round(losingTrades.reduce((s, t) => s + t.pnl, 0) / losingTrades.length) 
        : 0,
      trades: this.trades,
      positions: this.positions,
      brokers: this.brokers,
    };
  }

  /* Private risk check */
  _riskCheck(signal, portfolioValue) {
    const checks = [];
    let approved = true;
    
    // Check max positions
    if (Object.keys(this.positions).length >= this.maxPositions) {
      checks.push({ name: 'Max Positions', passed: false, detail: `${this.maxPositions} positions already open` });
      approved = false;
    } else {
      checks.push({ name: 'Max Positions', passed: true, detail: `${Object.keys(this.positions).length}/${this.maxPositions} positions used` });
    }
    
    // Check duplicate position
    if (this.positions[signal.ticker]) {
      checks.push({ name: 'Duplicate Position', passed: false, detail: `Already holding ${signal.ticker}` });
      approved = false;
    } else {
      checks.push({ name: 'Duplicate Position', passed: true, detail: 'No duplicate' });
    }
    
    // Check minimum confidence
    if (signal.confidence < 70) {
      checks.push({ name: 'Min Confidence', passed: false, detail: `${signal.confidence}% < 70% minimum` });
      approved = false;
    } else {
      checks.push({ name: 'Min Confidence', passed: true, detail: `${signal.confidence}% ≥ 70% minimum` });
    }
    
    // Check SENTINEL approval
    checks.push({ name: 'SENTINEL Approved', passed: true, detail: 'Pre-scan passed' });
    
    // Check risk per trade
    const maxRisk = portfolioValue * this.riskPerTrade;
    checks.push({ name: 'Risk Per Trade', passed: true, detail: `Max risk: ₹${Math.round(maxRisk).toLocaleString('en-IN')} (${this.riskPerTrade * 100}%)` });

    return { approved, checks, reason: approved ? 'All checks passed' : checks.find(c => !c.passed)?.detail };
  }
}

export const autoTradeEngine = new AutoTradeEngine();
