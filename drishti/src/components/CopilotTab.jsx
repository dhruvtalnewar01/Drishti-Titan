import { useState, useEffect } from 'react';
import { SIGNALS } from '../data.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

const DEMO_COMMANDS = [
  { cmd: 'mcp connect --broker zerodha --mode paper', output: '✓ Connected to Zerodha Kite API (Paper Mode)', type: 'success', delay: 800 },
  { cmd: 'sentinel prescan --signal TATAMOTORS', output: '✓ SENTINEL pre-scan passed. No adversarial vectors.', type: 'success', delay: 600 },
  { cmd: 'council analyze --ticker TATAMOTORS --signal BULK_DEAL', output: '⚡ Running 6-agent council analysis...\n  ORACLE: ACCUMULATE (92%)\n  SHERLOCK: ANOMALY CONFIRMED (89%)\n  FREUD: POSITIVE SHIFT (85%)\n  TESLA: BREAKOUT SIGNAL (88%)\n  BUFFETT: UNDERVALUED (86%)\n  GUARDIAN: APPROVED (94%)\n✓ Consensus: STRONG BUY (89% agreement)', type: 'success', delay: 1500 },
  { cmd: 'autotrade execute --ticker TATAMOTORS --type BUY --sizing kelly', output: '✓ Paper trade executed:\n  Entry: ₹924 | Qty: 108 | Value: ₹99,792\n  Stop Loss: ₹896 | Target: ₹982\n  Kelly Half-Size: 9.4% | Risk: 1.8%', type: 'success', delay: 1000 },
  { cmd: 'quantum sign --trade T-2026-TATA-001', output: '✓ CRYSTALS-Dilithium signature applied\n  Sig: dil-sig-7a3f9c2e8b...\n  NIST FIPS 204 compliant', type: 'success', delay: 500 },
  { cmd: 'sentinel postvalidate --output LAST', output: '✓ Post-validation complete. Integrity: 100/100', type: 'success', delay: 400 },
];

