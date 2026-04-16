"""
TITAN — Shared State Schema for LangGraph
The single source of truth flowing through all agents in the graph.
Uses TypedDict with reducer annotations for append-only fields.
"""

from __future__ import annotations

import operator
from datetime import datetime, timezone
from typing import Annotated, TypedDict

from packages.core.models import (
    CircuitBreakerLevel,
    DebateArgument,
    FundamentalResult,
    MarketRegime,
    Opportunity,
    Position,
    RiskAssessment,
    SentimentResult,
    TechnicalResult,
    TradeDecision,
    TradeRecord,
)


class TitanState(TypedDict, total=False):
    """
    Central state object shared across all LangGraph nodes.

    Rules:
    - Fields annotated with `operator.add` are APPEND-ONLY (reducer pattern).
    - All other fields are overwritten by the latest node output.
    - Every node reads what it needs and writes its delta.
    """

    # ── Cycle Metadata ──────────────────────────────────────
    cycle_id: str                          # Unique ID for this analysis cycle
    cycle_count: int                       # Total cycles completed
    cycle_timestamp: str                   # ISO-8601 start time of this cycle
    is_market_hours: bool                  # Whether NSE/BSE are currently open

    # ── Market Context (from Market Scanner) ─────────────────
    market_regime: str                     # Current: TRENDING_UP, RANGING, etc.
    top_opportunities: list[Opportunity]   # Top 10 opportunities from scanner
    sector_heat_map: dict[str, float]      # Sector → momentum score
    market_breadth: dict[str, int]         # advances, declines, unchanged
    india_vix: float                       # India VIX level
    nifty_level: float                     # NIFTY 50 current level
    scanner_summary: str                   # Human-readable market overview

    # ── Selected Symbol for Deep Analysis ────────────────────
    selected_symbol: str                   # Currently analyzing this symbol
    selected_price: float                  # Current price of selected symbol

    # ── Agent Analysis Results ───────────────────────────────
    technical_analysis: dict               # TechnicalResult as dict
    fundamental_analysis: dict             # FundamentalResult as dict
    sentiment_analysis: dict               # SentimentResult as dict

    # ── Debate ───────────────────────────────────────────────
    bull_case: dict                        # DebateArgument from Bull Advocate
    bear_case: dict                        # DebateArgument from Bear Advocate

    # ── Decision ─────────────────────────────────────────────
    judge_decision: dict                   # TradeDecision from Decision Judge
    risk_assessment: dict                  # RiskAssessment from Risk Manager

    # ── Execution State ──────────────────────────────────────
    active_positions: list[dict]           # Currently held positions
    portfolio_pnl_today: float             # Today's realized + unrealized P&L
    portfolio_pnl_week: float              # This week's P&L
    total_capital: float                   # Total available capital
    deployed_capital: float                # Currently deployed capital

    # ── Append-Only Logs (Reducer Pattern) ───────────────────
    trade_history: Annotated[list[dict], operator.add]     # All executed trades
    reasoning_log: Annotated[list[str], operator.add]      # Audit trail of thoughts
    error_log: Annotated[list[str], operator.add]          # Any errors encountered

    # ── Circuit Breaker ──────────────────────────────────────
    circuit_breaker_level: int             # 0=NORMAL, 1=WARNING, 2=HALT, 3=EMERGENCY
    daily_loss_amount: float               # How much lost today
    weekly_loss_amount: float              # How much lost this week

    # ── Control Flags ────────────────────────────────────────
    should_execute: bool                   # Whether to proceed to execution
    should_continue: bool                  # Whether to continue the loop
    agent_paused: bool                     # User-triggered pause


def create_initial_state() -> TitanState:
    """Create a fresh state for a new trading session."""
    return TitanState(
        cycle_id="",
        cycle_count=0,
        cycle_timestamp=datetime.now(tz=timezone.utc).isoformat(),
        is_market_hours=False,

        market_regime=MarketRegime.RANGING.value,
        top_opportunities=[],
        sector_heat_map={},
        market_breadth={"advances": 0, "declines": 0, "unchanged": 0},
        india_vix=0.0,
        nifty_level=0.0,
        scanner_summary="",

        selected_symbol="",
        selected_price=0.0,

        technical_analysis={},
        fundamental_analysis={},
        sentiment_analysis={},

        bull_case={},
        bear_case={},

        judge_decision={},
        risk_assessment={},

        active_positions=[],
        portfolio_pnl_today=0.0,
        portfolio_pnl_week=0.0,
        total_capital=100_000.0,
        deployed_capital=0.0,

        trade_history=[],
        reasoning_log=[],
        error_log=[],

        circuit_breaker_level=CircuitBreakerLevel.NORMAL.value,
        daily_loss_amount=0.0,
        weekly_loss_amount=0.0,

        should_execute=False,
        should_continue=True,
        agent_paused=False,
    )
