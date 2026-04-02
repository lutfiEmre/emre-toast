import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const metadata = {
  title: "Blog | emre-toast",
  description: "Articles about emre-toast, React toasts, and building better UX.",
};

export default function BlogPage() {
  const posts = getAllContent("blog");
  const [featured, ...rest] = posts;

  const formatDate = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-24">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_85%_18%,rgba(99,102,241,0.14),transparent_42%),radial-gradient(circle_at_52%_82%,rgba(236,72,153,0.1),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <section className="rounded-[2rem] border border-slate-200/70 dark:border-slate-700/60 bg-white/75 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-12 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
          <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 dark:border-indigo-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700 dark:text-indigo-300">
            Product Stories
          </p>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Blog That Helps Teams Ship Better Notification UX
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            Practical comparisons, migration guides, and UX patterns from teams building fast
            React apps. Every article is written to help you choose faster and ship with fewer
            tradeoffs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100/90 dark:bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              {posts.length} editorial guides
            </span>
            <Link
              href="/#playground"
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Try emre-toast live
            </Link>
          </div>
        </section>

        {featured && (
          <section className="mt-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-3xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl p-8 md:p-10 shadow-[0_24px_70px_-42px_rgba(99,102,241,0.45)] hover:border-indigo-300/70 dark:hover:border-indigo-500/50 transition-colors"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                Featured article
              </p>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
                  {featured.description}
                </p>
              )}
              <div className="mt-6 flex items-center gap-4 text-sm">
                {featured.date && (
                  <time dateTime={featured.date} className="text-slate-500 dark:text-slate-400">
                    {formatDate(featured.date)}
                  </time>
                )}
                <span className="font-medium text-indigo-600 dark:text-indigo-300">
                  Read article →
                </span>
              </div>
            </Link>
          </section>
        )}

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/75 dark:bg-slate-900/60 backdrop-blur-xl p-6 hover:border-cyan-300/70 dark:hover:border-cyan-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                {post.title}
              </h3>
              {post.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {post.description}
                </p>
              )}
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {formatDate(post.date) ?? "No date"}
                </span>
                <span className="font-medium text-cyan-700 dark:text-cyan-300">Open →</span>
              </div>
            </Link>
          ))}
        </section>

        {posts.length === 0 && (
          <section className="mt-10 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 p-8 text-center text-slate-600 dark:text-slate-300">
            Blog posts are on the way.
          </section>
        )}
      </div>
    </main>
  );
}
