const ACCESS_TOKEN_KEY = 'gs.access.token';
const ACCESS_SCOPES_KEY = 'gs.access.scopes';

export type AccessScope =
  | 'console'
  | 'playbooks'
  | 'signal:studio'
  | 'risk'
  | 'automation'
  | 'compliance';

export interface AccessPayload {
  token: string;
  scopes: AccessScope[];
  expiresAt: number;
}

export function requireAccess(): AccessPayload | null {
  const raw = sessionStorage.getItem(ACCESS_TOKEN_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AccessPayload;
    if (Date.now() > parsed.expiresAt) {
      clearAccess();
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('Invalid access payload in storage', error);
    clearAccess();
    return null;
  }
}

export function hasScope(scope: AccessScope): boolean {
  const raw = sessionStorage.getItem(ACCESS_SCOPES_KEY);
  if (!raw) return false;

  try {
    const scopes = JSON.parse(raw) as AccessScope[];
    return scopes.includes(scope);
  } catch (error) {
    console.warn('Invalid scope data in storage', error);
    sessionStorage.removeItem(ACCESS_SCOPES_KEY);
    return false;
  }
}

export function storeAccess(payload: AccessPayload) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, JSON.stringify(payload));
  sessionStorage.setItem(ACCESS_SCOPES_KEY, JSON.stringify(payload.scopes));
}

export function clearAccess() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_SCOPES_KEY);
}
