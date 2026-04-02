"use client";

import { useTheme } from "next-themes";
import { EmreToaster } from "emre-toast";
import { useToastPosition } from "@/lib/ToastPositionContext";

export function ToasterWrapper() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const { position, expand, closeButton, movable } = useToastPosition();

  return (
    <EmreToaster
      position={position}
      theme={theme}
      sounds={false}
      expand={expand}
      closeButton={closeButton}
      movable={movable}
    />
  );
}
