/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — Formatters
   Indian currency, percentage, and number formatting
   ═══════════════════════════════════════════════════════════════ */

export const formatINR = (num) => {
  if (num === undefined || num === null) return '₹0';
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)} L`;
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
};

export const formatINRFull = (num) => {
  if (num === undefined || num === null) return '₹0';
  const sign = num < 0 ? '-' : num > 0 ? '+' : '';
  return `${sign}₹${Math.abs(num).toLocaleString('en-IN')}`;
};

export const formatPercent = (num, decimals = 2) => {
  if (num === undefined || num === null) return '0%';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
};

export const formatLargeNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e7) return `${(num / 1e7).toFixed(1)}Cr`;
  if (num >= 1e5) return `${(num / 1e5).toFixed(1)}L`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toString();
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });
};
