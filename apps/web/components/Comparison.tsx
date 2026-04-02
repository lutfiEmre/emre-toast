"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const comparison = [
  { feature: "Zero dependencies", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Confetti celebration", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Undo countdown", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Avatar toasts", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Streaming toasts", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Progress toasts", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Smart grouping", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Headless mode", emre: true, sonner: false, hot: true, goey: false },
  { feature: "Sound effects", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Animated icon transitions", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Promise API", emre: true, sonner: true, hot: true, goey: true },
  { feature: "Swipe to dismiss", emre: true, sonner: true, hot: false, goey: false },
  { feature: "Dark/light theme", emre: true, sonner: true, hot: true, goey: true },
  { feature: "TypeScript-first", emre: true, sonner: true, hot: true, goey: true },
  { feature: "Close button", emre: true, sonner: true, hot: false, goey: false },
  { feature: "Movable toasts", emre: true, sonner: false, hot: false, goey: false },
  { feature: "Custom JSX body", emre: true, sonner: true, hot: true, goey: true },
  { feature: "Under 4KB gzipped", emre: true, sonner: true, hot: true, goey: false },
  { feature: "Morphing/blob animations", emre: false, sonner: false, hot: false, goey: true },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const iconVariants = {
  hidden: { scale: 0 },
  visible: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 20 } },
};

function Check() {
  return (
    <motion.span
      variants={iconVariants}
      className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    </motion.span>
  );
}

function Cross() {
  return (
    <motion.span
      variants={iconVariants}
      className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500"
    >
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </motion.span>
  );
}

export function Comparison() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gradientOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.08, 0.08, 0]);

  return (
    <section ref={sectionRef} id="compare" className="relative py-24 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px gradient-divider" />
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: gradientOpacity,
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99,102,241,0.15), transparent)",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-4xl md:text-5xl font-bold text-center mb-5 text-slate-800 dark:text-slate-100"
        >
          Compare with others
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 text-center mb-14"
        >
          See how emre-toast stacks up against popular alternatives
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl shadow-xl"
        >
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700/50">
                <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur z-10">
                  Feature
                </th>
                <th className="p-5 font-semibold text-indigo-600 dark:text-indigo-400 sticky bg-indigo-50/80 dark:bg-indigo-500/10 shadow-[inset_0_0_30px_-10px_rgba(99,102,241,0.3)]">
                  emre-toast
                </th>
                <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50">Sonner</th>
                <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50">React Hot Toast</th>
                <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50">goey-toast</th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {comparison.map((row, i) => (
                <motion.tr
                  key={row.feature}
                  variants={rowVariants}
                  className={`border-b border-slate-100 dark:border-slate-700/30 transition-colors duration-200 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 ${
                    i % 2 === 0 ? "bg-slate-50/30 dark:bg-slate-800/20" : ""
                  }`}
                >
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-medium sticky left-0 bg-inherit z-[1]">
                    {row.feature}
                  </td>
                  <td className="p-5 text-center bg-indigo-50/30 dark:bg-indigo-500/5">
                    {row.emre ? <Check /> : <Cross />}
                  </td>
                  <td className="p-5 text-center">{row.sonner ? <Check /> : <Cross />}</td>
                  <td className="p-5 text-center">{row.hot ? <Check /> : <Cross />}</td>
                  <td className="p-5 text-center">{row.goey ? <Check /> : <Cross />}</td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
