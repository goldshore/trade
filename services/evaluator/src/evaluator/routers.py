"""Route stubs for the evaluator service."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/evaluator", tags=["evaluator"])


class EvaluationRequest(BaseModel):
    """Payload describing an execution to evaluate."""

    plan_id: str
    fills: list[dict[str, object]]


class EvaluationResponse(BaseModel):
    """Response summarising evaluation metrics."""

    id: str
    plan_id: str
    status: str
    metrics: dict[str, float]


@router.get("/health", summary="Service health probe")
def healthcheck() -> dict[str, str]:
    """Return readiness information for observers."""

    return {"status": "ok"}


@router.post(
    "/evaluations",
    response_model=EvaluationResponse,
    summary="Evaluate an execution",
)
def evaluate(request: EvaluationRequest) -> EvaluationResponse:
    """Generate a placeholder evaluation report for ``plan_id``."""

    return EvaluationResponse(
        id="eval-001",
        plan_id=request.plan_id,
        status="completed",
        metrics={"pnl": 0.0, "delta": 0.0},
    )


@router.get(
    "/evaluations/{evaluation_id}",
    response_model=EvaluationResponse,
    summary="Fetch an evaluation",
)
def get_evaluation(evaluation_id: str) -> EvaluationResponse:
    """Return a placeholder evaluation record or raise when not found."""

    if evaluation_id != "eval-001":
        raise HTTPException(status_code=404, detail="Evaluation not found")
    return EvaluationResponse(
        id=evaluation_id,
        plan_id="plan-000",
        status="completed",
        metrics={"pnl": 0.0, "delta": 0.0},
    )
