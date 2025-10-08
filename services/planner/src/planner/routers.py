"""Route stubs for the planner service."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/planner", tags=["planner"])


class PlanRequest(BaseModel):
    """Payload describing a proposed strategy plan."""

    name: str
    rationale: str
    target_symbol: str
    notional: float


class PlanResponse(BaseModel):
    """Response returned after creating or fetching a plan."""

    id: str
    status: str
    details: dict[str, object]


@router.get("/health", summary="Service health probe")
def healthcheck() -> dict[str, str]:
    """Return readiness information for load balancers."""

    return {"status": "ok"}


@router.post("/plans", response_model=PlanResponse, summary="Submit a new trading plan")
def submit_plan(request: PlanRequest) -> PlanResponse:
    """Accept a plan submission and return a placeholder record."""

    return PlanResponse(id="plan-000", status="pending", details=request.model_dump())


@router.get("/plans", response_model=list[PlanResponse], summary="List existing plans")
def list_plans() -> list[PlanResponse]:
    """Return a list of staged plans awaiting approval."""

    return [
        PlanResponse(id="plan-000", status="pending", details={"name": "Stub strategy"})
    ]


@router.get(
    "/plans/{plan_id}",
    response_model=PlanResponse,
    summary="Fetch a specific plan",
)
def get_plan(plan_id: str) -> PlanResponse:
    """Return a placeholder plan or raise when it cannot be found."""

    if plan_id != "plan-000":
        raise HTTPException(status_code=404, detail="Plan not found")
    return PlanResponse(
        id=plan_id,
        status="pending",
        details={"name": "Stub strategy"},
    )


@router.post(
    "/plans/{plan_id}/approve",
    response_model=PlanResponse,
    summary="Approve a plan for execution",
)
def approve_plan(plan_id: str) -> PlanResponse:
    """Transition a plan into the approved state and emit the placeholder status."""

    if plan_id != "plan-000":
        raise HTTPException(status_code=404, detail="Plan not found")
    return PlanResponse(
        id=plan_id,
        status="approved",
        details={"approved_by": "system"},
    )
