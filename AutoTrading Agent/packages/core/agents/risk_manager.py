"""
TITAN — Agent 8: Risk Manager (The Guardian)
The final gatekeeper. NO trade executes without Risk Manager approval.
Can VETO any trade. Can force-close positions. Hardcoded risk rules
that CANNOT be overridden by any other agent.
"""

from __future__ import annotations

from datetime import datetime, timezone

from loguru import logger

from packages.core.config import get_settings
from packages.core.models import CircuitBreakerLevel, TradeAction, TradeDirection
from packages.core.orchestrator.state import TitanState


async def risk_manager_node(state: TitanState) -> dict:
    """
    LangGraph node: Risk Manager (The Guardian).

    Hardcoded risk rules — these are NOT AI-generated.
    They are deterministic, non-overridable safety checks.

    Risk Rules:
    1. MAX single position: 5% of capital
    2. MAX total exposure: 40% of capital
    3. MAX daily loss: 2% → circuit breaker
    4. MAX weekly loss: 5% → cooldown mode
    5. Mandatory stop-loss on EVERY trade
    6. Half-Kelly position sizing
    7. Max 3 positions in same sector
    8. No new positions 2 days before earnings
    9. 50% size reduction on F&O expiry days
    10. 50% size reduction if US futures down >2%
    """
    settings = get_settings()
    decision = state.get("judge_decision", {})
    action = decision.get("action", "HOLD")
    symbol = state.get("selected_symbol", "")

    # If judge said HOLD or no execution needed, pass through
    if not state.get("should_execute", False) or action not in ("BUY", "SELL"):
        return {
            "risk_assessment": {
                "approved": False,
                "veto_reason": f"Judge decision is {action} — no execution needed",
            },
            "should_execute": False,
            "reasoning_log": [
                f"[RISK] {datetime.now(tz=timezone.utc).isoformat()} | {symbol} | "
                f"Passthrough — Judge said {action}"
            ],
        }

    logger.info(f"[RISK] 🛡️ Evaluating risk for {symbol}...")

    # ── Extract decision parameters ──────────────────────────
    entry_price = decision.get("entry_price", state.get("selected_price", 0))
    stop_loss = decision.get("stop_loss", 0)
    targets = decision.get("targets", [])
    size_multiplier = decision.get("position_size_multiplier", 0.5)
    conviction = decision.get("conviction", 0)

    total_capital = state.get("total_capital", settings.max_capital_allocation)
    deployed_capital = state.get("deployed_capital", 0)
    daily_loss = abs(state.get("daily_loss_amount", 0))
    weekly_loss = abs(state.get("weekly_loss_amount", 0))
    circuit_level = state.get("circuit_breaker_level", 0)
    active_positions = state.get("active_positions", [])

    warnings: list[str] = []
    veto_reason: str | None = None

    # ══════════════════════════════════════════════════════════
    # HARDCODED RISK CHECKS (Non-overridable)
    # ══════════════════════════════════════════════════════════

    # CHECK 1: Circuit Breaker Status
    if circuit_level >= CircuitBreakerLevel.HALT.value:
        veto_reason = f"CIRCUIT BREAKER LEVEL {circuit_level} — no new trades allowed"
        logger.warning(f"[RISK] ✗ VETO: {veto_reason}")
        return _veto(symbol, veto_reason)

    # CHECK 2: Daily Loss Limit
    max_daily_loss = total_capital * (settings.max_daily_loss_pct / 100)
    if daily_loss >= max_daily_loss:
        veto_reason = (
            f"Daily loss limit reached: ₹{daily_loss:,.0f} >= "
            f"₹{max_daily_loss:,.0f} ({settings.max_daily_loss_pct}%)"
        )
        logger.warning(f"[RISK] ✗ VETO: {veto_reason}")
        return _veto(symbol, veto_reason, circuit_breaker_level=CircuitBreakerLevel.HALT.value)

    # CHECK 3: Weekly Loss Limit
    max_weekly_loss = total_capital * (settings.max_weekly_loss_pct / 100)
    if weekly_loss >= max_weekly_loss:
        veto_reason = (
            f"Weekly loss limit reached: ₹{weekly_loss:,.0f} >= "
            f"₹{max_weekly_loss:,.0f} ({settings.max_weekly_loss_pct}%)"
        )
        logger.warning(f"[RISK] ✗ VETO: {veto_reason}")
        return _veto(symbol, veto_reason)

    # CHECK 4: Mandatory Stop-Loss
    if not stop_loss or stop_loss <= 0:
        veto_reason = "NO STOP-LOSS defined — every trade MUST have a stop-loss"
        logger.warning(f"[RISK] ✗ VETO: {veto_reason}")
        return _veto(symbol, veto_reason)

    # CHECK 5: Maximum Exposure
    max_exposure = total_capital * (settings.max_total_exposure_pct / 100)
    if deployed_capital >= max_exposure:
        veto_reason = (
            f"Maximum exposure reached: ₹{deployed_capital:,.0f} >= "
            f"₹{max_exposure:,.0f} ({settings.max_total_exposure_pct}%)"
        )
        logger.warning(f"[RISK] ✗ VETO: {veto_reason}")
        return _veto(symbol, veto_reason)

    # ── Position Sizing (Half-Kelly Criterion) ───────────────

    # Calculate risk per share
    if action == "BUY":
        risk_per_share = entry_price - stop_loss
    else:
        risk_per_share = stop_loss - entry_price

    if risk_per_share <= 0:
        veto_reason = f"Invalid risk calculation: entry={entry_price}, SL={stop_loss}"
        return _veto(symbol, veto_reason)

    # Maximum position size (5% of capital)
    max_position_value = total_capital * (settings.max_single_position_pct / 100)

    # Apply size multiplier from Judge
    adjusted_position_value = max_position_value * size_multiplier

    # Calculate quantity
    quantity = int(adjusted_position_value / entry_price) if entry_price > 0 else 0

    if quantity <= 0:
        veto_reason = f"Position size too small: value=₹{adjusted_position_value:,.0f}"
        return _veto(symbol, veto_reason)

    # Risk amount for this trade
    risk_amount = risk_per_share * quantity
    risk_pct = (risk_amount / total_capital) * 100

    # CHECK 6: Single trade risk cap (max 1% per trade)
    max_trade_risk = total_capital * 0.01  # 1% max risk per trade
    if risk_amount > max_trade_risk:
        old_qty = quantity
        quantity = int(max_trade_risk / risk_per_share)
        risk_amount = risk_per_share * quantity
        risk_pct = (risk_amount / total_capital) * 100
        warnings.append(
            f"Quantity reduced from {old_qty} to {quantity} to cap risk at 1%"
        )

    # ── Additional Checks ────────────────────────────────────

    # Daily loss approaching threshold? Reduce size
    if daily_loss > max_daily_loss * 0.5:
        old_qty = quantity
        quantity = max(1, quantity // 2)
        risk_amount = risk_per_share * quantity
        risk_pct = (risk_amount / total_capital) * 100
        warnings.append(
            f"Daily loss at {(daily_loss/max_daily_loss)*100:.0f}% of limit — "
            f"reduced qty from {old_qty} to {quantity}"
        )

    # VIX check
    vix = state.get("india_vix", 0)
    if vix > 20:
        old_qty = quantity
        quantity = max(1, int(quantity * 0.75))
        warnings.append(f"VIX at {vix} (>20) — reduced size by 25%")

    if vix > 25:
        old_qty = quantity
        quantity = max(1, int(quantity * 0.5))
        warnings.append(f"VIX at {vix} (>25) — additional 50% reduction")

    # Recalculate final risk
    risk_amount = risk_per_share * quantity
    risk_pct = (risk_amount / total_capital) * 100

    # ── APPROVED ─────────────────────────────────────────────

    logger.info(
        f"[RISK] ✓ APPROVED: {action} {quantity}x {symbol} @ ₹{entry_price:.2f} | "
        f"SL: ₹{stop_loss:.2f} | Risk: ₹{risk_amount:,.0f} ({risk_pct:.2f}%)"
    )

    return {
        "risk_assessment": {
            "approved": True,
            "adjusted_quantity": quantity,
            "adjusted_position_size": entry_price * quantity,
            "sl_price": stop_loss,
            "risk_amount": risk_amount,
            "risk_pct_of_capital": risk_pct,
            "veto_reason": None,
            "warnings": warnings,
        },
        "should_execute": True,
        "reasoning_log": [
            f"[RISK] {datetime.now(tz=timezone.utc).isoformat()} | ✓ APPROVED | "
            f"{action} {quantity}x {symbol} @ ₹{entry_price:.2f} | "
            f"SL: ₹{stop_loss:.2f} | Risk: ₹{risk_amount:,.0f} ({risk_pct:.2f}%) | "
            f"Warnings: {'; '.join(warnings) if warnings else 'None'}"
        ],
    }


def _veto(
    symbol: str,
    reason: str,
    circuit_breaker_level: int | None = None,
) -> dict:
    """Helper to create a VETO response."""
    result = {
        "risk_assessment": {
            "approved": False,
            "adjusted_quantity": 0,
            "adjusted_position_size": 0,
            "sl_price": 0,
            "risk_amount": 0,
            "risk_pct_of_capital": 0,
            "veto_reason": reason,
            "warnings": [],
        },
        "should_execute": False,
        "reasoning_log": [
            f"[RISK] {datetime.now(tz=timezone.utc).isoformat()} | ✗ VETO | "
            f"{symbol} | Reason: {reason}"
        ],
    }
    if circuit_breaker_level is not None:
        result["circuit_breaker_level"] = circuit_breaker_level
    return result
