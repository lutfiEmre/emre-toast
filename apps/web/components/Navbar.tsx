"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "#features", externalHref: "/#features", label: "Features", id: "features" },
  { href: "#playground", externalHref: "/#playground", label: "Playground", id: "playground" },
  { href: "#docs", externalHref: "/#docs", label: "Docs", id: "docs" },
  { href: "#compare", externalHref: "/#compare", label: "Compare", id: "compare" },
  { href: "/blog", label: "Blog", id: "blog" },
  { href: "/integrations", label: "Integrations", id: "integrations" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>("hero");
  const isBlogRoute = pathname.startsWith("/blog");
  const isIntegrationsRoute = pathname.startsWith("/integrations");

  useEffect(() => {
    if (isBlogRoute) {
      setActiveSection("blog");
      return;
    }
    if (isIntegrationsRoute) {
      setActiveSection("integrations");
      return;
    }
  }, [isBlogRoute, isIntegrationsRoute]);

  useEffect(() => {
    const sections = ["hero", "features", "playground", "docs", "compare"];

    const handleScroll = () => {
      const scrollY = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          return;
        }
      }
      setActiveSection("hero");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const resolvedSection = isBlogRoute ? "blog" : isIntegrationsRoute ? "integrations" : activeSection;

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between py-2 px-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
        <a
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <img
            src="/brand/emre-toast-mark.svg"
            alt="emre-toast logo"
            className="h-7 w-7 rounded-md"
          />
          emre-toast
        </a>
        <LayoutGroup>
        <div className="hidden md:flex items-center gap-8 relative">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={pathname === "/" ? link.href : (link.externalHref ?? link.href)}
              className={`relative py-2 text-base font-medium transition-colors ${
                resolvedSection === link.id
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              {link.label}
              {resolvedSection === link.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>
        </LayoutGroup>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/lutfiEmre/emre-toast"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="GitHub"
          >
            <svg
              className="w-5 h-5 text-slate-600 dark:text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
