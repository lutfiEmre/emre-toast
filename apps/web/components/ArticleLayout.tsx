import type { Metadata } from "next";
import Link from "next/link";
import type { ContentMeta } from "@/lib/mdx";

type AdjacentArticle = {
  title: string;
  slug: string;
};

type ArticleLayoutProps = {
  children: React.ReactNode;
  meta: ContentMeta;
  collection: "blog" | "integrations";
  previous?: AdjacentArticle;
  next?: AdjacentArticle;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://emre-toast-web.vercel.app";

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleLayout({
  children,
  meta,
  collection,
  previous,
  next,
}: ArticleLayoutProps) {
  const basePath = collection === "blog" ? "/blog" : "/integrations";
  const isBlog = collection === "blog";

  return (
    <article className="relative overflow-hidden pt-28 pb-12 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(14,165,233,0.12),transparent_42%),radial-gradient(circle_at_86%_14%,rgba(245,158,11,0.14),transparent_42%),radial-gradient(circle_at_50%_86%,rgba(16,185,129,0.12),transparent_48%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <header className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_36px_90px_-56px_rgba(15,23,42,0.5)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/72 md:p-10">
          <Link
            href={basePath}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600 transition-colors hover:border-cyan-300/80 hover:text-cyan-700 dark:border-slate-700/70 dark:text-slate-300 dark:hover:border-cyan-500/60 dark:hover:text-cyan-300"
          >
            ← {isBlog ? "Back to Blog" : "Back to Integrations"}
          </Link>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
            {meta.title}
          </h1>

          {meta.description && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300 md:text-lg">
              {meta.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-xs">
            {meta.date && (
              <span className="rounded-full bg-slate-100/85 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                {formatDate(meta.date)}
              </span>
            )}
            {meta.readingTimeMinutes && (
              <span className="rounded-full bg-slate-100/85 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                {meta.readingTimeMinutes} min read
              </span>
            )}
            {meta.wordCount && (
              <span className="rounded-full bg-slate-100/85 px-3 py-1 font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
                {meta.wordCount} words
              </span>
            )}
          </div>

          {(meta.tags ?? []).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {(meta.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200/75 bg-white/75 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white/85 p-7 shadow-[0_26px_80px_-56px_rgba(15,23,42,0.5)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/72 md:p-10">
          <div className="prose prose-slate prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-cyan-700 prose-a:font-medium hover:prose-a:text-cyan-600 prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-950 prose-code:before:content-none prose-code:after:content-none prose-img:rounded-2xl dark:prose-invert dark:prose-a:text-cyan-300 dark:hover:prose-a:text-cyan-200 dark:prose-pre:border-slate-700 max-w-none">
            {children}
          </div>
        </div>

        {(previous || next) && (
          <section className="mt-8 grid gap-4 md:grid-cols-2">
            {previous ? (
              <Link
                href={`${basePath}/${previous.slug}`}
                className="group rounded-2xl border border-slate-200/70 bg-white/80 p-5 transition-colors hover:border-cyan-300/80 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-cyan-500/50"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  Previous
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-cyan-700 dark:text-slate-100 dark:group-hover:text-cyan-300">
                  {previous.title}
                </p>
              </Link>
            ) : (
              <div className="hidden md:block" />
            )}

            {next && (
              <Link
                href={`${basePath}/${next.slug}`}
                className="group rounded-2xl border border-slate-200/70 bg-white/80 p-5 text-left transition-colors hover:border-amber-300/80 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-amber-400/45"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  Next
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-amber-700 dark:text-slate-100 dark:group-hover:text-amber-300">
                  {next.title}
                </p>
              </Link>
            )}
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-slate-200/70 bg-gradient-to-r from-slate-50/95 to-cyan-50/80 p-5 dark:border-slate-700/60 dark:from-slate-900/75 dark:to-cyan-500/10">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Want to test these patterns live? Use the demo and copy the install command in seconds.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/#playground"
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400"
            >
              Open Playground
            </Link>
            <Link
              href="https://www.npmjs.com/package/@emrelutfi/emre-toast"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-slate-300/80 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-cyan-400 hover:text-cyan-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-300"
            >
              View on npm
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}

export function generateArticleMetadata(
  meta: ContentMeta,
  collection: "blog" | "integrations"
): Metadata {
  const basePath = collection === "blog" ? "/blog" : "/integrations";
  const url = `${baseUrl}${basePath}/${meta.slug}`;

  return {
    title: meta.title,
    description: meta.description ?? `Read ${meta.title} on emre-toast`,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}
