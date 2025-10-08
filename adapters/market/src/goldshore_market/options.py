"""Simulated options market data provider."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date


@dataclass
class SimulatedOptionsClient:
    """In-memory market data client for option chains."""

    def get_chain(
        self,
        symbol: str,
        *,
        expiry: date | None = None,
    ) -> list[dict[str, object]]:
        """Return a placeholder option chain for ``symbol`` and optional ``expiry``."""

        _ = (symbol, expiry)
        return []

    def get_quote(self, symbol: str) -> dict[str, float]:
        """Return a placeholder NBBO snapshot for ``symbol``."""

        _ = symbol
        return {"bid": 0.0, "ask": 0.0, "last": 0.0}

    def get_greeks(
        self,
        symbol: str,
        *,
        strike: float,
        expiry: date,
    ) -> dict[str, float]:
        """Return placeholder greek sensitivities for the specified contract."""

        _ = (symbol, strike, expiry)
        return {"delta": 0.0, "gamma": 0.0, "theta": 0.0, "vega": 0.0, "rho": 0.0}
