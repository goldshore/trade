export interface StrategyLeg {
  type: 'call' | 'put';
  side: 'long' | 'short';
  strike: number;
  premium: number;
  quantity: number;
}

export interface PositionExposure {
  symbol: string;
  sector?: string;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;
  notional: number;
}

export function maxLoss(strategy: StrategyLeg[]): number {
  return strategy.reduce((acc, leg) => {
    const direction = leg.side === 'long' ? -1 : 1;
    const exposure = direction * leg.premium * leg.quantity * 100;
    return acc + exposure;
  }, 0);
}

export function exposure(positions: PositionExposure[]) {
  return positions.reduce(
    (acc, pos) => {
      acc.delta += pos.delta ?? 0;
      acc.gamma += pos.gamma ?? 0;
      acc.theta += pos.theta ?? 0;
      acc.vega += pos.vega ?? 0;
      acc.rho += pos.rho ?? 0;
      acc.notional += pos.notional;
      acc.bySymbol[pos.symbol] = (acc.bySymbol[pos.symbol] ?? 0) + pos.notional;
      if (pos.sector) {
        acc.bySector[pos.sector] = (acc.bySector[pos.sector] ?? 0) + pos.notional;
      }
      return acc;
    },
    {
      delta: 0,
      gamma: 0,
      theta: 0,
      vega: 0,
      rho: 0,
      notional: 0,
      bySymbol: {} as Record<string, number>,
      bySector: {} as Record<string, number>
    }
  );
}

export interface BreakevenPoint {
  price: number;
  payoff: number;
}

export function breakeven(strategy: StrategyLeg[]): BreakevenPoint[] {
  const strikes = [...new Set(strategy.map((leg) => leg.strike))].sort((a, b) => a - b);
  return strikes.map((price) => ({
    price,
    payoff: strategy.reduce((acc, leg) => acc + payoffForLeg(leg, price), 0)
  }));
}

function payoffForLeg(leg: StrategyLeg, price: number) {
  const intrinsic = leg.type === 'call' ? Math.max(price - leg.strike, 0) : Math.max(leg.strike - price, 0);
  const direction = leg.side === 'long' ? 1 : -1;
  return direction * (intrinsic - leg.premium) * leg.quantity * 100;
}
