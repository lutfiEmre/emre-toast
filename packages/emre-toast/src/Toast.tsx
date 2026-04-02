"use client";

import React from "react";
import { ToastIcon } from "./ToastIcon";
import { emreToast } from "./api";
import { playToastSound } from "./sounds";
import { fireConfetti } from "./confetti";
import type { ToastState, ToastPosition } from "./types";

function useIsDocumentHidden(): boolean {
  const [hidden, setHidden] = React.useState(
    typeof document !== "undefined" ? document.hidden : false
  );

  React.useEffect(() => {
    const handler = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  return hidden;
}

interface ToastProps {
  toast: ToastState;
  animation: string;
  sounds: boolean;
  closeButton?: boolean;
  movable?: boolean;
  forcePause?: boolean;
  onHeightChange?: (id: string, height: number) => void;
  isBottom?: boolean;
  position?: ToastPosition;
}

const SWIPE_THRESHOLD = 60;
const VELOCITY_THRESHOLD = 0.5;
const DRAG_START_THRESHOLD = 4;
const RESET_ANIMATION_MS = 220;

type Point = { x: number; y: number };
type Rect = { left: number; top: number; width: number; height: number };

export function Toast({
  toast,
  animation,
  sounds,
  closeButton = false,
  movable = false,
  forcePause = false,
  onHeightChange,
  isBottom = true,
  position = "bottom-right",
}: ToastProps) {
  const [isHoverPaused, setIsHoverPaused] = React.useState(false);
  const [swipeDx, setSwipeDx] = React.useState(0);
  const [swipeDy, setSwipeDy] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [resetting, setResetting] = React.useState(false);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = React.useRef(Math.max(0, toast.duration));
  const timerStartedAtRef = React.useRef<number | null>(null);
  const durationRef = React.useRef(toast.duration);

  const isDraggingRef = React.useRef(false);
  const movedRef = React.useRef(false);
  const pointerIdRef = React.useRef<number | null>(null);

  // Shared pointer/time data
  const startRef = React.useRef({ x: 0, y: 0, t: 0 });

  // Movable drag refs (no re-render on move)
  const moveRef = React.useRef<Point>({ x: 0, y: 0 });
  const dragOriginRef = React.useRef<Point>({ x: 0, y: 0 });
  const baseRectRef = React.useRef<Rect>({ left: 0, top: 0, width: 0, height: 0 });

  const isDocumentHidden = useIsDocumentHidden();

  const prevTypeRef = React.useRef<ToastState["type"] | null>(null);
  React.useEffect(() => {
    if (sounds && prevTypeRef.current !== toast.type) {
      prevTypeRef.current = toast.type;
      playToastSound(toast.type);
    }
  }, [toast.id, sounds, toast.type]);

  React.useEffect(() => {
    if (toast.type === "success" && toast.options.confetti && wrapperRef.current) {
      const timeout = setTimeout(() => fireConfetti(wrapperRef.current!, 0, 0), 100);
      return () => clearTimeout(timeout);
    }
  }, [toast.id, toast.type, toast.options.confetti]);

  React.useEffect(() => {
    if (!wrapperRef.current || !onHeightChange) return;
    const el = wrapperRef.current;
    const observer = new ResizeObserver(() => {
      onHeightChange(toast.id, el.getBoundingClientRect().height);
    });
    observer.observe(el);
    onHeightChange(toast.id, el.getBoundingClientRect().height);
    return () => observer.disconnect();
  }, [toast.id, onHeightChange]);

  const dismiss = React.useCallback(() => emreToast.dismiss(toast.id), [toast.id]);

  const clearTimer = React.useCallback((countElapsed = true) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (countElapsed && timerStartedAtRef.current != null) {
      const elapsed = Date.now() - timerStartedAtRef.current;
      remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    }

    timerStartedAtRef.current = null;
  }, []);

  const paused = isHoverPaused || forcePause;

  const startTimer = React.useCallback(() => {
    if (paused || isDocumentHidden || toast.type === "loading" || toast.duration <= 0) {
      return;
    }
    if (remainingRef.current <= 0) {
      dismiss();
      return;
    }
    timerStartedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      timerStartedAtRef.current = null;
      remainingRef.current = 0;
      dismiss();
    }, remainingRef.current);
  }, [paused, isDocumentHidden, toast.type, toast.duration, dismiss]);

  React.useEffect(() => {
    if (durationRef.current !== toast.duration) {
      // Preserve elapsed time when duration is updated.
      // Example: 5s toast with 2s elapsed -> remaining 3s.
      // If duration becomes 10s, remaining should become 8s (not reset to 10s).
      clearTimer();
      const previousDuration = durationRef.current;
      const delta = toast.duration - previousDuration;
      durationRef.current = toast.duration;
      remainingRef.current = Math.max(0, remainingRef.current + delta);
    }

    clearTimer();
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const applyMovableTransform = React.useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const { x, y } = moveRef.current;
    el.style.transform = x === 0 && y === 0 ? "" : `translate(${x}px, ${y}px)`;
  }, []);

  const clampMoveToViewport = React.useCallback((nextX: number, nextY: number): Point => {
    const rect = baseRectRef.current;

    const minX = -rect.left;
    const maxX = window.innerWidth - (rect.left + rect.width);
    const minY = -rect.top;
    const maxY = window.innerHeight - (rect.top + rect.height);

    const clampedX = minX <= maxX ? Math.min(maxX, Math.max(minX, nextX)) : nextX;
    const clampedY = minY <= maxY ? Math.min(maxY, Math.max(minY, nextY)) : nextY;

    return { x: clampedX, y: clampedY };
  }, []);

  React.useLayoutEffect(() => {
    if (movable) {
      applyMovableTransform();
    } else if (wrapperRef.current) {
      moveRef.current = { x: 0, y: 0 };
      wrapperRef.current.style.transform = "";
    }
  }, [movable, applyMovableTransform]);

  const handleMouseEnter = () => {
    setIsHoverPaused(true);
    clearTimer();
  };

  const handleMouseLeave = () => {
    setIsHoverPaused(false);
    startTimer();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;

    isDraggingRef.current = true;
    movedRef.current = false;
    setDragging(true);
    setResetting(false);

    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };

    if (movable) {
      dragOriginRef.current = { ...moveRef.current };
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      baseRectRef.current = {
        left: rect.left - moveRef.current.x,
        top: rect.top - moveRef.current.y,
        width: rect.width,
        height: rect.height,
      };
      pointerIdRef.current = e.pointerId;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (
      !movedRef.current &&
      (Math.abs(dx) >= DRAG_START_THRESHOLD || Math.abs(dy) >= DRAG_START_THRESHOLD)
    ) {
      movedRef.current = true;
    }

    if (movable) {
      if (!movedRef.current) {
        return;
      }

      const nextX = dragOriginRef.current.x + dx;
      const nextY = dragOriginRef.current.y + dy;
      moveRef.current = clampMoveToViewport(nextX, nextY);
      applyMovableTransform();
      return;
    }

    // Non-movable mode: left swipe dismiss intent.
    // Right drags are strongly resisted to avoid accidental close.
    const swipeX = dx > 0 ? dx * 0.18 : dx;
    const swipeY = dy * 0.08;
    setSwipeDx(swipeX);
    setSwipeDy(swipeY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setDragging(false);

    if (movable) {
      if (pointerIdRef.current != null) {
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(pointerIdRef.current);
        } catch {
          // ignore release errors
        }
      }
      pointerIdRef.current = null;
      movedRef.current = false;
      return;
    }

    if (!movedRef.current) {
      // Treat as click/tap: never dismiss in swipe mode.
      setSwipeDx(0);
      setSwipeDy(0);
      return;
    }

    const totalDx = e.clientX - startRef.current.x;
    const dt = Math.max(Date.now() - startRef.current.t, 1);
    const velocityX = totalDx / dt;

    const shouldDismiss =
      totalDx <= -SWIPE_THRESHOLD ||
      (totalDx < -20 && Math.abs(velocityX) > VELOCITY_THRESHOLD);

    if (shouldDismiss) {
      dismiss();
    } else {
      setSwipeDx(0);
      setSwipeDy(0);
    }
    movedRef.current = false;
  };

  const handlePointerCancel = () => {
    isDraggingRef.current = false;
    setDragging(false);
    movedRef.current = false;
    setSwipeDx(0);
    setSwipeDy(0);
  };

  const handleDoubleClick = () => {
    if (!movable) return;
    moveRef.current = { x: 0, y: 0 };
    setResetting(true);
    applyMovableTransform();

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setResetting(false);
      resetTimerRef.current = null;
    }, RESET_ANIMATION_MS);
  };

  const displayTitle =
    toast.groupCount && toast.groupCount > 1
      ? `${toast.title} (×${toast.groupCount})`
      : toast.title;

  const isAssertive = toast.type === "error" || toast.type === "warning";

  const swipeTransform =
    !movable && (swipeDx !== 0 || swipeDy !== 0)
      ? `translate(${swipeDx}px, ${swipeDy}px)`
      : undefined;

  const transition = movable
    ? dragging
      ? "none"
      : resetting
        ? `transform ${RESET_ANIMATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : "none"
    : dragging
      ? "none"
      : swipeTransform
        ? "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)"
        : undefined;

  return (
    <div
      ref={wrapperRef}
      className={[
        "emre-toast",
        `emre-toast--${toast.type}`,
        `emre-toast--${animation}`,
        toast.status === "dismissing" && "emre-toast--dismissing",
        closeButton && "emre-toast--has-close",
        movable && "emre-toast--movable",
        movable && dragging && "emre-toast--dragging",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => e.key === "Escape" && dismiss()}
      tabIndex={0}
      style={{
        transform: swipeTransform,
        touchAction: movable ? "none" : "pan-y",
        cursor: movable ? (dragging ? "grabbing" : "grab") : "default",
        userSelect: movable ? "none" : undefined,
        width: "100%",
        boxSizing: "border-box",
        transition,
      }}
      role="status"
      aria-live={isAssertive ? "assertive" : "polite"}
      aria-atomic="true"
      aria-label={`${toast.type} notification: ${displayTitle}`}
      data-position={position}
    >
      {closeButton && (
        <button
          type="button"
          className="emre-toast__close-btn"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          aria-label="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 1l10 10M11 1L1 11" />
          </svg>
        </button>
      )}

      <div className="emre-toast__content">
        <div className="emre-toast__header">
          <div className="emre-toast__icon-wrapper">
            {toast.undoCountdown != null && (
              <svg className="emre-toast__countdown-ring" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100"
                  strokeDashoffset="0"
                  style={{
                    animation: `emre-countdown ${toast.undoCountdown}ms linear forwards`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              </svg>
            )}
            {toast.avatar ? (
              <img src={toast.avatar} alt="" className="emre-toast__avatar" />
            ) : (
              <ToastIcon type={toast.type} />
            )}
          </div>
          <span className="emre-toast__title">{displayTitle}</span>
        </div>

        {toast.description && (
          <div className="emre-toast__description">{toast.description}</div>
        )}

        {typeof toast.progress === "number" && (
          <div className="emre-toast__progress">
            <div className="emre-toast__progress-bar" style={{ width: `${toast.progress}%` }} />
          </div>
        )}

        {toast.action && (
          <div className="emre-toast__action">
            <button
              type="button"
              className="emre-toast__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                toast.action?.onClick();
                if (toast.action?.successLabel) {
                  emreToast.update(toast.id, {
                    title: toast.action.successLabel,
                    type: "success",
                  });
                } else {
                  dismiss();
                }
              }}
            >
              {toast.action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
