"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { emreToast } from "emre-toast";
import { MeshGradient } from "./MeshGradient";

const HEADLINE_LINE1 = ["The", "last", "toast"];
const HEADLINE_LINE2 = ["library", "you'll", "ever", "need"];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

function AnimatedCounter({ end, suffix = "", duration = 1 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      <CountUp end={end} inView={inView} duration={duration} />
      {suffix}
    </motion.span>
  );
}

function CountUp({ end, inView, duration }: { end: number; inView: boolean; duration: number }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  if (inView && !hasAnimated.current) {
    hasAnimated.current = true;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  return <>{count}</>;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const float1Y = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const float2Y = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const float3Y = useTransform(scrollYProgress, [0, 0.5], [0, 50]);

  const handleDemo = () => {
    emreToast.success("Welcome to emre-toast!", {
      description: "The last toast library you'll ever need.",
      confetti: true,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x: x * 8, y: y * 8 });
  };

  const handleMouseLeave = () => setMousePosition({ x: 0, y: 0 });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-24 md:pb-28"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/90 via-white to-white dark:from-indigo-950/50 dark:via-[#0a0a1a] dark:to-[#0a0a1a]" />
      <motion.div
        className="absolute inset-0 dark:opacity-[1.2]"
        animate={{
          opacity: [0.15, 0.25, 0.15],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.2), transparent)",
        }}
      />
      <motion.div
        className="absolute inset-0 dark:opacity-[1.2]"
        animate={{
          opacity: [0.2, 0.35, 0.2],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        style={{
          background: "radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139,92,246,0.15), transparent)",
        }}
      />
      <motion.div
        className="absolute inset-0 dark:opacity-[1.2]"
        animate={{
          opacity: [0.15, 0.28, 0.15],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
        style={{
          background: "radial-gradient(ellipse 50% 60% at 20% 80%, rgba(6,182,212,0.12), transparent)",
        }}
      />
      <MeshGradient />

      {/* Floating toasts with parallax */}
      <motion.div
        className="absolute left-[8%] top-1/3 hidden lg:block"
        style={{ y: float1Y, animation: "float 6s ease-in-out infinite" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-48 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl ring-1 ring-indigo-500/10 dark:ring-indigo-400/10"
          style={{ transform: "rotate(-8deg)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Saved!</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500">Changes synced</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute right-[8%] top-1/4 hidden lg:block"
        style={{ y: float2Y, animation: "float 7s ease-in-out infinite 1s" }}
      >
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-48 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl ring-1 ring-indigo-500/10 dark:ring-indigo-400/10"
          style={{ transform: "rotate(6deg)" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Uploading...</span>
          </div>
          <div className="h-1 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: "30%" }}
              animate={{ width: "75%" }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute right-[12%] bottom-1/3 hidden lg:block"
        style={{ y: float3Y, animation: "float 5s ease-in-out infinite 0.5s" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="w-44 p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl ring-1 ring-rose-500/10 dark:ring-rose-400/10"
          style={{ transform: "rotate(-4deg)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Error</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Please try again</p>
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="relative overflow-hidden inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-base font-medium mb-10 shadow-xl shadow-indigo-500/10"
        >
          <span
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
          <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="relative z-10">Zero dependencies · Under 4KB gzipped</span>
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
        >
          <div className="mb-2">
            {HEADLINE_LINE1.map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                variants={wordVariants}
                className="inline-block mr-3 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <div>
            {HEADLINE_LINE2.map((word, i) => (
              <motion.span
                key={`l2-${i}`}
                variants={wordVariants}
                className="inline-block mr-3 bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.6 }}
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Premium React toast notifications. Streaming, progress bars, confetti,
          undo countdown, and headless mode. Built for 2026.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.75 }}
          className="flex flex-wrap justify-center gap-5 text-base md:text-lg text-slate-500 dark:text-slate-400 mb-12 font-medium"
        >
          <span>0 deps</span>
          <span>·</span>
          <span>&lt;4KB</span>
          <span>·</span>
          <AnimatedCounter end={6} suffix=" toast types" />
          <span>·</span>
          <AnimatedCounter end={8} suffix=" animations" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 md:mb-16"
        >
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 font-mono text-base shadow-xl">
            <code className="text-slate-700 dark:text-slate-300">npm install emre-toast</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("npm install emre-toast");
                emreToast.success("Copied to clipboard!");
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              aria-label="Copy install command"
            >
              <svg
                className="w-4 h-4 text-slate-500 dark:text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
          <motion.button
            ref={buttonRef}
            type="button"
            onClick={handleDemo}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold shadow-xl shadow-indigo-500/30"
            style={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -15px rgba(99, 102, 241, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Try it
          </motion.button>
        </motion.div>
      </div>

      <motion.a
        href="#features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        style={{ animation: "scroll-bounce 2s ease-in-out infinite" }}
      >
        <span className="text-xs font-medium">Scroll</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.a>

      <div className="absolute bottom-0 left-0 right-0 h-px gradient-divider" />
    </section>
  );
}
