"""Placeholder Black-Scholes pricers and greeks used by the trading stack."""

from typing import Literal

OptionType = Literal["call", "put"]


def black_scholes_price(
    *,
    option_type: OptionType,
    spot: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    rate: float,
) -> float:
    """Return the theoretical Black-Scholes price for the provided option contract.

    The implementation will eventually plug in a numerically stable closed-form
    solution with dividend support. For now the function returns ``0.0`` so the
    surrounding services can be wired together without pricing logic.
    """

    _ = (option_type, spot, strike, time_to_expiry, volatility, rate)
    return 0.0


def option_delta(
    *,
    option_type: OptionType,
    spot: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    rate: float,
) -> float:
    """Return the first derivative of price with respect to the underlying.

    Delta will be positive for calls and negative for puts; once implemented it
    should incorporate discounting and carry costs. The placeholder simply
    returns ``0.0`` for wiring tests.
    """

    _ = (option_type, spot, strike, time_to_expiry, volatility, rate)
    return 0.0


def option_gamma(
    *,
    spot: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    rate: float,
) -> float:
    """Return the second derivative of price with respect to the underlying."""

    _ = (spot, strike, time_to_expiry, volatility, rate)
    return 0.0


def option_theta(
    *,
    option_type: OptionType,
    spot: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    rate: float,
) -> float:
    """Return the time decay of the option's value under Black-Scholes."""

    _ = (option_type, spot, strike, time_to_expiry, volatility, rate)
    return 0.0


def option_vega(
    *,
    spot: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    rate: float,
) -> float:
    """Return the sensitivity of price to volatility changes."""

    _ = (spot, strike, time_to_expiry, volatility, rate)
    return 0.0


def option_rho(
    *,
    option_type: OptionType,
    spot: float,
    strike: float,
    time_to_expiry: float,
    volatility: float,
    rate: float,
) -> float:
    """Return the sensitivity of price to interest-rate shifts."""

    _ = (option_type, spot, strike, time_to_expiry, volatility, rate)
    return 0.0


def implied_volatility(
    *,
    option_type: OptionType,
    spot: float,
    strike: float,
    time_to_expiry: float,
    rate: float,
    target_price: float,
    initial_guess: float = 0.2,
) -> float:
    """Return a placeholder implied volatility using root finding in production.

    The final implementation will execute a Newton-Raphson search bounded to
    realistic volatility ranges. For now we echo the ``initial_guess`` to unblock
    callers wiring together data flows.
    """

    _ = (option_type, spot, strike, time_to_expiry, rate, target_price)
    return float(initial_guess)
