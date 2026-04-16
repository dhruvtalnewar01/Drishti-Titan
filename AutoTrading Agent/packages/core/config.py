"""
TITAN — Centralized Configuration
Loads all settings from environment variables with validation.
"""

from __future__ import annotations

from enum import Enum
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class TradingMode(str, Enum):
    PAPER = "paper"
    LIVE = "live"


class BrokerType(str, Enum):
    ZERODHA = "zerodha"
    GROWW = "groww"
    SIMULATOR = "simulator"


class RiskProfile(str, Enum):
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"


class AgentAutonomy(str, Enum):
    FULL_AUTO = "full_auto"          # Agent trades independently
    SEMI_AUTO = "semi_auto"          # Agent recommends, user confirms
    ANALYSIS_ONLY = "analysis_only"  # No trading, just signals


class Settings(BaseSettings):
    """Master configuration for TITAN."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Gemini AI ───────────────────────────────────────────
    gemini_api_key: str = Field(description="Google Gemini API key")
    gemini_model: str = Field(default="gemini-3.1-pro")

    # ── Zerodha ─────────────────────────────────────────────
    zerodha_api_key: str = Field(default="")
    zerodha_api_secret: str = Field(default="")
    zerodha_user_id: str = Field(default="")
    zerodha_totp_secret: str = Field(default="")
    zerodha_password: str = Field(default="")

    # ── Groww ───────────────────────────────────────────────
    groww_api_key: str = Field(default="")
    groww_api_secret: str = Field(default="")

    # ── Database ────────────────────────────────────────────
    database_url: str = Field(
        default="postgresql+asyncpg://titan:titan_secure_password_change_me@localhost:5432/titan_db"
    )
    redis_url: str = Field(default="redis://localhost:6379/0")
    chroma_host: str = Field(default="localhost")
    chroma_port: int = Field(default=8000)

    # ── API Server ──────────────────────────────────────────
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8080)
    jwt_secret_key: str = Field(default="change-me-in-production")
    jwt_algorithm: str = Field(default="HS256")
    jwt_access_token_expire_minutes: int = Field(default=1440)

    # ── Trading ─────────────────────────────────────────────
    trading_mode: TradingMode = Field(default=TradingMode.PAPER)
    default_broker: BrokerType = Field(default=BrokerType.SIMULATOR)
    agent_autonomy: AgentAutonomy = Field(default=AgentAutonomy.SEMI_AUTO)
    risk_profile: RiskProfile = Field(default=RiskProfile.MODERATE)

    max_capital_allocation: float = Field(default=100_000.0)
    max_single_position_pct: float = Field(default=5.0)
    max_total_exposure_pct: float = Field(default=40.0)
    max_daily_loss_pct: float = Field(default=2.0)
    max_weekly_loss_pct: float = Field(default=5.0)
    orders_per_second_limit: int = Field(default=8)

    # ── Logging ─────────────────────────────────────────────
    log_level: str = Field(default="INFO")
    log_file: str = Field(default="logs/titan.log")

    # ── Derived Properties ──────────────────────────────────
    @property
    def max_single_position_amount(self) -> float:
        return self.max_capital_allocation * (self.max_single_position_pct / 100)

    @property
    def max_total_exposure_amount(self) -> float:
        return self.max_capital_allocation * (self.max_total_exposure_pct / 100)

    @property
    def max_daily_loss_amount(self) -> float:
        return self.max_capital_allocation * (self.max_daily_loss_pct / 100)

    @property
    def max_weekly_loss_amount(self) -> float:
        return self.max_capital_allocation * (self.max_weekly_loss_pct / 100)


@lru_cache
def get_settings() -> Settings:
    """Singleton settings instance."""
    return Settings()
