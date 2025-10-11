interface KvLike {
  get(key: string, type: 'json'): Promise<{ count: number; expiry: number } | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface RateLimitOptions {
  ip: string;
  route: string;
  limit: number;
  period: number;
  storage: KvLike | Map<string, string>;
}

export async function rateLimit({ ip, route, limit, period, storage }: RateLimitOptions): Promise<boolean> {
  const key = `ratelimit:${route}:${ip}`;
  const now = Date.now();
  const expiry = now + period;

  if (!('size' in storage)) {
    const kv = storage as KvLike;
    const existing = await kv.get(key, 'json');
    if (existing && existing.expiry > now) {
      if (existing.count >= limit) return false;
      await kv.put(key, JSON.stringify({ count: existing.count + 1, expiry }), { expirationTtl: period / 1000 });
      return true;
    }
    await kv.put(key, JSON.stringify({ count: 1, expiry }), { expirationTtl: period / 1000 });
    return true;
  }

  const memory = storage as Map<string, string>;
  const raw = memory.get(key);
  if (raw) {
    const parsed = JSON.parse(raw) as { count: number; expiry: number };
    if (parsed.expiry > now && parsed.count >= limit) {
      return false;
    }
    memory.set(key, JSON.stringify({ count: parsed.expiry > now ? parsed.count + 1 : 1, expiry }));
    return true;
  }

  memory.set(key, JSON.stringify({ count: 1, expiry }));
  return true;
}

export async function signWebhook(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return bufferToHex(signature);
}

export async function verifySignature(secret: string, payload: string, signature: string): Promise<boolean> {
  const expected = await signWebhook(secret, payload);
  return timingSafeEqual(expected, signature);
}

export function redact<T extends Record<string, unknown>>(payload: T, keys: string[] = ['apiKey', 'secret', 'token']): T {
  const clone = structuredClone(payload);
  const writable = clone as Record<string, unknown>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(writable, key)) {
      writable[key] = '██ redacted ██';
    }
  }
  return clone;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function bufferToHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
