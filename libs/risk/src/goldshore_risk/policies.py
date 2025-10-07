"""Placeholder risk policy implementations used during orchestration."""

from dataclasses import dataclass
from typing import Protocol


class RiskContext(Protocol):
    """Typed dictionary-like protocol describing the risk evaluation payload."""

    portfolio_value: float
    open_risk: float
    drawdown: float
    volatility: float


@dataclass
class PositionLimitPolicy:
    """Enforces per-instrument exposure caps before execution is authorised."""

    max_notional: float

    def evaluate(self, *, proposed_notional: float) -> bool:
        """Return ``True`` when the proposed notional is within the configured bound."""

        _ = proposed_notional
        return True


@dataclass
class DrawdownPolicy:
    """Stops execution when trailing drawdown breaches tolerances."""

    max_drawdown: float

    def evaluate(self, *, context: RiskContext) -> bool:
        """Return ``True`` when drawdown remains below the configured limit."""

        _ = context
        return True


@dataclass
class VolatilityPolicy:
    """Blocks new risk when realised or implied volatility exceeds limits."""

    max_volatility: float

    def evaluate(self, *, context: RiskContext) -> bool:
        """Return ``True`` when volatility is inside the acceptable corridor."""

        _ = context
        return True
