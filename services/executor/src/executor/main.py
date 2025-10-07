"""Application factory for the executor service."""

from __future__ import annotations

from fastapi import FastAPI

from .routers import router


def create_app() -> FastAPI:
    """Return a FastAPI application with executor routes registered."""

    app = FastAPI(title="Gold Shore Executor", version="0.1.0")
    app.include_router(router)
    return app


app = create_app()
