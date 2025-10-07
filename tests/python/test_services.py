"""Smoke tests for the FastAPI service factories."""

from fastapi.testclient import TestClient

from planner.main import create_app as create_planner_app
from executor.main import create_app as create_executor_app
from marketdata.main import create_app as create_marketdata_app
from notifier.main import create_app as create_notifier_app
from evaluator.main import create_app as create_evaluator_app


def test_planner_health() -> None:
    client = TestClient(create_planner_app())
    response = client.get("/planner/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_executor_health() -> None:
    client = TestClient(create_executor_app())
    response = client.get("/executor/health")
    assert response.status_code == 200


def test_marketdata_health() -> None:
    client = TestClient(create_marketdata_app())
    response = client.get("/marketdata/health")
    assert response.status_code == 200


def test_notifier_health() -> None:
    client = TestClient(create_notifier_app())
    response = client.get("/notifier/health")
    assert response.status_code == 200


def test_evaluator_health() -> None:
    client = TestClient(create_evaluator_app())
    response = client.get("/evaluator/health")
    assert response.status_code == 200
