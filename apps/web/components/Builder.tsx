"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { emreToast } from "emre-toast";
import { highlightCode } from "@/lib/highlightCode";
import { useToastPosition, type ToastPosition } from "@/lib/ToastPositionContext";

const toastTypes = [
  { value: "default", label: "Default" },
  { value: "success", label: "Success" },
  { value: "error", label: "Error" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
  { value: "loading", label: "Loading" },
] as const;

const POSITIONS: { value: ToastPosition; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-center", label: "Top Center" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-center", label: "Bottom Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

export function Builder() {
  const { position, setPosition, expand, setExpand, closeButton, setCloseButton, movable, setMovable } = useToastPosition();
  const [type, setType] = useState<(typeof toastTypes)[number]["value"]>("success");
  const [title, setTitle] = useState("Changes saved");
  const [description, setDescription] = useState(
    "Your changes have been saved and synced successfully."
  );
  const [hasAction, setHasAction] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [durationMs, setDurationMs] = useState("");

  const fireToast = () => {
    const opts: Parameters<typeof emreToast.success>[1] = {};
    if (description) opts.description = description;
    const parsedDuration = Number(durationMs);
    if (durationMs.trim() !== "" && Number.isFinite(parsedDuration) && parsedDuration > 0) {
      opts.duration = Math.floor(parsedDuration);
    }
    if (hasAction) {
      opts.action = {
        label: "Undo",
        onClick: () => {},
      };
    }
    if (type === "success" && confetti) opts.confetti = true;
    switch (type) {
      case "success":
        emreToast.success(title, opts);
        break;
      case "error":
        emreToast.error(title, opts);
        break;
      case "warning":
        emreToast.warning(title, opts);
        break;
      case "info":
        emreToast.info(title, opts);
        break;
      case "loading":
        emreToast.loading(title, opts);
        break;
      default:
        emreToast(title, opts);
    }
  };

  const firePromise = () => {
    emreToast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Saving...",
        success: "Changes saved",
        error: "Something went wrong",
        description: {
          success: "All changes have been synced.",
          error: "Please try again later.",
        },
      }
    );
  };

  const fireProgress = () => {
    const id = emreToast.progress("Uploading...", { progress: 0 });
    let p = 0;
    const iv = setInterval(() => {
      p += 10;
      emreToast.update(id, { progress: p });
      if (p >= 100) {
        clearInterval(iv);
        emreToast.update(id, { type: "success", title: "Upload complete!" });
      }
    }, 300);
  };

  const fireStream = () => {
    emreToast.stream("Analyzing...", {
      onStream: (update) => {
        setTimeout(() => update("Found 3 issues in your code"), 800);
        setTimeout(() => update("All issues have been resolved"), 1600);
      },
      duration: 5000,
    });
  };

  const fireGroup = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(
        () => emreToast.success("File saved", { groupKey: "file-save" }),
        i * 200
      );
    }
  };

  const fireConfetti = () => {
    emreToast.success("Celebration!", {
      description: "Confetti burst on success.",
      confetti: true,
    });
  };

  const fireUndo = () => {
    emreToast.undo("Email archived", {
      onUndo: () => emreToast.success("Undone! Email restored."),
      countdown: 5000,
    });
  };

  const fireAvatar = () => {
    emreToast.info("Sarah liked your post", {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      description: "2 minutes ago",
    });
  };

  const fireStacking = () => {
    const messages = [
      "First notification",
      "Second notification",
      "Third notification",
      "Fourth notification",
    ];
    messages.forEach((msg, i) => {
      setTimeout(() => {
        emreToast.success(msg, { description: `Toast #${i + 1}` });
      }, i * 300);
    });
  };

  const opts: string[] = [];
  if (description) opts.push(`description: ${JSON.stringify(description)}`);
  if (durationMs.trim() !== "") {
    const parsedDuration = Number(durationMs);
    if (Number.isFinite(parsedDuration) && parsedDuration > 0) {
      opts.push(`duration: ${Math.floor(parsedDuration)}`);
    }
  }
  if (hasAction) opts.push(`action: { label: "Undo", onClick: () => {} }`);
  if (type === "success" && confetti) opts.push("confetti: true");
  const optsStr = opts.length ? `, {\n  ${opts.join(",\n  ")}\n}` : "";

  const toasterProps = [
    `position="${position}"`,
    expand && "expand",
    closeButton && "closeButton",
    movable && "movable",
  ]
    .filter(Boolean)
    .join(" ");
  const codePreview = `<EmreToaster ${toasterProps} />\n\n${type === "default"
    ? `emreToast(${JSON.stringify(title)}${optsStr})`
    : `emreToast.${type}(${JSON.stringify(title)}${optsStr})`}`;

  return (
    <section id="playground" className="relative py-24 px-6">
      <div className="absolute top-0 left-0 right-0 h-px gradient-divider" />
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-4xl md:text-5xl font-bold text-center mb-5 text-slate-800 dark:text-slate-100"
        >
          Interactive Playground
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 text-center mb-14"
        >
          Design and test your toast in real time
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "conic-gradient(from 0deg, #6366f1, #8b5cf6, #06b6d4, #ec4899, #6366f1)",
              animation: "gradient-rotate 4s linear infinite",
            }}
          />
          <div className="relative p-10 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-7">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Toaster options</p>
                <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={expand}
                    onChange={(e) => setExpand(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Expand by default</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={closeButton}
                    onChange={(e) => setCloseButton(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Close button</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={movable}
                    onChange={(e) => setMovable(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Movable (drag around)</span>
                </label>
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Position
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {POSITIONS.map((p) => (
                    <motion.button
                      key={p.value}
                      type="button"
                      onClick={() => setPosition(p.value)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        position === p.value
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                          : "bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {p.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                >
                  {toastTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration (ms)
                </label>
                <input
                  type="number"
                  min={1}
                  step={100}
                  value={durationMs}
                  onChange={(e) => setDurationMs(e.target.value)}
                  placeholder="5000 (default)"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Boş bırakırsan sistem varsayılanı 5000ms kullanır.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={hasAction}
                    onChange={(e) => setHasAction(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Action button</span>
                </label>
                <AnimatePresence>
                  {type === "success" && (
                    <motion.label
                      key="confetti"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="flex items-center gap-2 overflow-hidden"
                    >
                      <input
                        type="checkbox"
                        checked={confetti}
                        onChange={(e) => setConfetti(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-600"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">Confetti</span>
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                type="button"
                onClick={fireToast}
                className="relative w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold shadow-xl shadow-indigo-500/25 overflow-visible"
                style={{ animation: "glow-pulse 2.5s ease-in-out infinite" }}
                whileHover={{ scale: 1.03, boxShadow: "0 20px 50px -15px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Fire Toast
              </motion.button>
            </div>
            <div className="space-y-3">
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-4">Quick demos</p>
              <motion.button
                type="button"
                onClick={firePromise}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Promise Toast
              </motion.button>
              <motion.button
                type="button"
                onClick={fireProgress}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Progress Toast
              </motion.button>
              <motion.button
                type="button"
                onClick={fireStream}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Streaming Toast
              </motion.button>
              <motion.button
                type="button"
                onClick={fireGroup}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Grouped Toasts (×5)
              </motion.button>
              <motion.button
                type="button"
                onClick={fireConfetti}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Confetti Toast
              </motion.button>
              <motion.button
                type="button"
                onClick={fireUndo}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Undo Countdown
              </motion.button>
              <motion.button
                type="button"
                onClick={fireAvatar}
                className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Avatar Toast
              </motion.button>
              <motion.button
                type="button"
                onClick={fireStacking}
                className="w-full py-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 text-base font-medium transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Stacking Demo (×4)
              </motion.button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-base font-medium text-slate-600 dark:text-slate-400 mb-3">Live code preview</p>
            <pre className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-sm overflow-x-auto font-mono">
              <code>{highlightCode(codePreview)}</code>
            </pre>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
