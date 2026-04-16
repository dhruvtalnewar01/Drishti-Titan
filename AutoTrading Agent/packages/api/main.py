"""
TITAN — FastAPI Main Application
The central nervous system that connects the AI engine, broker APIs,
and all frontend clients (Chrome Extension + Web Dashboard).
"""

from __future__ import annotations

import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from packages.core.config import get_settings
from packages.core.orchestrator.graph import compile_trading_graph, run_single_cycle
from packages.core.orchestrator.state import TitanState, create_initial_state

__version__ = "1.0.0"


# ═══════════════════════════════════════════════════════════
# GLOBAL STATE
# ═══════════════════════════════════════════════════════════

class TitanRuntime:
    """Global runtime state for the trading agent."""

    def __init__(self):
        self.graph = None
        self.current_state: TitanState = create_initial_state()
        self.is_running = False
        self.is_paused = False
        self.connected_clients: list[WebSocket] = []
        self._trading_task: asyncio.Task | None = None
        self._started_at: datetime | None = None

    async def broadcast(self, event: str, data: dict):
        """Broadcast event to all connected WebSocket clients."""
        message = {
            "event": event,
            "data": data,
            "timestamp": datetime.now(tz=timezone.utc).isoformat(),
        }
        disconnected = []
        for ws in self.connected_clients:
            try:
                await ws.send_json(message)
            except Exception:
                disconnected.append(ws)
        # Safe removal — handles clients already gone
        for ws in disconnected:
            try:
                self.connected_clients.remove(ws)
            except ValueError:
                pass


runtime = TitanRuntime()


# ═══════════════════════════════════════════════════════════
# APPLICATION LIFECYCLE
# ═══════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    logger.info("═══════════════════════════════════════════")
    logger.info("  TITAN AI Trading Agent — Starting Up")
    logger.info("═══════════════════════════════════════════")

    settings = get_settings()

    # ── Startup Validation ────────────────────────────────
    if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
        logger.critical(
            "[STARTUP] ⚠️ GEMINI_API_KEY is not configured! "
            "Set it in your .env file. The agent will not function without it."
        )

    runtime.graph = compile_trading_graph()
    runtime._started_at = datetime.now(tz=timezone.utc)

    logger.info(f"  Mode: {settings.trading_mode.value.upper()}")
    logger.info(f"  Broker: {settings.default_broker.value}")
    logger.info(f"  Capital: ₹{settings.max_capital_allocation:,.0f}")
    logger.info(f"  Autonomy: {settings.agent_autonomy.value}")
    logger.info("═══════════════════════════════════════════")
    logger.info("  ✓ All systems nominal. Ready for commands.")
    logger.info("═══════════════════════════════════════════")

    yield

    # ── Graceful Shutdown ─────────────────────────────────
    logger.info("[SHUTDOWN] Initiating graceful shutdown...")
    runtime.is_running = False
    if runtime._trading_task and not runtime._trading_task.done():
        runtime._trading_task.cancel()
        try:
            await asyncio.wait_for(
                asyncio.shield(runtime._trading_task), timeout=10.0
            )
        except (asyncio.CancelledError, asyncio.TimeoutError):
            pass
    # Disconnect all WebSocket clients cleanly
    for ws in runtime.connected_clients[:]:
        try:
            await ws.close()
        except Exception:
            pass
    runtime.connected_clients.clear()
    logger.info("[SHUTDOWN] TITAN shutdown complete.")


# ═══════════════════════════════════════════════════════════
# FASTAPI APP
# ═══════════════════════════════════════════════════════════

