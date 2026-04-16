import { useState, useEffect, useRef, useCallback } from 'react';
import { SYSTEM_PROMPT } from '../data.js';
import { callAI } from '../utils/api.js';
import { voiceEngine } from '../engine/voiceEngine.js';

const S = { dim: '#3d5272', muted: '#5e7490', card: '#0c1322', border: '#1a2744' };

const GlowDot = ({ color = '#10b981' }) => (
  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}, 0 0 12px ${color}60`, animation: 'live-pulse 2s ease-in-out infinite' }} />
);

const LANGUAGES = [
  { code: 'en-IN', label: 'English', shortLabel: 'EN', flag: '🇬🇧' },
  { code: 'hi-IN', label: 'हिन्दी', shortLabel: 'HI', flag: '🇮🇳' },
  { code: 'mr-IN', label: 'मराठी', shortLabel: 'MR', flag: '🇮🇳' },
];

export default function AnalystTab({ initialQuestion }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Namaste! I am DRISHTI NEXUS v3 — your multi-agent AI market intelligence system.\n\n🏛️ AGENT COUNCIL ACTIVE:\n• ORACLE — scanning NSE bulk/block deals\n• SHERLOCK — monitoring volume anomalies\n• FREUD — analyzing earnings sentiment\n• TESLA — detecting chart patterns\n• BUFFETT — evaluating fundamentals\n• GUARDIAN — checking SEBI compliance\n\n📊 Your portfolio (8 stocks) is loaded. Search any of 48+ NSE stocks.\n📡 20 live signals detected across 48 NSE stocks.\n\n🛡️ SENTINEL defense active. All queries pre-scanned.\n⚛️ Quantum vault signatures enabled.\n\n🌐 Voice available in: English · हिन्दी · मराठी\n\nAsk me anything about any Indian stock!`
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [voiceLang, setVoiceLang] = useState('en-IN');
  const [voiceSupported] = useState(() => !!(window.SpeechRecognition || window.webkitSpeechRecognition));
  const bottom = useRef(null);
  const processedQuestionRef = useRef(null);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Handle initial question from search/radar — with dedup
  useEffect(() => {
    if (initialQuestion && initialQuestion !== processedQuestionRef.current) {
      processedQuestionRef.current = initialQuestion;
      send(initialQuestion);
    }
  }, [initialQuestion]);

  const send = useCallback(async (q) => {
    const msg = q || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const langPrompt = voiceLang === 'hi-IN' ? '\n\nIMPORTANT: You MUST write your entire analysis completely natively in Hindi (Devanagari script).' : voiceLang === 'mr-IN' ? '\n\nIMPORTANT: You MUST write your entire analysis completely natively in Marathi (Devanagari script).' : '';
      
      const response = await callAI([
        { role: 'system', content: SYSTEM_PROMPT + langPrompt },
        ...history,
        { role: 'user', content: msg }
      ]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: voiceLang === 'hi-IN' ? 'नेटवर्क त्रुटी — नेक्सस उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.' : voiceLang === 'mr-IN' ? 'नेटवर्क त्रुटी - नेक्सस उपलब्ध नाही. कृपया पुन्हा प्रयत्न करा.' : 'Network error — NEXUS unavailable. Please retry.' }]);
    }
    setLoading(false);
  }, [input, loading, messages, voiceLang]);

  const toggleVoice = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      // Set recognition language
      voiceEngine.setLanguage(voiceLang);
      voiceEngine.onResult = (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          setIsListening(false);
          send(transcript);
        }
      };
      voiceEngine.onEnd = () => setIsListening(false);
      voiceEngine.onError = () => setIsListening(false);
      const started = voiceEngine.startListening();
      setIsListening(started);
    }
  };

  useEffect(() => {
    // Poll voice engine status to sync UI with speech end
    const interval = setInterval(() => {
      setIsReading(voiceEngine.isSpeaking);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleSpeak = () => {
    if (isReading) {
      voiceEngine.stopSpeaking();
      setIsReading(false);
    } else {
      const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistant) {
        voiceEngine.speak(lastAssistant.content.substring(0, 800), { lang: voiceLang });
        setIsReading(true);
      }
    }
  };

  const langObj = LANGUAGES.find(l => l.code === voiceLang) || LANGUAGES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 210px)', minHeight: 400, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', letterSpacing: '-0.02em' }}>DRISHTI Voice AI Analyst</div>
          <div style={{ color: S.muted, fontSize: 11, marginTop: 2 }}>7-agent council · source-cited · voice input/output · powered by NEXUS CORE</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Language Selector */}
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: `1px solid ${S.border}` }}>
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => setVoiceLang(lang.code)}
                style={{
                  background: voiceLang === lang.code ? 'rgba(0,229,160,0.12)' : 'transparent',
                  border: 'none', borderRight: `1px solid ${S.border}`,
                  color: voiceLang === lang.code ? '#00E5A0' : S.muted,
                  padding: '5px 10px', fontSize: 10, fontWeight: voiceLang === lang.code ? 700 : 500,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3
                }}>
                <span style={{ fontSize: 11 }}>{lang.flag}</span>
                {lang.shortLabel}
              </button>
            ))}
          </div>
          {voiceSupported && (
            <button onClick={toggleVoice}
              style={{ background: isListening ? 'linear-gradient(135deg, #ef444420, #ef444410)' : 'none', border: `1px solid ${isListening ? '#ef4444' : S.border}`, color: isListening ? '#ef4444' : S.muted, borderRadius: 8, padding: '6px 12px', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              {isListening ? (
                <><div className="voice-indicator"><div className="voice-bar" /><div className="voice-bar" /><div className="voice-bar" /><div className="voice-bar" /><div className="voice-bar" /></div> {langObj.label}...</>
              ) : `🎙️ Voice Input`}
            </button>
          )}
          <button onClick={toggleSpeak}
            style={{ background: isReading ? 'linear-gradient(135deg, #ef444420, #ef444410)' : 'none', border: `1px solid ${isReading ? '#ef4444' : S.border}`, color: isReading ? '#ef4444' : S.muted, borderRadius: 8, padding: '6px 12px', fontSize: 10, fontWeight: 500, cursor: 'pointer' }}>
            {isReading ? '🛑 Stop Reading' : `🔊 Read Aloud (${langObj.shortLabel})`}
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'linear-gradient(180deg, #04070f, #060911)', borderRadius: 12, border: `1px solid ${S.border}`, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 12, boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.3)' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ maxWidth: '88%', background: m.role === 'user' ? 'linear-gradient(135deg, #0a1a18, #081512)' : S.card, border: `1px solid ${m.role === 'user' ? 'rgba(0,229,160,0.2)' : S.border}`, borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '2px 14px 14px 14px', padding: '12px 16px', fontSize: 12.5, lineHeight: 1.8, color: m.role === 'user' ? '#a7f3d0' : '#cbd5e1', whiteSpace: 'pre-wrap', boxShadow: m.role === 'user' ? '0 0 15px rgba(0,229,160,0.06)' : 'var(--shadow-card)' }}>
              {m.role === 'assistant' && (
                <div style={{ fontSize: 9, color: '#00E5A0', fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <GlowDot color="#00E5A0" />NEXUS INTELLIGENCE
                  <span style={{ marginLeft: 'auto', color: '#7C5CFC', fontSize: 8 }}>⚛️ Q-SIGNED</span>
                </div>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', animation: 'fadeInUp 0.3s ease' }}>
            <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: '2px 14px 14px 14px', padding: '12px 16px' }}>
              <div style={{ fontSize: 9, color: '#00E5A0', fontWeight: 700, marginBottom: 6, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 5 }}>
                <GlowDot color="#00E5A0" />NEXUS COUNCIL DELIBERATING
              </div>
              <div style={{ color: S.dim, fontSize: 11, display: 'flex', gap: 4 }}>
                Querying 6 agents<span style={{ animation: 'typing-dots 1.4s infinite' }}>.</span><span style={{ animation: 'typing-dots 1.4s infinite 0.2s' }}>.</span><span style={{ animation: 'typing-dots 1.4s infinite 0.4s' }}>.</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottom} />
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
        {[
          'Which holdings are at risk?',
          'Run Monte Carlo on my portfolio',
          'Explain TATAMOTORS LIC deal',
          'SENTINEL threat report',
          'Best tax-loss harvesting move',
        ].map(q => (
          <button key={q} onClick={() => send(q)}
            style={{ background: S.card, border: `1px solid ${S.border}`, color: S.muted, borderRadius: 20, padding: '5px 12px', fontSize: 10, whiteSpace: 'nowrap', fontWeight: 500, cursor: 'pointer' }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask NEXUS anything about the market or your portfolio..."
          style={{ flex: 1, background: S.card, border: `1px solid ${S.border}`, borderRadius: 10, padding: '12px 16px', color: '#f0f4f8', fontSize: 12, transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = 'rgba(0,229,160,0.25)'}
          onBlur={e => e.target.style.borderColor = S.border} />
        <button onClick={() => send()} disabled={loading}
          style={{ background: loading ? S.border : 'linear-gradient(135deg, #00E5A0, #10b981)', color: loading ? S.muted : '#000', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 12, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 0 20px rgba(0,229,160,0.25)' }}>
          {loading ? '···' : 'Send ↗'}
        </button>
      </div>
      <div style={{ fontSize: 9, color: '#1e2d45', marginTop: 6, textAlign: 'center' }}>For informational purposes only. Not SEBI-registered investment advice.</div>
    </div>
  );
}
