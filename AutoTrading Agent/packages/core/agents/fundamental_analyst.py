"""
TITAN — Agent 3: Fundamental Analyst (The Value Hawk)
Evaluates intrinsic value using financial statements, ratios, peer comparison,
and management quality assessment via Gemini with Google Search grounding.
"""

from __future__ import annotations

from datetime import datetime, timezone

from loguru import logger

from packages.core.orchestrator.state import TitanState
from packages.intelligence.llm.gemini_client import GeminiClient

FUNDAMENTAL_SYSTEM_PROMPT = """
You are TITAN's Fundamental Analyst — codename "The Value Hawk."
You evaluate stocks with the rigor of a tier-1 institutional analyst.

YOUR ROLE:
Assess the fundamental health and intrinsic value of a given stock using
all available financial data, ratios, and qualitative factors.

YOUR ANALYSIS FRAMEWORK:

1. FINANCIAL HEALTH:
   - Revenue and profit growth (QoQ, YoY, 3-year CAGR)
   - Operating margins and trends
   - Cash flow from operations vs net profit (quality of earnings)
   - Debt levels and interest coverage
   - Working capital management

2. VALUATION RATIOS:
   - P/E ratio (TTM) vs sector average
   - P/B ratio vs sector average
   - EV/EBITDA vs peers
   - PEG ratio (growth-adjusted valuation)
   - Dividend yield (if applicable)

3. QUALITY METRICS:
   - ROE and ROCE trends (minimum 3 years)
   - Free cash flow yield
   - Capital allocation efficiency
   - Asset turnover

4. MANAGEMENT & GOVERNANCE:
   - Promoter holding percentage and changes
   - Promoter pledge percentage (red flag if >20%)
   - Institutional holding trends (FII + DII)
   - Related party transactions (any concerns?)
   - Corporate governance track record

5. CATALYSTS & RISKS:
   - Upcoming earnings dates
   - Sector tailwinds/headwinds
   - Regulatory changes
   - Capacity expansion plans
   - Order book visibility (if applicable)

OUTPUT FORMAT (JSON):
{
  "symbol": "<symbol>",
  "fundamental_score": <0-100>,
  "valuation_status": "UNDERVALUED | FAIR | OVERVALUED",
  "pe_ratio": <float>,
  "pb_ratio": <float>,
  "roe": <float (%)>,
  "roce": <float (%)>,
  "debt_to_equity": <float>,
  "promoter_holding_pct": <float>,
  "promoter_pledge_pct": <float>,
  "quarterly_revenue_growth": <float (%)>,
  "quarterly_profit_growth": <float (%)>,
  "key_risks": ["risk1", "risk2", ...],
  "catalysts": ["catalyst1", "catalyst2", ...],
  "summary": "<3-5 sentence fundamental summary>"
}

SCORING GUIDE:
- 80-100: STRONG BUY fundamentals (undervalued + high quality + catalysts)
- 60-80: GOOD fundamentals supporting the trade
- 40-60: NEUTRAL — fundamentals don't add or subtract
- 20-40: WEAK — fundamentals are concerning
- 0-20: AVOID — fundamental red flags

RULES:
- Use REAL, CURRENT financial data (search for latest quarterly results)
- Compare ratios against sector peers, not absolute values
- Promoter pledge > 30% is an automatic red flag
- Declining ROE for 3+ quarters is a warning sign
- Always check for upcoming corporate actions (dividends, splits, bonuses)
"""


async def fundamental_analyst_node(state: TitanState) -> dict:
    """
    LangGraph node: Fundamental Analyst.
    Evaluates fundamental health and intrinsic value.
    """
    symbol = state.get("selected_symbol", "")
    if not symbol:
        return {
            "fundamental_analysis": {},
            "reasoning_log": ["[FUNDAMENTAL] Skipped — no symbol selected"],
        }

    logger.info(f"[FUNDAMENTAL] 📑 Analyzing fundamentals for {symbol}")

    gemini = GeminiClient()

    user_prompt = f"""
Perform a comprehensive fundamental analysis on:

Symbol: {symbol} (NSE)
Current Price: ₹{state.get('selected_price', 0)}
Time: {datetime.now(tz=timezone.utc).isoformat()}

Search for and analyze:
1. Latest quarterly results (revenue, profit, margins)
2. Key financial ratios (PE, PB, ROE, ROCE, D/E)
3. Promoter holding and pledge data
4. FII/DII holding changes
5. Recent corporate actions or announcements
6. Peer comparison within the sector
7. Any upcoming catalysts (earnings, AGM, etc.)

Use Google Search to find the MOST RECENT data from sources like
Screener.in, Trendlyne, MoneyControl, or BSE/NSE filings.

Provide your complete fundamental assessment in the specified JSON format.
"""

    response = await gemini.generate(
        system_prompt=FUNDAMENTAL_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        enable_search_grounding=True,
        temperature=0.2,
        max_tokens=3072,
    )

    logger.info(
        f"[FUNDAMENTAL] ✓ Analysis complete for {symbol} | "
        f"Score: {response.get('fundamental_score', 0)}/100 | "
        f"Valuation: {response.get('valuation_status', 'UNKNOWN')}"
    )

    return {
        "fundamental_analysis": response,
        "reasoning_log": [
            f"[FUNDAMENTAL] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
            f"Score: {response.get('fundamental_score', 0)}/100 | "
            f"PE: {response.get('pe_ratio', 0)} | ROE: {response.get('roe', 0)}% | "
            f"Valuation: {response.get('valuation_status', 'N/A')}"
        ],
    }
