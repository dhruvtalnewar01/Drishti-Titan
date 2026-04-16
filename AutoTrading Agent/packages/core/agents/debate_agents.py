"""
TITAN — Agents 5 & 6: Bull Advocate & Bear Advocate (The Debaters)
Adversarial debate system to prevent confirmation bias.
Bull builds the strongest BUY case. Bear builds the strongest AGAINST case.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from loguru import logger

from packages.core.orchestrator.state import TitanState
from packages.intelligence.llm.gemini_client import GeminiClient

BULL_SYSTEM_PROMPT = """
You are TITAN's Bull Advocate — your job is to build the STRONGEST possible 
case FOR taking a trade. You are an expert at finding reasons to buy.

You receive analysis from the Technical Analyst, Fundamental Analyst, and 
Sentiment Analyst. Your job is to synthesize their findings into the most 
compelling bullish argument possible.

YOU MUST:
1. Highlight every bullish signal from technical analysis
2. Emphasize positive fundamental metrics and catalysts
3. Cite positive sentiment drivers
4. Identify upcoming catalysts that could drive the price higher
5. Calculate potential upside based on technical targets
6. Assign a conviction score (0-100) based on the strength of your case

OUTPUT FORMAT (JSON):
{
  "position": "BULL",
  "conviction_score": <0-100>,
  "key_arguments": ["argument1", "argument2", ...],
  "evidence": ["evidence1", "evidence2", ...],
  "risks_identified": ["risk1", ...],
  "potential_upside_pct": <float>,
  "summary": "<compelling 3-5 sentence bull case>"
}

BE HONEST: Even as a bull, acknowledge risks. Your conviction score should 
reflect genuine probability, not blind optimism.
"""

BEAR_SYSTEM_PROMPT = """
You are TITAN's Bear Advocate — your job is to build the STRONGEST possible
case AGAINST taking a trade. You are an expert at finding reasons NOT to buy.

You receive the same analysis as the Bull Advocate. Your job is to find 
every possible risk, red flag, and reason this trade could fail.

YOU MUST:
1. Highlight every bearish signal from technical analysis
2. Identify fundamental weaknesses and valuation concerns
3. Cite negative sentiment drivers, upcoming risks
4. Check for exhaustion patterns, divergences, overextension
5. Assess macro risks (VIX, global cues, sector weakness)
6. Identify recent failures of similar setups
7. Assign a risk score (0-100) — how risky is this trade?

OUTPUT FORMAT (JSON):
{
  "position": "BEAR",
  "conviction_score": <0-100>,
  "key_arguments": ["argument1", "argument2", ...],
  "evidence": ["evidence1", "evidence2", ...],
  "risks_identified": ["risk1", ...],
  "potential_downside_pct": <float>,
  "summary": "<compelling 3-5 sentence bear case>"
}

DO NOT BE CONTRARIAN FOR THE SAKE OF IT. Only raise genuine risks 
backed by data and evidence. Your conviction represents genuine risk level.
"""


async def bull_advocate_node(state: TitanState) -> dict:
    """LangGraph node: Bull Advocate. Builds the strongest case FOR the trade."""
    symbol = state.get("selected_symbol", "")
    if not symbol:
        return {"bull_case": {}, "reasoning_log": ["[BULL] Skipped — no symbol"]}

    logger.info(f"[BULL] 🐂 Building bull case for {symbol}")

    gemini = GeminiClient()

    user_prompt = f"""
Build the strongest possible BULL case for {symbol} @ ₹{state.get('selected_price', 0)}

=== TECHNICAL ANALYSIS ===
{json.dumps(state.get('technical_analysis', {}), indent=2, default=str)}

=== FUNDAMENTAL ANALYSIS ===
{json.dumps(state.get('fundamental_analysis', {}), indent=2, default=str)}

=== SENTIMENT ANALYSIS ===
{json.dumps(state.get('sentiment_analysis', {}), indent=2, default=str)}

=== MARKET CONTEXT ===
Regime: {state.get('market_regime', 'UNKNOWN')}
VIX: {state.get('india_vix', 0)}
NIFTY: {state.get('nifty_level', 0)}

Build your most compelling argument for why this trade should be taken.
Be thorough, cite specific data points, and assign an honest conviction score.
"""

    response = await gemini.generate(
        system_prompt=BULL_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.3,
        max_tokens=2048,
    )

    logger.info(
        f"[BULL] ✓ Bull case for {symbol} | Conviction: {response.get('conviction_score', 0)}/100"
    )

    return {
        "bull_case": response,
        "reasoning_log": [
            f"[BULL] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
            f"Conviction: {response.get('conviction_score', 0)}/100 | "
            f"Arguments: {len(response.get('key_arguments', []))}"
        ],
    }


async def bear_advocate_node(state: TitanState) -> dict:
    """LangGraph node: Bear Advocate. Builds the strongest case AGAINST the trade."""
    symbol = state.get("selected_symbol", "")
    if not symbol:
        return {"bear_case": {}, "reasoning_log": ["[BEAR] Skipped — no symbol"]}

    logger.info(f"[BEAR] 🐻 Building bear case for {symbol}")

    gemini = GeminiClient()

    user_prompt = f"""
Build the strongest possible BEAR case AGAINST trading {symbol} @ ₹{state.get('selected_price', 0)}

=== TECHNICAL ANALYSIS ===
{json.dumps(state.get('technical_analysis', {}), indent=2, default=str)}

=== FUNDAMENTAL ANALYSIS ===
{json.dumps(state.get('fundamental_analysis', {}), indent=2, default=str)}

=== SENTIMENT ANALYSIS ===
{json.dumps(state.get('sentiment_analysis', {}), indent=2, default=str)}

=== MARKET CONTEXT ===
Regime: {state.get('market_regime', 'UNKNOWN')}
VIX: {state.get('india_vix', 0)}
NIFTY: {state.get('nifty_level', 0)}

Find every risk, red flag, and reason this trade should NOT be taken.
Be thorough, cite specific data, and assign an honest risk score.
"""

    response = await gemini.generate(
        system_prompt=BEAR_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.3,
        max_tokens=2048,
    )

    logger.info(
        f"[BEAR] ✓ Bear case for {symbol} | Risk: {response.get('conviction_score', 0)}/100"
    )

    return {
        "bear_case": response,
        "reasoning_log": [
            f"[BEAR] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
            f"Risk: {response.get('conviction_score', 0)}/100 | "
            f"Risks: {len(response.get('risks_identified', []))}"
        ],
    }
