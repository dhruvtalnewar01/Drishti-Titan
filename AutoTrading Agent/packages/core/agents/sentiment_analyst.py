"""
TITAN — Agent 4: Sentiment Analyst (The Mood Reader)
Processes multi-source data to compute real-time sentiment scores
using financial NLP, social listening, and fear/greed analysis.
"""

from __future__ import annotations

from datetime import datetime, timezone

from loguru import logger

from packages.core.orchestrator.state import TitanState
from packages.intelligence.llm.gemini_client import GeminiClient

SENTIMENT_SYSTEM_PROMPT = """
You are TITAN's Sentiment Analyst — codename "The Mood Reader."
You are the most sophisticated market sentiment engine in India.

YOUR ROLE:
Process multi-source data streams to compute real-time market sentiment
for individual stocks and the overall market.

YOUR DATA SOURCES:
1. Financial News: MoneyControl, ET, LiveMint, Business Standard, Reuters
2. Social Media: Twitter/X financial cashtags, Reddit, StockTwits
3. Institutional Data: FII/DII flows, analyst upgrades/downgrades
4. Market Indicators: India VIX, PCR, breadth, new highs/lows
5. Global Cues: US futures, Asian markets, crude oil, DXY, US yields

YOUR ANALYSIS:

1. NEWS SENTIMENT:
   - Classify each piece of news as POSITIVE / NEGATIVE / NEUTRAL
   - Weight by source credibility and recency
   - Detect earnings guidance changes
   - Identify regulatory/policy impacts

2. SOCIAL SENTIMENT:
   - Twitter/X cashtag mention velocity and sentiment ratio
   - Reddit buzz and sentiment direction
   - StockTwits bull/bear ratio
   - Detect retail frenzy or panic signals

3. FEAR & GREED COMPOSITE INDEX (0-100):
   Components:
   - India VIX level and direction (fear gauge)
   - NIFTY Put-Call Ratio (options sentiment)
   - FII/DII net flow (institutional confidence)
   - Market breadth (advances vs declines)
   - New 52-week highs vs lows
   
   Interpretation:
   - 0-25: EXTREME FEAR (contrarian buy signal)
   - 25-45: FEAR
   - 45-55: NEUTRAL
   - 55-75: GREED
   - 75-100: EXTREME GREED (contrarian sell signal)

OUTPUT FORMAT (JSON):
{
  "symbol": "<symbol>",
  "sentiment_score": <-1.0 to +1.0>,
  "confidence": <0.0 to 1.0>,
  "news_sentiment": <-1.0 to +1.0>,
  "social_sentiment": <-1.0 to +1.0>,
  "fear_greed_index": <0-100>,
  "key_drivers": ["driver1", "driver2", ...],
  "catalysts": ["catalyst1", "catalyst2", ...],
  "india_vix": <float>,
  "pcr": <float>,
  "fii_net_flow": <float in crores>,
  "summary": "<3-5 sentence sentiment summary>"
}

RULES:
- sentiment_score: -1 = extremely bearish, +1 = extremely bullish, 0 = neutral
- Always cross-reference news sentiment with price action (was it already priced in?)
- Extreme fear CAN be a buying opportunity (contrarian signal)
- Extreme greed CAN be a selling opportunity
- Single analyst downgrades may create short-term noise; focus on consensus changes
- Social media hype without volume confirmation is unreliable
"""


async def sentiment_analyst_node(state: TitanState) -> dict:
    """
    LangGraph node: Sentiment Analyst.
    Computes multi-source sentiment scores.
    """
    symbol = state.get("selected_symbol", "")
    if not symbol:
        return {
            "sentiment_analysis": {},
            "reasoning_log": ["[SENTIMENT] Skipped — no symbol selected"],
        }

    logger.info(f"[SENTIMENT] 🧠 Analyzing sentiment for {symbol}")

    gemini = GeminiClient()

    user_prompt = f"""
Perform a comprehensive sentiment analysis for:

Symbol: {symbol} (NSE)
Current Price: ₹{state.get('selected_price', 0)}
Time: {datetime.now(tz=timezone.utc).isoformat()}

Search for and analyze:
1. Latest news about {symbol} from financial portals
2. Social media buzz and sentiment (Twitter/X, Reddit)
3. Analyst recommendations and target price changes
4. FII/DII activity in this stock and overall market
5. India VIX current level
6. NIFTY PCR (Put-Call Ratio)
7. Global market sentiment (US futures, Asian markets)
8. Any upcoming events that could impact sentiment

Compute:
- Individual sentiment scores for news and social channels
- Overall sentiment score (-1 to +1)
- Fear & Greed composite index (0-100)
- Key sentiment drivers and catalysts

Use Google Search to find the MOST CURRENT sentiment data.
"""

    response = await gemini.generate(
        system_prompt=SENTIMENT_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        enable_search_grounding=True,
        temperature=0.2,
        max_tokens=3072,
    )

    logger.info(
        f"[SENTIMENT] ✓ Analysis complete for {symbol} | "
        f"Sentiment: {response.get('sentiment_score', 0):+.2f} | "
        f"Fear/Greed: {response.get('fear_greed_index', 50)}"
    )

    return {
        "sentiment_analysis": response,
        "reasoning_log": [
            f"[SENTIMENT] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
            f"Score: {response.get('sentiment_score', 0):+.2f} | "
            f"F&G: {response.get('fear_greed_index', 50)} | "
            f"Drivers: {', '.join(response.get('key_drivers', [])[:3])}"
        ],
    }
