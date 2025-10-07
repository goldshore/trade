"""Route stubs for the notifier service."""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/notifier", tags=["notifier"])


class AlertRequest(BaseModel):
    """Alert payload issued to downstream channels."""

    channel: str
    subject: str
    body: str


@router.get("/health", summary="Service health probe")
def healthcheck() -> dict[str, str]:
    """Return readiness information for queue processors."""

    return {"status": "ok"}


@router.post("/alerts", summary="Dispatch an alert")
def dispatch_alert(request: AlertRequest) -> dict[str, object]:
    """Persist and schedule a new alert notification."""

    return {"id": "alert-001", "status": "queued", "payload": request.model_dump()}


@router.post("/alerts/test", summary="Send a test alert")
def test_alert(request: AlertRequest) -> dict[str, object]:
    """Send a test alert without affecting production pipelines."""

    return {"id": "alert-test", "status": "delivered", "payload": request.model_dump()}
