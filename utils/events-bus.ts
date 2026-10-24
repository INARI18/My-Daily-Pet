// Tiny pub/sub so data services can announce changes (e.g. to resync reminders)
// without importing the modules that react to them.
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeEventsChanged(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitEventsChanged(): void {
  listeners.forEach((l) => l());
}
