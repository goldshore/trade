"""Route stubs for the market data service."""

from __future__ import annotations

from datetime import date

from fastapi import APIRouter

OptionsChain = list[dict[str, object]]

router = APIRouter(prefix="/marketdata", tags=["marketdata"])


@router.get("/health", summary="Service health probe")
def healthcheck() -> dict[str, str]:
    """Return readiness information for monitoring."""

    return {"status": "ok"}


@router.get("/quotes/{symbol}", summary="Fetch the latest quote")
def get_quote(symbol: str) -> dict[str, float]:
    """Return a placeholder quote snapshot for ``symbol``."""

    return {"symbol": symbol, "bid": 0.0, "ask": 0.0, "last": 0.0}


@router.get("/options/{symbol}", summary="Fetch option chain")
def get_option_chain(symbol: str, expiry: date | None = None) -> OptionsChain:
    """Return a placeholder option chain for ``symbol`` and optional ``expiry``."""

    _ = expiry
    return [
        {"symbol": symbol, "strike": 0.0, "type": "call"}
    ]


@router.get("/greeks/{symbol}", summary="Fetch placeholder greek sensitivities")
def get_greeks(symbol: str, strike: float, expiry: date) -> dict[str, float]:
    """Return placeholder greeks for the specified contract."""

    _ = (strike, expiry)
    return {
        "symbol": symbol,
        "delta": 0.0,
        "gamma": 0.0,
        "theta": 0.0,
        "vega": 0.0,
        "rho": 0.0,
    }
