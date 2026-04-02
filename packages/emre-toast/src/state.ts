import type { ToastState } from "./types";

type Listener = (toasts: ToastState[]) => void;

let toasts: ToastState[] = [];
const listeners = new Set<Listener>();

export function getToasts(): ToastState[] {
  return [...toasts];
}

export function setToasts(updater: (prev: ToastState[]) => ToastState[]): void {
  toasts = updater(toasts);
  listeners.forEach((fn) => fn(toasts));
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
