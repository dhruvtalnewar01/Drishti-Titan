"""
TITAN — Agent 7: Decision Judge (The Final Arbiter)
Weighs Bull vs Bear arguments, synthesizes all data, and makes the
FINAL trade/no-trade decision with conviction and position sizing.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone

from loguru import logger

from packages.core.models import TimeHorizon, TradeAction
from packages.core.orchestrator.state import TitanState
from packages.intelligence.llm.gemini_client import GeminiClient

JUDGE_SYSTEM_PROMPT = """
You are TITAN's Decision Judge — codename "The Final Arbiter."
You are the most critical decision point in the entire system.
NO trade happens without your explicit approval.

YOUR ROLE:
Receive the Bull and Bear arguments along with all analysis data.
Weigh them objectively. Make the FINAL decision.

DECISION MATRIX:
- Bull conviction > 75 AND Bear risk < 40 → STRONG signal (full size)
- Bull conviction > 60 AND Bear risk < 55 → MODERATE signal (50-75% size)
- Bull conviction < 60 OR Bear risk > 55 → NO TRADE (skip)
- Bear risk > 75 → EMERGENCY: consider closing existing positions

POSITION SIZING MULTIPLIER:
- 1.0 = Full position (maximum conviction, all signals aligned)
- 0.75 = Strong (most signals aligned, minor concerns)
- 0.50 = Moderate (decent setup but some uncertainty)
- 0.25 = Minimum (marginal setup, small position only)
- 0.0 = No trade

OUTPUT FORMAT (JSON):
{
  "action": "BUY | SELL | HOLD | CLOSE",
  "conviction": <0-100>,
  "position_size_multiplier": <0.0-1.0>,
  "time_horizon": "SCALP | INTRADAY | SWING | POSITIONAL",
  "entry_price": <float>,
  "stop_loss": <float>,
  "targets": [<t1>, <t2>, <t3>],
  "reasoning": "<detailed 5-7 sentence reasoning explaining the decision>"
}

RULES:
1. You MUST explain WHY you made the decision (reasoning field is mandatory)
2. Stop-loss is MANDATORY for any BUY/SELL action
3. If market regime is HIGH_VOLATILITY, reduce all position sizes by 50%
4. If VIX > 20, apply extra caution (reduce size by 25%)
5. If technicals and fundamentals DISAGREE, default to technicals for 
   short-term and fundamentals for positional trades
6. Never override the Risk Manager (that comes after you)
7. Be CONSERVATIVE. It's better to miss a trade than to lose money.
8. A HOLD decision is for already-held positions that should be maintained.
   BUY/SELL is for new entries. CLOSE is for exiting positions.
"""


async def decision_judge_node(state: TitanState) -> dict:
    """
    LangGraph node: Decision Judge.
    Makes the final trade/no-trade decision.
    """
    symbol = state.get("selected_symbol", "")
    if not symbol:
        return {
            "judge_decision": {"action": "HOLD", "conviction": 0, "reasoning": "No symbol"},
            "should_execute": False,
            "reasoning_log": ["[JUDGE] No symbol — defaulting to HOLD"],
        }

    logger.info(f"[JUDGE] ⚖️ Deliberating on {symbol}...")

    gemini = GeminiClient()

    bull = state.get("bull_case", {})
    bear = state.get("bear_case", {})

    user_prompt = f"""
MAKE YOUR FINAL DECISION on {symbol} @ ₹{state.get('selected_price', 0)}

══════════════════════════════════
BULL ADVOCATE (conviction: {bull.get('conviction_score', 0)}/100):
{json.dumps(bull, indent=2, default=str)}

══════════════════════════════════
BEAR ADVOCATE (risk: {bear.get('conviction_score', 0)}/100):
{json.dumps(bear, indent=2, default=str)}

══════════════════════════════════
TECHNICAL ANALYSIS:
Confluence: {state.get('technical_analysis', {}).get('confluence_score', 0)}
R:R Ratio: {state.get('technical_analysis', {}).get('risk_reward_ratio', 0)}
Entry: {state.get('technical_analysis', {}).get('recommended_entry', 0)}
SL: {state.get('technical_analysis', {}).get('recommended_sl', 0)}
Targets: {state.get('technical_analysis', {}).get('recommended_targets', [])}

FUNDAMENTAL SCORE: {state.get('fundamental_analysis', {}).get('fundamental_score', 0)}/100
SENTIMENT SCORE: {state.get('sentiment_analysis', {}).get('sentiment_score', 0)}
MARKET REGIME: {state.get('market_regime', 'UNKNOWN')}
VIX: {state.get('india_vix', 0)}

PORTFOLIO STATE:
- Capital: ₹{state.get('total_capital', 0):,.0f}
- Today P&L: ₹{state.get('portfolio_pnl_today', 0):,.0f}
- Active positions: {len(state.get('active_positions', []))}
- Circuit breaker: Level {state.get('circuit_breaker_level', 0)}

══════════════════════════════════

Apply the decision matrix. Make your final call.
Remember: It's better to miss a trade than to lose money.
"""

    response = await gemini.generate(
        system_prompt=JUDGE_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.15,
        max_tokens=2048,
    )

    action = response.get("action", "HOLD")
    conviction = response.get("conviction", 0)
    should_execute = action in ("BUY", "SELL") and conviction >= 50

    logger.info(
        f"[JUDGE] {'✓' if should_execute else '✗'} Decision for {symbol}: "
        f"{action} | Conviction: {conviction}/100 | "
        f"Size: {response.get('position_size_multiplier', 0):.0%} | "
        f"Execute: {should_execute}"
    )

    return {
        "judge_decision": response,
        "should_execute": should_execute,
        "reasoning_log": [
            f"[JUDGE] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
            f"Decision: {action} | Conviction: {conviction}/100 | "
            f"Size: {response.get('position_size_multiplier', 0):.0%} | "
            f"Reason: {response.get('reasoning', 'N/A')[:200]}"
        ],
    }
