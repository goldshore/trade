const API_BASE_URL = "https://api.goldshore.org";
const DEFAULT_TIMEOUT = 15000;
const DEFAULT_RETRIES = 2;

export interface ApiFetchOptions extends RequestInit {
  /** Number of retries for recoverable statuses such as 429/5xx. */
  retries?: number;
  /** Milliseconds before the request is aborted. */
  timeout?: number;
  /** Optional access token override. */
  accessToken?: string;
}

export async function withTimeout<T>(promise: Promise<T>, ms = DEFAULT_TIMEOUT): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  try {
    const result = await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        controller.signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError')));
      })
    ]);

    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<Response> {
  const {
    retries = DEFAULT_RETRIES,
    timeout = DEFAULT_TIMEOUT,
    accessToken,
    headers,
    ...init
  } = options;

  const requestHeaders = new Headers(headers);
  if (accessToken) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers: requestHeaders, signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
        throw new RecoverableFetchError(`Server responded with ${response.status}`, response.status);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (!(error instanceof RecoverableFetchError || isAbortError(error)) || attempt === retries) {
        throw error;
      }

      const backoff = Math.min(2000 * (attempt + 1), 6000);
      await delay(backoff);
      attempt += 1;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Unknown fetch error');
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

class RecoverableFetchError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'RecoverableFetchError';
  }
}
