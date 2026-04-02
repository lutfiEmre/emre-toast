"use client";

import React from "react";
import { Toast } from "./Toast";
import { getToasts, subscribe } from "./state";
import type { ToasterProps, ToastTheme } from "./types";

const TOAST_WIDTH = 356;

function useResolvedTheme(theme: ToastTheme): "light" | "dark" {
  const [resolved, setResolved] = React.useState<"light" | "dark">("light");
  React.useEffect(() => {
    if (theme !== "system") { setResolved(theme); return; }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setResolved(mq.matches ? "dark" : "light");
    const h = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [theme]);
  return resolved;
}

export function EmreToaster({
  position = "bottom-right",
  theme = "system",
  maxVisible = 5,
  sounds = false,
  animation = "slide",
  history = false,
  duration,
  gap = 14,
  offset = "24px",
  expand = false,
  closeButton = false,
  movable = false,
}: ToasterProps) {
  const [toasts, setToasts] = React.useState(getToasts);
  const [isExpanded, setIsExpanded] = React.useState(expand);
  const [isHovering, setIsHovering] = React.useState(false);
  const [heights, setHeights] = React.useState<Record<string, number>>({});
  const leaveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedTheme = useResolvedTheme(theme);

  React.useEffect(() => subscribe(setToasts), []);
  React.useEffect(() => () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }, []);

  const visible = toasts.filter((t) => t.status === "visible").slice(-maxVisible);
  const visibleIds = visible.map((t) => t.id).join(",");

  // Clean up heights for dismissed toasts
  React.useEffect(() => {
    const ids = new Set(visibleIds ? visibleIds.split(",") : []);
    setHeights((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const id of Object.keys(next)) {
        if (!ids.has(id)) { delete next[id]; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [visibleIds]);

  const isBottom = position.startsWith("bottom");
  const isCenter = position.endsWith("center");
  const offsetVal = typeof offset === "number" ? `${offset}px` : offset;

  const onHeightChange = React.useCallback((id: string, h: number) => {
    setHeights((prev) => prev[id] === h ? prev : { ...prev, [id]: h });
  }, []);

  // orderedHeights[i] = height of visible[i], oldest first
  const orderedHeights = visible.map((t) => heights[t.id] ?? 96);
  const frontH = orderedHeights[orderedHeights.length - 1] ?? 96;

  // Container height: when stacked shows just the front toast + peek gaps
  // when expanded shows all toasts stacked
  const expandedH = orderedHeights.reduce((a, b) => a + b, 0) + gap * Math.max(0, visible.length - 1);
  const stackedH = frontH + gap * Math.min(Math.max(0, visible.length - 1), 2);
  const containerH = isExpanded ? expandedH : stackedH;

  // Toaster position — pure inline, zero CSS class conflicts
  const toasterPos: React.CSSProperties = {
    position: "fixed",
    zIndex: 9999,
    pointerEvents: "none",
    width: TOAST_WIDTH,
    ...(isBottom ? { bottom: offsetVal } : { top: offsetVal }),
    ...(isCenter
      ? { left: "50%", transform: "translateX(-50%)" }
      : position.endsWith("right")
        ? { right: offsetVal }
        : { left: offsetVal }),
  };

  return (
    <section
      className={`emre-toaster emre-toaster--${resolvedTheme}`}
      data-position={position}
      data-theme={resolvedTheme}
      style={toasterPos}
      role="region"
      aria-label="Notifications"
    >
      {/* List: relative positioning, height transitions on expand/collapse */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: visible.length > 0 ? containerH : 0,
          transition: "height 360ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: "auto",
        }}
        onMouseEnter={() => {
          if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
          setIsHovering(true);
          setIsExpanded(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
          leaveTimer.current = setTimeout(() => {
            setIsExpanded(expand);
            leaveTimer.current = null;
          }, 300);
        }}
      >
        {visible.map((toast, i) => {
          // stackIndex: 0 = front (newest), higher = further back (older)
          const stackIndex = visible.length - 1 - i;
          const isFront = stackIndex === 0;
          const h = orderedHeights[i] ?? 96;
          const shouldPauseToast = isHovering || (!isExpanded && !isFront);

          // Y offset from the anchor edge (bottom or top of container)
          const offsetY = isExpanded
            // Expanded: each toast at its sequential position
            ? orderedHeights.slice(i + 1).reduce((a, b) => a + b, 0) + gap * (visible.length - 1 - i)
            // Stacked: just small gap peeks
            : gap * stackIndex;

          // Depth scale: front=1, each level back slightly smaller
          const scale = isExpanded || movable ? 1 : Math.max(0.9, 1 - 0.035 * stackIndex);

          // Hide toasts beyond 3 deep
          const opacity = stackIndex < 3 ? 1 : 0;

          return (
            <div
              key={toast.id}
              style={{
                position: "absolute",
                // Anchor to the near edge
                [isBottom ? "bottom" : "top"]: 0,
                left: 0,
                right: 0,
                // Only translate + scale. No height changes — avoids all jumping.
                transform: `translateY(${isBottom ? -offsetY : offsetY}px) scale(${scale})`,
                transformOrigin: isBottom ? "bottom center" : "top center",
                zIndex: visible.length - stackIndex,
                pointerEvents: isExpanded || isFront ? "auto" : "none",
                opacity,
                // Background toasts clip to front toast height when stacked
                height: isExpanded ? h : (isFront ? undefined : frontH),
                overflow: "visible",
                transition: [
                  "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                  "opacity 300ms ease",
                  "height 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                ].join(", "),
              }}
            >
              <Toast
                toast={toast}
                animation={animation}
                sounds={sounds}
                closeButton={closeButton}
                movable={movable}
                forcePause={shouldPauseToast}
                onHeightChange={onHeightChange}
                isBottom={isBottom}
                position={position}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
