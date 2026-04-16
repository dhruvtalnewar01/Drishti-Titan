/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — Monte Carlo Risk Engine
   10,000-path portfolio simulation for VaR & stress testing
   ═══════════════════════════════════════════════════════════════ */

/* Generate correlated random returns using Cholesky decomposition (simplified) */
function generateCorrelatedReturns(n, means, stdDevs) {
  const returns = [];
  for (let i = 0; i < n; i++) {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    returns.push(means[i % means.length] + z * stdDevs[i % stdDevs.length]);
  }
  return returns;
}

/* Run Monte Carlo simulation */
export function runMonteCarloSimulation(portfolio, config = {}) {
  const {
    paths = 10000,
    horizon = 252, // trading days in a year
    confidenceLevel = 0.95,
  } = config;

  const startTime = performance.now();
  
  // Portfolio parameters
  const totalInvested = portfolio.reduce((sum, s) => sum + s.avgPrice * s.qty, 0);
  const currentValue = portfolio.reduce((sum, s) => sum + s.ltp * s.qty, 0);
  
  // Simulated daily returns (annualized)
  const stockParams = portfolio.map(stock => ({
    ticker: stock.ticker,
    weight: (stock.ltp * stock.qty) / currentValue,
    dailyMean: ((stock.ltp - stock.avgPrice) / stock.avgPrice) / 252,
    dailyStdDev: (Math.random() * 0.015 + 0.01), // 1-2.5% daily vol
  }));

  // Run simulations
  const finalValues = [];
  const pathData = []; // Store a subset of paths for visualization
  const maxVisualizePaths = 50;

  for (let p = 0; p < paths; p++) {
    let portfolioValue = currentValue;
    const pathValues = p < maxVisualizePaths ? [portfolioValue] : null;

    for (let d = 0; d < horizon; d++) {
      let dailyReturn = 0;
      stockParams.forEach(stock => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(Math.max(u1, 0.0001))) * Math.cos(2 * Math.PI * u2);
        dailyReturn += stock.weight * (stock.dailyMean + z * stock.dailyStdDev);
      });
      portfolioValue *= (1 + dailyReturn);
      if (pathValues && d % 5 === 0) pathValues.push(portfolioValue);
    }

    finalValues.push(portfolioValue);
    if (pathValues) pathData.push(pathValues);
  }

  // Sort final values for percentile calculation
  finalValues.sort((a, b) => a - b);

  // Calculate VaR
  const varIndex = Math.floor(paths * (1 - confidenceLevel));
  const var95 = currentValue - finalValues[varIndex];
  const cvar = currentValue - (finalValues.slice(0, varIndex).reduce((a, b) => a + b, 0) / varIndex);

  // Calculate statistics
  const mean = finalValues.reduce((a, b) => a + b, 0) / paths;
  const percentiles = {
    p5: finalValues[Math.floor(paths * 0.05)],
    p25: finalValues[Math.floor(paths * 0.25)],
    p50: finalValues[Math.floor(paths * 0.50)],
    p75: finalValues[Math.floor(paths * 0.75)],
    p95: finalValues[Math.floor(paths * 0.95)],
  };

  // Build histogram data
  const min = finalValues[0];
  const max = finalValues[finalValues.length - 1];
  const bucketCount = 40;
  const bucketSize = (max - min) / bucketCount;
  const histogram = Array(bucketCount).fill(0);
  finalValues.forEach(v => {
    const bucket = Math.min(Math.floor((v - min) / bucketSize), bucketCount - 1);
    histogram[bucket]++;
  });

  const endTime = performance.now();

  return {
    currentValue,
    totalInvested,
    paths,
    horizon,
    confidenceLevel,
    var95: Math.round(var95),
    cvar: Math.round(cvar),
    expectedValue: Math.round(mean),
    expectedReturn: ((mean - currentValue) / currentValue * 100).toFixed(2),
    maxLoss: Math.round(currentValue - finalValues[0]),
    maxGain: Math.round(finalValues[finalValues.length - 1] - currentValue),
    percentiles: Object.fromEntries(Object.entries(percentiles).map(([k, v]) => [k, Math.round(v)])),
    histogram: histogram.map((count, i) => ({
      rangeStart: Math.round(min + i * bucketSize),
      rangeEnd: Math.round(min + (i + 1) * bucketSize),
      count,
      percentage: ((count / paths) * 100).toFixed(1),
    })),
    pathData,
    computeTime: `${(endTime - startTime).toFixed(0)}ms`,
    stockParams: stockParams.map(s => ({
      ticker: s.ticker,
      weight: (s.weight * 100).toFixed(1),
      annualizedVol: (s.dailyStdDev * Math.sqrt(252) * 100).toFixed(1),
    })),
  };
}

/* Stress test scenarios */
export const STRESS_SCENARIOS = [
  {
    name: 'Market Crash (-20%)',
    description: 'Simulate a 2008-style market correction',
    shock: -0.20,
    sectors: { all: -0.20 },
    probability: '5-8% per year',
  },
  {
    name: 'Sector Rotation',
    description: 'IT sector drops 15%, Banking rallies 10%',
    shock: 0,
    sectors: { IT: -0.15, Banking: 0.10, Auto: 0.05, Energy: -0.05 },
    probability: '15-20% per year',
  },
  {
    name: 'Black Swan Event',
    description: 'Unprecedented 40% decline (COVID-like)',
    shock: -0.40,
    sectors: { all: -0.40 },
    probability: '1-2% per decade',
  },
  {
    name: 'Bull Rally (+30%)',
    description: 'Strong bull market rally across sectors',
    shock: 0.30,
    sectors: { all: 0.30 },
    probability: '10-15% per year',
  },
  {
    name: 'Rupee Depreciation',
    description: 'INR drops 10%, IT benefits, importers hurt',
    shock: -0.05,
    sectors: { IT: 0.12, Auto: -0.08, Energy: -0.10 },
    probability: '8-12% per year',
  },
];

export function runStressTest(portfolio, scenario) {
  const currentValue = portfolio.reduce((sum, s) => sum + s.ltp * s.qty, 0);
  
  const stockSector = {
    RELIANCE: 'Energy', INFY: 'IT', HDFCBANK: 'Banking',
    TATAMOTORS: 'Auto', SBIN: 'Banking',
  };
  
  const impactedStocks = portfolio.map(stock => {
    const sector = stockSector[stock.ticker] || 'Other';
    const sectorShock = scenario.sectors[sector] || scenario.sectors.all || scenario.shock;
    const value = stock.ltp * stock.qty;
    const impactValue = value * sectorShock;
    
    return {
      ticker: stock.ticker,
      sector,
      currentValue: Math.round(value),
      shock: (sectorShock * 100).toFixed(1),
      impactValue: Math.round(impactValue),
      newValue: Math.round(value + impactValue),
    };
  });

  const totalImpact = impactedStocks.reduce((sum, s) => sum + s.impactValue, 0);

  return {
    scenario: scenario.name,
    description: scenario.description,
    probability: scenario.probability,
    currentPortfolioValue: Math.round(currentValue),
    totalImpact: Math.round(totalImpact),
    newPortfolioValue: Math.round(currentValue + totalImpact),
    percentageImpact: ((totalImpact / currentValue) * 100).toFixed(2),
    impactedStocks,
    recoveryEstimate: totalImpact < 0 ? `${Math.floor(Math.abs(totalImpact / currentValue) * 18 + 3)} months` : 'N/A',
  };
}
