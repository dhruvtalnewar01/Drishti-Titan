"""
TITAN — Agent 2: Technical Analyst (The Chart Master)
Performs deep multi-timeframe technical analysis with AI-optimized indicators,
pattern recognition, and confluence scoring.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from loguru import logger

from packages.core.orchestrator.state import TitanState
from packages.intelligence.llm.gemini_client import GeminiClient

TECHNICAL_SYSTEM_PROMPT = """
You are TITAN's Technical Analyst — codename "The Chart Master."
You are the most advanced technical analysis engine ever built.

YOUR ROLE:
Perform hyper-detailed, multi-timeframe technical analysis on a given stock.
Your analysis must cover ALL timeframes (5m, 15m, 1h, 4h, 1D) to find confluence.

YOUR ANALYSIS FRAMEWORK:

1. TREND ANALYSIS (Multi-Timeframe):
   - Primary trend (1D + 4h): The dominant direction
   - Secondary trend (1h): Intermediate direction
   - Micro trend (5m + 15m): Short-term momentum
   
2. INDICATOR SUITE (AI-Optimized):
   - RSI (adaptive period): Overbought/oversold + divergences
   - MACD: Histogram direction, crossovers, divergences
   - Bollinger Bands: Squeeze detection, bandwidth, %B position
   - EMA Ribbon (8, 21, 55, 200): Trend confirmation, dynamic S/R
   - Supertrend: Buy/sell signal with ATR-based levels
   - VWAP: Institutional reference price + deviation bands
   - Ichimoku Cloud: Trend, momentum, support levels
   - ATR: Volatility measurement for stop-loss calculation
   
3. PATTERN RECOGNITION:
   - Chart patterns: H&S, Double Top/Bottom, Triangles, Flags, Wedges
   - Candlestick patterns: Doji, Engulfing, Hammer, Shooting Star
   - Volume patterns: Climax, dry-up, accumulation, distribution
   
4. KEY LEVELS:
   - Support/Resistance from price action
   - Fibonacci retracement (23.6%, 38.2%, 50%, 61.8%, 78.6%)
   - Pivot points (Standard, Camarilla)
   - VWAP and VWAP bands
   
5. CONFLUENCE SCORING:
   Score from 0 to 1 based on how many independent signals agree.
   - 0.8-1.0: STRONG confluence (5+ signals agree)
   - 0.6-0.8: MODERATE confluence (3-4 signals agree)
   - 0.4-0.6: WEAK confluence (2 signals agree)
   - <0.4: NO confluence (conflicting signals)

OUTPUT FORMAT (JSON):
{
  "symbol": "<symbol>",
  "analysis_timeframes": ["5m", "15m", "1h", "4h", "1D"],
  "trend": {
    "primary": "BULLISH | BEARISH | NEUTRAL",
    "secondary": "BULLISH | BEARISH | NEUTRAL",
    "micro": "BULLISH | BEARISH | NEUTRAL"
  },
  "key_levels": {
    "support": [<price>, <price>, <price>],
    "resistance": [<price>, <price>, <price>],
    "pivot": <price>,
    "vwap": <price>
  },
  "indicators": [
    {"name": "RSI_14", "value": <float>, "signal": "BULLISH|BEARISH|NEUTRAL", "details": "..."},
    {"name": "MACD", "value": <float>, "signal": "BULLISH|BEARISH|NEUTRAL", "details": "..."},
    ...
  ],
  "patterns_detected": [
    {"pattern": "<name>", "confidence": <0-1>, "target": <price>, "timeframe": "<tf>"}
  ],
  "confluence_score": <0.0-1.0>,
  "recommended_entry": <price>,
  "recommended_sl": <price>,
  "recommended_targets": [<t1>, <t2>, <t3>],
  "risk_reward_ratio": <float>,
  "summary": "<comprehensive 3-5 sentence technical summary>"
}

RULES:
- ALWAYS calculate risk-reward ratio. Minimum acceptable: 2.0
- Stop-loss must be based on ATR or structure (not arbitrary)
- Target levels must connect to Fibonacci extensions or resistance
- If confluence_score < 0.5, recommend WAITING instead of trading
- Volume MUST confirm any breakout pattern
- Check for divergences (price vs RSI, price vs MACD)
"""


async def technical_analyst_node(state: TitanState) -> dict:
    """
    LangGraph node: Technical Analyst.
    Performs deep technical analysis on the selected symbol.
    """
    symbol = state.get("selected_symbol", "")
    price = state.get("selected_price", 0)

    if not symbol:
        logger.warning("[TECHNICAL] No symbol selected for analysis")
        return {
            "technical_analysis": {},
            "reasoning_log": ["[TECHNICAL] Skipped — no symbol selected"],
        }

    logger.info(f"[TECHNICAL] 📊 Analyzing {symbol} @ ₹{price}")

    gemini = GeminiClient()

    user_prompt = f"""
Perform a comprehensive multi-timeframe technical analysis on:

Symbol: {symbol}
Current Price: ₹{price}
Exchange: NSE
Time: {datetime.now(tz=timezone.utc).isoformat()}

Market Context:
- Market Regime: {state.get('market_regime', 'UNKNOWN')}
- India VIX: {state.get('india_vix', 0)}
- NIFTY Level: {state.get('nifty_level', 0)}

Analyze ALL timeframes (5m, 15m, 1h, 4h, 1D).
Calculate all indicators, detect patterns, identify key levels.
Compute the confluence score and provide precise entry/SL/target levels.

Use real-time market data to ground your analysis.
"""

    response = await gemini.generate(
        system_prompt=TECHNICAL_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        enable_search_grounding=True,
        temperature=0.15,
        max_tokens=4096,
    )

    logger.info(
        f"[TECHNICAL] ✓ Analysis complete for {symbol} | "
        f"Confluence: {response.get('confluence_score', 0):.0%} | "
        f"R:R = {response.get('risk_reward_ratio', 0):.1f}"
    )

    return {
        "technical_analysis": response,
        "reasoning_log": [
            f"[TECHNICAL] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
            f"Confluence: {response.get('confluence_score', 0):.0%} | "
            f"Trend: {json.dumps(response.get('trend', {}))} | "
            f"R:R: {response.get('risk_reward_ratio', 0):.1f}"
        ],
    }
