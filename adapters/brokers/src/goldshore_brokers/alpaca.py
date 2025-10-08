"""Simplified Alpaca paper-trading client."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class AlpacaPaperEquitiesClient:
    """Minimal REST wrapper for Alpaca paper-trading equities endpoint."""

    api_key: str
    api_secret: str
    base_url: str = "https://paper-api.alpaca.markets"

    def submit_order(self, payload: dict[str, object]) -> dict[str, object]:
        """Submit an order payload and return a placeholder broker response."""

        _ = payload
        return {"status": "accepted", "id": "paper-order"}

    def cancel_order(self, order_id: str) -> bool:
        """Cancel the provided order identifier and return ``True`` when accepted."""

        _ = order_id
        return True

    def get_order_status(self, order_id: str) -> dict[str, object]:
        """Return a placeholder order status document."""

        _ = order_id
        return {"status": "filled", "filled_qty": 0}

    def get_account(self) -> dict[str, object]:
        """Return a snapshot of the simulated account state."""

        return {"status": "ACTIVE", "equity": 0.0}

    def configure_ratelimit(
        self,
        *,
        burst: int | None = None,
        sustained: int | None = None,
    ) -> None:
        """Placeholder ratelimit configuration hook for future instrumentation."""

        _ = (burst, sustained)
