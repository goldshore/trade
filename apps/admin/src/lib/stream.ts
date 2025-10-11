type MessageHandler = (event: MessageEvent) => void;
type ErrorHandler = (event: Event) => void;

type EventBusHandler<T> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<EventBusHandler<any>>>();

  emit<T>(channel: string, payload: T) {
    const handlers = this.listeners.get(channel);
    handlers?.forEach((handler) => handler(payload));
  }

  on<T>(channel: string, handler: EventBusHandler<T>) {
    const handlers = this.listeners.get(channel) ?? new Set<EventBusHandler<T>>();
    handlers.add(handler as EventBusHandler<any>);
    this.listeners.set(channel, handlers as Set<EventBusHandler<any>>);
    return () => this.off(channel, handler);
  }

  off<T>(channel: string, handler: EventBusHandler<T>) {
    const handlers = this.listeners.get(channel);
    handlers?.delete(handler as EventBusHandler<any>);
  }
}

export const eventBus = new EventBus();

export function sse(url: string, onMessage: MessageHandler, onError?: ErrorHandler) {
  const source = new EventSource(url, { withCredentials: true });
  source.addEventListener('message', onMessage);
  if (onError) {
    source.addEventListener('error', onError);
  }

  return () => {
    source.removeEventListener('message', onMessage);
    if (onError) {
      source.removeEventListener('error', onError);
    }
    source.close();
  };
}