app = FastAPI(
    title="TITAN AI Trading Agent",
    description=(
        "God-Level AI Auto-Trading Agent with 8-Agent Multi-Agent Council, "
        "adversarial debate system, and real-time market intelligence. "
        "Powered by Google Gemini with Google Search grounding."
    ),
    version=__version__,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS for Chrome Extension and Dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to extension + dashboard origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════
# HEALTH & STATUS
# ═══════════════════════════════════════════════════════════

@app.get("/", tags=["Health"])
async def root():
    return {
        "name": "TITAN AI Trading Agent",
        "version": __version__,
        "status": "running" if runtime.is_running else "idle",
        "uptime_seconds": (
            (datetime.now(tz=timezone.utc) - runtime._started_at).total_seconds()
            if runtime._started_at
            else 0
        ),
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status": "healthy",
        "agent_running": runtime.is_running,
        "agent_paused": runtime.is_paused,
        "connected_clients": len(runtime.connected_clients),
        "circuit_breaker_level": runtime.current_state.get("circuit_breaker_level", 0),
        "gemini_configured": bool(
            get_settings().gemini_api_key
            and get_settings().gemini_api_key != "your_gemini_api_key_here"
        ),
    }


# ═══════════════════════════════════════════════════════════
# AGENT CONTROL
# ═══════════════════════════════════════════════════════════

@app.post("/api/v1/agent/start", tags=["Agent Control"])
async def start_agent():
    """Start the TITAN trading agent loop."""
    if runtime.is_running:
        return {"status": "already_running", "cycle_count": runtime.current_state.get("cycle_count", 0)}

    # Validate Gemini key before starting
    settings = get_settings()
    if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY not configured. Set it in .env before starting."
        )

    runtime.is_running = True
    runtime.is_paused = False

    async def trading_loop():
        """Main trading loop — runs one cycle per interval."""
        cycle_interval = 60  # seconds

        while runtime.is_running:
            if runtime.is_paused:
                await asyncio.sleep(5)
                continue

            try:
                # Run one analysis cycle
                result = await run_single_cycle(runtime.graph, runtime.current_state)
                runtime.current_state = result

                # Broadcast state update to all clients
                await runtime.broadcast("state_update", {
                    "cycle_count": result.get("cycle_count", 0),
                    "market_regime": result.get("market_regime", "UNKNOWN"),
                    "selected_symbol": result.get("selected_symbol", ""),
                    "judge_decision": result.get("judge_decision", {}),
                    "risk_assessment": result.get("risk_assessment", {}),
                    "portfolio_pnl_today": result.get("portfolio_pnl_today", 0),
                    "circuit_breaker_level": result.get("circuit_breaker_level", 0),
                })

                logger.info(
                    f"[LOOP] Cycle {result.get('cycle_count', 0)} complete. "
                    f"Next scan in {cycle_interval}s"
                )

            except asyncio.CancelledError:
                logger.info("[LOOP] Trading loop cancelled gracefully")
                break
            except Exception as e:
                logger.error(f"[LOOP] Cycle error: {e}")
                await runtime.broadcast("error", {"message": str(e)})

            await asyncio.sleep(cycle_interval)

        runtime.is_running = False

    runtime._trading_task = asyncio.create_task(trading_loop())

    return {"status": "started", "mode": settings.trading_mode.value}


@app.post("/api/v1/agent/stop", tags=["Agent Control"])
async def stop_agent():
    """Stop the TITAN trading agent."""
    runtime.is_running = False
    if runtime._trading_task:
        runtime._trading_task.cancel()
    await runtime.broadcast("agent_stopped", {})
    return {"status": "stopped"}


@app.post("/api/v1/agent/pause", tags=["Agent Control"])
async def pause_agent():
    """Pause agent — keeps positions, stops new analysis."""
    runtime.is_paused = not runtime.is_paused
    status = "paused" if runtime.is_paused else "resumed"
    await runtime.broadcast("agent_paused", {"paused": runtime.is_paused})
    return {"status": status}


