import type { Metadata } from "next";
import Link from "next/link";
import type { ContentMeta } from "@/lib/mdx";

type ArticleLayoutProps = {
  children: React.ReactNode;
  meta: ContentMeta;
  collection: "blog" | "integrations";
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://emre-toast.dev";

export function ArticleLayout({ children, meta, collection }: ArticleLayoutProps) {
  const basePath = collection === "blog" ? "/blog" : "/integrations";
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-10">
        <Link
          href={basePath}
          className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-4 inline-block"
        >
          ← {collection === "blog" ? "Blog" : "Integrations"}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {meta.title}
        </h1>
        {meta.description && (
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            {meta.description}
          </p>
        )}
        {meta.date && (
          <time
            dateTime={meta.date}
            className="mt-2 block text-sm text-slate-500 dark:text-slate-500"
          >
            {new Date(meta.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </header>
      <div className="prose prose-slate dark:prose-invert prose-headings:font-semibold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 max-w-none">
        {children}
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
    },
  };
}
