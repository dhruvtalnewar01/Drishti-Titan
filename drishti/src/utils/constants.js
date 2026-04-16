/* ═══════════════════════════════════════════════════════════════
   NEXUS COMMAND CENTER v3 — Constants (Military Command Palette)
   ═══════════════════════════════════════════════════════════════ */

export const COLORS = {
  bg: '#060911',
  bgSecondary: '#0b1120',
  card: '#0c1322',
  cardHover: '#111d33',
  border: '#1a2744',
  borderHover: '#2a3f66',
  text: '#f0f4f8',
  textSecondary: '#b0bec5',
  muted: '#5e7490',
  dim: '#3d5272',
  deep: '#04070f',
  elevated: '#0f1a2e',
  accent: '#00E5A0',
  green: '#10b981',
  red: '#ef4444',
  blue: '#38bdf8',
  purple: '#7C5CFC',
  orange: '#fb923c',
  cyan: '#06b6d4',
  pink: '#ec4899',
  gold: '#f59e0b',
  crisisRed: '#dc2626',
};

export const AGENT_COLORS = {
  oracle: '#00E5A0',
  sherlock: '#38bdf8',
  freud: '#7C5CFC',
  tesla: '#34d399',
  buffett: '#10b981',
  guardian: '#ef4444',
  nexus: '#00E5A0',
  sentinel: '#ec4899',
};

export const TAB_CONFIG = [
  { id: 'command',   label: 'COMMAND CENTER',   icon: '🎯', shortLabel: 'Command' },
  { id: 'council',   label: 'AGENT COUNCIL',    icon: '🤖', shortLabel: 'Council' },
  { id: 'autotrade', label: 'TITAN AUTO-TRADE', icon: '⚡', shortLabel: 'TITAN' },
  { id: 'universe',  label: 'UNIVERSE 3D',      icon: '🌌', shortLabel: 'Universe' },
  { id: 'oracle',    label: 'ORACLE FUTURES',   icon: '🔮', shortLabel: 'Oracle' },
  { id: 'analyst',   label: 'AI ANALYST',       icon: '🧠', shortLabel: 'Analyst' },
  { id: 'riskdna',   label: 'RISK DNA',         icon: '🛡️', shortLabel: 'Risk' },
  { id: 'ledger',    label: 'ALPHA LEDGER',     icon: '💼', shortLabel: 'Alpha' },
  { id: 'geopulse',  label: 'GEO PULSE',        icon: '🌍', shortLabel: 'Geo' },
  { id: 'quantum',   label: 'QUANTUM VAULT',    icon: '⚛️', shortLabel: 'Quantum' },
];

export const SCALE_PHASES = [
  { phase: 1, name: 'Static Deploy', tech: 'Netlify + Vite', users: '100', status: 'active', color: '#10b981' },
  { phase: 2, name: 'Serverless', tech: 'Netlify Functions + Edge', users: '10K', status: 'ready', color: '#38bdf8' },
  { phase: 3, name: 'Container', tech: 'Kubernetes + Redis', users: '1L', status: 'planned', color: '#00E5A0' },
  { phase: 4, name: 'Microservices', tech: 'gRPC + Kafka', users: '10L', status: 'designed', color: '#7C5CFC' },
  { phase: 5, name: 'Quantum Nodes', tech: 'QKD + Quantum ML', users: '1Cr+', status: 'future', color: '#ec4899' },
];

export const SUSTAINABILITY_METRICS = {
  greenAIScore: 87,
  carbonPerQuery: '0.023g CO₂',
  modelEfficiency: '91%',
  socialImpact: {
    retailTradersProtected: '89% loss prevention',
    sebiCompliance: '100%',
    financialLiteracy: 'Built-in explain mode',
  },
  businessRevenue: [
    { source: 'Premium Tier', amount: '₹999/mo', users: '1L target' },
    { source: 'API Access', amount: '₹4,999/mo', users: '10K target' },
    { source: 'Institutional', amount: '₹49,999/mo', users: '500 target' },
    { source: 'Data Licensing', amount: 'Custom', users: 'Enterprise' },
  ],
};
