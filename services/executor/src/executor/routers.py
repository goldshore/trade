"""Route stubs for the executor service."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/executor", tags=["executor"])


class OrderRequest(BaseModel):
    """Minimal payload describing an order to execute."""

    symbol: str
    side: str
    quantity: float


class CancelRequest(BaseModel):
    """Payload identifying the order cancellation target."""

    order_id: str


@router.get("/health", summary="Service health probe")
def healthcheck() -> dict[str, str]:
    """Return readiness information for orchestration layers."""

    return {"status": "ok"}


@router.post("/orders/submit", summary="Submit an order for execution")
def submit_order(request: OrderRequest) -> dict[str, object]:
    """Forward an order to the configured broker adapter."""

    return {
        "order_id": "exec-001",
        "status": "accepted",
        "payload": request.model_dump(),
    }


@router.post("/orders/cancel", summary="Cancel a previously submitted order")
def cancel_order(request: CancelRequest) -> dict[str, object]:
    """Attempt to cancel an existing order."""

    if request.order_id != "exec-001":
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order_id": request.order_id, "status": "cancelled"}


@router.get("/orders/{order_id}", summary="Fetch order status")
def get_order_status(order_id: str) -> dict[str, object]:
    """Return a placeholder status record."""

    if order_id != "exec-001":
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order_id": order_id, "status": "filled", "filled_quantity": 0.0}
