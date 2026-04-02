import { getToasts, setToasts } from "./state";
import type { ToastOptions, ToastType, PromiseToastOptions, StreamToastOptions, UndoToastOptions } from "./types";

function generateId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function addToast(
  type: ToastType,
  title: string,
  options: ToastOptions = {}
): string {
  const id = String(options.id ?? generateId());
  const duration = options.duration ?? 5000;

  const toast: import("./types").ToastState = {
    id,
    type,
    title,
    description: options.description,
    action: options.action,
    icon: options.icon,
    avatar: options.avatar,
    createdAt: Date.now(),
    duration,
    progress: options.progress,
    groupKey: options.groupKey,
    options,
    status: "visible",
  };

  setToasts((prev) => {
    if (options.groupKey) {
      const existing = prev.find((t) => t.groupKey === options.groupKey && t.status === "visible");
      if (existing) {
        return prev.map((t) =>
          t.groupKey === options.groupKey
            ? { ...t, groupCount: (t.groupCount ?? 1) + 1 }
            : t
        ) as import("./types").ToastState[];
      }
    }
    return [...prev.filter((t) => t.id !== id), toast].slice(-50);
  });

  return id;
}

function dismiss(id: string): void {
  setToasts((prev) =>
    prev.map((t) => (t.id === id ? { ...t, status: "dismissing" as const } : t))
  );
  setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, 420);
}

function update(
  id: string,
  updates: Partial<ToastOptions & { title: string; type: ToastType }>
): void {
  const { id: _omit, ...safeUpdates } = updates as Record<string, unknown> & {
    title?: string;
    type?: ToastType;
  };
  setToasts((prev) =>
    prev.map((t) =>
      t.id === id
        ? ({ ...t, ...safeUpdates, options: { ...t.options, ...updates } } as import("./types").ToastState)
        : t
    )
  );
}

export const emreToast = Object.assign(
  (title: string, options?: ToastOptions) => addToast("default", title, options),
  {
    success: (title: string, options?: ToastOptions) => addToast("success", title, options),
    error: (title: string, options?: ToastOptions) => addToast("error", title, options),
    warning: (title: string, options?: ToastOptions) => addToast("warning", title, options),
    info: (title: string, options?: ToastOptions) => addToast("info", title, options),
    loading: (title: string, options?: ToastOptions) => addToast("loading", title, options),
    promise: <T>(
      promise: Promise<T>,
      opts: PromiseToastOptions
    ): Promise<T> => {
      const id = addToast("loading", opts.loading, {
        description: opts.description?.loading,
      });
      return promise
        .then((data) => {
          const title = typeof opts.success === "function" ? opts.success(data) : opts.success;
          update(id, {
            type: "success",
            title,
            description: opts.description?.success,
            action: opts.action?.success,
          });
          return data;
        })
        .catch((err) => {
          const title = typeof opts.error === "function" ? opts.error(err) : opts.error;
          update(id, {
            type: "error",
            title,
            description: opts.description?.error,
            action: opts.action?.error,
          });
          throw err;
        });
    },
    progress: (title: string, options: ToastOptions & { progress?: number } = {}): string => {
      return addToast("loading", title, { ...options, progress: options.progress ?? 0 });
    },
    stream: (title: string, options: StreamToastOptions = {}): string => {
      const id = addToast("loading", title, {
        description: options.description,
        duration: options.duration ?? 10000,
      });
      options.onStream?.((text) => update(id, { title: text }));
      return id;
    },
    undo: (title: string, options: UndoToastOptions): string => {
      const countdown = options.countdown ?? 5000;
      const id = addToast("default", title, {
        duration: countdown,
        action: {
          label: "Undo",
          onClick: options.onUndo,
        },
      });
      setToasts((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, undoCountdown: countdown, onUndo: options.onUndo } : t
        )
      );
      return id;
    },
    dismiss,
    update,
    getToasts,
  }
);
