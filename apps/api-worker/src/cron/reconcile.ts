export interface ReconcileContext {
  env: {
    ALPACA_KEY: string;
    ALPACA_SECRET: string;
  };
  fetch: typeof fetch;
  timestamp: number;
}

export async function reconcilePaperAccounts(ctx: ReconcileContext) {
  console.log('[cron:reconcile] starting', { timestamp: ctx.timestamp });
  const response = await ctx.fetch('https://paper-api.alpaca.markets/v2/account', {
    headers: {
      'APCA-API-KEY-ID': ctx.env.ALPACA_KEY,
      'APCA-API-SECRET-KEY': ctx.env.ALPACA_SECRET
    }
  });

  if (!response.ok) {
    console.error('[cron:reconcile] failed to fetch account snapshot');
    return null;
  }

  const snapshot = await response.json();
  console.log('[cron:reconcile] snapshot captured');
  return snapshot;
}
