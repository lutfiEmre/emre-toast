"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { emreToast } from "@emrelutfi/emre-toast";

export function Footer() {
  return (
    <footer className="relative py-16 px-6 overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-60"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(139,92,246,0.5), rgba(6,182,212,0.5), transparent)",
        }}
      />
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img
            src="/brand/emre-toast-mark.svg"
            alt="emre-toast logo"
            className="h-7 w-7 rounded-md"
          />
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">emre-toast</span>
          <span className="text-slate-500 dark:text-slate-400 text-sm">v0.1.2</span>
        </div>
        <div className="flex items-center gap-6">
          <motion.button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText("npm install @emrelutfi/emre-toast");
              emreToast.success("Copied to clipboard!");
            }}
            className="group relative px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-mono overflow-hidden border border-transparent hover:border-indigo-300/50 dark:hover:border-indigo-500/30 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: "linear-gradient(90deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))",
              }}
            />
            <span className="relative z-10">npm install @emrelutfi/emre-toast</span>
          </motion.button>
          <Link
            href="/blog"
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/integrations"
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors"
          >
            Integrations
          </Link>
          <motion.a
            href="https://github.com/lutfiEmre/emre-toast"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition-colors"
            whileHover={{ x: 2 }}
          >
            GitHub
          </motion.a>
          <span className="text-slate-500 dark:text-slate-400 text-sm">MIT License</span>
        </div>
      </div>
    </footer>
  );
}
