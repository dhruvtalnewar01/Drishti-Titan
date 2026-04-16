/**
 * TITAN AI v2.0 — Background Service Worker
 * Handles health checks, badge updates, and notifications.
 */

const API = 'http://localhost:8080';
let agentState = { running: false, pnl: 0 };

// Health check every 60 seconds (silent)
chrome.alarms.create('titan-health', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== 'titan-health') return;

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${API}/health`, { signal: controller.signal });
    const data = await res.json();

    const wasRunning = agentState.running;
    agentState.running = data.agent_running;

    // Update badge
    if (data.agent_running) {
      chrome.action.setBadgeText({ text: '●' });
      chrome.action.setBadgeBackgroundColor({ color: data.agent_paused ? '#FFAB00' : '#00E676' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }

    // Notify on circuit breaker
    if (data.circuit_breaker_level >= 2) {
      chrome.notifications.create('titan-cb', {
        type: 'basic',
        iconUrl: 'assets/icons/icon128.png',
        title: '🚨 TITAN — Circuit Breaker',
        message: `Circuit breaker level ${data.circuit_breaker_level} activated. New trades halted.`,
        priority: 2,
      });
    }

    // Get P&L stats
    try {
      const statusRes = await fetch(`${API}/api/v1/agent/status`, { signal: AbortSignal.timeout(3000) });
      const stats = await statusRes.json();
      agentState.pnl = stats.portfolio_pnl_today || 0;
    } catch { /* Stats optional */ }

  } catch {
    // Backend not running — clear badge silently
    chrome.action.setBadgeText({ text: '' });
    agentState.running = false;
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'getState') {
    sendResponse(agentState);
  }
  return true;
});

console.log('[TITAN] Service worker initialized — v2.0');
