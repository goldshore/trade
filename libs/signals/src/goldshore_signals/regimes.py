"""Placeholder signal regime detection helpers."""

from __future__ import annotations

from collections.abc import Sequence

import pandas as pd


def detect_regime(price_series: Sequence[float]) -> str:
    """Return a placeholder label describing the detected market regime.

    The production implementation will blend volatility clustering with
    macro-fundamental overlays. During scaffolding we simply return
    ``"unknown"`` to unblock downstream orchestration.
    """

    _ = price_series
    return "unknown"


def classify_volatility(price_series: Sequence[float]) -> str:
    """Return ``"low"``, ``"medium"``, or ``"high"`` once statistics are wired."""

    _ = price_series
    return "medium"


def score_liquidity(order_book: pd.DataFrame) -> float:
    """Return a floating score describing order-book depth and spread stability."""

    _ = order_book
    return 0.0
