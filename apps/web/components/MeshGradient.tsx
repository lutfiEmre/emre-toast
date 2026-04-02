"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const BLOBS = [
  { color: "#6366f1", size: 480, x: "20%", y: "10%", duration: 18, delay: 0 },
  { color: "#8b5cf6", size: 420, x: "80%", y: "20%", duration: 22, delay: 2 },
  { color: "#06b6d4", size: 450, x: "50%", y: "70%", duration: 16, delay: 1 },
  { color: "#ec4899", size: 380, x: "10%", y: "60%", duration: 20, delay: 3 },
  { color: "#f59e0b", size: 400, x: "85%", y: "75%", duration: 17, delay: 1.5 },
];

export function MeshGradient() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const blendMode = isDark ? "screen" : "multiply";

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[80px] opacity-60 dark:opacity-50"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            backgroundColor: blob.color,
            mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
            transform: "translate(-50%, -50%)",
            willChange: reducedMotion ? "auto" : "transform",
          }}
          animate={
            reducedMotion
              ? {}
              : {
                  x: [0, 60, -40, 30, 0],
                  y: [0, -70, 50, -30, 0],
                  scale: [1, 1.15, 0.92, 1.08, 1],
                }
          }
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
