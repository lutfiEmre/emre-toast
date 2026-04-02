"use client";

import { useSyncExternalStore } from "react";
import { getToasts, subscribe } from "./state";
import { emreToast } from "./api";
import type { ToastState } from "./types";

export function useEmreToast() {
  const toasts = useSyncExternalStore(subscribe, getToasts, getToasts);

  return {
    toasts,
    dismiss: emreToast.dismiss,
    update: emreToast.update,
    getToasts: emreToast.getToasts,
  };
}