@app.get("/api/v1/agent/status", tags=["Agent Control"])
async def agent_status():
    """Get comprehensive agent status."""
    state = runtime.current_state
    trades = state.get("trade_history", [])
    winning = sum(1 for t in trades if t.get("pnl", 0) > 0)

    return {
        "is_running": runtime.is_running,
        "is_paused": runtime.is_paused,
        "cycle_count": state.get("cycle_count", 0),
        "market_regime": state.get("market_regime", "UNKNOWN"),
        "circuit_breaker_level": state.get("circuit_breaker_level", 0),
        "last_symbol": state.get("selected_symbol", ""),
        "last_decision": state.get("judge_decision", {}),
        "portfolio_pnl_today": state.get("portfolio_pnl_today", 0),
        "total_capital": state.get("total_capital", 0),
        "deployed_capital": state.get("deployed_capital", 0),
        "active_positions": len(state.get("active_positions", [])),
        "trades_today": len(trades),
        "win_rate": (winning / len(trades) * 100) if trades else 0,
    }


# ═══════════════════════════════════════════════════════════
# MANUAL CYCLE (On-Demand Analysis)
# ═══════════════════════════════════════════════════════════

@app.post("/api/v1/agent/cycle", tags=["Agent Control"])
async def run_manual_cycle():
    """
    Run a single analysis cycle on-demand without starting the loop.
    Useful for manual testing and one-shot analysis.
    """
    if runtime.is_running:
        raise HTTPException(
            status_code=409,
            detail="Agent is already running in auto mode. Stop it first."
        )

    settings = get_settings()
    if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
        raise HTTPException(status_code=503, detail="GEMINI_API_KEY not configured.")

    logger.info("[MANUAL] Running single analysis cycle...")

    try:
        result = await run_single_cycle(runtime.graph, runtime.current_state)
        runtime.current_state = result

        return {
            "status": "complete",
            "cycle_count": result.get("cycle_count", 0),
            "selected_symbol": result.get("selected_symbol", ""),
            "market_regime": result.get("market_regime", "UNKNOWN"),
            "decision": result.get("judge_decision", {}),
            "risk": result.get("risk_assessment", {}),
            "executed": result.get("should_execute", False),
        }
    except Exception as e:
        logger.error(f"[MANUAL] Cycle failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ═══════════════════════════════════════════════════════════
# MARKET ANALYSIS
# ═══════════════════════════════════════════════════════════

@app.get("/api/v1/analysis/scan", tags=["Analysis"])
async def get_scan_results():
    """Get latest market scan results."""
    state = runtime.current_state
    return {
        "market_regime": state.get("market_regime", "UNKNOWN"),
        "opportunities": state.get("top_opportunities", []),
        "sector_heat_map": state.get("sector_heat_map", {}),
        "market_breadth": state.get("market_breadth", {}),
        "india_vix": state.get("india_vix", 0),
        "nifty_level": state.get("nifty_level", 0),
        "summary": state.get("scanner_summary", ""),
    }


@app.get("/api/v1/analysis/{symbol}", tags=["Analysis"])
async def get_symbol_analysis(symbol: str):
    """Get deep analysis for a specific symbol."""
    state = runtime.current_state
    if state.get("selected_symbol", "").upper() != symbol.upper():
        return {
            "message": f"{symbol} not currently analyzed. Latest: {state.get('selected_symbol')}",
            "available_symbol": state.get("selected_symbol", ""),
        }

    return {
        "symbol": symbol,
        "technical": state.get("technical_analysis", {}),
        "fundamental": state.get("fundamental_analysis", {}),
        "sentiment": state.get("sentiment_analysis", {}),
        "bull_case": state.get("bull_case", {}),
        "bear_case": state.get("bear_case", {}),
        "decision": state.get("judge_decision", {}),
        "risk": state.get("risk_assessment", {}),
    }


# ═══════════════════════════════════════════════════════════
# PORTFOLIO
# ═══════════════════════════════════════════════════════════

@app.get("/api/v1/portfolio/summary", tags=["Portfolio"])
async def portfolio_summary():
    """Get portfolio performance summary."""
    state = runtime.current_state
    trades = state.get("trade_history", [])
    winning = sum(1 for t in trades if t.get("pnl", 0) > 0)

    return {
        "total_capital": state.get("total_capital", 0),
        "deployed_capital": state.get("deployed_capital", 0),
        "pnl_today": state.get("portfolio_pnl_today", 0),
        "pnl_week": state.get("portfolio_pnl_week", 0),
        "total_trades": len(trades),
        "winning_trades": winning,
        "losing_trades": len(trades) - winning,
        "win_rate": (winning / len(trades) * 100) if trades else 0,
        "active_positions": state.get("active_positions", []),
        "circuit_breaker_level": state.get("circuit_breaker_level", 0),
    }


@app.get("/api/v1/portfolio/trades", tags=["Portfolio"])
async def trade_history():
    """Get trade history with reasoning."""
    return {
        "trades": runtime.current_state.get("trade_history", []),
    }


@app.get("/api/v1/portfolio/reasoning", tags=["Portfolio"])
async def reasoning_log():
    """Get the full AI reasoning audit trail."""
    return {
        "reasoning_log": runtime.current_state.get("reasoning_log", []),
    }


# ═══════════════════════════════════════════════════════════
# GEMINI USAGE STATS
# ═══════════════════════════════════════════════════════════

@app.get("/api/v1/system/usage", tags=["System"])
async def gemini_usage():
    """Get Gemini API token usage statistics."""
    from packages.intelligence.llm.gemini_client import GeminiClient

    try:
        client = GeminiClient()
        return client.get_usage_stats()
    except Exception:
        return {"total_tokens_used": 0, "total_requests": 0}


# ═══════════════════════════════════════════════════════════
# EMERGENCY CONTROLS
# ═══════════════════════════════════════════════════════════

@app.post("/api/v1/emergency/close-all", tags=["Emergency"])
async def emergency_close_all():
    """EMERGENCY: Close all positions immediately."""
    logger.critical("[EMERGENCY] ⚠️ CLOSE ALL POSITIONS triggered!")
    runtime.is_running = False
    runtime.current_state["circuit_breaker_level"] = 3
    await runtime.broadcast("emergency", {"action": "close_all"})
    # In production: call broker.close_all_positions()
    return {
        "status": "emergency_close_initiated",
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }


@app.post("/api/v1/emergency/kill-switch", tags=["Emergency"])
async def kill_switch():
    """KILL SWITCH: Stop everything immediately."""
    logger.critical("[EMERGENCY] ⚠️ KILL SWITCH activated!")
    runtime.is_running = False
    runtime.is_paused = True
    runtime.current_state["circuit_breaker_level"] = 3
    if runtime._trading_task:
        runtime._trading_task.cancel()
    await runtime.broadcast("kill_switch", {})
    return {
        "status": "killed",
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }


# ═══════════════════════════════════════════════════════════
# WEBSOCKET — Real-time Updates
# ═══════════════════════════════════════════════════════════

@app.websocket("/ws/v1/live")
async def websocket_endpoint(websocket: WebSocket):
    """Real-time WebSocket for Chrome Extension and Dashboard."""
    await websocket.accept()
    runtime.connected_clients.append(websocket)
    logger.info(
        f"[WS] Client connected | Total: {len(runtime.connected_clients)}"
    )

    try:
        # Send initial state on connection
        await websocket.send_json({
            "event": "connected",
            "data": {
                "agent_running": runtime.is_running,
                "agent_paused": runtime.is_paused,
                "cycle_count": runtime.current_state.get("cycle_count", 0),
                "version": __version__,
            },
        })

        # Keep connection alive and handle incoming messages
        while True:
            data = await websocket.receive_json()
            # Handle client commands
            if data.get("action") == "ping":
                await websocket.send_json({"event": "pong"})

    except WebSocketDisconnect:
        # Safe removal — client may already have been removed during broadcast
        try:
            runtime.connected_clients.remove(websocket)
        except ValueError:
            pass
        logger.info(
            f"[WS] Client disconnected | Total: {len(runtime.connected_clients)}"
        )
    except Exception as e:
        # Handle unexpected WebSocket errors gracefully
        try:
            runtime.connected_clients.remove(websocket)
        except ValueError:
            pass
        logger.warning(f"[WS] Client error: {e}")