export default function CopilotTab() {
  const [lines, setLines] = useState([
    { type: 'system', text: '═══ DRISHTI NEXUS v3 — MCP Copilot Terminal ═══' },
    { type: 'system', text: 'Model Context Protocol (MCP) server active' },
    { type: 'system', text: 'Broker integrations: Zerodha · Groww · Angel One · Upstox' },
    { type: 'system', text: 'Type "demo" to run automated trade flow, or enter commands manually.\n' },
  ]);
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [cmdIndex, setCmdIndex] = useState(0);

  const runDemo = async () => {
    if (isRunning) return;
    setIsRunning(true);
    
    for (let i = 0; i < DEMO_COMMANDS.length; i++) {
      const demo = DEMO_COMMANDS[i];
      // Show command
      setLines(prev => [...prev, { type: 'prompt', text: `nexus@mcp:~$ ${demo.cmd}` }]);
      
      // Wait for "processing"
      await new Promise(r => setTimeout(r, demo.delay));
      
      // Show output
      setLines(prev => [...prev, { type: demo.type, text: demo.output }]);
      await new Promise(r => setTimeout(r, 300));
    }
    
    setLines(prev => [...prev, { type: 'system', text: '\n✓ Full MCP trade flow complete. All layers verified.' }]);
    setIsRunning(false);
  };

  const handleCommand = (cmd) => {
    if (!cmd.trim()) return;
    setInput('');
    setLines(prev => [...prev, { type: 'prompt', text: `nexus@mcp:~$ ${cmd}` }]);
    
    if (cmd.toLowerCase() === 'demo') {
      runDemo();
      return;
    }
    if (cmd.toLowerCase() === 'clear') {
      setLines([{ type: 'system', text: 'Terminal cleared. Type "demo" or "help".' }]);
      return;
    }
    if (cmd.toLowerCase() === 'help') {
      setLines(prev => [...prev, { type: 'output', text: 'Available commands:\n  demo          — Run automated MCP trade flow\n  status        — Show system status\n  signals       — List active signals\n  brokers       — Show broker connections\n  sentinel      — SENTINEL defense status\n  clear         — Clear terminal\n  help          — Show this help' }]);
      return;
    }
    if (cmd.toLowerCase() === 'status') {
      setLines(prev => [...prev, { type: 'success', text: `NEXUS v3 Status:\n  Agents: 6/6 online\n  SENTINEL: Active (GREEN)\n  Data Sources: 5/5 connected\n  Quantum Vault: LOCKED\n  MCP Server: Running\n  Paper Balance: ₹10,00,000` }]);
      return;
    }
    if (cmd.toLowerCase() === 'signals') {
      const sigText = SIGNALS.slice(0, 5).map(s => `  ${s.ticker.padEnd(12)} ${s.impact.padEnd(8)} ${s.confidence}% ${s.signal.substring(0, 50)}...`).join('\n');
      setLines(prev => [...prev, { type: 'output', text: `Active Signals (${SIGNALS.length}):\n${sigText}` }]);
      return;
    }
    if (cmd.toLowerCase() === 'brokers') {
      setLines(prev => [...prev, { type: 'success', text: 'Broker Connections:\n  🟢 Zerodha    — Kite Connect API v3 (connected)\n  🟡 Groww      — Groww Trading API (ready)\n  🟡 Angel One  — SmartAPI v2 (ready)\n  🟡 Upstox     — Upstox API v2 (ready)' }]);
      return;
    }
    if (cmd.toLowerCase() === 'sentinel') {
      setLines(prev => [...prev, { type: 'success', text: 'SENTINEL Defense Status:\n  Threat Level: GREEN\n  Total Scans: 47\n  Blocked: 0\n  Success Rate: 100%\n  Last Scan: Just now\n  Checks: Injection ✓ Replay ✓ Social ✓ Poisoning ✓' }]);
      return;
    }
    
    setLines(prev => [...prev, { type: 'error', text: `Command not found: ${cmd}. Type "help" for available commands.` }]);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
          Copilot MCP Terminal
          <span style={{ fontSize: 9, color: '#10b981', background: '#10b98112', padding: '2px 8px', borderRadius: 10, fontWeight: 600, border: '1px solid #10b98120' }}>MCP SERVER ACTIVE</span>
        </div>
        <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>Model Context Protocol · broker integration · automated trade execution flow</div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <button onClick={runDemo} disabled={isRunning}
          style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #10b98140', background: 'linear-gradient(135deg, #0a2018, #0a1a15)', color: '#10b981', fontSize: 11, fontWeight: 700 }}>
          {isRunning ? '⏳ Running...' : '▶ Run Full Demo'}
        </button>
        {['status', 'signals', 'brokers', 'sentinel'].map(cmd => (
          <button key={cmd} onClick={() => handleCommand(cmd)}
            style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${S.border}`, background: 'none', color: S.muted, fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}>
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal */}
      <div className="copilot-terminal">
        {lines.map((line, i) => (
          <div key={i} className="copilot-line" style={{ animation: 'fadeIn 0.2s ease' }}>
            {line.type === 'prompt' && <span className="copilot-prompt">$</span>}
            <span className={
              line.type === 'success' ? 'copilot-success' :
              line.type === 'error' ? 'copilot-error' :
              line.type === 'prompt' ? '' : 'copilot-output'
            } style={{ whiteSpace: 'pre-wrap', color: line.type === 'prompt' ? '#00E5A0' : undefined }}>
              {line.type === 'prompt' ? line.text.replace('nexus@mcp:~$ ', '') : line.text}
            </span>
          </div>
        ))}
        {isRunning && (
          <div style={{ color: '#00E5A0', fontSize: 10, animation: 'typing-dots 1.4s infinite' }}>Processing...</div>
        )}
      </div>

      {/* Command Input */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, background: '#0a0e14', border: `1px solid ${S.border}`, borderRadius: 8, padding: '0 12px' }}>
          <span style={{ color: '#10b981', fontFamily: 'var(--font-mono)', fontSize: 11 }}>nexus@mcp:~$</span>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCommand(input)}
            placeholder="Enter command..."
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#f0f4f8', fontSize: 11, fontFamily: 'var(--font-mono)', padding: '10px 4px' }} />
        </div>
        <button onClick={() => handleCommand(input)}
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#000', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 11, fontWeight: 700 }}>
          Execute
        </button>
      </div>
    </div>
  );
}
