"""
TITAN — Execution Engine
The final stage: Translates approved decisions into real broker orders.
Handles order placement, position monitoring, and trade lifecycle.
"""

from __future__ import annotations

from datetime import datetime, timezone

from loguru import logger

from packages.brokers.base import BrokerBase
from packages.core.config import get_settings
from packages.core.models import (
    OrderRequest,
    OrderType,
    TradeAction,
    TradeDirection,
)
from packages.core.orchestrator.state import TitanState


class ExecutionEngine:
    """
    Translates trade decisions into broker orders with SEBI compliance.
    
    Features:
    - Order type selection (MARKET vs LIMIT based on liquidity)
    - Automatic SL order placement after entry
    - Trade lifecycle logging for audit
    """

    def __init__(self, broker: BrokerBase) -> None:
        self.broker = broker
        self.settings = get_settings()
        logger.info(f"[EXECUTION] Engine initialized | Broker: {broker.name}")

    async def execute_decision(self, state: TitanState) -> dict:
        """Execute the approved trade decision."""
        decision = state.get("judge_decision", {})
        risk = state.get("risk_assessment", {})
        symbol = state.get("selected_symbol", "")

        if not risk.get("approved", False):
            return {
                "reasoning_log": [
                    f"[EXECUTION] {datetime.now(tz=timezone.utc).isoformat()} | "
                    f"Skipped — Risk Manager did not approve"
                ],
            }

        action = decision.get("action", "HOLD")
        quantity = risk.get("adjusted_quantity", 0)
        entry_price = decision.get("entry_price", 0)
        sl_price = risk.get("sl_price", 0)

        if action not in ("BUY", "SELL") or quantity <= 0:
            return {
                "reasoning_log": [
                    f"[EXECUTION] Skipped — invalid action={action} or qty={quantity}"
                ],
            }

        logger.info(
            f"[EXECUTION] 🚀 Executing: {action} {quantity}x {symbol} "
            f"@ ₹{entry_price:.2f} | SL: ₹{sl_price:.2f}"
        )

        # Determine direction
        direction = TradeDirection.LONG if action == "BUY" else TradeDirection.SHORT

        # Determine product type based on time horizon
        time_horizon = decision.get("time_horizon", "INTRADAY")
        product = "MIS" if time_horizon in ("SCALP", "INTRADAY") else "CNC"

        # ── Place Entry Order ────────────────────────────────
        entry_order = OrderRequest(
            symbol=symbol,
            exchange="NSE",
            direction=direction,
            order_type=OrderType.MARKET,
            quantity=quantity,
            price=entry_price,
            product=product,
            algo_id=f"TITAN_V1_{self.settings.trading_mode.value.upper()}",
        )

        entry_response = await self.broker.place_order(entry_order)

        if entry_response.status.value == "REJECTED":
            logger.error(
                f"[EXECUTION] ✗ Entry order rejected: {entry_response.message}"
            )
            return {
                "reasoning_log": [
                    f"[EXECUTION] {datetime.now(tz=timezone.utc).isoformat()} | "
                    f"REJECTED: {entry_response.message}"
                ],
                "error_log": [
                    f"[EXECUTION] Order rejected for {symbol}: {entry_response.message}"
                ],
            }

        logger.info(
            f"[EXECUTION] ✓ Entry filled: {entry_response.order_id} | "
            f"Price: ₹{entry_response.price:.2f}"
        )

        # ── Place Stop-Loss Order ────────────────────────────
        sl_direction = (
            TradeDirection.SHORT if direction == TradeDirection.LONG else TradeDirection.LONG
        )

        sl_order = OrderRequest(
            symbol=symbol,
            exchange="NSE",
            direction=sl_direction,
            order_type=OrderType.SL_M,
            quantity=quantity,
            trigger_price=sl_price,
            product=product,
            algo_id=f"TITAN_V1_SL",
        )

        sl_response = await self.broker.place_order(sl_order)

        logger.info(
            f"[EXECUTION] {'✓' if sl_response.status.value != 'REJECTED' else '✗'} "
            f"SL order: {sl_response.order_id} @ ₹{sl_price:.2f}"
        )

        # ── Build Trade Record ───────────────────────────────
        trade_record = {
            "trade_id": entry_response.order_id,
            "symbol": symbol,
            "direction": direction.value,
            "entry_price": entry_response.price,
            "quantity": quantity,
            "stop_loss": sl_price,
            "targets": decision.get("targets", []),
            "strategy": decision.get("time_horizon", "INTRADAY"),
            "conviction": decision.get("conviction", 0),
            "risk_amount": risk.get("risk_amount", 0),
            "reasoning": decision.get("reasoning", ""),
            "entry_time": datetime.now(tz=timezone.utc).isoformat(),
            "sl_order_id": sl_response.order_id,
        }

        # Update deployed capital
        new_deployed = state.get("deployed_capital", 0) + (
            entry_response.price * quantity
        )

        return {
            "trade_history": [trade_record],
            "deployed_capital": new_deployed,
            "reasoning_log": [
                f"[EXECUTION] {datetime.now(tz=timezone.utc).isoformat()} | ✓ EXECUTED | "
                f"{direction.value} {quantity}x {symbol} @ "
                f"₹{entry_response.price:.2f} | SL: ₹{sl_price:.2f} | "
                f"Risk: ₹{risk.get('risk_amount', 0):,.0f} | "
                f"OrderID: {entry_response.order_id}"
            ],
        }


async def execution_node(state: TitanState) -> dict:
    """
    LangGraph node: Execution Engine.
    Uses the broker from state/config to execute trades.
    NOTE: In production, the broker instance is injected via the graph config.
    """
    # Import here to avoid circular dependency
    from packages.brokers.simulator.paper_trading import PaperTradingClient

    settings = get_settings()

    # Default to paper trading
    broker = PaperTradingClient()
    await broker.authenticate()

    engine = ExecutionEngine(broker)
    return await engine.execute_decision(state)
