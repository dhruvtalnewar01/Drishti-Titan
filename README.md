<div align="center">

```
██████╗ ██████╗ ██╗███████╗██╗  ██╗████████╗██╗
██╔══██╗██╔══██╗██║██╔════╝██║  ██║╚══██╔══╝██║
██║  ██║██████╔╝██║███████╗███████║   ██║   ██║
██║  ██║██╔══██╗██║╚════██║██╔══██║   ██║   ██║
██████╔╝██║  ██║██║███████║██║  ██║   ██║   ██║
╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝
                     ×
████████╗██╗████████╗ █████╗ ███╗   ██╗
╚══██╔══╝██║╚══██╔══╝██╔══██╗████╗  ██║
   ██║   ██║   ██║   ███████║██╔██╗ ██║
   ██║   ██║   ██║   ██╔══██║██║╚██╗██║
   ██║   ██║   ██║   ██║  ██║██║ ╚████║
   ╚═╝   ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝
```

# DRISHTI × TITAN

### India's First AI-Native Market Intelligence & Autonomous Execution Platform

**End-to-End Intelligence → Education → Autonomous Execution Pipeline**

[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.3-7C4DFF?logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Gemini 3.1 Pro](https://img.shields.io/badge/Gemini-3.1_Pro-FF6F00?logo=google&logoColor=white)](https://ai.google.dev)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Manifest_v3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/)
[![License](https://img.shields.io/badge/License-Proprietary-white.svg)](#)
[![Status](https://img.shields.io/badge/Status-Production_Ready-26a69a.svg)](#)

---

*A vertically integrated AI startup that goes beyond analysis — it educates, strategizes, and executes. DRISHTI is the brain. TITAN is the hand.*

</div>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution---drishti--titan)
- [System Architecture](#-unified-system-architecture)
- [DRISHTI — Intelligence Command Center](#-drishti--intelligence-command-center)
- [TITAN — Autonomous Execution Engine](#-titan--autonomous-execution-engine)
- [Technology Stack](#-full-technology-matrix)
- [38 Candlestick Patterns Engine](#-38-candlestick-patterns-engine)
- [Risk Management Architecture](#-risk-management--sebi-compliance)
- [Competitive Analysis](#-competitive-landscape--differentiation)
- [Deployment Guide](#-deployment--quick-start)
- [Scalability & Roadmap](#-scalability-blueprint)
- [Team](#-team--vision)

---

## 🔴 The Problem

India has **15 Cr+** demat accounts but **93% of retail traders lose money** within their first year (SEBI Study 2024). The root causes:

| Pain Point | Current Reality | Impact |
|---|---|---|
| **Information Asymmetry** | Retail traders use 1-2 data sources; institutions use 50+ | Delayed signals, missing context |
| **Zero Education Pipeline** | Apps show buttons, not knowledge | Users gamble instead of trading |
| **Emotional Execution** | Humans panic sell at -5% and FOMO buy at +8% | Systematic capital destruction |
| **Fragmented Tooling** | Separate apps for charts, news, analysis, brokerage | Cognitive overload, missed opportunities |
| **No Crisis Preparedness** | Geopolitical events trigger 5-10% overnight gaps | Portfolios wiped without hedging |

**The industry has trading platforms. It has analysis platforms. It has education platforms. Nobody has built all three as a single, intelligent, autonomous system.**

---

## 💡 The Solution — DRISHTI × TITAN

We engineered a **vertically integrated AI pipeline** that covers the complete lifecycle of a market participant:

```mermaid
graph LR
    classDef edu fill:#FFD700,stroke:#000,stroke-width:2px,color:#000
    classDef intel fill:#7C5CFC,stroke:#000,stroke-width:2px,color:#fff
    classDef exec fill:#26a69a,stroke:#000,stroke-width:2px,color:#fff
    classDef risk fill:#ef5350,stroke:#000,stroke-width:2px,color:#fff

    A[🎮 EDUCATE<br/>Beginner Academy]:::edu --> B[📊 ANALYZE<br/>Expert Intelligence]:::intel
    B --> C[🤖 EXECUTE<br/>TITAN Agent]:::exec
    C --> D[🛡️ PROTECT<br/>Risk Firewall]:::risk
    D --> |Feedback Loop| A
```

| Layer | Product | Function |
|---|---|---|
| **EDUCATE** | DRISHTI Beginner Mode | 38 candlestick patterns, trend analysis, S&R training, paper trading with gamified XP progression |
| **ANALYZE** | DRISHTI Expert Mode (NEXUS) | 21-component command center with Crisis AI, Oracle scenario modeling,  multi-agent council, geopolitical pulse |
| **EXECUTE** | TITAN Chrome Extension | 8-agent adversarial council with LangGraph orchestration, automated order execution on Zerodha/Groww |
| **PROTECT** | Risk Guardian Subsystem | Hardcoded maximum loss, position sizing, SEBI-compliant circuit breakers |

---

## 🏗 Unified System Architecture

```mermaid
graph TB
    classDef frontend fill:#1a1f2e,stroke:#FFD700,stroke-width:2px,color:#FFD700
    classDef backend fill:#1a1f2e,stroke:#7C5CFC,stroke-width:2px,color:#A78BFA
    classDef data fill:#1a1f2e,stroke:#26a69a,stroke-width:2px,color:#26a69a
    classDef broker fill:#1a1f2e,stroke:#ef5350,stroke-width:2px,color:#ef5350
    classDef ai fill:#1a1f2e,stroke:#FF6F00,stroke-width:2px,color:#FF6F00

    subgraph USER_LAYER["🖥️ User Interface Layer"]
        direction LR
        BM[🎮 Beginner Mode<br/>React + SVG Charts]:::frontend
        EM[⚡ Expert Mode<br/>NEXUS Command Center]:::frontend
        EXT[🧩 Chrome Extension<br/>TITAN Widget]:::frontend
    end

    subgraph AI_LAYER["🧠 AI Orchestration Layer"]
        direction LR
        GEM[Google Gemini 3.1 Pro]:::ai
        LG[LangGraph State Machine]:::ai
        COUNCIL[8-Agent Council]:::ai
    end

    subgraph INTEL_LAYER["📡 Intelligence Layer"]
        direction LR
        D1[Tickertape]:::data
        D2[Screener.in]:::data
        D3[TradingView]:::data
        D4[Chartink]:::data
        D5[NSE / BSE]:::data
        D6[Moneycontrol]:::data
        D7[+13 More Sources]:::data
    end

    subgraph EXEC_LAYER["⚡ Execution Layer"]
        direction LR
        API[FastAPI Server<br/>WebSocket + REST]:::backend
        ZER[Zerodha Kite API]:::broker
        GRW[Groww API]:::broker
        SIM[Paper Trading Sim]:::broker
    end

    subgraph INFRA["💾 Infrastructure"]
        direction LR
        PG[(PostgreSQL)]:::backend
        RD[(Redis PubSub)]:::backend
        CR[(ChromaDB Vectors)]:::backend
    end

    BM --> GEM
    EM --> GEM
    EXT --> API
    API --> LG
    LG --> COUNCIL
    COUNCIL --> GEM
    GEM --> INTEL_LAYER
    COUNCIL --> API
    API --> ZER
    API --> GRW
    API --> SIM
    API --> INFRA
```

---

## 📊 DRISHTI — Intelligence Command Center

DRISHTI is a **dual-mode market intelligence platform** built with React 18 + Vite, delivering institutional-grade analysis through a luxury UI.

### Dual-Mode Architecture

```mermaid
graph TD
    classDef sel fill:#0c1117,stroke:#FFD700,stroke-width:2px,color:#FFD700
    classDef beg fill:#0c1117,stroke:#F59E0B,stroke-width:2px,color:#F59E0B
    classDef exp fill:#0c1117,stroke:#7C5CFC,stroke-width:2px,color:#A78BFA

    SPLASH[Splash Screen] --> SEL[Mode Selector]:::sel

    SEL --> BEG[🎮 Beginner Mode]:::beg
    SEL --> EXP[⚡ Expert Mode]:::exp

    subgraph Beginner["Beginner Mode — Gamified Learning"]
        BEG --> B1[📈 Trend Analysis Engine]
        BEG --> B2[🧠 38 Candlestick Patterns]
        BEG --> B3[🎯 Support & Resistance Trainer]
        BEG --> B4[💹 Paper Trading Simulator]
        BEG --> B5[⚔️ Daily Quest System + XP]
    end

    subgraph Expert["Expert Mode — 21 Component Command Center"]
        EXP --> E1[📊 Radar & Signals Dashboard]
        EXP --> E2[🛡️ Crisis AI Engine]
        EXP --> E3[🔮 Oracle Scenario Simulator]
        EXP --> E4[🌍 GeoPulse Geopolitical Map]
        EXP --> E5[🤖 8-Agent Council Interface]
        EXP --> E6[📈 Alpha Ledger & Portfolio]
        EXP --> E7[🧬 Risk DNA Profiler]
        EXP --> E8[⚛️ Quantum Strategy Engine]
    end
```

### 🎮 Beginner Mode — Gamified Trading Academy

A complete zero-to-expert learning pipeline with gamified progression:

| Feature | Description | Implementation |
|---|---|---|
| **Trend Analysis** | Interactive SVG candlestick charts for Uptrend / Downtrend / Sideways recognition | 50-candle realistic charts with volume bars, TradingView-style rendering |
| **38 Pattern Recognition** | All 38 candlestick patterns from professional curriculum (19 Bullish + 19 Bearish) | Animated SVG path drawing, category toggles, metadata (candle count, difficulty, XP) |
| **S&R Training** | Annotated charts with R2/R1/S1/S2 levels and supply/demand zones | 4 progressive lessons: Basics → Identification → Polarity Flip → Zones vs Lines |
| **Paper Trading** | Risk-free simulated trading with live-ticking prices | Equities (RELIANCE, INFY, TCS) + Risk-Free instruments (LiquidBEES, SGBs, NiftyBEES) |
| **XP & Progression** | Level system, streak tracking, badge collection, daily quests | React state machine with animated reward popups |

### ⚡ Expert Mode — NEXUS Command Center

21 interconnected intelligence modules:

| Component | Function |
|---|---|
| `CommandCenter.jsx` | Primary dashboard with live-ticking Nifty, FII/DII, market sentiment |
| `CrisisAI.jsx` | Real-time geopolitical crisis playbook engine (Iran-US, Earnings, RBI) |
| `NexusOracle.jsx` | Monte Carlo–inspired scenario simulation with probability distributions |
| `CouncilTab.jsx` | Visual interface for the 8-agent debate (Bull vs Bear advocacy) |
| `GeoPulse.jsx` | Global geopolitical risk mapping with India-specific impact analysis |
| `RadarTab.jsx` | Multi-signal scanner: RSI, MACD, EMA crossovers, volume anomalies |
| `AlphaLedger.jsx` | AI-generated trade ledger with conviction scoring |
| `QuantumTab.jsx` | Quantum-inspired strategy exploration (hedging, Iron Condors, Straddles) |
| `RiskDNATab.jsx` | Personalized risk profiling and portfolio stress testing |
| `SectorRadar.jsx` | Sector rotation analysis with momentum ranking |
| `AnalystTab.jsx` | AI voice analyst with natural language market queries |
| `AutoTradeTab.jsx` | Direct TITAN agent control panel for autonomous execution |

---

## 🤖 TITAN — Autonomous Execution Engine

TITAN is a **multi-agent AI trading system** deployed as a Chrome Extension (Manifest v3) that injects directly into Zerodha Kite or Groww broker dashboards.

### The 8-Agent Adversarial Council

```mermaid
graph TD
    classDef scanner fill:#00e5ff,stroke:#0a0e15,stroke-width:2px,color:#000
    classDef analyst fill:#7c4dff,stroke:#0a0e15,stroke-width:2px,color:#fff
    classDef debate fill:#ffab00,stroke:#0a0e15,stroke-width:2px,color:#000
    classDef judge fill:#26a69a,stroke:#0a0e15,stroke-width:2px,color:#fff
    classDef risk fill:#ef5350,stroke:#0a0e15,stroke-width:2px,color:#fff
    classDef exec fill:#FFD700,stroke:#0a0e15,stroke-width:2px,color:#000

    Sources["📡 19 Live Intelligence Sources<br/>Tickertape · Screener · TradingView<br/>Chartink · NSE · Moneycontrol · ET Markets<br/>+ 12 More"]

    Sources --> Scanner["🕵️ Agent 1: Market Scanner<br/>Volume/Momentum Anomalies"]:::scanner

    Scanner --> Tech["📈 Agent 2: Technical Analyst<br/>RSI · MACD · EMA · Fibonacci"]:::analyst
    Scanner --> Fund["⚖️ Agent 3: Fundamental Analyst<br/>DCF · PE · ROCE · Sector Median"]:::analyst
    Scanner --> Sent["📰 Agent 4: Sentiment Analyst<br/>NLP · Fear Index · News Flow"]:::analyst

    Tech --> Bull["🐂 Agent 5: Bull Advocate<br/>Maximum Long Case"]:::debate
    Fund --> Bull
    Sent --> Bull

    Tech --> Bear["🐻 Agent 6: Bear Advocate<br/>Maximum Short Case"]:::debate
    Fund --> Bear
    Sent --> Bear

    Bull --> Judge["⚖️ Agent 7: Decision Judge<br/>Conviction Score Calculation"]:::judge
    Bear --> Judge

    Judge --> Risk["🛡️ Agent 8: Risk Guardian<br/>Hardcoded Capital Firewall"]:::risk

    Risk -->|"REJECT"| Halt["⛔ Trade Killed"]
    Risk -->|"APPROVE"| Exec["⚡ Execution Engine<br/>Zerodha / Groww API"]:::exec
```

### Agent Module Structure

```
AutoTrading Agent/
├── main.py                     # FastAPI server entry point
├── packages/
│   ├── api/                    # REST + WebSocket endpoints
│   ├── brokers/
│   │   ├── base.py             # Abstract broker interface
│   │   ├── zerodha/            # Kite Connect integration
│   │   ├── groww/              # Groww API integration
│   │   └── simulator/          # Paper trading engine
│   ├── core/
│   │   ├── config.py           # Pydantic settings (19 params)
│   │   ├── models.py           # TypedDict state schemas
│   │   ├── agents/
│   │   │   ├── market_scanner.py
│   │   │   ├── technical_analyst.py
│   │   │   ├── fundamental_analyst.py
│   │   │   ├── sentiment_analyst.py
│   │   │   ├── debate_agents.py    # Bull + Bear adversarial pair
│   │   │   ├── decision_judge.py
│   │   │   └── risk_manager.py     # Deterministic firewall
│   │   ├── orchestrator/
│   │   │   ├── graph.py            # LangGraph state machine
│   │   │   └── state.py           # Shared state reducers
│   │   └── execution/             # Order routing engine
│   └── intelligence/
│       └── llm/                   # Gemini 3.1 Pro client
└── extension/
    ├── manifest.json              # Chrome Manifest v3
    ├── src/
    │   ├── background/            # Service worker
    │   ├── content/               # DOM injection
    │   │   ├── inject.js          # Broker overlay
    │   │   └── overlay.css        # Glassmorphism UI
    │   └── popup/                 # Extension popup
    └── assets/                    # Icons & branding
```

### 19-Source Intelligence Matrix

TITAN aggregates data from **19 independent sources** before generating a single trade signal:

| Category | Sources | Data Type |
|---|---|---|
| **Screening** | Tickertape, Screener.in, Trendlyne, MarketMojo, StockEdge | Fundamentals, DVM scores, financial statements |
| **Technicals** | TradingView, Chartink, GoCharting, Interactive Brokers | Candlestick patterns, indicators, order flow |
| **News/Sentiment** | Moneycontrol, ET Markets, Investing.com | NLP sentiment, macro indicators, Fear & Greed |
| **Exchange Data** | NSE India, BSE India | Volume, delivery %, derivative OI, bulk deals |
| **Research** | ICICI Direct, Angel One, Sharekhan, Morningstar | Institutional research, intrinsic value models |

### Pre-Start Safety Protocol

Before TITAN executes any trade, the user must configure:

| Parameter | Purpose | Example |
|---|---|---|
| `Daily Profit Target` | Auto-secure gains at threshold | ₹5,000 |
| `Maximum Loss Tolerance` | Absolute kill-switch limit | ₹2,000 |
| `Risk Profile` | Conservative / Moderate / Aggressive | Moderate |
| `Agent Autonomy` | Full Auto / Semi-Auto / Analysis Only | Semi-Auto |

### Real-Time Loss Meter

```
┌──────────────────────────────────────────────┐
│  LOSS TOLERANCE: ₹2,000                       │
│                                                │
│  ⬜⬜⬜⬜⬜⬜⬜🟨🟨🟧🟧🟥🟥⬛  ₹1,640 / ₹2,000 │
│  ░░░░░░░░░░░░░░░░░░▓▓▓▓▓▓████                │
│  ────────── 82% ──────────                     │
│                                                │
│  ⚠️  AMBER PHASE: Position sizes reduced 50%  │
│  ⚠️  At 100%: FULL ENGINE HALT triggered       │
└──────────────────────────────────────────────┘
```

---

## 🧠 38 Candlestick Patterns Engine

The Beginner Mode Pattern Recognition module implements the complete professional candlestick curriculum:

### Bullish Patterns (19)

| # | Pattern | Type | Candles | Difficulty |
|---|---|---|---|---|
| 1 | Bullish Engulfing | Reversal | 2 | Easy |
| 2 | Hammer | Reversal | 1 | Easy |
| 3 | Morning Star | Reversal | 3 | Medium |
| 4 | Piercing Line | Reversal | 2 | Medium |
| 5 | Bullish Harami | Reversal | 2 | Easy |
| 6 | Three White Soldiers | Reversal | 3 | Medium |
| 7 | Inverted Hammer | Reversal | 1 | Easy |
| 8 | Dragonfly Doji | Reversal | 1 | Medium |
| 9 | Bullish Abandoned Baby | Reversal | 3 | Hard |
| 10 | Three Inside Up | Reversal | 3 | Medium |
| 11 | Three Outside Up | Reversal | 3 | Medium |
| 12 | Bullish Kicker | Reversal | 2 | Hard |
| 13 | Tweezer Bottom | Reversal | 2 | Easy |
| 14 | Rising Three Methods | Continuation | 5 | Hard |
| 15 | Mat Hold | Continuation | 5 | Hard |
| 16 | Bullish Belt Hold | Reversal | 1 | Easy |
| 17 | Three-Line Strike (Bull) | Continuation | 4 | Hard |
| 18 | Ladder Bottom | Reversal | 5 | Hard |
| 19 | Meeting Lines (Bull) | Reversal | 2 | Medium |

### Bearish Patterns (19)

| # | Pattern | Type | Candles | Difficulty |
|---|---|---|---|---|
| 1 | Bearish Engulfing | Reversal | 2 | Easy |
| 2 | Hanging Man | Reversal | 1 | Easy |
| 3 | Evening Star | Reversal | 3 | Medium |
| 4 | Shooting Star | Reversal | 1 | Easy |
| 5 | Bearish Harami | Reversal | 2 | Easy |
| 6 | Three Black Crows | Reversal | 3 | Medium |
| 7 | Bearish Kicker | Reversal | 2 | Hard |
| 8 | Dark Cloud Cover | Reversal | 2 | Medium |
| 9 | Bearish Abandoned Baby | Reversal | 3 | Hard |
| 10 | Tweezer Top | Reversal | 2 | Easy |
| 11 | Three Inside Down | Reversal | 3 | Medium |
| 12 | Three Outside Down | Reversal | 3 | Medium |
| 13 | Bearish Doji Star | Reversal | 2 | Medium |
| 14 | Bearish Belt Hold | Reversal | 1 | Easy |
| 15 | Bearish Three-Line Strike | Continuation | 4 | Hard |
| 16 | Upside Gap Two Crows | Reversal | 3 | Hard |
| 17 | Bearish Mat Hold | Continuation | 5 | Hard |
| 18 | Three Outside Down | Reversal | 3 | Medium |
| 19 | Bearish Doji Star | Reversal | 2 | Medium |

Each pattern includes: interactive SVG animation, description, candle count, difficulty rating, XP reward, and quiz assessment.

---

## 🛡️ Risk Management & SEBI Compliance

```mermaid
graph LR
    classDef hard fill:#ef5350,stroke:#0a0e15,stroke-width:2px,color:#fff
    classDef soft fill:#ffab00,stroke:#0a0e15,stroke-width:2px,color:#000
    classDef safe fill:#26a69a,stroke:#0a0e15,stroke-width:2px,color:#fff

    subgraph Hardcoded["⛔ Deterministic Firewalls (Cannot Be Overridden)"]
        H1[Max Daily Loss: 2%]:::hard
        H2[Max Single Position: 5%]:::hard
        H3[Max Total Exposure: 40%]:::hard
        H4[Order Rate Limit: 8/sec]:::hard
    end

    subgraph Smart["⚠️ AI-Adaptive Controls"]
        S1[Amber Phase at 80% Loss]:::soft
        S2[Auto Position Size Reduction]:::soft
        S3[Regime-Based Strategy Shift]:::soft
    end

    subgraph Compliance["✅ SEBI Compliance"]
        C1[Algo Tagging: TITAN_V2_ALGO]:::safe
        C2[Exchange Rate Throttling]:::safe
        C3[Audit Trail in PostgreSQL]:::safe
        C4[Paper Mode Default]:::safe
    end
```

| Risk Parameter | Value | Enforced By |
|---|---|---|
| `max_daily_loss_pct` | 2.0% | `risk_manager.py` — Deterministic |
| `max_weekly_loss_pct` | 5.0% | `risk_manager.py` — Deterministic |
| `max_single_position_pct` | 5.0% | `risk_manager.py` — Deterministic |
| `max_total_exposure_pct` | 40.0% | `risk_manager.py` — Deterministic |
| `orders_per_second_limit` | 8 | `config.py` — Server-side throttle |
| Default Trading Mode | `Paper` | Cannot execute live without explicit override |

---

## 📊 Competitive Landscape & Differentiation

| Capability | Zerodha Kite | Groww | Smallcase | **DRISHTI × TITAN** |
|---|---|---|---|---|
| **Real-time Charts** | ✅ TradingView | ✅ Basic | ❌ | ✅ 50-candle SVG + Volume |
| **Education System** | ❌ Varsity (separate) | ❌ | ❌ | ✅ 38 Patterns + Gamified XP |
| **Pattern Recognition** | ❌ | ❌ | ❌ | ✅ All 38 Candlestick Patterns |
| **AI Analysis** | ❌ | ❌ | ❌ | ✅ Gemini 3.1 Pro + 19 Sources |
| **Crisis AI** | ❌ | ❌ | ❌ | ✅ Geopolitical Playbooks |
| **Agent Council** | ❌ | ❌ | ❌ | ✅ 8-Agent Adversarial Debate |
| **Autonomous Execution** | ❌ | ❌ | ❌ | ✅ LangGraph Orchestration |
| **Paper Trading** | ❌ | ❌ | ❌ | ✅ Built-in with Risk-Free Assets |
| **Beginner → Expert Pipeline** | ❌ | ❌ | ❌ | ✅ Gamified Learning Path |
| **Risk Firewall** | Basic SL | Basic SL | ❌ | ✅ 6-Layer Deterministic System |
| **Browser Integration** | Native App | Native App | Web | ✅ Chrome Extension Overlay |

---

## 🛠 Full Technology Matrix

### DRISHTI — Intelligence Dashboard

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18.3 + Vite 5.4 | Component-driven SPA |
| **Charting** | Custom SVG Engine | 50-candle TradingView-style realistic charts |
| **State** | React Hooks + useMemo | Optimized re-renders for live-ticking data |
| **Styling** | Vanilla CSS + Inline | Luxury dark-mode with gold/amber/cyan palette |
| **Data Layer** | Static modules (`src/data/`) | Crisis playbooks, alpha ledger, signal data |
| **Build** | Vite Production Build | Optimized static bundle for deployment |

### TITAN — Autonomous Agent

| Layer | Technology | Purpose |
|---|---|---|
| **AI Model** | Google Gemini 3.1 Pro | Reasoning engine for all 8 agents |
| **Orchestration** | LangGraph + LangChain | Stateful agent graph with TypedDict reducers |
| **Backend** | FastAPI + Uvicorn | REST + WebSocket multiplexing |
| **Database** | PostgreSQL + SQLAlchemy | Trade history, audit logs, user state |
| **Cache/PubSub** | Redis | Real-time signal broadcasting |
| **Vector Store** | ChromaDB | Agent reasoning log embeddings |
| **Extension** | Chrome Manifest v3 | Service worker + content script injection |
| **Broker API** | Kite Connect + Groww API | Order execution, portfolio sync |
| **Config** | Pydantic Settings | Validated environment configuration |

---

## 🚀 Deployment & Quick Start

### DRISHTI Dashboard

```bash
# Clone the repository
git clone https://github.com/dhruvtalnewar01/Drishti-Titan.git
cd Drishti-Titan/drishti

# Install dependencies
npm install

# Start development server
npm run dev
# → Open http://localhost:5175/?app=1

# Production build
npm run build
```

### TITAN Agent Backend

```bash
cd Drishti-Titan/AutoTrading\ Agent

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Configure environment
cp .env.example .env
# → Set GEMINI_API_KEY in .env

# Start the server (Paper mode by default)
python main.py --mode paper --port 8080
```

### TITAN Chrome Extension

```bash
# 1. Open Chrome → chrome://extensions/
# 2. Enable "Developer Mode"
# 3. Click "Load Unpacked"
# 4. Select: Drishti-Titan/AutoTrading Agent/extension/
# 5. Open Zerodha Kite or Groww
# 6. Click the TITAN icon to activate
```

### Environment Variables

```env
# === AI ===
GEMINI_API_KEY=your_gemini_key

# === Broker (Zerodha) ===
ZERODHA_API_KEY=
ZERODHA_API_SECRET=
ZERODHA_USER_ID=

# === Broker (Groww) ===
GROWW_API_KEY=
GROWW_API_SECRET=

# === Infrastructure ===
DATABASE_URL=postgresql+asyncpg://titan:password@localhost:5432/titan_db
REDIS_URL=redis://localhost:6379/0

# === Risk ===
MAX_CAPITAL_ALLOCATION=100000
MAX_DAILY_LOSS_PCT=2.0
TRADING_MODE=paper
AGENT_AUTONOMY=semi_auto
```

---

## 🌐 Scalability Blueprint

```mermaid
graph TD
    classDef now fill:#26a69a,stroke:#0a0e15,stroke-width:2px,color:#fff
    classDef q2 fill:#FFD700,stroke:#0a0e15,stroke-width:2px,color:#000
    classDef q3 fill:#7C5CFC,stroke:#0a0e15,stroke-width:2px,color:#fff
    classDef q4 fill:#ef5350,stroke:#0a0e15,stroke-width:2px,color:#fff

    subgraph NOW["✅ Current (v1.0)"]
        N1[DRISHTI Dashboard<br/>21 Components]:::now
        N2[38 Pattern Engine]:::now
        N3[TITAN 8-Agent Council]:::now
        N4[Paper Trading + Zerodha/Groww]:::now
    end

    subgraph Q2["🟡 Q3 2026"]
        Q2A[Mobile App<br/>React Native]:::q2
        Q2B[Options Flow<br/>Gamma Exposure Maps]:::q2
        Q2C[Social Trading<br/>Copy Top Performers]:::q2
    end

    subgraph Q3["🟣 Q4 2026"]
        Q3A[Multi-Market<br/>US + Crypto Support]:::q3
        Q3B[Advanced Backtesting<br/>10-Year Historical]:::q3
        Q3C[Institutional API<br/>Hedge Fund Integration]:::q3
    end

    subgraph Q4["🔴 2027"]
        Q4A[Regulatory Sandbox<br/>SEBI Approval]:::q4
        Q4B[AI Model Fine-Tuning<br/>Self-Learning Agent]:::q4
        Q4C[100K+ MAU<br/>Revenue Scaling]:::q4
    end

    NOW --> Q2 --> Q3 --> Q4
```

### Revenue Model

| Stream | Model | Projected ARR |
|---|---|---|
| **Freemium Dashboard** | DRISHTI Beginner (free) + Expert (₹499/mo) | ₹6Cr |
| **TITAN Subscription** | Agent access (₹999/mo) + Performance fee (10% alpha) | ₹12Cr |
| **Data API** | B2B intelligence feed to fintechs | ₹3Cr |
| **White-Label** | Broker-integrated version for banks | ₹10Cr |

---

## 📁 Repository Structure

```
Drishti-Titan/
├── README.md                          # This file
├── drishti/                           # DRISHTI Intelligence Dashboard
│   ├── src/
│   │   ├── App.jsx                    # Root: Splash → Mode → Dashboard
│   │   ├── components/
│   │   │   ├── BeginnerMode.jsx       # 38 Patterns + Gamified Learning
│   │   │   ├── CommandCenter.jsx      # Expert Mode Main Dashboard
│   │   │   ├── CrisisAI.jsx          # Geopolitical Crisis Engine
│   │   │   ├── NexusOracle.jsx        # Scenario Simulator
│   │   │   ├── CouncilTab.jsx         # Agent Council Interface
│   │   │   ├── ModeSelector.jsx       # Beginner/Expert Toggle
│   │   │   └── ... (21 components)
│   │   ├── data/                      # Crisis playbooks, alpha ledger
│   │   └── index.css                  # Design system + 3D animations
│   ├── package.json
│   └── vite.config.js
│
├── AutoTrading Agent/                 # TITAN Autonomous Agent
│   ├── main.py                        # FastAPI entry point
│   ├── packages/
│   │   ├── core/
│   │   │   ├── agents/                # 8 specialized AI agents
│   │   │   ├── orchestrator/          # LangGraph state machine
│   │   │   ├── execution/             # Order routing
│   │   │   ├── config.py              # Pydantic settings
│   │   │   └── models.py              # State schemas
│   │   ├── brokers/                   # Zerodha + Groww + Simulator
│   │   ├── intelligence/              # Gemini 3.1 Pro client
│   │   └── api/                       # REST + WebSocket server
│   ├── extension/                     # Chrome Manifest v3
│   │   ├── manifest.json
│   │   └── src/                       # Content scripts + popup
│   ├── pyproject.toml
│   └── docker-compose.yml
│
└── docs/                              # Additional documentation
```

---

## 👥 Team & Vision

**DRISHTI × TITAN** is not a hackathon prototype. It is a **production-grade startup** engineering solution for the $4.2 Trillion Indian capital markets. We are solving the most critical pain point in retail trading: the gap between **knowing** and **doing**.

Built at **Amity University Mumbai** — designed for the world.

---

<div align="center">

**DRISHTI sees. TITAN acts. Together, they redefine how India trades.**

*Built with precision. Engineered for scale. Designed for the future of autonomous finance.*

**© 2026 DRISHTI × TITAN Labs — All Rights Reserved**

</div>
