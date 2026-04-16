"""
TITAN — LangGraph Trading Graph
The master orchestration graph that connects all 8 agents into a
coherent, stateful trading pipeline.

Graph Flow:
  START → Scanner → [Technical | Fundamental | Sentiment] (parallel)
        → [Bull | Bear] (parallel) → Judge → Risk Manager
        → Conditional: Execute or Skip → Loop
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from langgraph.graph import END, StateGraph
from loguru import logger

from packages.core.agents.debate_agents import bear_advocate_node, bull_advocate_node
from packages.core.agents.decision_judge import decision_judge_node
from packages.core.agents.fundamental_analyst import fundamental_analyst_node
from packages.core.agents.market_scanner import market_scanner_node
from packages.core.agents.risk_manager import risk_manager_node
from packages.core.agents.sentiment_analyst import sentiment_analyst_node
from packages.core.agents.technical_analyst import technical_analyst_node
from packages.core.execution.engine import execution_node
from packages.core.orchestrator.state import TitanState


def should_execute_or_end(state: TitanState) -> str:
    """Conditional edge: route to execution or skip."""
    if state.get("circuit_breaker_level", 0) >= 2:
        logger.warning("[GRAPH] Circuit breaker active — halting")
        return "end"

    if state.get("should_execute", False):
        return "execute"

    return "end"


def should_continue_loop(state: TitanState) -> str:
    """Conditional edge: continue scanning or stop."""
    if state.get("agent_paused", False):
        logger.info("[GRAPH] Agent paused by user")
        return "end"

    if state.get("circuit_breaker_level", 0) >= 2:
        logger.warning("[GRAPH] Circuit breaker — stopping loop")
        return "end"

    if not state.get("should_continue", True):
        return "end"

    return "scan"


def build_trading_graph() -> StateGraph:  # Returns uncompiled graph
    """
    Build the complete TITAN trading graph.

    Architecture:
    ┌─────────────────────────────────────────────────┐
    │  SCAN → ANALYZE (parallel) → DEBATE (parallel)  │
    │  → JUDGE → RISK → EXECUTE/SKIP → LOOP          │
    └─────────────────────────────────────────────────┘
    """
    graph = StateGraph(TitanState)

    # ── Add all nodes ────────────────────────────────────────
    graph.add_node("scanner", market_scanner_node)
    graph.add_node("technical", technical_analyst_node)
    graph.add_node("fundamental", fundamental_analyst_node)
    graph.add_node("sentiment", sentiment_analyst_node)
    graph.add_node("bull", bull_advocate_node)
    graph.add_node("bear", bear_advocate_node)
    graph.add_node("judge", decision_judge_node)
    graph.add_node("risk_manager", risk_manager_node)
    graph.add_node("execute", execution_node)

    # ── Define edges ─────────────────────────────────────────

    # Step 1: Start with market scan
    graph.set_entry_point("scanner")

    # Step 2: Scanner → Parallel analysis (technical + fundamental + sentiment)
    graph.add_edge("scanner", "technical")
    graph.add_edge("scanner", "fundamental")
    graph.add_edge("scanner", "sentiment")

    # Step 3: All analysts → Parallel debate (bull + bear)
    graph.add_edge("technical", "bull")
    graph.add_edge("technical", "bear")
    graph.add_edge("fundamental", "bull")
    graph.add_edge("fundamental", "bear")
    graph.add_edge("sentiment", "bull")
    graph.add_edge("sentiment", "bear")

    # Step 4: Both debaters → Decision Judge
    graph.add_edge("bull", "judge")
    graph.add_edge("bear", "judge")

    # Step 5: Judge → Risk Manager
    graph.add_edge("judge", "risk_manager")

    # Step 6: Risk Manager → Conditional: Execute or End
    graph.add_conditional_edges(
        "risk_manager",
        should_execute_or_end,
        {
            "execute": "execute",
            "end": END,
        },
    )

    # Step 7: After execution → End (next cycle starts fresh)
    graph.add_edge("execute", END)

    logger.info("[GRAPH] ✓ Trading graph built successfully")

    return graph


def compile_trading_graph():
    """Compile the graph for execution."""
    graph = build_trading_graph()
    compiled = graph.compile()
    logger.info("[GRAPH] ✓ Trading graph compiled and ready")
    return compiled


async def run_single_cycle(compiled_graph, initial_state: TitanState | None = None) -> TitanState:
    """
    Run a single analysis → decision → execution cycle.

    Returns the final state after the cycle completes.
    """
    from packages.core.orchestrator.state import create_initial_state

    state = initial_state or create_initial_state()
    state["cycle_id"] = uuid.uuid4().hex[:8]
    state["cycle_count"] = state.get("cycle_count", 0) + 1
    state["cycle_timestamp"] = datetime.now(tz=timezone.utc).isoformat()

    logger.info(
        f"[GRAPH] ═══ Starting Cycle #{state['cycle_count']} "
        f"(ID: {state['cycle_id']}) ═══"
    )

    # Run the graph
    result = await compiled_graph.ainvoke(state)

    logger.info(
        f"[GRAPH] ═══ Cycle #{state['cycle_count']} Complete ═══\n"
        f"  Symbol: {result.get('selected_symbol', 'None')}\n"
        f"  Decision: {result.get('judge_decision', {}).get('action', 'N/A')}\n"
        f"  Executed: {result.get('should_execute', False)}\n"
        f"  Circuit Breaker: Level {result.get('circuit_breaker_level', 0)}"
    )

    return result
