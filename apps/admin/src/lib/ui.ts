interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

type HotkeyHandler = (event: KeyboardEvent) => void;

const toastHostId = 'gs-toast-host';

export function toast(type: ToastOptions['type'], message: string, options: ToastOptions = {}) {
  const host = ensureToastHost();
  const node = document.createElement('div');
  node.className = `gs-toast gs-toast--${type ?? 'info'}`;
  node.textContent = message;
  host.appendChild(node);

  window.setTimeout(() => {
    node.classList.add('gs-toast--exit');
    node.addEventListener('transitionend', () => node.remove(), { once: true });
  }, options.duration ?? 4000);
}

function ensureToastHost() {
  let host = document.getElementById(toastHostId);
  if (!host) {
    host = document.createElement('div');
    host.id = toastHostId;
    host.style.position = 'fixed';
    host.style.bottom = 'var(--gs-space-4)';
    host.style.right = 'var(--gs-space-4)';
    host.style.display = 'grid';
    host.style.gap = 'var(--gs-space-2)';
    host.style.zIndex = '9999';
    document.body.appendChild(host);
  }
  return host;
}

export function modal(prompt: string, actions: { label: string; intent?: 'primary' | 'danger'; onSelect: () => void }[]) {
  const overlay = document.createElement('div');
  overlay.className = 'gs-modal-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'gs-modal';

  const title = document.createElement('h2');
  title.textContent = prompt;
  dialog.appendChild(title);

  const actionRow = document.createElement('div');
  actionRow.className = 'gs-modal__actions';
  actions.forEach((action) => {
    const button = document.createElement('button');
    button.textContent = action.label;
    button.className = `gs-button gs-button--${action.intent ?? 'ghost'}`;
    button.addEventListener('click', () => {
      action.onSelect();
      document.body.removeChild(overlay);
    });
    actionRow.appendChild(button);
  });

  dialog.appendChild(actionRow);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  return () => document.body.removeChild(overlay);
}

export function hotkeys(map: Record<string, HotkeyHandler>) {
  const handler = (event: KeyboardEvent) => {
    const combo = formatHotkey(event);
    const action = map[combo];
    if (action) {
      event.preventDefault();
      action(event);
    }
  };

  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

function formatHotkey(event: KeyboardEvent) {
  const parts = [] as string[];
  if (event.metaKey) parts.push('meta');
  if (event.ctrlKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  parts.push(event.key.toLowerCase());
  return parts.join('+');
}
