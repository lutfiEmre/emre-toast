"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { highlightCode } from "@/lib/highlightCode";

const tabs = [
  { id: "quick", label: "01 Quick Start", num: "01" },
  { id: "confetti", label: "02 Confetti", num: "02" },
  { id: "undo", label: "03 Undo", num: "03" },
  { id: "avatar", label: "04 Avatar", num: "04" },
  { id: "promise", label: "05 Promise", num: "05" },
  { id: "stream", label: "06 Streaming", num: "06" },
  { id: "progress", label: "07 Progress", num: "07" },
  { id: "headless", label: "08 Headless", num: "08" },
  { id: "stacking", label: "09 Stacking", num: "09" },
];

const codeSnippets: Record<string, string> = {
  quick: `import { EmreToaster, emreToast } from '@emrelutfi/emre-toast'
import '@emrelutfi/emre-toast/styles.css'

function App() {
  return (
    <>
      <EmreToaster position="bottom-right" />
      <button onClick={() => emreToast.success('Saved!')}>
        Save
      </button>
    </>
  )
}`,
  confetti: `emreToast.success('Payment received!', {
  description: 'Thank you for your purchase.',
  confetti: true,
})`,
  undo: `emreToast.undo('Email archived', {
  onUndo: () => restoreEmail(),
  countdown: 5000,
})`,
  avatar: `emreToast.info('John liked your post', {
  avatar: '/avatars/john.png',
  description: '2 minutes ago',
})`,
  promise: `emreToast.promise(saveData(), {
  loading: 'Saving...',
  success: 'Changes saved',
  error: 'Something went wrong',
  description: {
    success: 'All changes have been synced.',
    error: 'Please try again later.',
  },
})`,
  stream: `emreToast.stream('Analyzing...', {
  onStream: (update) => {
    update('Found 3 issues in your code')
  },
})`,
  progress: `const id = emreToast.progress('Uploading...', { progress: 0 })

emreToast.update(id, { progress: 75 })
emreToast.update(id, { type: 'success', title: 'Upload complete!' })`,
  headless: `const { toasts, dismiss, update } = useEmreToast()

return (
  <div>
    {toasts.map(toast => (
      <div key={toast.id} onClick={() => dismiss(toast.id)}>
        {toast.title}
      </div>
    ))}
  </div>
)`,
  stacking: `// Stacked perspective with expand on hover
<EmreToaster
  position="bottom-right"
  expand={false}
  closeButton={true}
/>

// When expand={false}, toasts stack with scale/translate.
// Hover over the toast area to expand and see all toasts.
// closeButton adds an X button to each toast.`,
};

export function Docs() {
  const [activeTab, setActiveTab] = useState("quick");

  return (
    <section id="docs" className="relative py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
      <div className="absolute top-0 left-0 right-0 h-px gradient-divider" />
      <div className="max-w-6xl w-fit mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-4xl md:text-5xl font-bold text-center mb-5 text-slate-800 dark:text-slate-100"
        >
          Documentation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 text-center mb-14"
        >
          Everything you need to add premium toasts to your React app
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl"
        >
          <LayoutGroup>
          <div className="flex border-b border-slate-200 dark:border-slate-700/50 overflow-x-auto overflow-y-hidden scroll-smooth relative docs-tabs-scroll">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-shrink-0 px-6 py-4 text-base font-medium transition-colors whitespace-nowrap z-10 ${
                  activeTab === tab.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="docs-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
          </LayoutGroup>
          <AnimatePresence mode="wait">
            <motion.pre
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="p-7 overflow-x-auto text-sm font-mono bg-slate-900 dark:bg-slate-950"
            >
              <code className="text-[14px]">{highlightCode(codeSnippets[activeTab])}</code>
            </motion.pre>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mt-14 grid md:grid-cols-2 gap-8"
        >
          <motion.div
            className="p-7 rounded-2xl bg-white/70 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          >
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">Toast Types</h3>
            <pre className="text-sm font-mono overflow-x-auto text-slate-600 dark:text-slate-400">
              <code>{`emreToast('Hello')
emreToast.success('Saved!')
emreToast.error('Failed')
emreToast.warning('Careful')
emreToast.info('FYI')
emreToast.loading('Loading...')`}</code>
            </pre>
          </motion.div>
          <motion.div
            className="p-7 rounded-2xl bg-white/70 dark:bg-slate-800/30 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50"
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
          >
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">Toaster Props</h3>
            <pre className="text-sm font-mono overflow-x-auto text-slate-600 dark:text-slate-400">
              <code>{`<EmreToaster
  position="bottom-right"
  theme="system"
  maxVisible={5}
  sounds={false}
  animation="slide"
  expand={false}
  closeButton={false}
/>`}</code>
            </pre>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
