/**
 * TITAN — Popup Script
 * Shows live agent status and quick stats in the extension popup.
 */

document.addEventListener('DOMContentLoaded', async () => {
  const statusDot = document.getElementById('popup-status-dot');
  const statusText = document.getElementById('popup-status-text');
  const pnlEl = document.getElementById('popup-pnl');
  const tradesEl = document.getElementById('popup-trades');

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);

    const response = await fetch('http://localhost:8080/health', {
      signal: controller.signal,
    });
    const data = await response.json();

    if (data.agent_running && !data.agent_paused) {
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Agent is ACTIVE';
    } else if (data.agent_paused) {
      statusDot.className = 'status-dot paused';
      statusText.textContent = 'Agent is PAUSED';
    } else {
      statusDot.className = 'status-dot';
      statusText.textContent = 'Agent is IDLE';
    }

    // Try to get stats
    try {
      const statusRes = await fetch('http://localhost:8080/api/v1/agent/status', {
        signal: AbortSignal.timeout(3000),
      });
      const stats = await statusRes.json();
      if (stats.portfolio_pnl_today !== undefined) {
        const pnl = stats.portfolio_pnl_today;
        pnlEl.textContent = `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toFixed(0)}`;
        pnlEl.classList.toggle('negative', pnl < 0);
      }
      if (stats.trades_today !== undefined) {
        tradesEl.textContent = stats.trades_today;
      }
    } catch { /* Stats optional */ }

  } catch (err) {
    statusDot.className = 'status-dot';
    statusText.textContent = 'Demo Mode (No Backend)';
    pnlEl.textContent = '₹0';
    pnlEl.style.color = '#5a5e72';
  }
});
