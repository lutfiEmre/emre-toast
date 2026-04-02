"use client";

import React, { createContext, useContext, useState } from "react";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

const ToastPositionContext = createContext<{
  position: ToastPosition;
  setPosition: (p: ToastPosition) => void;
  expand: boolean;
  setExpand: (v: boolean) => void;
  closeButton: boolean;
  setCloseButton: (v: boolean) => void;
  movable: boolean;
  setMovable: (v: boolean) => void;
} | null>(null);

export function ToastPositionProvider({ children }: { children: React.ReactNode }) {
  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  const [expand, setExpand] = useState(false);
  const [closeButton, setCloseButton] = useState(false);
  const [movable, setMovable] = useState(false);
  return (
    <ToastPositionContext.Provider
      value={{ position, setPosition, expand, setExpand, closeButton, setCloseButton, movable, setMovable }}
    >
      {children}
    </ToastPositionContext.Provider>
  );
}

export function useToastPosition() {
  const ctx = useContext(ToastPositionContext);
  if (!ctx) throw new Error("useToastPosition must be used within ToastPositionProvider");
  return ctx;
}
