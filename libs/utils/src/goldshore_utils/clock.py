"""Time helpers for coordinating scheduler interactions."""

from datetime import datetime, timezone


def utc_now() -> datetime:
    """Return the current UTC timestamp with timezone information."""

    return datetime.now(timezone.utc)
