interface MemoizedEntry<T> {
  value: Promise<T> | T;
  expiresAt: number;
}

const memoTable = new Map<string, MemoizedEntry<unknown>>();

export async function memoize<T>(key: string, fn: () => Promise<T> | T, ttl = 30_000): Promise<T> {
  const existing = memoTable.get(key) as MemoizedEntry<T> | undefined;
  const now = Date.now();
  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  const value = fn();
  memoTable.set(key, { value, expiresAt: now + ttl });
  return value;
}

type SwrListener<T> = (data: T) => void;

export interface SwrOptions {
  ttl?: number;
  revalidate?: number;
}

const swrCache = new Map<string, { data?: unknown; listeners: Set<SwrListener<unknown>>; timeout?: number }>();

export function swr<T>(key: string, fetcher: () => Promise<T>, options: SwrOptions = {}) {
  const { ttl = 15_000, revalidate = 60_000 } = options;
  const entry = swrCache.get(key) ?? { listeners: new Set<SwrListener<T>>() };
  swrCache.set(key, entry as typeof entry & { data?: T });

  async function load(immediate = false) {
    if (!immediate && entry.data && Date.now() - (entry as any).timestamp < ttl) {
      return entry.data as T;
    }

    const data = await fetcher();
    Object.assign(entry, { data, timestamp: Date.now() });
    entry.listeners.forEach((listener) => listener(data));
    return data;
  }

  if (!entry.timeout) {
    entry.timeout = window.setInterval(() => {
      load(true).catch((error) => console.warn('swr refresh failed', error));
    }, revalidate);
  }

  return {
    get data() {
      return (entry as any).data as T | undefined;
    },
    subscribe(listener: SwrListener<T>) {
      entry.listeners.add(listener as SwrListener<unknown>);
      if ((entry as any).data !== undefined) {
        listener((entry as any).data as T);
      }
      return () => entry.listeners.delete(listener as SwrListener<unknown>);
    },
    refresh() {
      return load(true);
    }
  };
}
