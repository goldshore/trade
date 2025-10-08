"""Logging configuration helpers."""

from typing import Any


def build_structlog_config(service_name: str) -> dict[str, Any]:
    """Return a dictionary used to configure structured logging for ``service_name``."""

    return {
        "service": service_name,
        "level": "INFO",
        "processors": ["add_timestamp", "add_log_level", "format_exc_info"],
    }
