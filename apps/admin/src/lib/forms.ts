let unregisterBeforeUnload: (() => void) | null = null;

export function guardUnsaved(isDirty: () => boolean) {
  if (unregisterBeforeUnload) unregisterBeforeUnload();

  const handler = (event: BeforeUnloadEvent) => {
    if (!isDirty()) return;
    event.preventDefault();
    event.returnValue = '';
  };

  window.addEventListener('beforeunload', handler);
  unregisterBeforeUnload = () => window.removeEventListener('beforeunload', handler);
  return unregisterBeforeUnload;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateOrder(schema: Record<string, (value: unknown) => string | null>, payload: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  for (const [key, validator] of Object.entries(schema)) {
    const message = validator(payload[key]);
    if (message) {
      errors[key] = message;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
