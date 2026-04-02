import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const metadata = {
  title: "Integrations | emre-toast",
  description: "Guides for integrating emre-toast with Next.js, shadcn/ui, and more.",
};

export default function IntegrationsPage() {
  const guides = getAllContent("integrations");
  const [featured, ...rest] = guides;
  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-24">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_8%_22%,rgba(16,185,129,0.14),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.14),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(14,165,233,0.12),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <section className="rounded-[2rem] border border-slate-200/70 dark:border-slate-700/60 bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 dark:border-emerald-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
            Integration Hub
          </p>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Plug emre-toast Into Any React Stack In Minutes
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Step-by-step guides for Next.js, shadcn/ui, and modern app stacks. Integration
            recipes are optimized for fast setup, strong defaults, and premium UX out of the box.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Install
              </p>
              <code className="mt-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
                npm install emre-toast
              </code>
            </div>
            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Quick Signal
              </p>
              <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                Zero deps, streaming-ready, stacked interactions.
              </p>
            </div>
          </div>
        </section>

        {featured && (
          <section className="mt-12">
            <Link
              href={`/integrations/${featured.slug}`}
              className="group block rounded-3xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 shadow-[0_24px_70px_-42px_rgba(16,185,129,0.45)] hover:border-emerald-300/70 dark:hover:border-emerald-500/50 transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Featured guide
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
                  {featured.description}
                </p>
              )}
              <div className="mt-6 flex items-center gap-4 text-sm">
                <span className="rounded-full bg-emerald-100/80 dark:bg-emerald-500/15 px-3 py-1 font-medium text-emerald-700 dark:text-emerald-300">
                  {guides.length} guides available
                </span>
                <span className="font-medium text-emerald-700 dark:text-emerald-300">
                  Open guide →
                </span>
              </div>
            </Link>
          </section>
        )}

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {rest.map((guide) => (
            <Link
              key={guide.slug}
              href={`/integrations/${guide.slug}`}
              className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl p-6 hover:border-sky-300/70 dark:hover:border-sky-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors">
                {guide.title}
              </h3>
              {guide.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {guide.description}
                </p>
              )}
              <div className="mt-4 text-xs font-medium text-sky-700 dark:text-sky-300">Open →</div>
            </Link>
          ))}
        </section>

        {guides.length === 0 && (
          <section className="mt-10 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 p-8 text-center text-slate-600 dark:text-slate-300">
            Integration guides are coming soon.
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-cyan-50/70 dark:from-slate-900 dark:to-cyan-950/30 p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Want instant visual validation?
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Open the playground and test live toast behavior before you integrate.
            </p>
          </div>
          <Link
            href="/#playground"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Go to Playground
          </Link>
        </section>
      </div>
    </main>
  );
}
