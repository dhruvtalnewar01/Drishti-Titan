"""
TITAN — Groww Trading API Client
Adapter implementing BrokerBase for the Groww trading platform.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Callable

import httpx
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


class GrowwClient(BrokerBase):
    """
    Groww Trading API adapter.

    Implements the BrokerBase interface for Groww's REST API and WebSocket feeds.
    Uses the growwapi Python SDK where available, falling back to raw REST calls.
    """

    name = "groww"
    BASE_URL = "https://api.groww.in/v1"

    def __init__(self) -> None:
        settings = get_settings()
        self.api_key = settings.groww_api_key
        self.api_secret = settings.groww_api_secret
        self.access_token: str | None = None
        self.is_authenticated = False
        self._http = httpx.AsyncClient(
            base_url=self.BASE_URL,
            timeout=30.0,
        )
        logger.info("[GROWW] Client initialized")

    def _headers(self) -> dict:
        """Build authorization headers."""
        headers = {"Content-Type": "application/json"}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers

    # ── Authentication ──────────────────────────────────────

    async def authenticate(self) -> bool:
        """
        Groww OAuth 2.0 authentication flow.
        In production, complete the OAuth redirect flow to obtain access_token.
        """
        try:
            # NOTE: Groww requires OAuth 2.0 with redirect.
            # For server-side, the access_token is obtained from the OAuth flow
            # and stored. Here we check if a token is already set.
            if self.access_token:
                self.is_authenticated = True
                logger.info("[GROWW] ✓ Authenticated with existing token")
                return True

            logger.warning(
                "[GROWW] No access token set. Complete OAuth flow via "
                "set_access_token() or the Groww developer portal."
            )
            return False

        except Exception as e:
            logger.error(f"[GROWW] Authentication failed: {e}")
            return False

    def set_access_token(self, token: str) -> None:
        """Manually inject access token from OAuth flow."""
        self.access_token = token
        self.is_authenticated = True
        logger.info("[GROWW] ✓ Access token set")

    async def is_session_valid(self) -> bool:
        if not self.access_token:
            return False
        try:
            response = await self._http.get(
                "/user/profile", headers=self._headers()
            )
            return response.status_code == 200
        except Exception:
            return False

    async def refresh_session(self) -> bool:
        return await self.authenticate()

    # ── Order Management ────────────────────────────────────

    async def place_order(self, order: OrderRequest) -> OrderResponse:
        """Place order via Groww API."""
        try:
            payload = {
                "symbol": order.symbol,
                "exchange": order.exchange,
                "transaction_type": "BUY" if order.direction == TradeDirection.LONG else "SELL",
                "order_type": order.order_type.value,
                "quantity": order.quantity,
                "price": order.price,
                "trigger_price": order.trigger_price,
                "product": order.product,
                "tag": order.algo_id,
            }

            response = await self._http.post(
                "/orders", json=payload, headers=self._headers()
            )
            data = response.json()

            if response.status_code == 200 and data.get("order_id"):
                logger.info(f"[GROWW] ✓ Order placed: {data['order_id']}")
                return OrderResponse(
                    order_id=data["order_id"],
                    status=OrderStatus.PENDING,
                    symbol=order.symbol,
                    direction=order.direction,
                    quantity=order.quantity,
                    price=order.price,
                    message="Order placed",
                )
            else:
                return OrderResponse(
                    order_id="",
                    status=OrderStatus.REJECTED,
                    symbol=order.symbol,
                    direction=order.direction,
                    quantity=order.quantity,
                    message=data.get("message", "Order rejected"),
                )

        except Exception as e:
            logger.error(f"[GROWW] Order failed: {e}")
            return OrderResponse(
                order_id="",
                status=OrderStatus.REJECTED,
                symbol=order.symbol,
                direction=order.direction,
                quantity=order.quantity,
                message=str(e),
            )

    async def modify_order(self, order_id: str, params: dict[str, Any]) -> OrderResponse:
        try:
            response = await self._http.put(
                f"/orders/{order_id}", json=params, headers=self._headers()
            )
            return OrderResponse(
                order_id=order_id,
                status=OrderStatus.OPEN,
                symbol=params.get("symbol", ""),
                direction=TradeDirection.LONG,
                quantity=params.get("quantity", 0),
                message="Modified",
            )
        except Exception as e:
            return OrderResponse(
                order_id=order_id,
                status=OrderStatus.REJECTED,
                symbol="",
                direction=TradeDirection.LONG,
                quantity=0,
                message=str(e),
            )

    async def cancel_order(self, order_id: str) -> bool:
        try:
            response = await self._http.delete(
                f"/orders/{order_id}", headers=self._headers()
            )
            return response.status_code == 200
        except Exception:
            return False

    async def get_order_status(self, order_id: str) -> OrderResponse:
        try:
            response = await self._http.get(
                f"/orders/{order_id}", headers=self._headers()
            )
            data = response.json()
            return OrderResponse(
                order_id=order_id,
                status=OrderStatus(data.get("status", "PENDING")),
                symbol=data.get("symbol", ""),
                direction=TradeDirection.LONG,
                quantity=data.get("quantity", 0),
                price=data.get("average_price", 0),
            )
        except Exception:
            return OrderResponse(
                order_id=order_id,
                status=OrderStatus.CANCELLED,
                symbol="",
                direction=TradeDirection.LONG,
                quantity=0,
            )

    async def get_order_history(self) -> list[OrderResponse]:
        try:
            response = await self._http.get("/orders", headers=self._headers())
            orders = response.json().get("orders", [])
            return [
                OrderResponse(
                    order_id=o.get("order_id", ""),
                    status=OrderStatus.COMPLETE,
                    symbol=o.get("symbol", ""),
                    direction=TradeDirection.LONG if o.get("side") == "BUY" else TradeDirection.SHORT,
                    quantity=o.get("quantity", 0),
                    price=o.get("average_price", 0),
                )
                for o in orders
            ]
        except Exception:
            return []

    # ── Portfolio ────────────────────────────────────────────

    async def get_positions(self) -> list[Position]:
        try:
            response = await self._http.get("/positions", headers=self._headers())
            positions = response.json().get("positions", [])
            return [
                Position(
                    symbol=p.get("symbol", ""),
                    direction=TradeDirection.LONG if p.get("quantity", 0) > 0 else TradeDirection.SHORT,
                    quantity=abs(p.get("quantity", 0)),
                    average_price=p.get("average_price", 0),
                    current_price=p.get("ltp", 0),
                    pnl=p.get("pnl", 0),
                )
                for p in positions
                if p.get("quantity", 0) != 0
            ]
        except Exception:
            return []

    async def get_holdings(self) -> list[Holding]:
        try:
            response = await self._http.get("/holdings", headers=self._headers())
            return [
                Holding(
                    symbol=h.get("symbol", ""),
                    quantity=h.get("quantity", 0),
                    average_price=h.get("average_price", 0),
                    current_price=h.get("ltp", 0),
                    pnl=h.get("pnl", 0),
                )
                for h in response.json().get("holdings", [])
            ]
        except Exception:
            return []

    async def get_margins(self) -> MarginInfo:
        try:
            response = await self._http.get("/margins", headers=self._headers())
            data = response.json()
            return MarginInfo(
                available_cash=data.get("available_cash", 0),
                used_margin=data.get("used_margin", 0),
                total_margin=data.get("total_margin", 0),
            )
        except Exception:
            return MarginInfo()

    # ── Market Data ─────────────────────────────────────────

    async def get_ltp(self, symbols: list[str]) -> dict[str, float]:
        try:
            params = {"symbols": ",".join(symbols)}
            response = await self._http.get(
                "/market/ltp", params=params, headers=self._headers()
            )
            return {
                item["symbol"]: item["ltp"]
                for item in response.json().get("data", [])
            }
        except Exception:
            return {}

    async def get_quote(self, symbols: list[str]) -> dict[str, TickData]:
        ltp_data = await self.get_ltp(symbols)
        return {
            sym: TickData(symbol=sym, ltp=price)
            for sym, price in ltp_data.items()
        }

    async def get_historical_data(
        self, symbol: str, interval: str, from_date: str, to_date: str
    ) -> list[CandleData]:
        try:
            params = {
                "symbol": symbol,
                "interval": interval,
                "from": from_date,
                "to": to_date,
            }
            response = await self._http.get(
                "/market/history", params=params, headers=self._headers()
            )
            candles = response.json().get("candles", [])
            return [
                CandleData(
                    symbol=symbol,
                    timeframe=interval,
                    open=c[1],
                    high=c[2],
                    low=c[3],
                    close=c[4],
                    volume=c[5],
                    timestamp=datetime.fromisoformat(c[0]),
                )
                for c in candles
            ]
        except Exception:
            return []

    # ── WebSocket (Groww real-time feed) ─────────────────────

    async def subscribe_ticks(
        self, instruments: list[str], on_tick: Callable, **kwargs
    ) -> None:
        logger.info(f"[GROWW] Tick subscription for {len(instruments)} instruments")
        # Groww WebSocket integration would go here
        # Similar to Zerodha but using Groww's WS endpoints

    async def unsubscribe_ticks(self, instruments: list[str]) -> None:
        pass

    async def disconnect(self) -> None:
        await self._http.aclose()
        logger.info("[GROWW] Disconnected")

    async def get_instruments(self, exchange: str = "NSE") -> list[dict]:
        try:
            response = await self._http.get(
                f"/instruments/{exchange}", headers=self._headers()
            )
            return response.json().get("instruments", [])
        except Exception:
            return []

    async def get_instrument_token(self, symbol: str, exchange: str = "NSE") -> str:
        return symbol  # Groww uses symbol directly
