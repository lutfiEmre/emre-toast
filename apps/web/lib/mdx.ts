import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentMeta = {
  title: string;
  description?: string;
  date?: string;
  slug: string;
};

export function getContentSlugs(collection: "blog" | "integrations"): string[] {
  const dir = path.join(CONTENT_DIR, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getContentBySlug(
  collection: "blog" | "integrations",
  slug: string
): { content: string; meta: ContentMeta } {
  const filePath = path.join(CONTENT_DIR, collection, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    content,
    meta: {
      title: data.title ?? slug,
      description: data.description,
      date: data.date,
      slug,
    },
  };
}

export function getAllContent(
  collection: "blog" | "integrations"
): ContentMeta[] {
  const slugs = getContentSlugs(collection);
  return slugs
    .map((slug) => {
      const { meta } = getContentBySlug(collection, slug);
      return meta;
    })
    .sort((a, b) => {
      const da = a.date ?? "";
      const db = b.date ?? "";
      return db.localeCompare(da);
    });
}
