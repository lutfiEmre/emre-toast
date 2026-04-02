import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import {
  getContentBySlug,
  getAllContent,
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
  let previous: { title: string; slug: string } | undefined;
  let next: { title: string; slug: string } | undefined;
  try {
    const result = getContentBySlug("blog", slug);
    content = result.content;
    meta = result.meta;
    const allPosts = getAllContent("blog");
    const currentIndex = allPosts.findIndex((post) => post.slug === slug);
    if (currentIndex !== -1) {
      const older = allPosts[currentIndex + 1];
      const newer = allPosts[currentIndex - 1];
      previous = older ? { title: older.title, slug: older.slug } : undefined;
      next = newer ? { title: newer.title, slug: newer.slug } : undefined;
    }
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <ArticleLayout
        meta={meta}
        collection="blog"
        previous={previous}
        next={next}
      >
        <MDXRemote source={content} />
      </ArticleLayout>
    </main>
  );
}
