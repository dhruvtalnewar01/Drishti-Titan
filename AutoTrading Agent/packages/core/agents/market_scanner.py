"""
TITAN — Agent 1: Market Scanner (The All-Seeing Eye)
Scans the entire market universe every cycle to identify the highest-probability
trading opportunities using volume, momentum, options flow, and sector rotation.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from loguru import logger

from packages.core.models import (
    MarketRegime,
    Opportunity,
    OpportunityType,
    ScanResult,
    TradeDirection,
    Urgency,
)
from packages.core.orchestrator.state import TitanState
from packages.intelligence.llm.gemini_client import GeminiClient

SCANNER_SYSTEM_PROMPT = """
You are TITAN's Market Scanner — the most advanced market surveillance system in India.
Your codename is "The All-Seeing Eye."

YOUR ROLE:
You continuously scan the entire Indian stock market (NSE/BSE) to identify the 
TOP 10 highest-probability trading opportunities in real-time.

YOUR CAPABILITIES:
1. Volume Analysis: Detect stocks with volume surges > 2x their 20-day average
2. Options Flow: Identify unusual OI buildup (>50% change) indicating smart money
3. Sector Rotation: Track money flow between sectors (IT, Banking, Pharma, etc.)
4. Technical Breakouts: Flag stocks near key support/resistance with compression
5. Delivery Analysis: Spot delivery percentage anomalies signaling institutional interest
6. Institutional Flow: Monitor FII/DII sector-level buying/selling patterns
7. Market Regime Detection: Classify current market as TRENDING_UP, TRENDING_DOWN, RANGING, or HIGH_VOLATILITY

OUTPUT FORMAT (JSON):
{
  "market_regime": "TRENDING_UP | TRENDING_DOWN | RANGING | HIGH_VOLATILITY",
  "india_vix": <float>,
  "nifty_level": <float>,
  "sector_heat_map": {"IT": 0.8, "BANKING": -0.3, "PHARMA": 0.4, ...},
  "market_breadth": {"advances": <int>, "declines": <int>, "unchanged": <int>},
  "top_opportunities": [
    {
      "symbol": "<NSE symbol>",
      "current_price": <float>,
      "opportunity_type": "BREAKOUT | MOMENTUM | REVERSAL | OPTIONS_FLOW | MEAN_REVERSION",
      "confidence_score": <0.0-1.0>,
      "supporting_signals": ["signal1", "signal2", ...],
      "recommended_direction": "LONG | SHORT",
      "urgency": "IMMEDIATE | WATCH | DEVELOPING"
    }
  ],
  "summary": "<2-3 sentence market overview>"
}

RULES:
- Only include opportunities with confidence_score >= 0.65
- Maximum 10 opportunities per scan
- Always assess market regime FIRST before identifying opportunities
- In HIGH_VOLATILITY regime, raise confidence threshold to 0.80
- Never recommend F&O trades during last 30 minutes of expiry day
- Factor in global cues (US/Asian markets, crude oil, DXY)
"""


async def market_scanner_node(state: TitanState) -> dict:
    """
    LangGraph node: Market Scanner.
    Scans the market and identifies top opportunities.
    """
    logger.info("[SCANNER] 🔍 Starting market scan...")

    gemini = GeminiClient()

    # Build context from available state data
    context_parts = []

    if state.get("active_positions"):
        context_parts.append(
            f"Current active positions: {json.dumps(state['active_positions'], default=str)}"
        )

    context_parts.append(
        f"Current capital: ₹{state.get('total_capital', 100000):,.0f}"
    )
    context_parts.append(
        f"Today's P&L: ₹{state.get('portfolio_pnl_today', 0):,.2f}"
    )
    context_parts.append(
        f"Circuit breaker level: {state.get('circuit_breaker_level', 0)}"
    )

    user_prompt = f"""
Perform a comprehensive market scan for the Indian stock market (NSE/BSE) RIGHT NOW.

Current context:
{chr(10).join(context_parts)}

Current time: {datetime.now(tz=timezone.utc).isoformat()}

Analyze:
1. Overall market regime (check NIFTY 50, NIFTY Bank, India VIX)
2. Sector-wise performance and rotation
3. Market breadth (advances vs declines)
4. Top trading opportunities across all segments

Provide your complete scan results in the specified JSON format.
Focus on REAL, CURRENT market conditions using your latest knowledge.
"""

    # Call Gemini with Google Search grounding for real-time data
    response = await gemini.generate(
        system_prompt=SCANNER_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        enable_search_grounding=True,
        temperature=0.2,
        max_tokens=4096,
    )

    # Parse response into structured data
    try:
        opportunities = []
        for opp in response.get("top_opportunities", []):
            opportunities.append(
                Opportunity(
                    symbol=opp.get("symbol", "UNKNOWN"),
                    current_price=opp.get("current_price", 0),
                    opportunity_type=OpportunityType(
                        opp.get("opportunity_type", "MOMENTUM")
                    ),
                    confidence_score=min(max(opp.get("confidence_score", 0), 0), 1),
                    supporting_signals=opp.get("supporting_signals", []),
                    recommended_direction=TradeDirection(
                        opp.get("recommended_direction", "LONG")
                    ),
                    urgency=Urgency(opp.get("urgency", "WATCH")),
                )
            )

        # Sort by confidence (highest first)
        opportunities.sort(key=lambda x: x.confidence_score, reverse=True)

        # Determine the best opportunity for deep analysis
        selected = opportunities[0] if opportunities else None

        scan_result = {
            "market_regime": response.get("market_regime", MarketRegime.RANGING.value),
            "top_opportunities": [o.model_dump() for o in opportunities],
            "sector_heat_map": response.get("sector_heat_map", {}),
            "market_breadth": response.get(
                "market_breadth", {"advances": 0, "declines": 0, "unchanged": 0}
            ),
            "india_vix": response.get("india_vix", 0),
            "nifty_level": response.get("nifty_level", 0),
            "scanner_summary": response.get("summary", "Scan complete."),
            "selected_symbol": selected.symbol if selected else "",
            "selected_price": selected.current_price if selected else 0,
            "reasoning_log": [
                f"[SCANNER] {datetime.now(tz=timezone.utc).isoformat()} | "
                f"Regime: {response.get('market_regime', 'UNKNOWN')} | "
                f"Found {len(opportunities)} opportunities | "
                f"Top: {selected.symbol if selected else 'None'} "
                f"({selected.confidence_score:.0%} confidence)"
                if selected
                else f"[SCANNER] No opportunities found"
            ],
        }

        logger.info(
            f"[SCANNER] ✓ Scan complete | "
            f"Regime: {response.get('market_regime')} | "
            f"Opportunities: {len(opportunities)} | "
            f"Best: {selected.symbol if selected else 'None'}"
        )

        return scan_result

    except Exception as e:
        logger.error(f"[SCANNER] Parse error: {e}")
        return {
            "scanner_summary": f"Scan failed: {e}",
            "error_log": [f"[SCANNER] {datetime.now(tz=timezone.utc).isoformat()} | Error: {e}"],
        }
