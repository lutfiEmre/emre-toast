import Link from "next/link";
import { getAllContent } from "@/lib/mdx";

export const metadata = {
  title: "Blog | emre-toast",
  description: "Practical guides, migration notes, and UX patterns for building better notification systems.",
};

function formatDate(date?: string) {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllContent("blog");
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const rest = posts.filter((post) => post.slug !== featured?.slug);

  const tags = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }
  const topTags = [...tags.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag);

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_80%_18%,rgba(217,119,6,0.12),transparent_42%),radial-gradient(circle_at_55%_86%,rgba(16,185,129,0.12),transparent_48%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <section className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_40px_80px_-48px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-cyan-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300">
            emre-toast editorial
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            Blog Built For Teams Shipping Product UX, Not Demo UI
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
            Deep-dive articles on notification design, migration strategy, performance tradeoffs,
            and real production patterns. Each post is written to help you decide faster and ship
            with confidence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100/90 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
              {posts.length} posts
            </span>
            <Link
              href="/#playground"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Try the live demo
            </Link>
          </div>

          {topTags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {topTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200/80 bg-white/75 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {featured && (
          <section className="mt-12">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block overflow-hidden rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50/90 via-white/90 to-cyan-50/80 p-8 shadow-[0_32px_90px_-52px_rgba(217,119,6,0.45)] transition-colors hover:border-amber-300/90 dark:border-amber-500/20 dark:from-amber-500/10 dark:via-slate-900/90 dark:to-cyan-500/10 dark:hover:border-amber-400/40 md:p-10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                Featured article
              </p>
              <h2 className="mt-3 max-w-4xl text-2xl font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-300 md:text-3xl">
                {featured.title}
              </h2>
              {featured.description && (
                <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">
                  {featured.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  {formatDate(featured.date)}
                </span>
                <span className="rounded-full bg-white/80 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
                  {featured.readingTimeMinutes ?? 1} min read
                </span>
                <span className="rounded-full bg-amber-100/80 px-3 py-1 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
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
              className="group rounded-2xl border border-slate-200/70 bg-white/80 p-6 backdrop-blur-xl transition-colors hover:border-cyan-300/90 dark:border-slate-700/60 dark:bg-slate-900/65 dark:hover:border-cyan-500/50"
            >
              <div className="flex flex-wrap gap-2">
                {(post.tags ?? []).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200/80 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700/70 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                {post.title}
              </h3>

              {post.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {post.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">{formatDate(post.date)}</span>
                <span className="font-medium text-cyan-700 dark:text-cyan-300">
                  {post.readingTimeMinutes ?? 1} min · Open →
                </span>
              </div>
            </Link>
          ))}
        </section>

        {posts.length === 0 && (
          <section className="mt-10 rounded-2xl border border-slate-200/70 bg-white/80 p-8 text-center text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-300">
            Blog posts are on the way.
          </section>
        )}
      </div>
    </main>
  );
}
