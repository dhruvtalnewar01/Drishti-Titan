"""
TITAN — Abstract Broker Interface
All broker implementations (Zerodha, Groww, Simulator) must implement this.
Enables hot-swapping between brokers without changing trading logic.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Callable

from packages.core.models import (
    CandleData,
    Holding,
    MarginInfo,
    OrderRequest,
    OrderResponse,
    Position,
    TickData,
)


class BrokerBase(ABC):
    """
    Unified broker interface for TITAN.

    Every broker adapter implements this contract.
    The execution engine only talks to this interface,
    never to broker-specific APIs directly.
    """

    name: str = "base"
    is_authenticated: bool = False

    # ── Authentication ──────────────────────────────────────

    @abstractmethod
    async def authenticate(self) -> bool:
        """
        Perform full authentication flow (OAuth, TOTP, etc.).
        Returns True if session is valid.
        """
        ...

    @abstractmethod
    async def is_session_valid(self) -> bool:
        """Check if current session/token is still valid."""
        ...

    @abstractmethod
    async def refresh_session(self) -> bool:
        """Refresh an expired session. Re-authenticates if needed."""
        ...

    # ── Order Management ────────────────────────────────────

    @abstractmethod
    async def place_order(self, order: OrderRequest) -> OrderResponse:
        """
        Place a new order with the broker.
        Must attach SEBI-mandated algo_id to every order.
        """
        ...

    @abstractmethod
    async def modify_order(
        self, order_id: str, params: dict[str, Any]
    ) -> OrderResponse:
        """Modify an existing pending order."""
        ...

    @abstractmethod
    async def cancel_order(self, order_id: str) -> bool:
        """Cancel a pending order. Returns True on success."""
        ...

    @abstractmethod
    async def get_order_status(self, order_id: str) -> OrderResponse:
        """Get current status of a specific order."""
        ...

    @abstractmethod
    async def get_order_history(self) -> list[OrderResponse]:
        """Get all orders placed today."""
        ...

    # ── Portfolio ────────────────────────────────────────────

    @abstractmethod
    async def get_positions(self) -> list[Position]:
        """Get all current intraday + carryforward positions."""
        ...

    @abstractmethod
    async def get_holdings(self) -> list[Holding]:
        """Get all delivery holdings (CNC)."""
        ...

    @abstractmethod
    async def get_margins(self) -> MarginInfo:
        """Get available margin/cash information."""
        ...

    # ── Market Data ─────────────────────────────────────────

    @abstractmethod
    async def get_ltp(self, symbols: list[str]) -> dict[str, float]:
        """Get last traded price for given symbols."""
        ...

    @abstractmethod
    async def get_quote(self, symbols: list[str]) -> dict[str, TickData]:
        """Get full quote (OHLCV, depth, OI) for given symbols."""
        ...

    @abstractmethod
    async def get_historical_data(
        self,
        symbol: str,
        interval: str,
        from_date: str,
        to_date: str,
    ) -> list[CandleData]:
        """
        Fetch historical OHLCV candles.
        interval: "minute", "3minute", "5minute", "15minute",
                  "30minute", "60minute", "day", "week", "month"
        """
        ...

    # ── WebSocket / Real-Time ───────────────────────────────

    @abstractmethod
    async def subscribe_ticks(
        self,
        instruments: list[str],
        on_tick: Callable[[list[TickData]], Any],
        on_connect: Callable | None = None,
        on_disconnect: Callable | None = None,
    ) -> None:
        """
        Subscribe to real-time tick data via WebSocket.
        on_tick is called with a list of TickData for every tick batch.
        Must handle auto-reconnection with exponential backoff.
        """
        ...

    @abstractmethod
    async def unsubscribe_ticks(self, instruments: list[str]) -> None:
        """Unsubscribe from instruments."""
        ...

    @abstractmethod
    async def disconnect(self) -> None:
        """Cleanly disconnect all WebSocket connections."""
        ...

    # ── Instrument Master ───────────────────────────────────

    @abstractmethod
    async def get_instruments(self, exchange: str = "NSE") -> list[dict]:
        """
        Download the full instrument master list.
        Returns list of {symbol, token, lot_size, exchange, ...}
        """
        ...

    @abstractmethod
    async def get_instrument_token(self, symbol: str, exchange: str = "NSE") -> str:
        """Resolve a symbol to its broker-specific instrument token."""
        ...
