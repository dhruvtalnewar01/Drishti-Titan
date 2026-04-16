"""
TITAN — Main Entry Point
Starts the FastAPI server with the complete trading agent system.

Usage:
    python main.py                    # Start with default settings
    python main.py --mode paper       # Start in paper trading mode
    python main.py --mode live        # Start in live trading mode
"""

from __future__ import annotations

import argparse
import sys

import uvicorn
from loguru import logger

from packages.core.config import get_settings

__version__ = "1.0.0"


def setup_logging():
    """Configure loguru for production logging."""
    settings = get_settings()

    # Remove default handler
    logger.remove()

    # Console output
    logger.add(
        sys.stderr,
        level=settings.log_level,
        format=(
            "<green>{time:HH:mm:ss}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan> | "
            "<level>{message}</level>"
        ),
        colorize=True,
    )

    # File output
    logger.add(
        settings.log_file,
        level="DEBUG",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}",
        rotation="10 MB",
        retention="30 days",
        compression="zip",
        enqueue=True,  # Thread-safe
    )


def main():
    """Start the TITAN trading agent."""
    parser = argparse.ArgumentParser(description="TITAN AI Trading Agent")
    parser.add_argument(
        "--mode", choices=["paper", "live"], default="paper",
        help="Trading mode (default: paper)"
    )
    parser.add_argument(
        "--host", default=None, help="Server host (default: from .env)"
    )
    parser.add_argument(
        "--port", type=int, default=None, help="Server port (default: from .env)"
    )
    args = parser.parse_args()

    setup_logging()

    settings = get_settings()
    host = args.host or settings.api_host
    port = args.port or settings.api_port

    logger.info("══════════════════════════════════════════════════")
    logger.info("       ████████╗██╗████████╗ █████╗ ███╗   ██╗")
    logger.info("       ╚══██╔══╝██║╚══██╔══╝██╔══██╗████╗  ██║")
    logger.info("          ██║   ██║   ██║   ███████║██╔██╗ ██║")
    logger.info("          ██║   ██║   ██║   ██╔══██║██║╚██╗██║")
    logger.info("          ██║   ██║   ██║   ██║  ██║██║ ╚████║")
    logger.info("          ╚═╝   ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝")
    logger.info(f"       God-Level AI Auto-Trading Agent v{__version__}")
    logger.info("══════════════════════════════════════════════════")
    logger.info(f"  Mode:     {args.mode.upper()}")
    logger.info(f"  Broker:   {settings.default_broker.value}")
    logger.info(f"  Capital:  ₹{settings.max_capital_allocation:,.0f}")
    logger.info(f"  Autonomy: {settings.agent_autonomy.value}")
    logger.info(f"  Server:   http://{host}:{port}")
    logger.info("══════════════════════════════════════════════════")

    uvicorn.run(
        "packages.api.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info",
    )


if __name__ == "__main__":
    main()
