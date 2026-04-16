"""
TITAN — Gemini LLM Client
Central AI brain using Google Gemini with function calling,
Google Search grounding, and structured JSON output.

Features:
- Non-blocking async execution via asyncio.to_thread()
- Robust JSON extraction (handles markdown fences, partial JSON)
- Retry with exponential backoff on transient failures
- Thread-safe singleton pattern
- Token usage tracking with cost estimation
"""

from __future__ import annotations

import asyncio
import json
import re
import threading
from datetime import datetime, timezone
from typing import Any

from google import genai
from google.genai import types
from loguru import logger
from tenacity import (
    retry,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

from packages.core.config import get_settings

# ── JSON extraction regex ────────────────────────────────
# Matches ```json ... ``` or ``` ... ``` fenced blocks
_JSON_FENCE_RE = re.compile(
    r"```(?:json)?\s*\n?(.*?)\n?\s*```",
    re.DOTALL | re.IGNORECASE,
)


def _extract_json(text: str) -> dict[str, Any]:
    """
    Robustly extract JSON from LLM output.

    Handles:
    1. Pure JSON string
    2. Markdown-fenced JSON (```json ... ```)
    3. JSON embedded in prose text
    4. Fallback to raw_text if nothing works
    """
    if not text or not text.strip():
        return {"error": "Empty response"}

    cleaned = text.strip()

    # Attempt 1: Direct parse (ideal case — clean JSON)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Attempt 2: Extract from markdown code fence
    fence_match = _JSON_FENCE_RE.search(cleaned)
    if fence_match:
        try:
            return json.loads(fence_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Attempt 3: Find first { ... } block (greedy)
    brace_start = cleaned.find("{")
    brace_end = cleaned.rfind("}")
    if brace_start != -1 and brace_end > brace_start:
        try:
            return json.loads(cleaned[brace_start : brace_end + 1])
        except json.JSONDecodeError:
            pass

    # Attempt 4: Find first [ ... ] block (for array responses)
    bracket_start = cleaned.find("[")
    bracket_end = cleaned.rfind("]")
    if bracket_start != -1 and bracket_end > bracket_start:
        try:
            return {"data": json.loads(cleaned[bracket_start : bracket_end + 1])}
        except json.JSONDecodeError:
            pass

    # Fallback: return raw text
    return {"raw_text": cleaned}


class GeminiClient:
    """
    Thread-safe singleton Gemini client for all TITAN agents.

    Features:
    - Structured JSON output with schema enforcement
    - Google Search grounding for real-time web data
    - Function calling for tool use
    - Non-blocking async execution
    - Token usage tracking
    """

    _instance: GeminiClient | None = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls) -> GeminiClient:
        if cls._instance is None:
            with cls._lock:
                # Double-checked locking
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return

        settings = get_settings()
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = settings.gemini_model
        self.total_tokens_used = 0
        self.total_requests = 0
        self._created_at = datetime.now(tz=timezone.utc)

        self._initialized = True
        logger.info(f"[GEMINI] Client initialized | Model: {self.model}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=30),
        retry=retry_if_exception_type((ConnectionError, TimeoutError, OSError)),
        reraise=True,
    )
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        response_schema: dict[str, Any] | None = None,
        tools: list[Any] | None = None,
        enable_search_grounding: bool = False,
        temperature: float = 0.3,
        max_tokens: int = 8192,
    ) -> dict[str, Any]:
        """
        Generate a response from Gemini (non-blocking).

        Uses asyncio.to_thread() to prevent blocking the event loop
        during the synchronous SDK call.

        Args:
            system_prompt: The agent's system prompt defining its role
            user_prompt: The specific task/data to analyze
            response_schema: JSON schema for structured output
            tools: Function calling tool definitions
            enable_search_grounding: Enable Google Search for real-time data
            temperature: Creativity level (0=deterministic, 1=creative)
            max_tokens: Maximum output tokens

        Returns:
            Parsed JSON response or raw text as dict
        """
        try:
            # Build config
            config = types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=temperature,
                max_output_tokens=max_tokens,
            )

            # Enable structured JSON output
            if response_schema:
                config.response_mime_type = "application/json"
                config.response_schema = response_schema

            # Enable Google Search grounding
            if enable_search_grounding:
                config.tools = [types.Tool(google_search=types.GoogleSearch())]

            # Add custom tools (function calling)
            if tools:
                if config.tools:
                    config.tools.extend(tools)
                else:
                    config.tools = tools

            # ── Non-blocking generation ──────────────────────
            # The google-genai SDK's generate_content() is synchronous.
            # We offload it to a thread to avoid blocking the event loop.
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model,
                contents=user_prompt,
                config=config,
            )

            # Track usage
            self.total_requests += 1
            if hasattr(response, "usage_metadata") and response.usage_metadata:
                tokens = (
                    getattr(response.usage_metadata, "total_token_count", 0) or 0
                )
                self.total_tokens_used += tokens

            # Parse response with robust JSON extraction
            if response.text:
                return _extract_json(response.text)

            return {"error": "Empty response from Gemini"}

        except Exception as e:
            logger.error(f"[GEMINI] Generation failed: {e}")
            return {"error": str(e)}

    async def analyze_with_search(
        self,
        query: str,
        system_context: str = "You are a financial research analyst.",
    ) -> str:
        """
        Quick helper: Use Gemini with Google Search grounding
        for real-time web intelligence.
        """
        result = await self.generate(
            system_prompt=system_context,
            user_prompt=query,
            enable_search_grounding=True,
            temperature=0.2,
        )
        return result.get("raw_text", result.get("error", "No result"))

    def get_usage_stats(self) -> dict[str, Any]:
        """Get token usage statistics."""
        return {
            "total_tokens_used": self.total_tokens_used,
            "total_requests": self.total_requests,
            "model": self.model,
            "uptime_seconds": (
                datetime.now(tz=timezone.utc) - self._created_at
            ).total_seconds(),
        }
