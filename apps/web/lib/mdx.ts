import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ContentMeta = {
  title: string;
  description?: string;
  date?: string;
  slug: string;
  tags?: string[];
  featured?: boolean;
  readingTimeMinutes?: number;
  wordCount?: number;
};

function getWordCount(content: string): number {
  const normalized = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[#>*_\-]/g, " ");
  return normalized.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeTags(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const tags = value
      .map((item) => String(item).trim())
      .filter(Boolean);
    return tags.length > 0 ? tags : undefined;
  }
  if (typeof value === "string") {
    const tags = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return tags.length > 0 ? tags : undefined;
  }
  return undefined;
}

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
  const wordCount = getWordCount(content);
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 220));
  return {
    content,
    meta: {
      title: data.title ?? slug,
      description: data.description,
      date: data.date,
      slug,
      tags: normalizeTags(data.tags),
      featured: Boolean(data.featured),
      readingTimeMinutes,
      wordCount,
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
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const da = a.date ?? "";
      const db = b.date ?? "";
      return db.localeCompare(da);
    });
}
