/**
 * ═══════════════════════════════════════════════════════════════
 * TITAN AI Trading Agent v2.0 — God-Level Content Script
 * ═══════════════════════════════════════════════════════════════
 * • Pre-start config (profit target + max loss)
 * • 20+ live data sources scanning animation
 * • Loss-limit warning system with full-screen alert
 * • Draggable panel
 * • Full demo simulation with realistic Indian market data
 * • Multi-agent council reasoning playback
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';
  if (document.getElementById('titan-floating-icon')) return;

  // ═══════════ CONFIG ═══════════
  const API = 'http://localhost:8080';
  const WS_URL = 'ws://localhost:8080/ws/v1/live';

  // ═══════════ STATE ═══════════
  const S = {
    open: false, tab: 'dashboard', running: false, paused: false, demo: true,
    profitTarget: 0, maxLoss: 0, configured: false,
    pnlToday: 0, pnlWeek: 0, winRate: 0, trades: 0, cycles: 0,
    regime: 'UNKNOWN', cb: 0, positions: [], opps: [], log: [],
    history: [], decision: {}, scanProg: 0, lossWarningShown: false,
    totalPnl: 0,
  };

  let ws = null, backend = false, demoTimer = null;

  // ═══════════ STOCK DATA ═══════════
  const STOCKS = [
    { s:'RELIANCE', p:2847.50, sec:'Energy' }, { s:'TCS', p:3988.20, sec:'IT' },
    { s:'HDFCBANK', p:1678.90, sec:'Banking' }, { s:'INFY', p:1523.40, sec:'IT' },
    { s:'ICICIBANK', p:1204.75, sec:'Banking' }, { s:'BHARTIARTL', p:1645.30, sec:'Telecom' },
    { s:'SBIN', p:823.60, sec:'Banking' }, { s:'WIPRO', p:462.80, sec:'IT' },
    { s:'TATAMOTORS', p:978.45, sec:'Auto' }, { s:'BAJFINANCE', p:7234.10, sec:'Finance' },
    { s:'MARUTI', p:12340.50, sec:'Auto' }, { s:'LT', p:3456.90, sec:'Infra' },
    { s:'NESTLEIND', p:2567.80, sec:'FMCG' }, { s:'ADANIENT', p:3145.70, sec:'Infra' },
    { s:'ULTRACEMCO', p:11230.00, sec:'Cement' },
  ];

  const SOURCES = [
    { icon:'📊', name:'Tickertape — Fundamental Analysis', cat:'Analysis' },
    { icon:'🔍', name:'Screener.in — Financial Statements', cat:'Analysis' },
    { icon:'📈', name:'Trendlyne — DVM Scores & Momentum', cat:'Analysis' },
    { icon:'🏆', name:'MarketMojo — Quality Analysis', cat:'Analysis' },
    { icon:'📱', name:'StockEdge — Live Market Analytics', cat:'Analysis' },
    { icon:'📉', name:'TradingView — Technical Indicators', cat:'Charts' },
    { icon:'🎯', name:'Chartink — Real-time Screeners', cat:'Charts' },
    { icon:'⚡', name:'GoCharting — Order Flow Analysis', cat:'Charts' },
    { icon:'📰', name:'Moneycontrol — Real-time News', cat:'News' },
    { icon:'🏛️', name:'NSE India — Official Market Data', cat:'Data' },
    { icon:'🏛️', name:'BSE India — Exchange Data Feed', cat:'Data' },
    { icon:'📰', name:'ET Markets — Trend Analysis', cat:'News' },
    { icon:'🌐', name:'Investing.com — Global Markets', cat:'News' },
    { icon:'🔬', name:'ICICI Direct — Research Reports', cat:'Research' },
    { icon:'📋', name:'Angel One — Stock Picks & Reports', cat:'Research' },
    { icon:'🤖', name:'AlgoScreeners — AI Screening', cat:'AI' },
    { icon:'⭐', name:'Morningstar — Mutual Fund Analysis', cat:'Research' },
    { icon:'🧠', name:'Google Gemini 3.1 Pro — AI Engine', cat:'AI' },
    { icon:'🔗', name:'Google Search — Live Grounding', cat:'AI' },
  ];

  const AGENT_MSGS = [
    { a:'SCANNER', m:'Market scan initiated — analyzing NIFTY 50, NIFTY Bank, India VIX...', t:'scan' },
    { a:'SCANNER', m:'NIFTY 50: {NF} (+{NFC}%) | Bank NIFTY: {BN} | VIX: {VIX}', t:'scan' },
    { a:'SCANNER', m:'Sector Heat: IT ↑2.1% | Banking ↑0.8% | Auto ↓0.3% | Pharma ↑1.2%', t:'info' },
    { a:'SCANNER', m:'Top pick: {SYM} — {SEC} sector | Score: {SCORE}/100 | Volume spike detected', t:'scan' },
    { a:'TECHNICAL', m:'Analyzing {SYM} across 5 timeframes (5m, 15m, 1H, 4H, 1D)...', t:'agent' },
    { a:'TECHNICAL', m:'{SYM} — RSI(14): {RSI} | MACD: Bullish crossover | Above 20/50 EMA', t:'info' },
    { a:'TECHNICAL', m:'Confluence: 4/5 timeframes aligned | Support: ₹{SUP} | Resistance: ₹{RES}', t:'ok' },
    { a:'FUNDAMENTAL', m:'Scanning financial data for {SYM} via Screener.in + Tickertape...', t:'agent' },
    { a:'FUNDAMENTAL', m:'{SYM} — PE: {PE} | ROE: {ROE}% | ROCE: {ROCE}% | D/E: 0.23', t:'info' },
    { a:'FUNDAMENTAL', m:'Q4 results: Revenue ↑{REV}% | Net Profit ↑{NP}% | Margins expanding', t:'ok' },
    { a:'SENTIMENT', m:'Scanning Moneycontrol, ET Markets, social feeds for {SYM}...', t:'agent' },
    { a:'SENTIMENT', m:'News Sentiment: +0.{SENT} | Institutional: Net buyer ₹{INS}Cr | FII: Bullish', t:'info' },
    { a:'SENTIMENT', m:'Fear & Greed Index: {FG} ({FGL}) | Social mentions: {SM} (↑{SMC}%)', t:'ok' },
    { a:'BULL', m:'Building bull case: Strong earnings trajectory + sector tailwind + breakout setup', t:'ok' },
    { a:'BULL', m:'Bull Conviction: {BC}/100 — catalyst: upcoming quarterly results + FII buying', t:'ok' },
    { a:'BEAR', m:'Evaluating risks: Overbought RSI on weekly, global macro headwinds...', t:'err' },
    { a:'BEAR', m:'Bear Risk Score: {BR}/100 — watching: sector rotation risk, profit booking zone', t:'err' },
    { a:'JUDGE', m:'⚔️ Weighing Bull ({BC}/100) vs Bear ({BR}/100) arguments...', t:'agent' },
    { a:'JUDGE', m:'⚖️ VERDICT: {DEC} {SYM} @ ₹{PRICE} | Conviction: {CONV}% | R:R {RR}:1', t:'ok' },
    { a:'RISK', m:'Safety check: Position 4.2% capital ✓ | Max risk 0.9% ✓ | SL mandatory ✓', t:'info' },
    { a:'RISK', m:'✓ APPROVED — SL: ₹{SL} | Target: ₹{TGT} | Max loss: ₹{MLOSS}', t:'ok' },
    { a:'EXEC', m:'✓ ORDER EXECUTED — {DEC} {QTY}x {SYM} @ ₹{PRICE} | SL order placed', t:'ok' },
  ];

  // ═══════════ UTILS ═══════════
  const $ = id => document.getElementById(id);
  const now = () => new Date().toLocaleTimeString('en-IN', { hour12: false });
  const r = (a,b) => Math.random()*(b-a)+a;
  const ri = (a,b) => Math.floor(r(a,b+1));
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const inr = v => `${v>=0?'+':'-'}₹${Math.abs(v).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // ═══════════ BUILD FLOATING ICON ═══════════
  const icon = document.createElement('div');
  icon.id = 'titan-floating-icon';
  icon.className = 't-idle';
  icon.innerHTML = `<span class="titan-icon-text">T</span><span id="titan-mini-pnl">₹0</span>`;
  icon.addEventListener('click', () => togglePanel());
  document.body.appendChild(icon);

  // ═══════════ BUILD PANEL ═══════════
  const panel = document.createElement('div');
  panel.id = 'titan-panel';
  panel.innerHTML = buildPanelHTML();
  document.body.appendChild(panel);

  function buildPanelHTML() {
    return `
    <!-- CONFIG MODAL -->
    <div id="titan-config-overlay" class="t-visible">
      <div class="t-config-title">CONFIGURE SESSION</div>
      <div class="t-config-sub">Set your daily targets to activate<br>TITAN's intelligent risk management</div>
      <div class="t-config-field">
        <div class="t-config-label">🎯 Profit Target (₹)</div>
        <input type="number" class="t-config-input t-profit-input" id="titan-cfg-profit" placeholder="e.g. 5000" value="5000" min="100">
        <div class="t-config-hint">Agent will secure gains when target is approached</div>
      </div>
      <div class="t-config-field">
        <div class="t-config-label">🛡️ Maximum Loss Tolerance (₹)</div>
        <input type="number" class="t-config-input t-loss-input" id="titan-cfg-loss" placeholder="e.g. 2000" value="2000" min="100">
        <div class="t-config-hint">Hard stop — agent halts all trading at this limit</div>
      </div>
      <button class="t-config-btn" id="titan-cfg-go">⚡ ACTIVATE TITAN</button>
    </div>

    <!-- SOURCES SCAN OVERLAY -->
    <div id="titan-sources-overlay">
      <div class="t-sources-title">⚡ Live Intelligence Feed</div>
      <div class="t-sources-sub">Connecting to 19 data sources for real-time analysis</div>
      <div id="titan-sources-list"></div>
    </div>

    <!-- LOSS WARNING OVERLAY -->
    <div id="titan-warning-overlay">
      <div class="t-warn-icon">🚨</div>
      <div class="t-warn-title">LOSS LIMIT</div>
      <div class="t-warn-msg">
        Your maximum loss tolerance has been reached.<br>
        TITAN has <strong>halted all trading activity</strong> to protect your capital.
      </div>
      <div class="t-warn-stat" id="titan-warn-amount">-₹0</div>
      <button class="t-warn-btn" id="titan-warn-ack">ACKNOWLEDGE & STOP</button>
    </div>

    <!-- HEADER -->
    <div id="titan-header">
      <div class="t-header-left">
        <span class="t-logo">TITAN</span>
        <span class="t-version">v2.0</span>
      </div>
      <div class="t-header-right">
        <div class="t-status-pill t-s-idle" id="titan-status"><span class="t-s-dot"></span><span id="titan-status-txt">IDLE</span></div>
        <button id="titan-close-btn">✕</button>
      </div>
    </div>

    <!-- TABS -->
    <div id="titan-tabs">
      <button class="t-tab t-active" data-tab="dashboard">Dashboard</button>
      <button class="t-tab" data-tab="analysis">Analysis</button>
      <button class="t-tab" data-tab="trades">Trades</button>
      <button class="t-tab" data-tab="settings">Settings</button>
    </div>

    <!-- CONTENT -->
    <div id="titan-content">
      <!-- DASHBOARD -->
      <div class="t-page t-active" id="tp-dashboard">
        <div id="titan-regime"></div>
        <div class="t-scan-bar"><div class="t-scan-fill" id="titan-scan"></div></div>

        <div class="t-section">Daily Targets</div>
        <div class="t-grid-2">
          <div class="t-card"><div class="t-card-label">🎯 Profit Target</div><div class="t-card-value" id="td-target" style="color:var(--t-profit)">₹0</div></div>
          <div class="t-card"><div class="t-card-label">🛡️ Loss Limit</div><div class="t-card-value" id="td-limit" style="color:var(--t-loss)">₹0</div></div>
        </div>

        <div class="t-loss-meter" id="titan-loss-meter" style="display:none">
          <div class="t-loss-meter-bar"><div class="t-loss-meter-fill t-safe" id="titan-loss-fill" style="width:0%"></div></div>
          <div class="t-loss-meter-labels"><span>Safe</span><span id="titan-loss-pct">0%</span><span>Limit</span></div>
        </div>

        <div class="t-grid-2">
          <div class="t-card"><div class="t-card-label">Today P&L</div><div class="t-card-value" id="td-pnl">₹0.00</div></div>
          <div class="t-card"><div class="t-card-label">This Week</div><div class="t-card-value" id="td-week">₹0.00</div></div>
          <div class="t-card"><div class="t-card-label">Win Rate</div><div class="t-card-value t-info-c" id="td-wr">0%</div></div>
          <div class="t-card"><div class="t-card-label">Cycles</div><div class="t-card-value t-accent-c" id="td-cyc">0</div></div>
        </div>

        <div class="t-card" style="margin-bottom:8px">
          <div class="t-grid-3">
            <div class="t-stat-mini"><div class="t-stat-mini-val" id="td-trades">0</div><div class="t-stat-mini-lbl">Trades</div></div>
            <div class="t-stat-mini"><div class="t-stat-mini-val" id="td-pos">0</div><div class="t-stat-mini-lbl">Positions</div></div>
            <div class="t-stat-mini"><div class="t-stat-mini-val" id="td-cb">0</div><div class="t-stat-mini-lbl">CB Level</div></div>
          </div>
        </div>

        <div class="t-section">Active Positions</div>
        <div id="td-positions"><div class="t-empty">No active positions</div></div>

        <div class="t-btns">
          <button class="t-btn t-btn-primary" id="tb-start">▶ Start</button>
          <button class="t-btn" id="tb-pause">⏸ Pause</button>
          <button class="t-btn t-btn-danger" id="tb-close">⚠ Close All</button>
        </div>
      </div>

      <!-- ANALYSIS -->
      <div class="t-page" id="tp-analysis">
        <div class="t-section">Top Opportunities</div>
        <div id="td-opps"><div class="t-empty">Start agent to scan markets</div></div>
        <div class="t-section" style="margin-top:12px">Latest Verdict</div>
        <div id="td-verdict"><div class="t-empty">Awaiting analysis cycle</div></div>
      </div>

      <!-- TRADES -->
      <div class="t-page" id="tp-trades">
        <div class="t-section">Trade History</div>
        <div id="td-history"><div class="t-empty">No trades yet</div></div>
        <div class="t-section" style="margin-top:12px">AI Reasoning Log</div>
        <div class="t-log" id="td-log">
          <div class="t-log-entry t-l-info">[${now()}] TITAN v2.0 initialized. Configure session to begin.</div>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="t-page" id="tp-settings">
        <div class="t-setting"><div class="t-setting-lbl">Broker</div>
          <select class="t-select" id="ts-broker"><option value="sim">📝 Paper Trading</option><option value="zerodha">🟢 Zerodha</option><option value="groww">🟠 Groww</option></select>
        </div>
        <div class="t-setting"><div class="t-setting-lbl">Agent Mode</div>
          <select class="t-select" id="ts-mode"><option value="analysis">🔍 Analysis Only</option><option value="semi" selected>🤝 Semi-Auto</option><option value="full">🤖 Full Auto</option></select>
        </div>
        <div class="t-setting"><div class="t-setting-lbl">Risk Profile</div>
          <select class="t-select" id="ts-risk"><option value="conservative">🛡️ Conservative</option><option value="moderate" selected>⚖️ Moderate</option><option value="aggressive">🔥 Aggressive</option></select>
        </div>
        <div class="t-setting"><div class="t-setting-lbl">Max Capital (₹)</div>
          <input type="range" class="t-slider" id="ts-cap" min="10000" max="1000000" step="10000" value="100000">
          <div class="t-slider-val" id="ts-cap-v">₹1,00,000</div>
        </div>
        <div class="t-btns" style="margin-top:16px"><button class="t-btn t-btn-danger" id="tb-kill">🛑 KILL SWITCH</button></div>
      </div>
    </div>

    <!-- FOOTER -->
    <div id="titan-footer">
      <div class="t-footer-l"><span class="t-gem-dot"></span><span>Gemini 3.1 Pro • 19 Sources</span></div>
      <span id="titan-mode">DEMO</span>
    </div>`;
  }

  // ═══════════ EVENT WIRING ═══════════
  $('titan-close-btn').addEventListener('click', togglePanel);
  $('titan-cfg-go').addEventListener('click', onConfigure);
  $('titan-warn-ack').addEventListener('click', onAcknowledgeWarning);
  $('tb-start').addEventListener('click', () => action('start'));
  $('tb-pause').addEventListener('click', () => action('pause'));
  $('tb-close').addEventListener('click', () => action('close'));
  $('tb-kill').addEventListener('click', () => action('kill'));

  document.querySelectorAll('.t-tab').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('.t-tab').forEach(x => x.classList.remove('t-active'));
      t.classList.add('t-active');
      document.querySelectorAll('.t-page').forEach(x => x.classList.remove('t-active'));
      $(`tp-${t.dataset.tab}`).classList.add('t-active');
    });
  });

  const capSlider = $('ts-cap');
  if (capSlider) capSlider.addEventListener('input', e => {
    $('ts-cap-v').textContent = `₹${parseInt(e.target.value).toLocaleString('en-IN')}`;
  });

  // ═══════════ DRAG SYSTEM ═══════════
  let drag = false, dx = 0, dy = 0;
  $('titan-header').addEventListener('mousedown', e => {
    if (e.target.id === 'titan-close-btn') return;
    drag = true; const r = panel.getBoundingClientRect();
    dx = e.clientX - r.left; dy = e.clientY - r.top;
    panel.style.transition = 'none'; document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!drag) return; e.preventDefault();
    const x = Math.max(0, Math.min(e.clientX - dx, innerWidth - panel.offsetWidth));
    const y = Math.max(0, Math.min(e.clientY - dy, innerHeight - panel.offsetHeight));
    panel.style.left = x+'px'; panel.style.top = y+'px';
    panel.style.right = 'auto'; panel.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', () => {
    if (drag) { drag = false; panel.style.transition = ''; document.body.style.userSelect = ''; }
  });

  // ═══════════ CORE ═══════════
  function togglePanel() { S.open = !S.open; panel.classList.toggle('titan-visible', S.open); }

  function onConfigure() {
    const profit = parseInt($('titan-cfg-profit').value) || 5000;
    const loss = parseInt($('titan-cfg-loss').value) || 2000;
    S.profitTarget = profit; S.maxLoss = loss; S.configured = true;
    $('td-target').textContent = `₹${profit.toLocaleString('en-IN')}`;
    $('td-limit').textContent = `₹${loss.toLocaleString('en-IN')}`;
    $('titan-config-overlay').classList.remove('t-visible');
    $('titan-loss-meter').style.display = 'block';
    log('Session configured — Profit target: ₹' + profit.toLocaleString('en-IN') + ' | Max loss: ₹' + loss.toLocaleString('en-IN'), 'ok');
    log('Ready to start. Click ▶ Start to activate the AI council.', 'info');
  }

  function onAcknowledgeWarning() {
    $('titan-warning-overlay').classList.remove('t-visible');
    S.running = false; S.paused = false; stopDemo();
    setStatus('idle');
    log('🛑 Trading halted by loss limit protection. Session ended.', 'err');
  }

  async function action(act) {
    if (!S.configured && act === 'start') {
      $('titan-config-overlay').classList.add('t-visible');
      return;
    }

    switch (act) {
      case 'start':
        if (S.running) return;
        S.running = true; S.paused = false; S.lossWarningShown = false;
        setStatus('scanning');
        log('⚡ TITAN v2.0 ACTIVATED — initializing multi-source intelligence...', 'ok');
        $('titan-mode').textContent = 'LIVE DEMO';
        await showSourcesScan();
        setStatus('active');
        startDemo();
        break;
      case 'pause':
        S.paused = !S.paused;
        setStatus(S.paused ? 'paused' : 'active');
        log(S.paused ? '⏸ Agent paused' : '▶ Agent resumed', S.paused ? 'warn' : 'ok');
        break;
      case 'close':
        log('⚠️ Emergency close — all positions liquidated', 'err');
        S.positions = []; renderPositions();
        break;
      case 'kill':
        S.running = false; S.paused = false; stopDemo();
        setStatus('idle'); S.cb = 3;
        log('🛑 KILL SWITCH — all operations terminated', 'err');
        break;
    }
  }

  // ═══════════ SOURCES SCAN ANIMATION ═══════════
  async function showSourcesScan() {
    const overlay = $('titan-sources-overlay');
    const list = $('titan-sources-list');
    list.innerHTML = SOURCES.map((s,i) => `
      <div class="t-source-item" id="tsrc-${i}">
        <span class="t-src-icon">${s.icon}</span>
        <span class="t-src-name">${s.name}</span>
        <span class="t-src-status t-src-wait" id="tsrc-s-${i}">WAITING</span>
      </div>
    `).join('');
    overlay.classList.add('t-visible');

    for (let i = 0; i < SOURCES.length; i++) {
      if (!S.running) break;
      const item = $(`tsrc-${i}`);
      const stat = $(`tsrc-s-${i}`);
      item.classList.add('t-src-visible', 't-src-scanning');
      stat.className = 't-src-status t-src-fetching';
      stat.textContent = 'FETCHING...';
      await sleep(120 + Math.random() * 180);
      item.classList.remove('t-src-scanning');
      item.classList.add('t-src-done');
      stat.className = 't-src-status t-src-ok';
      stat.textContent = '✓ SYNCED';
    }

    log('✓ All 19 data sources connected and synced', 'ok');
    await sleep(600);
    overlay.classList.remove('t-visible');
  }

  // ═══════════ STATUS ═══════════
  function setStatus(s) {
    const pill = $('titan-status'); const txt = $('titan-status-txt');
    pill.className = `t-status-pill t-s-${s}`;
    txt.textContent = { idle:'IDLE', active:'ACTIVE', scanning:'SCANNING', paused:'PAUSED', danger:'⚠ DANGER' }[s] || 'IDLE';
    icon.className = { active: S.pnlToday >= 0 ? 't-profit' : 't-loss', scanning:'t-scanning', paused:'t-paused', danger:'t-loss', idle:'t-idle' }[s] || 't-idle';
  }

  // ═══════════ LOSS LIMIT CHECK ═══════════
  function checkLossLimit() {
    if (!S.configured || S.maxLoss <= 0) return;
    const loss = Math.abs(Math.min(0, S.pnlToday));
    const pct = (loss / S.maxLoss) * 100;
    const fill = $('titan-loss-fill');
    const lbl = $('titan-loss-pct');
    if (fill) {
      fill.style.width = Math.min(pct, 100) + '%';
      fill.className = 't-loss-meter-fill ' + (pct < 50 ? 't-safe' : pct < 80 ? 't-caution' : 't-danger');
    }
    if (lbl) lbl.textContent = pct.toFixed(0) + '%';

    if (pct >= 80 && pct < 100 && !S.lossWarningShown) {
      log('⚠️ WARNING: Approaching loss limit (' + pct.toFixed(0) + '% used). Reducing position sizes.', 'warn');
      setStatus('danger');
    }

    if (loss >= S.maxLoss && !S.lossWarningShown) {
      S.lossWarningShown = true;
      S.running = false;
      stopDemo();
      $('titan-warn-amount').textContent = `-₹${loss.toLocaleString('en-IN', {minimumFractionDigits:2})}`;
      $('titan-warning-overlay').classList.add('t-visible');
      setStatus('danger');
      log('🚨 LOSS LIMIT REACHED — ALL TRADING HALTED', 'err');
    }
  }

  // ═══════════ UI UPDATES ═══════════
  function log(msg, type='') {
    const c = $('td-log'); if (!c) return;
    const e = document.createElement('div');
    e.className = `t-log-entry ${type ? `t-l-${type}` : ''}`;
    e.textContent = `[${now()}] ${msg}`;
    c.prepend(e);
    while (c.children.length > 80) c.removeChild(c.lastChild);
  }

  function updPnl(id, v) { const e = $(id); if(!e) return; e.textContent = inr(v); e.classList.toggle('t-neg', v < 0); }

  function updRegime(regime) {
    const c = $('titan-regime'); if(!c) return;
    const cls = { TRENDING_UP:'t-up', TRENDING_DOWN:'t-down', RANGING:'t-range', HIGH_VOLATILITY:'t-vol' };
    const lbl = { TRENDING_UP:'📈 Trending Up', TRENDING_DOWN:'📉 Trending Down', RANGING:'↔️ Ranging', HIGH_VOLATILITY:'⚡ High Volatility' };
    c.innerHTML = `<span class="t-regime-pill ${cls[regime]||'t-range'}">${lbl[regime]||regime}</span>`;
  }

  function renderPositions() {
    const c = $('td-positions'); if(!c) return;
    if (!S.positions.length) { c.innerHTML = '<div class="t-empty">No active positions</div>'; $('td-pos').textContent='0'; return; }
    $('td-pos').textContent = S.positions.length;
    c.innerHTML = S.positions.map(p => `<div class="t-row"><div><div class="t-row-sym">${p.sym}</div><div class="t-row-meta">${p.qty}x @ ₹${p.entry.toFixed(2)} • ${p.dir}</div></div><div class="t-row-val ${p.pnl>=0?'t-green':'t-red'}">${inr(p.pnl)}</div></div>`).join('');
  }

  function renderOpps() {
    const c = $('td-opps'); if(!c || !S.opps.length) return;
    c.innerHTML = S.opps.map(o => `<div class="t-row"><div><div class="t-row-sym">${o.sym}</div><div class="t-row-meta">${o.sec} • ₹${o.price.toFixed(2)}</div></div><span class="t-score ${o.score>=75?'t-score-hi':'t-score-md'}">${o.score}%</span></div>`).join('');
  }

  function renderVerdict() {
    const c = $('td-verdict'), d = S.decision; if(!c || !d.act) return;
    const ac = d.act === 'BUY' ? 't-buy' : d.act === 'SELL' ? 't-sell' : 't-hold';
    c.innerHTML = `<div class="t-verdict"><div class="t-verdict-action ${ac}">${d.act}</div><div class="t-verdict-det">${d.sym} @ ₹${d.price?.toFixed(2)||'0'}<br>SL: ₹${d.sl?.toFixed(2)||'0'} • Target: ₹${d.tgt?.toFixed(2)||'0'}</div><div class="t-verdict-conv">Conviction: ${d.conv}%</div></div>`;
  }

  function renderHistory() {
    const c = $('td-history'); if(!c || !S.history.length) return;
    c.innerHTML = S.history.slice(0,12).map(t => `<div class="t-row"><div><div class="t-row-sym">${t.dir} ${t.sym}</div><div class="t-row-meta">${t.qty}x @ ₹${t.price.toFixed(2)}</div></div><div class="t-row-val ${t.pnl>=0?'t-green':'t-red'}">${inr(t.pnl)}</div></div>`).join('');
  }

  function updMini() {
    const e = $('titan-mini-pnl'); if(!e) return;
    e.textContent = `${S.pnlToday>=0?'+':''}₹${Math.abs(S.pnlToday).toFixed(0)}`;
    e.classList.toggle('t-neg', S.pnlToday < 0);
  }

  // ═══════════ DEMO ENGINE ═══════════
  function startDemo() { if (demoTimer) return; runCycle(); demoTimer = setInterval(() => { if (S.running && !S.paused) runCycle(); }, 9000); }
  function stopDemo() { if (demoTimer) { clearInterval(demoTimer); demoTimer = null; } $('titan-scan').style.width = '0%'; }

  async function runCycle() {
    S.cycles++;
    $('td-cyc').textContent = S.cycles;

    const stock = pick(STOCKS);
    const regime = pick(['TRENDING_UP','TRENDING_UP','RANGING','HIGH_VOLATILITY']);
    S.regime = regime; updRegime(regime);

    setStatus('scanning');
    animScan();

    const dec = pick(['BUY','BUY','BUY','HOLD','HOLD','SELL']);
    const conv = ri(60, 94);
    const bull = ri(60, 90), bear = ri(25, 55);
    const rsi = ri(45, 75), pe = r(12,35).toFixed(1), roe = r(12,26).toFixed(1), roce = r(14,30).toFixed(1);
    const nf = (22000+r(-500,500)).toFixed(0), nfc = r(-0.5,1.5).toFixed(2);
    const bn = (47000+r(-800,800)).toFixed(0), vix = r(11,18).toFixed(1);

    const rep = {
      '{SYM}': stock.s, '{PRICE}': stock.p.toFixed(2), '{SEC}': stock.sec,
      '{SCORE}': ri(72,96), '{DEC}': dec, '{CONV}': conv,
      '{SL}': (stock.p*0.97).toFixed(2), '{TGT}': (stock.p * (dec==='BUY'?1.05:0.95)).toFixed(2),
      '{SUP}': (stock.p*0.96).toFixed(2), '{RES}': (stock.p*1.04).toFixed(2),
      '{QTY}': ri(5,25), '{MLOSS}': (stock.p*0.03*ri(5,20)).toFixed(0),
      '{RSI}': rsi, '{PE}': pe, '{ROE}': roe, '{ROCE}': roce,
      '{REV}': ri(8,22), '{NP}': ri(10,35), '{SENT}': ri(55,85),
      '{INS}': ri(80,450), '{FG}': ri(45,75), '{FGL}': ri(55,75)>60?'Greed':'Neutral',
      '{SM}': ri(400,1200), '{SMC}': ri(100,400),
      '{BC}': bull, '{BR}': bear, '{RR}': r(1.8,3.5).toFixed(1),
      '{NF}': nf, '{NFC}': nfc, '{BN}': bn, '{VIX}': vix,
    };

    for (let i = 0; i < AGENT_MSGS.length; i++) {
      if (!S.running || S.paused) break;
      await sleep(280 + Math.random() * 320);
      let msg = `[${AGENT_MSGS[i].a}] ${AGENT_MSGS[i].m}`;
      for (const [k,v] of Object.entries(rep)) msg = msg.replace(new RegExp(k.replace(/[{}]/g,'\\$&'),'g'), v);
      log(msg, AGENT_MSGS[i].t);
    }

    setStatus('active');
    $('titan-scan').style.width = '100%';

    // Opportunities
    S.opps = [];
    for (let i = 0; i < ri(3,5); i++) {
      const st = STOCKS[(STOCKS.indexOf(stock)+i) % STOCKS.length];
      S.opps.push({ sym: st.s, sec: st.sec, price: st.p + r(-50,50), score: ri(60,95) });
    }
    S.opps.sort((a,b) => b.score - a.score);
    renderOpps();

    S.decision = { act: dec, sym: stock.s, price: stock.p, sl: stock.p*0.97, tgt: stock.p*(dec==='BUY'?1.05:0.95), conv };
    renderVerdict();

    // Execute trade
    if (dec === 'BUY' || dec === 'SELL') {
      const qty = ri(5,20);
      // Bias toward profit but include some losses
      const tradePnl = Math.random() < 0.65 ? r(200, 3200) : r(-1800, -100);
      S.pnlToday += tradePnl;
      S.pnlWeek += tradePnl;
      S.trades++;

      S.history.unshift({ sym: stock.s, dir: dec, qty, price: stock.p, pnl: tradePnl });

      if (dec === 'BUY') {
        const ei = S.positions.findIndex(p => p.sym === stock.s);
        if (ei === -1) S.positions.push({ sym: stock.s, dir: 'LONG', qty, entry: stock.p, pnl: r(-300,800) });
      } else {
        const ei = S.positions.findIndex(p => p.sym === stock.s);
        if (ei >= 0) S.positions.splice(ei, 1);
      }

      // Update position P&L
      S.positions.forEach(p => { p.pnl += r(-100, 200); });

      const wins = S.history.filter(t => t.pnl > 0).length;
      S.winRate = S.history.length ? (wins / S.history.length * 100) : 0;
    }

    // Update everything
    updPnl('td-pnl', S.pnlToday);
    updPnl('td-week', S.pnlWeek);
    $('td-wr').textContent = S.winRate.toFixed(1) + '%';
    $('td-trades').textContent = S.trades;
    $('td-cb').textContent = S.cb;
    renderPositions();
    renderHistory();
    updMini();

    icon.className = S.pnlToday >= 0 ? 't-profit' : 't-loss';

    checkLossLimit();

    setTimeout(() => { if (S.running) $('titan-scan').style.width = '0%'; }, 2500);
  }

  function animScan() {
    const fill = $('titan-scan'); if(!fill) return;
    fill.style.width = '0%'; let p = 0;
    const iv = setInterval(() => {
      p += ri(3,14); if (p >= 95) { clearInterval(iv); fill.style.width = '100%'; return; }
      fill.style.width = p + '%';
    }, 180);
  }

  // ═══════════ WEBSOCKET ═══════════
  function connectWS() {
    try {
      ws = new WebSocket(WS_URL);
      ws.onopen = () => { backend = true; S.demo = false; $('titan-mode').textContent = 'LIVE'; log('Connected to TITAN backend', 'ok'); };
      ws.onmessage = e => { try { handleMsg(JSON.parse(e.data)); } catch {} };
      ws.onclose = () => { backend = false; S.demo = true; $('titan-mode').textContent = 'DEMO'; setTimeout(connectWS, 15000); };
      ws.onerror = () => {};
    } catch { setTimeout(connectWS, 15000); }
  }

  function handleMsg(m) {
    if (m.event === 'state_update' && m.data) {
      if (m.data.portfolio_pnl_today !== undefined) { S.pnlToday = m.data.portfolio_pnl_today; updPnl('td-pnl', S.pnlToday); }
      if (m.data.market_regime) updRegime(m.data.market_regime);
      updMini(); checkLossLimit();
    }
  }

  // ═══════════ INIT ═══════════
  (async () => {
    try { const r = await fetch(`${API}/health`, { signal: AbortSignal.timeout(2000) }); if (r.ok) { backend = true; S.demo = false; $('titan-mode').textContent = 'LIVE'; } } catch {}
  })();
  connectWS();
  setInterval(() => { if (ws?.readyState === 1) ws.send(JSON.stringify({ action: 'ping' })); }, 30000);

  console.log('[TITAN] 🚀 v2.0 — Billion-Dollar AI Trading Agent injected');
})();
