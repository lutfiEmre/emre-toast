import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import {
  getContentBySlug,
  getContentSlugs,
} from "@/lib/mdx";
import {
  ArticleLayout,
  generateArticleMetadata,
} from "@/components/ArticleLayout";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getContentSlugs("blog");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { meta } = getContentBySlug("blog", slug);
    return generateArticleMetadata(meta, "blog");
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let content: string;
  let meta: { title: string; description?: string; date?: string; slug: string };
  try {
    const result = getContentBySlug("blog", slug);
    content = result.content;
    meta = result.meta;
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <ArticleLayout meta={meta} collection="blog">
        <MDXRemote source={content} />
      </ArticleLayout>
    </main>
  );
}
