"""
TITAN — Shared Data Models (Pydantic Schemas)
Used across all agents, APIs, and the execution engine.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


# ═══════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════

class MarketRegime(str, Enum):
    TRENDING_UP = "TRENDING_UP"
    TRENDING_DOWN = "TRENDING_DOWN"
    RANGING = "RANGING"
    HIGH_VOLATILITY = "HIGH_VOLATILITY"


class TradeDirection(str, Enum):
    LONG = "LONG"
    SHORT = "SHORT"


class TradeAction(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"
    CLOSE = "CLOSE"


class OpportunityType(str, Enum):
    BREAKOUT = "BREAKOUT"
    MOMENTUM = "MOMENTUM"
    REVERSAL = "REVERSAL"
    OPTIONS_FLOW = "OPTIONS_FLOW"
    MEAN_REVERSION = "MEAN_REVERSION"


class Urgency(str, Enum):
    IMMEDIATE = "IMMEDIATE"
    WATCH = "WATCH"
    DEVELOPING = "DEVELOPING"


class TimeHorizon(str, Enum):
    SCALP = "SCALP"
    INTRADAY = "INTRADAY"
    SWING = "SWING"
    POSITIONAL = "POSITIONAL"


class OrderType(str, Enum):
    MARKET = "MARKET"
    LIMIT = "LIMIT"
    SL = "SL"
    SL_M = "SL-M"


class OrderStatus(str, Enum):
    PENDING = "PENDING"
    OPEN = "OPEN"
    COMPLETE = "COMPLETE"
    CANCELLED = "CANCELLED"
    REJECTED = "REJECTED"


class TrendDirection(str, Enum):
    BULLISH = "BULLISH"
    BEARISH = "BEARISH"
    NEUTRAL = "NEUTRAL"


class CircuitBreakerLevel(int, Enum):
    NORMAL = 0
    WARNING = 1       # Daily loss 1% — reduce sizes
    HALT = 2          # Daily loss 2% — no new trades
    EMERGENCY = 3     # Daily loss 3% — close everything


# ═══════════════════════════════════════════════════════════
# MARKET DATA MODELS
# ═══════════════════════════════════════════════════════════

class TickData(BaseModel):
    """Single market tick."""
    symbol: str
    exchange: str = "NSE"
    ltp: float
    open: float = 0.0
    high: float = 0.0
    low: float = 0.0
    close: float = 0.0
    volume: int = 0
    oi: int = 0
    bid: float = 0.0
    ask: float = 0.0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(tz=timezone.utc))


class CandleData(BaseModel):
    """OHLCV candle."""
    symbol: str
    timeframe: str  # "1m", "5m", "15m", "1h", "4h", "1D"
    open: float
    high: float
    low: float
    close: float
    volume: int
    timestamp: datetime


class MarketDepth(BaseModel):
    """Level 2 order book."""
    symbol: str
    bids: list[dict] = Field(default_factory=list)  # [{price, qty}]
    asks: list[dict] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(tz=timezone.utc))


# ═══════════════════════════════════════════════════════════
# ANALYSIS MODELS
# ═══════════════════════════════════════════════════════════

class Opportunity(BaseModel):
    """A trading opportunity identified by the Market Scanner."""
    symbol: str
    exchange: str = "NSE"
    current_price: float
    opportunity_type: OpportunityType
    confidence_score: float = Field(ge=0, le=1)
    supporting_signals: list[str] = Field(default_factory=list)
    recommended_direction: TradeDirection
    urgency: Urgency = Urgency.WATCH


class TrendAnalysis(BaseModel):
    """Multi-timeframe trend assessment."""
    primary: TrendDirection      # 1D + 4h
    secondary: TrendDirection    # 1h
    micro: TrendDirection        # 5m + 15m


class KeyLevels(BaseModel):
    """Support, resistance, and pivot levels."""
    support: list[float] = Field(default_factory=list)
    resistance: list[float] = Field(default_factory=list)
    pivot: float = 0.0
    vwap: float = 0.0


class IndicatorSignal(BaseModel):
    """Single indicator reading."""
    name: str
    value: float
    signal: str  # "BULLISH", "BEARISH", "NEUTRAL"
    details: str = ""


class PatternDetected(BaseModel):
    """Detected chart pattern."""
    pattern: str
    confidence: float = Field(ge=0, le=1)
    target: float = 0.0
    timeframe: str = ""


class TechnicalResult(BaseModel):
    """Complete output from Technical Analyst agent."""
    symbol: str
    analysis_timeframes: list[str] = Field(default_factory=list)
    trend: TrendAnalysis | None = None
    key_levels: KeyLevels | None = None
    indicators: list[IndicatorSignal] = Field(default_factory=list)
    patterns_detected: list[PatternDetected] = Field(default_factory=list)
    confluence_score: float = Field(ge=0, le=1, default=0)
    recommended_entry: float = 0.0
    recommended_sl: float = 0.0
    recommended_targets: list[float] = Field(default_factory=list)
    risk_reward_ratio: float = 0.0
    summary: str = ""


class FundamentalResult(BaseModel):
    """Complete output from Fundamental Analyst agent."""
    symbol: str
    fundamental_score: float = Field(ge=0, le=100, default=50)
    valuation_status: str = "FAIR"  # UNDERVALUED, FAIR, OVERVALUED
    pe_ratio: float = 0.0
    pb_ratio: float = 0.0
    roe: float = 0.0
    roce: float = 0.0
    debt_to_equity: float = 0.0
    promoter_holding_pct: float = 0.0
    promoter_pledge_pct: float = 0.0
    quarterly_revenue_growth: float = 0.0
    quarterly_profit_growth: float = 0.0
    key_risks: list[str] = Field(default_factory=list)
    catalysts: list[str] = Field(default_factory=list)
    summary: str = ""


class SentimentResult(BaseModel):
    """Complete output from Sentiment Analyst agent."""
    symbol: str
    sentiment_score: float = Field(ge=-1, le=1, default=0)
    confidence: float = Field(ge=0, le=1, default=0)
    news_sentiment: float = 0.0
    social_sentiment: float = 0.0
    fear_greed_index: float = Field(ge=0, le=100, default=50)
    key_drivers: list[str] = Field(default_factory=list)
    catalysts: list[str] = Field(default_factory=list)
    india_vix: float = 0.0
    pcr: float = 0.0
    fii_net_flow: float = 0.0
    summary: str = ""


class DebateArgument(BaseModel):
    """Output from Bull or Bear Advocate."""
    position: str  # "BULL" or "BEAR"
    conviction_score: float = Field(ge=0, le=100, default=50)
    key_arguments: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)
    risks_identified: list[str] = Field(default_factory=list)
    summary: str = ""


class TradeDecision(BaseModel):
    """Final decision from the Decision Judge."""
    action: TradeAction
    conviction: float = Field(ge=0, le=100, default=0)
    position_size_multiplier: float = Field(ge=0, le=1, default=0.5)
    time_horizon: TimeHorizon = TimeHorizon.INTRADAY
    entry_price: float = 0.0
    stop_loss: float = 0.0
    targets: list[float] = Field(default_factory=list)
    reasoning: str = ""


class RiskAssessment(BaseModel):
    """Output from Risk Manager — trade gatekeeper."""
    approved: bool = False
    adjusted_quantity: int = 0
    adjusted_position_size: float = 0.0
    sl_price: float = 0.0
    risk_amount: float = 0.0
    risk_pct_of_capital: float = 0.0
    veto_reason: str | None = None
    warnings: list[str] = Field(default_factory=list)


# ═══════════════════════════════════════════════════════════
# ORDER & PORTFOLIO MODELS
# ═══════════════════════════════════════════════════════════

class OrderRequest(BaseModel):
    """Request to place an order with broker."""
    symbol: str
    exchange: str = "NSE"
    direction: TradeDirection
    order_type: OrderType = OrderType.MARKET
    quantity: int
    price: float = 0.0
    trigger_price: float = 0.0
    product: str = "MIS"  # MIS (intraday), CNC (delivery), NRML (F&O)
    algo_id: str = "TITAN_V1"  # SEBI-mandated algo identifier


class OrderResponse(BaseModel):
    """Response from broker after order placement."""
    order_id: str
    status: OrderStatus
    symbol: str
    direction: TradeDirection
    quantity: int
    price: float = 0.0
    timestamp: datetime = Field(default_factory=lambda: datetime.now(tz=timezone.utc))
    message: str = ""


class Position(BaseModel):
    """An active position."""
    symbol: str
    exchange: str = "NSE"
    direction: TradeDirection
    quantity: int
    average_price: float
    current_price: float = 0.0
    pnl: float = 0.0
    pnl_pct: float = 0.0
    stop_loss: float = 0.0
    targets: list[float] = Field(default_factory=list)
    opened_at: datetime = Field(default_factory=lambda: datetime.now(tz=timezone.utc))


class Holding(BaseModel):
    """A delivery holding."""
    symbol: str
    exchange: str = "NSE"
    quantity: int
    average_price: float
    current_price: float = 0.0
    pnl: float = 0.0
    pnl_pct: float = 0.0


class MarginInfo(BaseModel):
    """Available margin info."""
    available_cash: float = 0.0
    used_margin: float = 0.0
    total_margin: float = 0.0


class TradeRecord(BaseModel):
    """Historical trade record for audit."""
    trade_id: str = ""
    symbol: str
    exchange: str = "NSE"
    direction: TradeDirection
    entry_price: float
    exit_price: float = 0.0
    quantity: int
    pnl: float = 0.0
    pnl_pct: float = 0.0
    strategy: str = ""
    conviction: float = 0.0
    reasoning: str = ""
    entry_time: datetime = Field(default_factory=lambda: datetime.now(tz=timezone.utc))
    exit_time: Optional[datetime] = None
    duration_minutes: int = 0


# ═══════════════════════════════════════════════════════════
# SCAN RESULT MODEL
# ═══════════════════════════════════════════════════════════

class ScanResult(BaseModel):
    """Complete output from Market Scanner."""
    scan_timestamp: datetime = Field(default_factory=lambda: datetime.now(tz=timezone.utc))
    market_regime: MarketRegime = MarketRegime.RANGING
    top_opportunities: list[Opportunity] = Field(default_factory=list)
    sector_heat_map: dict[str, float] = Field(default_factory=dict)
    market_breadth: dict[str, int] = Field(default_factory=dict)
    india_vix: float = 0.0
    nifty_level: float = 0.0
    summary: str = ""


# ═══════════════════════════════════════════════════════════
# PORTFOLIO SUMMARY
# ═══════════════════════════════════════════════════════════

class PortfolioSummary(BaseModel):
    """Overall portfolio performance."""
    total_capital: float = 0.0
    deployed_capital: float = 0.0
    available_capital: float = 0.0
    total_pnl_today: float = 0.0
    total_pnl_week: float = 0.0
    total_pnl_month: float = 0.0
    total_pnl_all_time: float = 0.0
    win_rate: float = 0.0
    total_trades: int = 0
    winning_trades: int = 0
    losing_trades: int = 0
    avg_risk_reward: float = 0.0
    sharpe_ratio: float = 0.0
    max_drawdown: float = 0.0
    active_positions: int = 0
    circuit_breaker_level: CircuitBreakerLevel = CircuitBreakerLevel.NORMAL
