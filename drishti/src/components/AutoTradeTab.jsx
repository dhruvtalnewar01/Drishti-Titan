import { useState } from 'react';
import { SIGNALS, PORTFOLIO } from '../data.js';
import { autoTradeEngine } from '../engine/autoTrade.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

export default function AutoTradeTab() {
  const [pnlData, setPnlData] = useState(autoTradeEngine.getPnLSummary());
  const [lastTrade, setLastTrade] = useState(null);

  const executeTrade = (signal) => {
    const result = autoTradeEngine.executeTrade(signal, PORTFOLIO);
    setLastTrade(result);
    setPnlData(autoTradeEngine.getPnLSummary());
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          AutoTrade Paper Engine
          <span style={{ fontSize: 9, color: '#00E5A0', background: 'rgba(0,229,160,0.06)', padding: '2px 8px', borderRadius: 10, fontWeight: 600, border: '1px solid rgba(0,229,160,0.12)' }}>SENTINEL APPROVED ONLY</span>
        </div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Kelly Criterion sizing · risk management · slippage model · paper P&L tracking</div>
      </div>

      {/* P&L Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Paper Balance', value: `₹${pnlData.paperBalance.toLocaleString('en-IN')}`, color: '#f8fafc', icon: '💰' },
          { label: 'Portfolio Value', value: `₹${pnlData.portfolioValue.toLocaleString('en-IN')}`, color: '#f8fafc', icon: '📊' },
          { label: 'Total P&L', value: `₹${pnlData.totalPnL.toLocaleString('en-IN')}`, color: pnlData.totalPnL >= 0 ? '#10b981' : '#ef4444', icon: '📈' },
          { label: 'Win Rate', value: `${pnlData.winRate}%`, color: '#00E5A0', icon: '🎯' },
          { label: 'Open Positions', value: `${pnlData.openPositions}`, color: '#38bdf8', icon: '📋' },
          { label: 'Total Trades', value: `${pnlData.totalTrades}`, color: '#7C5CFC', icon: '🔄' },
        ].map((c, i) => (
          <div key={i} className="glass-card" style={{ animation: `fadeInUp 0.4s ease ${i * 0.06}s both` }}>
            <div style={{ fontSize: 9, color: S.dim, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{c.icon}</span>{c.label}
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: c.color, fontFamily: 'var(--font-mono)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Broker Connections */}
      <div className="glass-card" style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#f8fafc', marginBottom: 10 }}>MCP Broker Connections</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {pnlData.brokers.map(b => (
            <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: '#04070f', borderRadius: 8, border: `1px solid ${S.border}`, fontSize: 11 }}>
              <span>{b.icon}</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{b.name}</span>
              <span style={{ fontSize: 9, color: S.dim }}>{b.api}</span>
              <span style={{ fontSize: 8, color: b.status === 'connected' ? '#10b981' : '#00E5A0', textTransform: 'uppercase', fontWeight: 700 }}>{b.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Signals for Trading */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#f8fafc', marginBottom: 10 }}>Execute Paper Trade</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {SIGNALS.filter(s => s.confidence >= 70).slice(0, 5).map((sig, i) => (
            <div key={sig.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, animation: `fadeInUp 0.3s ease ${i * 0.06}s both` }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{sig.ticker}</span>
                  <span style={{ fontSize: 9, color: sig.impact === 'BULLISH' ? '#10b981' : '#ef4444', fontWeight: 700, background: sig.impact === 'BULLISH' ? '#10b98112' : '#ef444412', padding: '2px 8px', borderRadius: 8 }}>{sig.impact}</span>
                  <span style={{ fontSize: 10, color: S.muted }}>{sig.confidence}% confidence</span>
                </div>
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{sig.signal}</div>
              </div>
              <button onClick={() => executeTrade(sig)}
                style={{ background: sig.impact === 'BULLISH' ? 'linear-gradient(135deg, #0a2018, #0a1a15)' : 'linear-gradient(135deg, #200a0a, #1a0a0a)', border: `1px solid ${sig.impact === 'BULLISH' ? '#10b98140' : '#ef444440'}`, color: sig.impact === 'BULLISH' ? '#10b981' : '#ef4444', borderRadius: 8, padding: '8px 16px', fontSize: 11, fontWeight: 700 }}>
                {sig.impact === 'BULLISH' ? '📈 PAPER BUY' : '📉 PAPER SHORT'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Last Trade Result */}
      {lastTrade && (
        <div className="glass-card" style={{ borderColor: lastTrade.executed ? '#10b98130' : '#ef444430', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: lastTrade.executed ? '#10b981' : '#ef4444', marginBottom: 10 }}>
            {lastTrade.executed ? '✅ Trade Executed' : '❌ Trade Rejected'}
          </div>
          {lastTrade.executed ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
              <div style={{ color: S.dim }}>Ticker: <span style={{ color: '#f8fafc' }}>{lastTrade.trade.ticker}</span></div>
              <div style={{ color: S.dim }}>Type: <span style={{ color: '#f8fafc' }}>{lastTrade.trade.type}</span></div>
              <div style={{ color: S.dim }}>Entry Price: <span style={{ color: '#f8fafc' }}>₹{lastTrade.trade.entryPrice}</span></div>
              <div style={{ color: S.dim }}>Quantity: <span style={{ color: '#f8fafc' }}>{lastTrade.trade.quantity}</span></div>
              <div style={{ color: S.dim }}>Stop Loss: <span style={{ color: '#ef4444' }}>₹{lastTrade.trade.stopLoss}</span></div>
              <div style={{ color: S.dim }}>Target: <span style={{ color: '#10b981' }}>₹{lastTrade.trade.target}</span></div>
              <div style={{ color: S.dim }}>Slippage: <span style={{ color: '#00E5A0' }}>{lastTrade.slippage.totalSlippage} bps</span></div>
              <div style={{ color: S.dim }}>Kelly Size: <span style={{ color: '#7C5CFC' }}>{lastTrade.sizing.halfKelly}%</span></div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8', fontSize: 11 }}>Reason: {lastTrade.reason}</div>
          )}
          {lastTrade.riskCheck && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 10, color: S.dim, marginBottom: 4 }}>Risk Checks:</div>
              {lastTrade.riskCheck.checks.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>
                  <span style={{ color: c.passed ? '#10b981' : '#ef4444' }}>{c.passed ? '✓' : '✗'}</span>
                  <span>{c.name}: {c.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
