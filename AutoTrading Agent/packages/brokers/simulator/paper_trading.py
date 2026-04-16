"""
TITAN — Paper Trading Simulator
A fully functional broker simulator for testing strategies without real money.
Simulates order execution, position tracking, P&L calculation, and slippage.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Callable

from loguru import logger

from packages.brokers.base import BrokerBase
from packages.core.config import get_settings
from packages.core.models import (
    CandleData,
    Holding,
    MarginInfo,
    OrderRequest,
    OrderResponse,
    OrderStatus,
    Position,
    TickData,
    TradeDirection,
)


class PaperTradingClient(BrokerBase):
    """
    Simulated broker for paper trading.
    
    Mimics real broker behavior including:
    - Simulated order execution with configurable slippage
    - Position and P&L tracking
    - Margin calculations
    - Fake tick data generation from historical candles
    """

    name = "simulator"

    def __init__(self) -> None:
        settings = get_settings()
        self.is_authenticated = False

        # Simulated state
        self._capital = settings.max_capital_allocation
        self._positions: dict[str, Position] = {}
        self._holdings: dict[str, Holding] = {}
        self._orders: list[OrderResponse] = []
        self._prices: dict[str, float] = {}  # Current simulated prices

        # Simulation config
        self._slippage_pct = 0.05  # 0.05% slippage on market orders
        self._brokerage_per_order = 20.0  # Flat ₹20 per executed order

        logger.info(
            f"[PAPER] Paper trading simulator initialized | Capital: ₹{self._capital:,.0f}"
        )

    # ── Authentication ──────────────────────────────────────

    async def authenticate(self) -> bool:
        self.is_authenticated = True
        logger.info("[PAPER] ✓ Paper trading session started")
        return True

    async def is_session_valid(self) -> bool:
        return self.is_authenticated

    async def refresh_session(self) -> bool:
        return True

    # ── Order Management ────────────────────────────────────

    async def place_order(self, order: OrderRequest) -> OrderResponse:
        """Simulate order execution with slippage."""
        order_id = f"PAPER_{uuid.uuid4().hex[:12].upper()}"
        
        # Get current price (or estimate)
        current_price = self._prices.get(order.symbol, order.price or 100.0)

        # Apply slippage for market orders
        if order.order_type.value == "MARKET":
            if order.direction == TradeDirection.LONG:
                exec_price = current_price * (1 + self._slippage_pct / 100)
            else:
                exec_price = current_price * (1 - self._slippage_pct / 100)
        else:
            exec_price = order.price if order.price > 0 else current_price

        # Check margin
        required_margin = exec_price * order.quantity
        if order.direction == TradeDirection.LONG and required_margin > self._capital:
            logger.warning(
                f"[PAPER] ✗ Insufficient margin: need ₹{required_margin:,.0f}, "
                f"have ₹{self._capital:,.0f}"
            )
            return OrderResponse(
                order_id=order_id,
                status=OrderStatus.REJECTED,
                symbol=order.symbol,
                direction=order.direction,
                quantity=order.quantity,
                message="Insufficient margin",
            )

        # Execute order
        self._capital -= self._brokerage_per_order  # Charge brokerage

        # Update positions
        sym = order.symbol
        if sym in self._positions:
            pos = self._positions[sym]
            if pos.direction == order.direction:
                # Adding to position
                total_qty = pos.quantity + order.quantity
                avg_price = (
                    (pos.average_price * pos.quantity + exec_price * order.quantity)
                    / total_qty
                )
                pos.quantity = total_qty
                pos.average_price = avg_price
            else:
                # Closing/reducing position
                if order.quantity >= pos.quantity:
                    # Full close
                    pnl = (exec_price - pos.average_price) * pos.quantity
                    if pos.direction == TradeDirection.SHORT:
                        pnl = -pnl
                    self._capital += pnl + (pos.average_price * pos.quantity)
                    del self._positions[sym]
                    logger.info(
                        f"[PAPER] Position closed: {sym} | P&L: ₹{pnl:,.2f}"
                    )
                else:
                    pos.quantity -= order.quantity
        else:
            # New position
            if order.direction == TradeDirection.LONG:
                self._capital -= exec_price * order.quantity
            self._positions[sym] = Position(
                symbol=sym,
                exchange=order.exchange,
                direction=order.direction,
                quantity=order.quantity,
                average_price=exec_price,
                current_price=current_price,
                stop_loss=order.trigger_price,
            )

        response = OrderResponse(
            order_id=order_id,
            status=OrderStatus.COMPLETE,
            symbol=order.symbol,
            direction=order.direction,
            quantity=order.quantity,
            price=exec_price,
            message=f"Paper order executed @ ₹{exec_price:.2f}",
        )
        self._orders.append(response)

        logger.info(
            f"[PAPER] ✓ {order.direction.value} {order.quantity}x "
            f"{order.symbol} @ ₹{exec_price:.2f} | "
            f"Capital: ₹{self._capital:,.0f}"
        )
        return response

    async def modify_order(
        self, order_id: str, params: dict[str, Any]
    ) -> OrderResponse:
        """Paper orders execute instantly, so modification is a no-op."""
        logger.info(f"[PAPER] Order {order_id} modification simulated")
        return OrderResponse(
            order_id=order_id,
            status=OrderStatus.COMPLETE,
            symbol=params.get("tradingsymbol", ""),
            direction=TradeDirection.LONG,
            quantity=params.get("quantity", 0),
            message="Modification simulated",
        )

    async def cancel_order(self, order_id: str) -> bool:
        logger.info(f"[PAPER] Order {order_id} cancelled (simulated)")
        return True

    async def get_order_status(self, order_id: str) -> OrderResponse:
        for o in self._orders:
            if o.order_id == order_id:
                return o
        return OrderResponse(
            order_id=order_id,
            status=OrderStatus.CANCELLED,
            symbol="",
            direction=TradeDirection.LONG,
            quantity=0,
            message="Not found",
        )

    async def get_order_history(self) -> list[OrderResponse]:
        return self._orders.copy()

    # ── Portfolio ────────────────────────────────────────────

    async def get_positions(self) -> list[Position]:
        # Update current prices
        for sym, pos in self._positions.items():
            if sym in self._prices:
                pos.current_price = self._prices[sym]
                diff = pos.current_price - pos.average_price
                if pos.direction == TradeDirection.SHORT:
                    diff = -diff
                pos.pnl = diff * pos.quantity
                pos.pnl_pct = (diff / pos.average_price) * 100 if pos.average_price > 0 else 0
        return list(self._positions.values())

    async def get_holdings(self) -> list[Holding]:
        return list(self._holdings.values())

    async def get_margins(self) -> MarginInfo:
        deployed = sum(
            p.average_price * p.quantity for p in self._positions.values()
        )
        return MarginInfo(
            available_cash=self._capital,
            used_margin=deployed,
            total_margin=self._capital + deployed,
        )

    # ── Market Data (Simulated) ─────────────────────────────

    def update_price(self, symbol: str, price: float) -> None:
        """Inject simulated price (called by data feed)."""
        self._prices[symbol] = price

    async def get_ltp(self, symbols: list[str]) -> dict[str, float]:
        return {s: self._prices.get(s, 0.0) for s in symbols}

    async def get_quote(self, symbols: list[str]) -> dict[str, TickData]:
        result = {}
        for s in symbols:
            price = self._prices.get(s, 0.0)
            result[s] = TickData(
                symbol=s,
                ltp=price,
                open=price,
                high=price,
                low=price,
                close=price,
            )
        return result

    async def get_historical_data(
        self, symbol: str, interval: str, from_date: str, to_date: str
    ) -> list[CandleData]:
        # In paper trading, return empty — use external data source
        logger.info(f"[PAPER] Historical data request for {symbol} (not available in simulator)")
        return []

    # ── WebSocket (No-op in Paper Trading) ──────────────────

    async def subscribe_ticks(
        self, instruments: list[str], on_tick: Callable, **kwargs
    ) -> None:
        logger.info(f"[PAPER] Tick subscription simulated for {len(instruments)} instruments")

    async def unsubscribe_ticks(self, instruments: list[str]) -> None:
        pass

    async def disconnect(self) -> None:
        logger.info("[PAPER] Simulator disconnected")

    async def get_instruments(self, exchange: str = "NSE") -> list[dict]:
        return []

    async def get_instrument_token(self, symbol: str, exchange: str = "NSE") -> str:
        return symbol
