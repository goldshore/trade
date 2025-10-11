const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const fmt = {
  money(value: number | null | undefined) {
    if (value == null || Number.isNaN(value)) return '—';
    return currencyFormatter.format(value);
  },
  pct(value: number | null | undefined) {
    if (value == null || Number.isNaN(value)) return '—';
    return percentFormatter.format(value);
  },
  greeks(greeks: Partial<Record<'delta' | 'gamma' | 'theta' | 'vega' | 'rho', number>>) {
    return {
      delta: normalize(greeks.delta),
      gamma: normalize(greeks.gamma),
      theta: normalize(greeks.theta),
      vega: normalize(greeks.vega),
      rho: normalize(greeks.rho)
    };
  }
};

export function colorizeDelta(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return 'var(--gs-color-border-inner)';
  if (value > 0) return 'var(--gs-color-success)';
  if (value < 0) return 'var(--gs-color-critical)';
  return 'var(--gs-color-warning)';
}

function normalize(value: number | undefined) {
  if (value == null || Number.isNaN(value)) return 0;
  return Number(value.toFixed(4));
}
